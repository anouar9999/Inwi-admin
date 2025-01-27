import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  position = 'bottom-right',
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration === 0) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300); // Wait for exit animation
    }, duration);

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) return 0;
        return prev - (100 / (duration / 100));
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration, onClose]);

  // Icon and color configs
  const configs = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      progressColor: 'bg-green-500/50'
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-red-400" />,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      progressColor: 'bg-red-500/50'
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5 text-yellow-400" />,
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      progressColor: 'bg-yellow-500/50'
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-400" />,
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      progressColor: 'bg-blue-500/50'
    }
  };

  const config = configs[type];

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  return (
    <div
      className={`
        fixed ${positionClasses[position]} z-50
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}
    >
      <div className={`
        relative flex items-center max-w-md w-full overflow-hidden
        ${config.bgColor} ${config.borderColor}
        border rounded-lg shadow-lg
        backdrop-blur-md
      `}>
        {/* Icon */}
        <div className="flex-shrink-0 pl-4">
          {config.icon}
        </div>

        {/* Message */}
        <div className="flex-1 p-4 pr-2">
          <p className="text-sm text-gray-200">
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
          className="p-2 rounded-lg mr-2 hover:bg-white/10 
                     transition-colors duration-200"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        {/* Progress Bar */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div
              className={`h-full ${config.progressColor} transition-all duration-100 ease-linear`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Toast Container to manage multiple toasts
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
};

export default Toast;
export { ToastContainer };