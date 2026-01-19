import { useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error' | 'info';
}

export function Toast({ 
  message, 
  isVisible, 
  onClose, 
  duration = 2500,
  type = 'success' 
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-gradient-to-r from-green-600 to-emerald-600',
    error: 'bg-gradient-to-r from-red-600 to-rose-600',
    info: 'bg-gradient-to-r from-indigo-600 to-purple-600',
  }[type];

  const Icon = type === 'success' ? Check : type === 'error' ? X : Check;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 pt-4 safe-area-pt">
      <div
        className={`
          ${bgColor} 
          px-5 py-3.5 
          rounded-2xl 
          shadow-2xl 
          flex items-center gap-3
          pointer-events-auto
          animate-slide-down
        `}
      >
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <Icon size={18} className="text-white" />
        </div>
        <span className="text-white font-medium text-base">{message}</span>
      </div>
    </div>
  );
}
