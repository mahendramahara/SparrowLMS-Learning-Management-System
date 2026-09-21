import { FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentActivityFeed({ activities = [] }) {
  return (
    <div
      className="flex flex-col justify-between rounded-2xl p-5 border transition-all"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div
        className="flex items-center justify-between pb-3 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          Recent Activity
        </h3>
        <Link
          to="/student/notifications"
          className="flex items-center gap-1 text-xs font-semibold hover:underline"
          style={{ color: 'var(--color-primary-600)' }}
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-4 pt-3">
        {activities.map(
          ({
            id,
            icon: Icon = FileText,
            iconBg = 'rgba(37, 99, 235, 0.12)',
            iconColor = '#2563eb',
            title,
            subtitle,
            time,
          }) => (
            <div key={id} className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: iconBg, color: iconColor }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    {title}
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {subtitle}
                  </p>
                </div>
              </div>
              <span
                className="text-[10px] shrink-0 font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                {time}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
