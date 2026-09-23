import { Link } from 'react-router-dom';
import { UserCheck, BookOpen, CreditCard, MessageSquare, FileCheck2, ArrowRight } from 'lucide-react';

const TYPE_ICONS = {
  student: UserCheck,
  course: BookOpen,
  enrollment: CreditCard,
  message: MessageSquare,
  assessment: FileCheck2,
};

export default function AdminRecentActivity({ activities = [] }) {
  return (
    <div
      className="rounded-2xl p-5 border space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          Recent Activity
        </h2>
        <Link
          to="/admin/reports"
          className="flex items-center gap-1 text-xs font-semibold hover:underline"
          style={{ color: 'var(--color-primary-600, #2563eb)' }}
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-3.5">
        {activities.map(item => {
          const Icon = TYPE_ICONS[item.type] || BookOpen;

          return (
            <div key={item.id} className="flex items-start gap-3 text-xs">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5"
                style={{
                  backgroundColor: `${item.color}18`,
                  color: item.color,
                }}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </p>
                <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {item.detail}
                </p>
              </div>

              <span className="text-[10px] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                {item.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
