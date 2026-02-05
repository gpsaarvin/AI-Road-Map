export function FormInput({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  error 
}: { 
  label: string; 
  type?: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-md border px-3 py-2 text-sm ${
          disabled 
            ? 'bg-gray-100 dark:bg-neutral-900 cursor-not-allowed' 
            : 'bg-white dark:bg-neutral-950'
        } dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand ${
          error ? 'border-red-500' : ''
        }`}
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
