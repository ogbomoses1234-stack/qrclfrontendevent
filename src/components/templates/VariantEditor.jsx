import { useState, useEffect } from 'react';

export default function VariantEditor({ variants: initialVariants, onSave, onCancel }) {
  const [variants, setVariants] = useState(initialVariants || []);

  // Sync local state when initial variants change (e.g., when opening a different template)
  useEffect(() => {
    setVariants(initialVariants || []);
  }, [initialVariants]);

  const handleLabelChange = (index, value) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], label: value };
    setVariants(updated);
  };

  const handleBodyChange = (index, value) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], body: value };
    setVariants(updated);
  };

  const toggleActive = (index) => {
    const updated = [...variants];
    const newActive = !updated[index].active;
    if (!newActive && updated.filter((v) => v.active).length <= 1) return;
    updated[index] = { ...updated[index], active: newActive };
    setVariants(updated);
  };

  const addVariant = () => {
    if (variants.length >= 5) return;
    const newVariant = {
      label: `Variant ${variants.length + 1}`,
      body: 'Hi {{1}}, your pass for {{2}} on {{3}} is ready.',
      active: true,
    };
    setVariants([...variants, newVariant]);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Basic validation: at least one variant must have a body
    if (!variants.some((v) => v.body.trim().length > 0)) {
      alert('Please add content to at least one variant.');
      return;
    }
    onSave(variants);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">📝 Message Variants</h3>
        <button
          onClick={addVariant}
          disabled={variants.length >= 5}
          className="text-blue-600 text-xs font-medium hover:underline disabled:opacity-40"
        >
          + Add Variant
        </button>
      </div>
      <p className="text-[10px] text-gray-400">Each recipient randomly receives one active variant.</p>
      {variants.map((v, idx) => (
        <div key={idx} className="bg-white rounded-lg border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleActive(idx)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                  v.active
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-100 text-gray-400 border-gray-200'
                }`}
              >
                {v.active ? '●' : '○'} {v.label || `Variant ${idx + 1}`}
              </button>
              <span className="text-[9px] text-gray-400">Variant {idx + 1}</span>
            </div>
            <button onClick={() => removeVariant(idx)} className="text-gray-400 hover:text-red-500">
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={v.label}
              onChange={(e) => handleLabelChange(idx, e.target.value)}
              placeholder="Label"
              className="w-28 border border-gray-200 rounded px-2 py-1 text-xs"
            />
            <textarea
              rows="3"
              value={v.body}
              onChange={(e) => handleBodyChange(idx, e.target.value)}
              placeholder="Message body... Use {{1}} {{2}} {{3}}"
              className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs resize-none"
            ></textarea>
          </div>
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-3 border-t">
        <button onClick={onCancel} className="text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-xs hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700">
          Save Variants
        </button>
      </div>
    </div>
  );
}