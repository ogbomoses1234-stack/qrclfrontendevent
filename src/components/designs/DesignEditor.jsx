import { useState, useRef, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { useToast } from '../layout/Toast';
import { createDesign, updateDesign } from '../../services/designService';

export default function DesignEditor({ onClose, onDesignCreated, initialDesign }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialDesign?.imageUrl || null);
  const [position, setPosition] = useState({ x: 50, y: 50, width: 150, height: 150 });
  const [designName, setDesignName] = useState(initialDesign?.name || '');
  const [saving, setSaving] = useState(false);
  const imgRef = useRef(null);
  const [naturalSize, setNaturalSize] = useState({ width: 1, height: 1 });
  const initializedRef = useRef(false);
  const showToast = useToast();

  // ─── Convert natural dimensions to screen-displayed dimensions ───
  const convertToDisplayed = useCallback(() => {
    const img = imgRef.current;
    if (!img || !initialDesign?.qrPosition || initializedRef.current) return;
    
    // Use getBoundingClientRect for absolute precision on rendered size
    const rect = img.getBoundingClientRect();
    const displayedWidth = rect.width;
    const displayedHeight = rect.height;

    if (displayedWidth === 0 || displayedHeight === 0 || img.naturalWidth === 0) return;

    const scaleX = displayedWidth / img.naturalWidth;
    const scaleY = displayedHeight / img.naturalHeight;

    setPosition({
      x: Math.round(initialDesign.qrPosition.x * scaleX),
      y: Math.round(initialDesign.qrPosition.y * scaleY),
      width: Math.round(initialDesign.qrPosition.width * scaleX),
      height: Math.round(initialDesign.qrPosition.height * scaleY),
    });
    initializedRef.current = true;
  }, [initialDesign]);

  // ─── Reset state when editing a different design ──────────────────
  useEffect(() => {
    initializedRef.current = false;
    setDesignName(initialDesign?.name || '');
    setImagePreview(initialDesign?.imageUrl || null);
    
    if (initialDesign?.qrPosition) {
      setPosition(initialDesign.qrPosition);
    } else {
      setPosition({ x: 50, y: 50, width: 150, height: 150 });
    }
  }, [initialDesign]);

  // ─── Handle Image Load Event ──────────────────────────────────
  const handleImageLoad = (e) => {
    const img = e.target;
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    requestAnimationFrame(convertToDisplayed);
  };

  // ─── Fallback for cached images where onLoad might bypass ───
  useEffect(() => {
    if (!imagePreview) return;
    const img = imgRef.current;
    if (!img) return;

    if (img.complete && img.naturalWidth > 0) {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      requestAnimationFrame(convertToDisplayed);
    }
  }, [imagePreview, convertToDisplayed]);

  // ─── File upload handler ──────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
    initializedRef.current = false;
  };

  // ─── Save logic (re-scales screen coordinates back to natural) ───
  const handleSave = async () => {
    if (!designName.trim()) {
      showToast('warning', 'Missing info', 'Please provide a design name.');
      return;
    }
    if (!initialDesign && !imageFile) {
      showToast('warning', 'Missing image', 'Please upload an image.');
      return;
    }
    setSaving(true);

    try {
      const img = imgRef.current;
      if (!img) throw new Error('Image not loaded');

      const rect = img.getBoundingClientRect();
      const scaleX = naturalSize.width / rect.width;
      const scaleY = naturalSize.height / rect.height;

      const naturalPosition = {
        x: Math.round(position.x * scaleX),
        y: Math.round(position.y * scaleY),
        width: Math.round(position.width * scaleX),
        height: Math.round(position.height * scaleY),
      };

      if (initialDesign) {
        const res = await updateDesign(initialDesign._id, {
          name: designName.trim(),
          qrPosition: naturalPosition,
        });
        showToast('success', 'Design updated', 'Your changes have been saved.');
        if (onDesignCreated) onDesignCreated(res.data?.data || res.data);
      } else {
        const formData = new FormData();
        formData.append('name', designName.trim());
        formData.append('image', imageFile);
        formData.append('qrPosition', JSON.stringify(naturalPosition));

        const res = await createDesign(formData);
        showToast('success', 'Design saved', 'Your design is ready to use.');
        if (onDesignCreated) onDesignCreated(res.data?.data || res.data);
      }
      if (onClose) onClose();
    } catch (err) {
      showToast('error', 'Save failed', err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 max-w-3xl mx-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {initialDesign ? 'Edit Design' : 'Create Design'}
      </h3>

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
        <label className="text-xs font-semibold text-gray-500">
          {initialDesign ? 'Replace Image (optional)' : 'Upload Event Pass Image'}
        </label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full mt-1 text-sm" />
      </div>

      {imagePreview && (
        <div className="relative inline-block border rounded-lg overflow-hidden mb-4" style={{ maxHeight: '400px' }}>
          <img
            ref={imgRef}
            src={imagePreview}
            alt="template"
            className="max-w-full h-auto block"
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
          QR position (on screen): X={position.x} Y={position.y} · Size={position.width}×{position.height}px
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