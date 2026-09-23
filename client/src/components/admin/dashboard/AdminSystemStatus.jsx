export default function AdminSystemStatus({ statuses = [] }) {
  return (
    <div
      className="rounded-2xl p-5 border space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
        System Status
      </h2>

      <div className="space-y-3">
        {statuses.map(item => (
          <div key={item.id} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {item.name}
              </span>
            </div>

            <span className="font-bold text-emerald-500 text-[11px]">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
