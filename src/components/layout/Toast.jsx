import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, title, msg) => {
    setToast({ type, title, msg });
    setTimeout(() => setToast(null), 3500);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div className="fixed top-5 right-5 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl transform translate-x-0 transition-transform z-50 flex items-center gap-3 max-w-sm slide-in">
          <i
            className={`${
              toast.type === 'error'
                ? 'fas fa-exclamation-circle text-red-400'
                : toast.type === 'warning'
                ? 'fas fa-exclamation-triangle text-amber-400'
                : 'fas fa-check-circle text-green-400'
            } text-xl`}
          ></i>
          <div>
            <h4 className="font-bold text-sm">{toast.title}</h4>
            <p className="text-xs text-gray-300">{toast.msg}</p>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);