export default function FeatureItem({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-center gap-3.5">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: 'var(--color-primary-50)',
          color: 'var(--color-primary-600)',
          boxShadow: '0 0 0 4px var(--color-primary-focus)',
        }}
      >
        <Icon className="h-6 w-6" strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </div>
        <div className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {desc}
        </div>
      </div>
    </div>
  );
}
