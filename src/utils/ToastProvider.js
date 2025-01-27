import React, { useState, useEffect, createContext, useContext } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false); // Start as false for entry animation
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  if (!isVisible && isLeaving) return null;

  return (
    <div 
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        transform transition-all duration-300 ease-out
        ${!isVisible ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        ${isLeaving ? 'translate-x-full opacity-0' : ''}
        ${type === 'success' ? 'bg-green-900/90' : ''}
        ${type === 'error' ? 'bg-red-900/90' : ''}
        ${type === 'info' ? 'bg-blue-900/90' : ''}
        backdrop-blur-sm border border-white/10
        mb-2 relative overflow-hidden
        w-full max-w-sm
      `}
    >
      {/* Progress bar */}
      <div 
        className={`
          absolute bottom-0 left-0 h-1
          ${type === 'success' ? 'bg-green-400' : ''}
          ${type === 'error' ? 'bg-red-400' : ''}
          ${type === 'info' ? 'bg-blue-400' : ''}
        `}
        style={{
          width: '100%',
          animation: `shrink ${duration}ms linear`
        }}
      />
      
      {icons[type]}
      <p className="text-gray-100 font-medium">{message}</p>
      <button
        onClick={() => {
          setIsLeaving(true);
          setTimeout(() => {
            setIsVisible(false);
            onClose?.();
          }, 300);
        }}
        className="ml-auto text-gray-400 hover:text-gray-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success", duration = 3000) => {
    const id = Math.random().toString(36);
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const value = {
    showToast: addToast,
    hideToast: removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;