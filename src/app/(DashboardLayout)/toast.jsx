import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ 
  message = "Default message", 
  type = "success", 
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  const bgColors = {
    success: 'bg-gray-800 border-green-500/30',
    error: 'bg-gray-800 border-red-500/30',
    info: 'bg-gray-800 border-blue-500/30'
  };

  const glowEffects = {
    success: 'shadow-[0_0_15px_rgba(34,197,94,0.2)]',
    error: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    info: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]'
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div 
        className={`
          flex items-center gap-3 px-4 py-3 
          rounded-lg border backdrop-blur-sm
          ${bgColors[type]} ${glowEffects[type]}
        `}
      >
        {icons[type]}
        <p className="text-gray-100">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ml-4 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Example usage component
const ToastDemo = () => {
  const [toasts, setToasts] = useState([]);
  let toastId = 0;

  const showToast = (type) => {
    const newToast = {
      id: toastId++,
      type,
      message: `This is a ${type} message!`
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="p-4 bg-gray-900">
      <div className="flex gap-4">
        <button
          onClick={() => showToast('success')}
          className="px-4 py-2 bg-gray-800 text-green-400 rounded hover:bg-gray-700 border border-green-500/30"
        >
          Show Success
        </button>
        <button
          onClick={() => showToast('error')}
          className="px-4 py-2 bg-gray-800 text-red-400 rounded hover:bg-gray-700 border border-red-500/30"
        >
          Show Error
        </button>
        <button
          onClick={() => showToast('info')}
          className="px-4 py-2 bg-gray-800 text-blue-400 rounded hover:bg-gray-700 border border-blue-500/30"
        >
          Show Info
        </button>
      </div>
      
      <div className="fixed top-4 right-4 z-50">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ToastDemo;