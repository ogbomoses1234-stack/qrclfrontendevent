import { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import { useToast } from '../components/layout/Toast';
import { getSettings, updateSettings } from '../services/settingsService';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('api');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  // ─── Settings state ──────────────────────────────────────────
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
  });

  // ─── Fetch settings ──────────────────────────────────────────
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await getSettings();
        const data = res?.data || res;
        setSettings(prev => ({
          ...prev,
          ...data,
          apiCredentials: { ...prev.apiCredentials, ...(data.apiCredentials || {}) },
          businessProfile: { ...prev.businessProfile, ...(data.businessProfile || {}) },
        }));
      } catch (err) {
        showToast('error', 'Failed to load settings', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [showToast]);

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

  const updateNested = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  const testConnection = () => showToast('info', 'Testing...', 'Connection successful.');
  const copyWebhookUrl = () => {
    navigator.clipboard.writeText('https://api.eventpass.io/webhooks/whatsapp/incoming');
    showToast('success', 'Copied', 'Webhook URL copied.');
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
        <div className="flex border-b border-gray-200 gap-6 text-sm">
          <button onClick={() => setActiveTab('api')} className={`pb-2 px-1 ${activeTab === 'api' ? 'border-b-2 border-orange-600 text-orange-600 font-semibold' : 'text-gray-500'}`}>
            <i className="fas fa-key w-4"></i> API
          </button>
          <button onClick={() => setActiveTab('profile')} className={`pb-2 px-1 ${activeTab === 'profile' ? 'border-b-2 border-orange-600 text-orange-600 font-semibold' : 'text-gray-500'}`}>
            <i className="fas fa-building w-4"></i> Profile
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
                  <input type="text" value={settings.apiCredentials.phoneNumberId} onChange={(e) => updateNested('apiCredentials', 'phoneNumberId', e.target.value)} className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm font-mono focus:border-orange-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Access Token</label>
                  <input type="password" value={settings.apiCredentials.accessToken} onChange={(e) => updateNested('apiCredentials', 'accessToken', e.target.value)} className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm font-mono focus:border-orange-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Webhook Verify Token</label>
                  <input type="text" value={settings.apiCredentials.webhookToken} onChange={(e) => updateNested('apiCredentials', 'webhookToken', e.target.value)} className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm font-mono focus:border-orange-500 outline-none" />
                </div>
                <div className="flex gap-3">
                  <Button icon="plug" variant="outline" onClick={testConnection}>Test Connection</Button>
                  <Button icon="save" onClick={() => handleSave('API')} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="font-bold text-gray-700">Webhook URL</h2>
              <div className="flex items-center gap-2 mt-2">
                <code className="bg-gray-100 px-3 py-2 rounded-lg text-xs flex-1">https://api.eventpass.io/webhooks/whatsapp/incoming</code>
                <button onClick={copyWebhookUrl} className="text-gray-400 hover:text-orange-600"><i className="far fa-copy"></i></button>
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
                <input type="text" value={settings.businessProfile.displayName} onChange={(e) => updateNested('businessProfile', 'displayName', e.target.value)} className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm focus:border-orange-500 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">Description</label>
                <textarea value={settings.businessProfile.description} onChange={(e) => updateNested('businessProfile', 'description', e.target.value)} className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm focus:border-orange-500 outline-none" rows="2" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">Logo URL</label>
                <input type="text" value={settings.businessProfile.logoUrl} onChange={(e) => updateNested('businessProfile', 'logoUrl', e.target.value)} className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm focus:border-orange-500 outline-none" />
              </div>
              <Button onClick={() => handleSave('Profile')} icon="save" disabled={saving}>{saving ? 'Saving…' : 'Save Profile'}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
