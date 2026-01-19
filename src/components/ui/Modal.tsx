import type { ReactNode } from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  fullScreen?: boolean;
}

export function Modal({ isOpen, onClose, title, children, fullScreen = false }: ModalProps) {
  if (!isOpen) return null;

  // Fullscreen modal para mobile - se ve como una vista completa
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col safe-area-inset">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-4 border-b border-slate-700 bg-slate-800">
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>

        {/* Body - scrollable */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    );
  }

  // Modal normal (para confirmaciones, etc.)
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative w-full max-w-lg bg-slate-800 rounded-t-2xl sm:rounded-2xl border border-slate-700 max-h-[85vh] overflow-hidden flex flex-col safe-area-pb">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
