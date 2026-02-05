"use client";

export function ToggleSwitch({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string; 
  description?: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {description && <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-brand' : 'bg-gray-300 dark:bg-neutral-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
