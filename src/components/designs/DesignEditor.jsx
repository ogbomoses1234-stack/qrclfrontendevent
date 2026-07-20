import { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { useToast } from '../layout/Toast';          // corrected path (relative to components/designs/)
import { createDesign } from '../../services/designService';

export default function DesignEditor({ onClose, onDesignCreated }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [position, setPosition] = useState({ x: 50, y: 50, width: 150, height: 150 });
  const [designName, setDesignName] = useState('');
  const [saving, setSaving] = useState(false);
  const imgRef = useRef(null);
  const [naturalSize, setNaturalSize] = useState({ width: 1, height: 1 });
  const showToast = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleImageLoad = (e) => {
    const img = e.target;
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handleSave = async () => {
    if (!designName.trim() || !imageFile) {
      showToast('warning', 'Missing info', 'Please provide a name and an image.');
      return;
    }
    setSaving(true);
    try {
      const img = imgRef.current;
      if (!img) throw new Error('Image not loaded');

      const displayedWidth = img.offsetWidth;
      const displayedHeight = img.offsetHeight;
      const scaleX = naturalSize.width / displayedWidth;
      const scaleY = naturalSize.height / displayedHeight;

      const naturalPosition = {
        x: Math.round(position.x * scaleX),
        y: Math.round(position.y * scaleY),
        width: Math.round(position.width * scaleX),
        height: Math.round(position.height * scaleY),
      };

      const formData = new FormData();
      formData.append('name', designName.trim());
      formData.append('image', imageFile);
      formData.append('qrPosition', JSON.stringify(naturalPosition));

      const res = await createDesign(formData);
      showToast('success', 'Design saved', 'Your design is ready to use.');
      if (onDesignCreated) onDesignCreated(res.data?.data || res.data);
      if (onClose) onClose();
    } catch (err) {
      showToast('error', 'Save failed', err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 max-w-3xl mx-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Create Design</h3>

      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500">Design Name</label>
        <input
          type="text"
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
          className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm"
          placeholder="e.g., Gala Dinner Pass"
        />
      </div>

      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500">Upload Event Pass Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full mt-1 text-sm" />
      </div>

      {imagePreview && (
        <div className="relative inline-block border rounded-lg overflow-hidden mb-4" style={{ maxHeight: '400px' }}>
          <img
            ref={imgRef}
            src={imagePreview}
            alt="template"
            className="max-w-full h-auto"
            style={{ maxHeight: '400px' }}
            onLoad={handleImageLoad}
          />
          <Rnd
            size={{ width: position.width, height: position.height }}
            position={{ x: position.x, y: position.y }}
            onDragStop={(e, d) => setPosition((p) => ({ ...p, x: d.x, y: d.y }))}
            onResizeStop={(e, direction, ref, delta, pos) => {
              setPosition({
                x: pos.x,
                y: pos.y,
                width: parseInt(ref.style.width, 10),
                height: parseInt(ref.style.height, 10),
              });
            }}
            bounds="parent"
            style={{ zIndex: 10 }}
          >
            <div className="w-full h-full border-2 border-dashed border-orange-500 bg-white/50 flex items-center justify-center text-xs font-bold text-orange-600 select-none">
              QR Code
            </div>
          </Rnd>
        </div>
      )}

      {imagePreview && (
        <div className="text-xs text-gray-500 mb-4">
          QR position: X={position.x} Y={position.y} · Size={position.width}×{position.height}px
        </div>
      )}

      <div className="flex justify-end gap-2 pt-3 border-t">
        <button onClick={onClose} className="text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-xs hover:bg-gray-50">Cancel</button>
        <button onClick={handleSave} disabled={!imagePreview || saving} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-orange-600 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Design'}
        </button>
      </div>
    </div>
  );
}