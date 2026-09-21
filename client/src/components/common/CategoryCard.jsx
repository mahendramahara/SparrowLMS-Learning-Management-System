export default function CategoryCard({ icon: Icon, title, count }) {
  return (
    <a
      href="#"
      className="rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-md"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          backgroundColor: 'var(--color-primary-50)',
          color: 'var(--color-primary-600)',
        }}
      >
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <div className="mt-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </div>
      <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
        {count}
      </div>
    </a>
  );
}
