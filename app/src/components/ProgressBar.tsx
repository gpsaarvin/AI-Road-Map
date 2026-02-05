export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-3 rounded bg-gray-200 dark:bg-neutral-800">
      <div className="h-3 rounded bg-brand" style={{ width: `${value}%` }} />
    </div>
  );
}
