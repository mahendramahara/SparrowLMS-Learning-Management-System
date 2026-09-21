export default function InfoCard({ icon: Icon, iconBg, title, desc }) {
  return (
    <div
      className="flex items-center gap-3.5 rounded-2xl px-4 py-3 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-md"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <div
          className="text-xs sm:text-sm font-bold leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </div>
        <div
          className="text-[11px] sm:text-xs font-medium leading-tight mt-0.5"
          style={{ color: 'var(--text-muted)' }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
}
