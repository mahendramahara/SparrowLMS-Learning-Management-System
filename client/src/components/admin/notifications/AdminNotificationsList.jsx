import { Link } from 'react-router-dom';
import {
  BookOpen,
  DollarSign,
  UserCheck,
  ShieldAlert,
  Clock,
  ArrowRight,
  CheckCircle,
  Trash2,
} from 'lucide-react';

const TYPE_CONFIG = {
  assignment: { icon: BookOpen, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  course: { icon: BookOpen, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  course_request: { icon: BookOpen, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  payout: { icon: DollarSign, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  user_registration: { icon: UserCheck, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  system: { icon: ShieldAlert, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  security: { icon: ShieldAlert, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export default function AdminNotificationsList({
  notifications = [],
  onToggleRead,
  onDelete,
}) {
  if (notifications.length === 0) {
    return (
      <div
        className="rounded-3xl border p-12 text-center"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
      >
        <p className="text-sm font-semibold">No notifications found in this view.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map(item => {
        const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.system;
        const Icon = config.icon;

        return (
          <div
            key={item.id}
            className={`rounded-2xl p-4 sm:p-5 border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              !item.read ? 'ring-1 ring-blue-500/20' : ''
            }`}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-start gap-3.5 min-w-0 flex-1">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                style={{ backgroundColor: config.bg, color: config.color }}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="rounded-lg px-2 py-0.5 text-[10px] font-bold"
                    style={{ backgroundColor: config.bg, color: config.color }}
                  >
                    {item.category}
                  </span>
                  {!item.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                  )}
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.time}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {item.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {item.actionUrl && (
                <Link
                  to={item.actionUrl}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
                >
                  <span>Review</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}

              <button
                type="button"
                onClick={() => onToggleRead(item.id)}
                className="p-2 rounded-xl border transition hover:opacity-80"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: item.read ? 'var(--text-muted)' : 'var(--color-primary-600)',
                }}
                title={item.read ? 'Mark as Unread' : 'Mark as Read'}
              >
                <CheckCircle className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="p-2 rounded-xl border transition hover:bg-rose-500/10 text-rose-500"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                }}
                title="Remove notification"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
