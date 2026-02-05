"use client";

export function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  onConfirm, 
  onCancel,
  danger = false
}: { 
  isOpen: boolean; 
  title: string; 
  message: string; 
  confirmText?: string; 
  cancelText?: string; 
  onConfirm: () => void; 
  onCancel: () => void;
  danger?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white transition ${
              danger 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-brand hover:bg-brand-dark'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
