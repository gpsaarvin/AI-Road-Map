"use client";
import { useEffect } from 'react';

export function Toast({ 
  message, 
  type = 'success', 
  onClose 
}: { 
  message: string; 
  type?: 'success' | 'error' | 'info'; 
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-bottom`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">✕</button>
      </div>
    </div>
  );
}
