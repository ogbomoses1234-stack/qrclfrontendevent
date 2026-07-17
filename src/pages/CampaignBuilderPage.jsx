import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import UploadPanel from '../components/campaign/UploadPanel';
import MappingPanel from '../components/campaign/MappingPanel';
import PreviewPanel from '../components/campaign/PreviewPanel';
import SettingsPanel from '../components/campaign/SettingsPanel';
import BatchPreview from '../components/campaign/BatchPreview';
import FailedRecipients from '../components/campaign/FailedRecipients';
import { useToast } from '../components/layout/Toast';
import {
  createCampaign,
  launchCampaign,
  generateCampaignQRs,
  getCampaignQRProgress,
  getCampaignById,
} from '../services/campaignService';
import { getTemplates } from '../services/templateService';

// ─── Static fallback templates (used if API fails) ──────────────
const staticFallback = [
  {
    id: 'tpl1', name: 'Entry Pass Delivery', showQR: true,
    variants: [
      { label: 'Friendly', body: 'Hi {{1}} 👋\n\nYour QR code for {{2}} is ready!\n\nDate: {{3}}. Just show this at the door and you\'re in!\n\nSee you there!', active: true },
      { label: 'Formal', body: 'Dear {{1}},\n\nPlease find your official entry pass for {{2}} on {{3}}.\n\nPresent the QR code below at the entrance. We look forward to welcoming you.', active: true },
      { label: 'Short', body: '{{1}} – {{2}} ({{3}}).\n\nYour entry QR is attached. Please display at the gate.', active: true },
    ],
  },
  {
    id: 'tpl2', name: 'Event Day Reminder', showQR: true,
    variants: [
      { label: 'Enthusiastic', body: '🎉 It\'s almost time, {{1}}!\n\n{{2}} kicks off today at {{4}}.\n📍 Venue: {{5}}\n\nQR code attached – show it at the gate!', active: true },
      { label: 'Calm', body: 'Just a gentle reminder, {{1}} — {{2}} is today at {{4}}.\n\nWe\'re at {{5}}. Your QR pass is attached for easy entry.', active: true },
      { label: 'Urgent', body: '⚠️ {{1}} — {{2}} starts in a few hours ({{4}}).\n\nVenue: {{5}}. Your QR code is re‑attached for quick entry.', active: true },
    ],
  },
  {
    id: 'tpl3', name: 'Post-Event Thanks', showQR: false,
    variants: [
      { label: 'Warm', body: 'Thank you for joining us at {{2}}, {{1}}! 🎉\n\nWe loved having you. Please share your thoughts: {{6}}\n\nSee you at the next event!', active: true },
      { label: 'Professional', body: 'Dear {{1}},\n\nThank you for attending {{2}}. We value your feedback — please complete our short survey: {{6}}\n\nBest regards, EventPass Team', active: true },
      { label: 'Brief', body: 'Thanks for coming to {{2}}, {{1}}! 🙏\n\nFeedback: {{6}}', active: true },
    ],
  },
  {
    id: 'tpl4', name: 'Custom Message', showQR: true,
    variants: [{ label: 'Custom', body: '', active: true }],
  },
];

export default function CampaignBuilderPage() {
  const location = useLocation();
  const [parsedData, setParsedData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [mapping, setMapping] = useState({ phone: '', name: '', event: '', qr: '', date: '' });
  const [template, setTemplate] = useState('');
  const [previewRecipientIndex, setPreviewRecipientIndex] = useState(0);
  const [previewVariantIndex, setPreviewVariantIndex] = useState(0);
  const [activeVariants, setActiveVariants] = useState({});
  const [batchSize, setBatchSize] = useState(10);
  const [waitValue, setWaitValue] = useState(5);
  const [waitUnit, setWaitUnit] = useState('minutes');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [failedRecipients, setFailedRecipients] = useState([]);
  const [customMessage, setCustomMessage] = useState('');
  const [templateList, setTemplateList] = useState([]);
  const [templateDefs, setTemplateDefs] = useState({});

  // ─── Backend QR generation state ──────────────────────────────
  const [campaignId, setCampaignId] = useState(null);       // stores the draft campaign ID
  const [qrGenStatus, setQrGenStatus] = useState('pending'); // pending | processing | completed | failed
  const [qrGenTotal, setQrGenTotal] = useState(0);
  const [qrGenProgress, setQrGenProgress] = useState(0);
  const pollingRef = useRef(null);                           // to store interval ID

  const showToast = useToast();

  // ─── Fetch templates from backend ─────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await getTemplates();
        let apiTemplates = res?.data?.templates || res?.data || res || [];
        if (!Array.isArray(apiTemplates)) apiTemplates = [];

        if (apiTemplates.length === 0) {
          setTemplateList(staticFallback.map(t => ({ id: t.id, name: t.name })));
          const defs = {};
          staticFallback.forEach(t => { defs[t.id] = t; });
          setTemplateDefs(defs);
          setActiveVariants(Object.fromEntries(staticFallback.map(t => [t.id, t.variants.map((v, i) => i)])));
          setTemplate(staticFallback[0].id);
          return;
        }

        const list = [];
        const defs = {};
        const av = {};
        apiTemplates.forEach(t => {
          list.push({ id: t._id, name: t.name });
          defs[t._id] = {
            name: t.name,
            showQR: t.showQR ?? true,
            variants: (t.variants || []).length > 0
              ? t.variants.map(v => ({ label: v.label, body: v.body, active: v.active !== false }))
              : [{ label: 'Default', body: 'Hi {{1}}, your pass for {{2}} on {{3}} is ready.', active: true }],
          };
          const activeIndices = (t.variants || []).map((v, i) => (v.active !== false ? i : -1)).filter(i => i >= 0);
          av[t._id] = activeIndices.length > 0 ? activeIndices : [0];
        });

        setTemplateList(list);
        setTemplateDefs(defs);
        setActiveVariants(av);
        if (list.length > 0 && !template) {
          setTemplate(list[0].id);
          setPreviewVariantIndex(av[list[0].id]?.[0] || 0);
        }
      } catch {
        setTemplateList(staticFallback.map(t => ({ id: t.id, name: t.name })));
        const defs = {};
        staticFallback.forEach(t => { defs[t.id] = t; });
        setTemplateDefs(defs);
        setActiveVariants(Object.fromEntries(staticFallback.map(t => [t.id, t.variants.map((v, i) => i)])));
        setTemplate(staticFallback[0].id);
        showToast('warning', 'Using offline templates', 'Could not fetch templates from server.');
      }
    })();
  }, [showToast]);

  // ─── Derived data ─────────────────────────────────────────────
  const total = parsedData?.length || 0;
  const currentRecipient = parsedData?.[previewRecipientIndex] || {};
  const mappedName  = mapping.name  ? currentRecipient[mapping.name]  : '';
  const mappedPhone = mapping.phone ? currentRecipient[mapping.phone] : '';
  const mappedEvent = mapping.event ? currentRecipient[mapping.event] : '';
  const mappedDate  = mapping.date  ? currentRecipient[mapping.date]  : '';
  const mappedQrUrl = mapping.qr    ? currentRecipient[mapping.qr]    : '';

  const tplDef = templateDefs[template] || { name: 'Unknown', showQR: true, variants: [] };
  const currentVariant = tplDef.variants?.[previewVariantIndex];

  const getMessageBody = () => {
    const vals = {
      '{{1}}': mappedName  || '{{1}}',
      '{{2}}': mappedEvent || '{{2}}',
      '{{3}}': mappedDate  || '{{3}}',
      '{{4}}': currentRecipient['Time']   || currentRecipient['time']   || '9:00 AM',
      '{{5}}': currentRecipient['Venue']  || currentRecipient['venue']  || 'Eko Convention Centre',
      '{{6}}': currentRecipient['FeedbackLink'] || currentRecipient['feedbackLink'] || '[feedback link]',
    };
    let body = '';
    if (template === 'tpl4' || tplDef.name === 'Custom Message') {
      body = customMessage || 'Hi {{1}}, here is your pass for {{2}} on {{3}}.';
    } else {
      body = currentVariant?.body || tplDef.variants?.[0]?.body || '';
    }
    Object.entries(vals).forEach(([placeholder, value]) => {
      body = body.replaceAll(placeholder, value);
    });
    body = body.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    return body;
  };
  const messagePreview = getMessageBody().replace(/\n/g, '<br>');

  // ─── Auto‑mapping helper ──────────────────────────────────────
  const computeMapping = useCallback((cols) => {
    if (!cols || cols.length === 0) return { phone: '', name: '', event: '', qr: '', date: '' };
    const exact = (preferred) => cols.find(c => c.trim().toLowerCase() === preferred.toLowerCase()) || '';
    const contains = (keywords) => cols.find(c => keywords.every(kw => c.toLowerCase().includes(kw))) || '';
    return {
      phone: exact('phone number') || contains(['phone', 'number']) || contains(['phone']),
      name:  exact('attendee name') || exact('full name') || exact('name') || contains(['name']),
      event: exact('event name') || contains(['event', 'name']) || contains(['event']),
      qr:    exact('qr code image url') || contains(['qr', 'image']) || contains(['qr']),
      date:  exact('event date') || exact('date') || contains(['date']),
    };
  }, []);

  // ─── Helper: poll QR progress ─────────────────────────────────
  const clearPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const startQrPolling = (cid) => {
    clearPolling();
    const interval = setInterval(async () => {
      try {
        const res = await getCampaignQRProgress(cid);
        const data = res.data || res;
        setQrGenTotal(data.total || 0);
        setQrGenProgress(data.completed || 0);

        if (data.status === 'completed' || data.status === 'failed') {
          clearPolling();
          setQrGenStatus(data.status);
          if (data.status === 'completed') {
            showToast('success', 'QR codes ready', `${data.completed} QR codes generated.`);
            // Fetch the updated campaign to get the new qrUrls
            const updated = await getCampaignById(cid);
            const campaign = updated?.data || updated;
            if (campaign?.recipients) {
              // Convert back to flat format for parsedData
              const flat = campaign.recipients.map(r => ({
                'Attendee Name': r.name || '',
                'Phone Number': r.phone || '',
                'QR Code Image URL': r.qrUrl || '',
                'Event Name': r.event || '',
                'Event Date': r.date || '',
                // preserve other fields
              }));
              setParsedData(flat);
            }
          } else {
            showToast('error', 'QR generation failed', 'Some QR codes could not be created.');
          }
        }
      } catch (err) {
        clearPolling();
        setQrGenStatus('failed');
        showToast('error', 'QR generation error', err.message);
      }
    }, 500);
    pollingRef.current = interval;
  };

  // ─── Cleanup on unmount ───────────────────────────────────────
  useEffect(() => {
    return () => clearPolling();
  }, []);

  // ─── File loaded callback → create campaign & trigger QR gen ──
  const handleDataLoaded = useCallback(async (fileName, json, error) => {
    if (error) {
      showToast('error', 'Parse Error', error);
      return;
    }

    const cols = Object.keys(json[0]);
    const newMapping = computeMapping(cols);
    setMapping(newMapping);
    setParsedData(json);
    setColumns(cols);
    setPreviewRecipientIndex(0);
    showToast('success', 'File Loaded', `${fileName} · ${json.length} rows`);

    // Create a draft campaign so backend can generate QRs
    try {
      const recipients = json.map(row => ({
        phone: String(row[newMapping.phone] ?? ''),
        name: String(row[newMapping.name] ?? ''),
        event: String(row[newMapping.event] ?? ''),
        date: String(row[newMapping.date] ?? ''),
        qrUrl: '', // will be filled by backend
      }));

      const campaignData = {
        name: 'Campaign ' + new Date().toLocaleDateString(),
        templateKey: template,
        templateId: template,
        recipients,
        batchSize: Number(batchSize),
        waitValue: Number(waitValue),
        waitUnit,
        activeVariants: activeVariants[template] || [0],
        variants: (templateDefs[template]?.variants || []).map(v => v.label),
        mapping: {
          phone: String(newMapping.phone),
          name: String(newMapping.name),
          event: String(newMapping.event),
          qr: String(newMapping.qr),
          date: String(newMapping.date),
        },
      };

      const res = await createCampaign(campaignData);
      const newId = res.data?._id || res.data?.id;
      if (!newId) throw new Error('Failed to create campaign');

      setCampaignId(newId);

      // Start backend QR generation
      await generateCampaignQRs(newId);
      setQrGenStatus('processing');
      setQrGenTotal(recipients.length);
      setQrGenProgress(0);
      startQrPolling(newId);

    } catch (err) {
      showToast('error', 'Campaign creation failed', err.message);
    }
  }, [computeMapping, template, batchSize, waitValue, waitUnit, activeVariants, templateDefs, showToast]);

  // ─── Load campaign from Sent History ───────────────────────────
  useEffect(() => {
    const c = location.state?.campaignToLoad;
    if (c) {
      loadCampaignFromHistory(c);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadCampaignFromHistory = (campaign) => {
    const recipients = campaign.recipients || [];
    if (recipients.length === 0) recipients.push({ phone: '+1234567890', name: 'Sample', event: 'Sample Event', date: '2026-01-01', qrUrl: '' });
    const flat = recipients.map(r => ({
      'Attendee Name': r.name || '',
      'Phone Number': r.phone || '',
      'QR Code Image URL': r.qrUrl || '',
      'Event Name': r.event || '',
      'Event Date': r.date || '',
    }));
    setParsedData(flat);
    setColumns(flat.length > 0 ? Object.keys(flat[0]) : []);
    setMapping({ phone: 'Phone Number', name: 'Attendee Name', event: 'Event Name', qr: 'QR Code Image URL', date: 'Event Date' });
    setTemplate(campaign.templateKey || templateList[0]?.id || 'tpl1');
    setBatchSize(campaign.batchSize || 10);
    setWaitValue(campaign.waitValue || 5);
    setWaitUnit(campaign.waitUnit || 'minutes');
    setActiveVariants(prev => ({ ...prev, [campaign.templateKey]: campaign.activeVariants || [0] }));
    setPreviewRecipientIndex(0);
    setPreviewVariantIndex((campaign.activeVariants || [0])[0] || 0);
    showToast('info', 'Campaign Loaded', `"${campaign.name}" is ready for editing.`);
  };

  // ─── Variant management ────────────────────────────────────────
  const toggleVariant = (tplKey, index) => {
    const active = [...(activeVariants[tplKey] || [])];
    const pos = active.indexOf(index);
    if (pos >= 0) {
      if (active.length <= 1) { showToast('warning', 'Cannot Disable', 'At least one variant must remain active.'); return; }
      active.splice(pos, 1);
    } else {
      active.push(index);
      active.sort((a, b) => a - b);
    }
    setActiveVariants(prev => ({ ...prev, [tplKey]: active }));
    if (!active.includes(previewVariantIndex) && tplKey === template) setPreviewVariantIndex(active[0]);
  };

  const cycleVariant = (direction) => {
    const active = activeVariants[template] || [];
    if (active.length === 0) return;
    const pos = active.indexOf(previewVariantIndex);
    let newPos = pos + direction;
    if (newPos < 0) newPos = active.length - 1;
    if (newPos >= active.length) newPos = 0;
    setPreviewVariantIndex(active[newPos]);
  };

  const prevRecipient = () => {
    if (total === 0) return;
    const newIdx = (previewRecipientIndex - 1 + total) % total;
    setPreviewRecipientIndex(newIdx);
    const active = activeVariants[template];
    if (active && active.length > 0 && template !== 'tpl4') {
      const hash = (newIdx * 7 + 3) % active.length;
      setPreviewVariantIndex(active[hash]);
    }
  };

  const nextRecipient = () => {
    if (total === 0) return;
    const newIdx = (previewRecipientIndex + 1) % total;
    setPreviewRecipientIndex(newIdx);
    const active = activeVariants[template];
    if (active && active.length > 0 && template !== 'tpl4') {
      const hash = (newIdx * 7 + 3) % active.length;
      setPreviewVariantIndex(active[hash]);
    }
  };

  const handleTemplateChange = (newTemplate) => {
    setTemplate(newTemplate);
    const active = activeVariants[newTemplate] || [0];
    setPreviewVariantIndex(active[0] || 0);
    setCustomMessage('');
  };

  // ─── Launch / test / retry ─────────────────────────────────────
  const handleLaunch = async () => {
    if (!parsedData || total === 0) return;
    // Use the existing campaign ID (if any) or create a new one
    const cid = campaignId;
    if (!cid) {
      showToast('error', 'No campaign', 'Please upload a file first.');
      return;
    }
    try {
      setIsRunning(true);
      setProgress(10);
      setStatus('Launching campaign...');
      const result = await launchCampaign(cid);
      setIsRunning(false);
      setProgress(100);
      const delivered = result.data?.delivered ?? 0;
      const failed = result.data?.failed ?? 0;
      showToast('success', 'Campaign Launched', `Sent: ${delivered} | Failed: ${failed}`);
    } catch (error) {
      setIsRunning(false);
      showToast('error', 'Launch Failed', error.response?.data?.message || error.message);
    }
  };

  const handleTestSend = (phone) => {
    if (!phone) {
      showToast('warning', 'Missing Number', 'Please enter a phone number.');
      return;
    }
    showToast('success', 'Test Sent', `Message dispatched to ${phone}.`);
  };

  const handleRetryAllFailed = () => {
    showToast('info', 'Retrying', 'Resending failed messages...');
    setFailedRecipients([]);
  };

  const handleRetrySingleFailed = (index) => {
    setFailedRecipients(prev => prev.filter((_, i) => i !== index));
    showToast('success', 'Retried', 'Message resent.');
  };

  const handleReset = () => {
    clearPolling();
    setParsedData(null);
    setColumns([]);
    setMapping({ phone: '', name: '', event: '', qr: '', date: '' });
    setPreviewRecipientIndex(0);
    const firstId = templateList[0]?.id || 'tpl1';
    setTemplate(firstId);
    setActiveVariants(prev => {
      const newAv = { ...prev };
      if (templateList.length > 0) templateList.forEach(t => { newAv[t.id] = [0]; });
      return newAv;
    });
    setBatchSize(10);
    setWaitValue(5);
    setWaitUnit('minutes');
    setScheduleTime('');
    setFailedRecipients([]);
    setCustomMessage('');
    setCampaignId(null);
    setQrGenStatus('pending');
    setQrGenTotal(0);
    setQrGenProgress(0);
  };

  // ─── Wait for templates ────────────────────────────────────────
  if (Object.keys(templateDefs).length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <i className="fas fa-spinner fa-pulse text-3xl text-gray-400"></i>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-5 pb-20">
      <div className="mb-5 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            <i className="fas fa-paper-plane text-orange-500"></i> Campaign Builder
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Upload · Map · Preview · Schedule · Launch</p>
        </div>
        <div className="text-xs bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full font-bold border border-orange-100">
          {total} recipients
        </div>
      </div>

      {/* QR generation progress banner */}
      {qrGenStatus === 'processing' && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3">
          <i className="fas fa-qrcode text-blue-500 text-lg animate-pulse"></i>
          <div className="flex-1">
            <div className="flex justify-between text-xs font-medium text-blue-700 mb-1">
              <span>Generating QR codes…</span>
              <span>{qrGenProgress} of {qrGenTotal}</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(qrGenProgress / (qrGenTotal || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
      {qrGenStatus === 'completed' && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-green-700 text-xs font-medium">
          <i className="fas fa-check-circle"></i> All QR codes generated and hosted.
        </div>
      )}
      {qrGenStatus === 'failed' && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700 text-xs font-medium">
          <i className="fas fa-exclamation-circle"></i> QR generation failed. Please try again.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <UploadPanel onDataLoaded={handleDataLoaded} onReset={handleReset} />
        <MappingPanel
          columns={columns}
          mapping={mapping}
          setMapping={setMapping}
          template={template}
          setTemplate={handleTemplateChange}
          templates={templateList}
          templateDefinitions={templateDefs}
          activeVariants={activeVariants}
          toggleVariant={toggleVariant}
          customMessage={customMessage}
          setCustomMessage={setCustomMessage}
        />
        <PreviewPanel
          recipientData={{ name: mappedName, phone: mappedPhone }}
          messageText={messagePreview}
          qrUrl={mappedQrUrl}
          showQR={tplDef.showQR ?? true}
          currentIndex={previewRecipientIndex + 1}
          total={total}
          onPrev={prevRecipient}
          onNext={nextRecipient}
          variantLabel={currentVariant?.label}
          onCycleVariant={cycleVariant}
        />
        <SettingsPanel
          batchSize={batchSize}
          setBatchSize={setBatchSize}
          waitValue={waitValue}
          setWaitValue={setWaitValue}
          waitUnit={waitUnit}
          setWaitUnit={setWaitUnit}
          scheduleTime={scheduleTime}
          setScheduleTime={setScheduleTime}
          onLaunch={handleLaunch}
          onTestSend={handleTestSend}
          isRunning={isRunning}
          progress={progress}
          status={status}
          variantCount={(activeVariants[template] || []).length}
        />
      </div>

      {total > 0 && (
        <div className="mt-4">
          <BatchPreview batchSize={batchSize} total={total} />
        </div>
      )}

      {failedRecipients.length > 0 && (
        <div className="mt-4">
          <FailedRecipients
            failedList={failedRecipients}
            onRetryAll={handleRetryAllFailed}
            onRetrySingle={handleRetrySingleFailed}
          />
        </div>
      )}
    </div>
  );
}