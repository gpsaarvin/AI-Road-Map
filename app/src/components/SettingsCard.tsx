export function SettingsCard({ title, icon, children }: { title: string; icon?: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6 shadow-lg card-hover">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b dark:border-neutral-800">
        {icon && <span className="text-2xl">{icon}</span>}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}
