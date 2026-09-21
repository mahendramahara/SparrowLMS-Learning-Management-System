import { ArrowUpRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  iconBg = 'rgba(37, 99, 235, 0.12)',
  iconColor = '#2563eb',
}) {
  return (
    <div
      className="flex flex-col justify-between rounded-2xl p-5 border transition-all hover:shadow-md"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          {title}
        </p>
        <p
          className="text-2xl font-extrabold tracking-tight mt-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {value}
        </p>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}
