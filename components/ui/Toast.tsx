'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose?: () => void;
}

const COLORS: Record<ToastType, string> = {
  success: 'bg-accl border-acc text-accd',
  error:   'bg-errl border-err text-err',
  info:    'bg-infl border-inf text-inf',
};

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(() => onClose?.(), 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`
      fixed bottom-6 right-6 z-50 flex items-center gap-3
      px-4 py-3 rounded-r3 border shadow-sh2 text-sm max-w-sm
      ${COLORS[type]}
    `.trim()}>
      <span>{message}</span>
      <button onClick={onClose} aria-label="Fermer"><X size={16} /></button>
    </div>
  );
}
