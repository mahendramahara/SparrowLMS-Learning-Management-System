import { PieChart, Layers } from 'lucide-react';

export default function AdminCategoryRevenueChart({ categoryRevenue = [] }) {
  if (categoryRevenue.length === 0) return null;

  return (
    <div
      className="rounded-3xl border p-6 transition"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary-600)' }}
          >
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Category Revenue Share
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Market share by subject taxonomy
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {categoryRevenue.map(item => (
          <div key={item.category} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                {item.category}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  {item.amount}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  ({item.percentage}%)
                </span>
              </div>
            </div>

            <div className="h-2.5 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color || '#2563eb',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-6 rounded-2xl p-4 border text-xs"
        style={{
          backgroundColor: 'var(--bg-subtle)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <span className="font-bold text-slate-400 text-[10px] uppercase block mb-1">
          Top Performing Sector
        </span>
        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          Web Development represents 44% of total course volume, led by Full-Stack MERN curricula.
        </p>
      </div>
    </div>
  );
}
