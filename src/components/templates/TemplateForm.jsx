import { useState } from 'react';
import Modal from '../common/Modal';

export default function TemplateForm({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || 'delivery');
  const [showQR, setShowQR] = useState(initialData?.showQR ?? true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, category, showQR });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Template' : 'Create Template'} size="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500">Template Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm"
          >
            <option value="delivery">🎫 Delivery</option>
            <option value="reminder">⏰ Reminder</option>
            <option value="thanks">💌 Thanks</option>
            <option value="custom">📋 Custom</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showQR}
            onChange={(e) => setShowQR(e.target.checked)}
            className="rounded"
          />
          <span className="text-xs text-gray-600">Include QR Code Header</span>
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t">
          <button type="button" onClick={onClose} className="text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-xs hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700">
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}