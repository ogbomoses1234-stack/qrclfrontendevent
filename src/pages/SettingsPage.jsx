import { useState, useEffect } from 'react';
import Modal from '../components/common/Modal';
import ToggleSwitch from '../components/common/ToggleSwitch';
import Button from '../components/common/Button';
import { useToast } from '../components/layout/Toast';
import { getSettings, updateSettings } from '../services/settingsService';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('api');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  // ─── Settings state (matches backend model) ───────────────────
  const [settings, setSettings] = useState({
    apiCredentials: {
      phoneNumberId: '',
      accessToken: '',
      webhookToken: '',
    },
    businessProfile: {
      displayName: '',
      description: '',
      logoUrl: '',
    },
    messageDefaults: {
      language: 'en',
      senderName: '',
      autoAttachQr: true,
      readReceipts: true,
      deliveryDelay: 0,
      retryAttempts: 3,
    },
    notificationPrefs: {
      campaignCompleted: true,
      deliveryFailures: true,
      weeklySummary: false,
      email: '',
    },
  });

  // ─── Fetch settings from backend ──────────────────────────────
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await getSettings();
        const data = res?.data || res;
        // Merge with defaults to ensure all fields exist
        setSettings(prev => ({
          ...prev,
          ...data,
          apiCredentials: { ...prev.apiCredentials, ...(data.apiCredentials || {}) },
          businessProfile: { ...prev.businessProfile, ...(data.businessProfile || {}) },
          messageDefaults: { ...prev.messageDefaults, ...(data.messageDefaults || {}) },
          notificationPrefs: { ...prev.notificationPrefs, ...(data.notificationPrefs || {}) },
        }));
      } catch (err) {
        showToast('error', 'Failed to load settings', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [showToast]);

  // ─── Save entire settings object ──────────────────────────────
  const handleSave = async (section) => {
    setSaving(true);
    try {
      await updateSettings(settings);
      showToast('success', 'Settings Saved', `${section} updated.`);
    } catch (err) {
      showToast('error', 'Save failed', err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Helper: update nested state ──────────────────────────────
  const updateNested = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  // ─── Simple actions ────────────────────────────────────────────
  const testConnection = () => showToast('info', 'Testing...', 'Connection successful.');
  const copyWebhookUrl = () => {
    navigator.clipboard.writeText('https://api.eventpass.io/webhooks/whatsapp/incoming');
    showToast('success', 'Copied', 'Webhook URL copied.');
  };
  const sendInvite = () => {
    setShowInviteModal(false);
    showToast('success', 'Invite Sent', 'Invitation email dispatched.');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <i className="fas fa-spinner fa-pulse text-3xl text-gray-400"></i>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
          <i className="fas fa-cog text-orange-500"></i> Settings
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 gap-6 text-sm overflow-x-auto">
          <button onClick={() => setActiveTab('api')} className={`pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'api' ? 'border-b-2 border-orange-600 text-orange-600 font-semibold' : 'text-gray-500 hover:text-orange-500 transition-colors'}`}>
            <i className="fas fa-key w-4"></i> API
          </button>
          <button onClick={() => setActiveTab('profile')} className={`pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'profile' ? 'border-b-2 border-orange-600 text-orange-600 font-semibold' : 'text-gray-500 hover:text-orange-500 transition-colors'}`}>
            <i className="fas fa-building w-4"></i> Profile
          </button>
          <button onClick={() => setActiveTab('defaults')} className={`pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'defaults' ? 'border-b-2 border-orange-600 text-orange-600 font-semibold' : 'text-gray-500 hover:text-orange-500 transition-colors'}`}>
            <i className="fas fa-sliders-h w-4"></i> Defaults
          </button>
          <button onClick={() => setActiveTab('team')} className={`pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'team' ? 'border-b-2 border-orange-600 text-orange-600 font-semibold' : 'text-gray-500 hover:text-orange-500 transition-colors'}`}>
            <i className="fas fa-users w-4"></i> Team
          </button>
          <button onClick={() => setActiveTab('billing')} className={`pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'billing' ? 'border-b-2 border-orange-600 text-orange-600 font-semibold' : 'text-gray-500 hover:text-orange-500 transition-colors'}`}>
            <i className="fas fa-credit-card w-4"></i> Billing
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'notifications' ? 'border-b-2 border-orange-600 text-orange-600 font-semibold' : 'text-gray-500 hover:text-orange-500 transition-colors'}`}>
            <i className="fas fa-bell w-4"></i> Alerts
          </button>
          <button onClick={() => setActiveTab('danger')} className={`pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 text-red-500 hover:text-red-600 transition-colors`}>
            <i className="fas fa-exclamation-triangle w-4"></i> Danger
          </button>
        </div>

        {/* ─── API Tab ─────────────────────────────────────────────── */}
        {activeTab === 'api' && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="font-bold text-gray-700 mb-1">WhatsApp Cloud API Credentials</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500">Phone Number ID</label>
                  <input
                    type="text"
                    value={settings.apiCredentials.phoneNumberId}
                    onChange={(e) => updateNested('apiCredentials', 'phoneNumberId', e.target.value)}
                    className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm font-mono focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Access Token</label>
                  <input
                    type="password"
                    value={settings.apiCredentials.accessToken}
                    onChange={(e) => updateNested('apiCredentials', 'accessToken', e.target.value)}
                    className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm font-mono focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Webhook Verify Token</label>
                  <input
                    type="text"
                    value={settings.apiCredentials.webhookToken}
                    onChange={(e) => updateNested('apiCredentials', 'webhookToken', e.target.value)}
                    className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm font-mono focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                  />
                </div>
                <div className="flex gap-3">
                  <Button icon="plug" variant="outline" onClick={testConnection}>Test Connection</Button>
                  <Button icon="save" onClick={() => handleSave('API')} disabled={saving}>
                    {saving ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="font-bold text-gray-700">Webhook URL</h2>
              <div className="flex items-center gap-2 mt-2">
                <code className="bg-gray-100 px-3 py-2 rounded-lg text-xs flex-1">https://api.eventpass.io/webhooks/whatsapp/incoming</code>
                <button onClick={copyWebhookUrl} className="text-gray-400 hover:text-orange-600 transition-colors">
                  <i className="far fa-copy"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Profile Tab ──────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-bold text-gray-700 mb-3">Business Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500">Display Name</label>
                <input
                  type="text"
                  value={settings.businessProfile.displayName}
                  onChange={(e) => updateNested('businessProfile', 'displayName', e.target.value)}
                  className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">Description</label>
                <textarea
                  value={settings.businessProfile.description}
                  onChange={(e) => updateNested('businessProfile', 'description', e.target.value)}
                  className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                  rows="2"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">Logo URL</label>
                <input
                  type="text"
                  value={settings.businessProfile.logoUrl}
                  onChange={(e) => updateNested('businessProfile', 'logoUrl', e.target.value)}
                  className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>
              <Button onClick={() => handleSave('Profile')} icon="save" disabled={saving}>
                {saving ? 'Saving…' : 'Save Profile'}
              </Button>
            </div>
          </div>
        )}

        {/* ─── Defaults Tab ──────────────────────────────────────── */}
        {activeTab === 'defaults' && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-700">Message Defaults</h2>
            <div>
              <label className="text-xs font-semibold text-gray-500">Default Language</label>
              <select
                value={settings.messageDefaults.language}
                onChange={(e) => updateNested('messageDefaults', 'language', e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
              >
                <option value="en">en (English)</option>
                <option value="fr">fr (French)</option>
                <option value="ar">ar (Arabic)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Sender Name</label>
              <input
                type="text"
                value={settings.messageDefaults.senderName}
                onChange={(e) => updateNested('messageDefaults', 'senderName', e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Auto-attach QR code</span>
              <ToggleSwitch
                checked={settings.messageDefaults.autoAttachQr}
                onChange={(checked) => updateNested('messageDefaults', 'autoAttachQr', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Send read receipts</span>
              <ToggleSwitch
                checked={settings.messageDefaults.readReceipts}
                onChange={(checked) => updateNested('messageDefaults', 'readReceipts', checked)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Delivery Delay (seconds)</label>
              <input
                type="number"
                value={settings.messageDefaults.deliveryDelay}
                onChange={(e) => updateNested('messageDefaults', 'deliveryDelay', Number(e.target.value))}
                className="w-24 mt-1 border border-gray-200 rounded-lg p-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Retry Attempts</label>
              <input
                type="number"
                value={settings.messageDefaults.retryAttempts}
                onChange={(e) => updateNested('messageDefaults', 'retryAttempts', Number(e.target.value))}
                className="w-24 mt-1 border border-gray-200 rounded-lg p-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
              />
            </div>
            <Button onClick={() => handleSave('Defaults')} icon="save" disabled={saving}>
              {saving ? 'Saving…' : 'Save Defaults'}
            </Button>
          </div>
        )}

        {/* ─── Team Tab ──────────────────────────────── */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-gray-700">Team Members</h2>
              <Button onClick={() => setShowInviteModal(true)} icon="user-plus">Invite</Button>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div><p className="text-sm font-medium">Emeka Okafor</p><p className="text-[10px] text-gray-400">Admin</p></div>
              <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white outline-none focus:border-orange-500"><option>Admin</option></select>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div><p className="text-sm font-medium">Chioma Adeyemi</p><p className="text-[10px] text-gray-400">Operator</p></div>
              <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white outline-none focus:border-orange-500"><option>Operator</option></select>
            </div>
          </div>
        )}

        {/* ─── Billing Tab ───────────────────────────── */}
        {activeTab === 'billing' && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="font-bold text-gray-700">Current Plan</h2>
              {/* Changed from blue highlights to orange */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-2 flex justify-between items-center">
                <div>
                  <p className="font-bold text-orange-800">Pro Plan</p>
                  <p className="text-xs text-orange-600">5,000 conversations/month</p>
                </div>
                <Button>Upgrade</Button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Notifications Tab ──────────────────────────────────── */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-700">Notification Preferences</h2>
            <div className="flex items-center justify-between">
              <span className="text-xs">Campaign Completed</span>
              <ToggleSwitch
                checked={settings.notificationPrefs.campaignCompleted}
                onChange={(checked) => updateNested('notificationPrefs', 'campaignCompleted', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Delivery Failures</span>
              <ToggleSwitch
                checked={settings.notificationPrefs.deliveryFailures}
                onChange={(checked) => updateNested('notificationPrefs', 'deliveryFailures', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Weekly Summary</span>
              <ToggleSwitch
                checked={settings.notificationPrefs.weeklySummary}
                onChange={(checked) => updateNested('notificationPrefs', 'weeklySummary', checked)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Notification Email</label>
              <input
                type="email"
                value={settings.notificationPrefs.email}
                onChange={(e) => updateNested('notificationPrefs', 'email', e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
              />
            </div>
            <Button onClick={() => handleSave('Notifications')} icon="save" disabled={saving}>
              {saving ? 'Saving…' : 'Save Preferences'}
            </Button>
          </div>
        )}

        {/* ─── Danger Tab ─────────────────────────────── */}
        {activeTab === 'danger' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <h2 className="font-bold text-red-700">Danger Zone</h2>
            <p className="text-xs text-red-600 mb-3">Irreversible actions.</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-red-100">
                <div><p className="text-sm font-medium">Reset All Settings</p><p className="text-xs text-gray-500">Restore defaults</p></div>
                <Button variant="danger" onClick={() => showToast('warning', 'Action', 'Demo only.')}>Reset</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Team Member">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500">Email</label>
            <input type="email" className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition" placeholder="colleague@example.com" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Role</label>
            <select className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition">
              <option>Operator</option><option>Admin</option><option>Viewer</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowInviteModal(false)}>Cancel</Button>
            <Button onClick={sendInvite}>Send Invite</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}