import { Users, BookOpen, UserCheck, Award, ArrowUp } from 'lucide-react';

const ICON_CONFIG = {
  users: { icon: Users, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  courses: { icon: BookOpen, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  enrollments: { icon: UserCheck, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  completion: { icon: Award, color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
};

export default function AdminMetricsGrid({ metrics = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map(metric => {
        const config = ICON_CONFIG[metric.type] || ICON_CONFIG.users;
        const Icon = config.icon;

        return (
          <div
            key={metric.id}
            className="flex flex-col justify-between rounded-2xl p-5 border transition hover:shadow-md"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                {metric.label}
              </span>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: config.bg, color: config.color }}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div>
              <h3
                className="text-2xl sm:text-3xl font-black tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {metric.value}
              </h3>

              <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-500">
                <ArrowUp className="h-3.5 w-3.5" />
                <span>{metric.trend}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
