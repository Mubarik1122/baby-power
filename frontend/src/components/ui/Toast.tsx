'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  variant?: 'success' | 'error';
}

export default function Toast({ message, show, onClose, variant = 'success' }: ToastProps) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-[60] px-5 py-3.5 shadow-lg border text-sm font-medium animate-slide-up',
        variant === 'success'
          ? 'bg-primary text-white border-primary-dark'
          : 'bg-red-600 text-white border-red-700'
      )}
      role="status"
    >
      {message}
    </div>
  );
}
