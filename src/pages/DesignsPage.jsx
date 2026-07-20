import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/layout/Toast';          // correct path from pages/
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import DesignEditor from '../components/designs/DesignEditor';  // editor is separate
import { getDesigns } from '../services/designService';

// ---------- Sub‑component to display a saved design with QR overlay ----------
function DesignCard({ design }) {
  // Store natural dimensions to calculate percentage positions dynamically
  const [naturalDimensions, setNaturalDimensions] = useState({
    width: design.naturalWidth || 0,
    height: design.naturalHeight || 0
  });

  const handleImageLoad = (e) => {
    if (!naturalDimensions.width || !naturalDimensions.height) {
      setNaturalDimensions({
        width: e.currentTarget.naturalWidth,
        height: e.currentTarget.naturalHeight
      });
    }
  };

  const { x, y, width, height } = design.qrPosition;
  
  // Calculate percentage-based placement for perfect fluid responsiveness
  const hasDimensions = naturalDimensions.width > 0 && naturalDimensions.height > 0;
  const style = hasDimensions ? {
    left: `${(x / naturalDimensions.width) * 100}%`,
    top: `${(y / naturalDimensions.height) * 100}%`,
    width: `${(width / naturalDimensions.width) * 100}%`,
    height: `${(height / naturalDimensions.height) * 100}%`,
  } : { display: 'none' };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative w-full rounded-lg overflow-hidden bg-gray-50" style={{ lineHeight: 0 }}>
        <img
          src={design.imageUrl}
          alt={design.name}
          className="w-full h-auto block select-none"
          onLoad={handleImageLoad}
        />
        {/* Absolutely positioned overlay using CSS percentages */}
        {hasDimensions && (
          <div
            className="absolute border-2 border-dashed border-orange-500 bg-orange-100/30 pointer-events-none rounded shadow-sm"
            style={style}
            title={`QR position: (${x},${y}) ${width}×${height}px`}
          />
        )}
      </div>
      <h3 className="font-semibold text-sm text-gray-800 mt-2.5 truncate">{design.name}</h3>
      <p className="text-[10px] text-gray-400 mt-1 font-mono">QR: ({x},{y}) {width}×{height}px</p>
    </div>
  );
}

// ---------- Main Designs page ----------
export default function DesignsPage() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const showToast = useToast();

  const fetchDesigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDesigns();
      setDesigns(res.data?.data || res.data || []);
    } catch (err) {
      showToast('error', 'Failed to load designs', err.message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchDesigns(); }, [fetchDesigns]);

  const handleDesignCreated = (newDesign) => {
    setDesigns((prev) => [newDesign, ...prev]);
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 bg-gray-50/30">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            <i className="fas fa-paint-brush text-orange-500"></i> Designs
          </h1>
          <Button icon="plus" onClick={() => setShowEditor(true)}>New Design</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <i className="fas fa-spinner fa-pulse text-3xl text-gray-400"></i>
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-20 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white">
            No designs yet. Create one to use in your campaigns.
          </div>
        ) : (
          /* Responsive Masonry Layout Columns */
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {designs.map((d) => (
              <div key={d._id} className="break-inside-avoid">
                <DesignCard design={d} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showEditor} onClose={() => setShowEditor(false)} title="" size="max-w-3xl">
        <DesignEditor
          onClose={() => setShowEditor(false)}
          onDesignCreated={handleDesignCreated}
        />
      </Modal>
    </div>
  );
}