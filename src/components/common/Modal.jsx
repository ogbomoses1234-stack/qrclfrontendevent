export default function Modal({ isOpen, onClose, title, children, size = 'max-w-lg' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${size} mx-4 p-6 relative z-10 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}