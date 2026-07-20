import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VariantBodyEditor from '../components/templates/VariantBodyEditor';
import { useToast } from '../components/layout/Toast';
import { getTemplateById, updateTemplate } from '../services/templateService';

export default function VariantEditPage() {
  const { templateId, variantIndex } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [template, setTemplate] = useState(null);
  const [label, setLabel] = useState('');
  const [body, setBody] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getTemplateById(templateId);
        const tpl = res.data?.data || res.data;
        setTemplate(tpl);
        const idx = parseInt(variantIndex, 10);
        if (tpl && tpl.variants && tpl.variants[idx]) {
          const v = tpl.variants[idx];
          setLabel(v.label);
          setBody(v.body);
          setActive(v.active);
        } else {
          showToast('error', 'Variant not found');
          navigate(-1);
        }
      } catch (err) {
        showToast('error', 'Failed to load template', err.message);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [templateId, variantIndex, navigate, showToast]);

  const handleSave = async () => {
    if (!body.trim()) {
      showToast('warning', 'Empty body', 'Please add some content to the message.');
      return;
    }
    setSaving(true);
    try {
      const variants = [...template.variants];
      variants[parseInt(variantIndex, 10)] = { label, body, active };
      await updateTemplate(templateId, { variants });
      showToast('success', 'Variant saved', 'The variant has been updated.');
      navigate(-1);
    } catch (err) {
      showToast('error', 'Save failed', err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
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
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800">
            <i className="fas fa-arrow-left text-lg"></i>
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-gray-800">
              Edit Variant – {template?.name}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Variant {parseInt(variantIndex, 10) + 1} · {active ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm"
              placeholder="e.g., Friendly"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500">Message Body</label>
            {/* Rich editor with full toolbar */}
            <VariantBodyEditor value={body} onChange={setBody} showToolbar={true} />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded"
            />
            <span className="text-xs text-gray-600">Active (used in campaigns)</span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={() => navigate(-1)} className="text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-xs hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Variant'}
          </button>
        </div>
      </div>
    </div>
  );
}