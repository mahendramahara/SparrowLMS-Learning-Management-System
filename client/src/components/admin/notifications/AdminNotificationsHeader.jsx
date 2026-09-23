import { Bell, CheckCheck, Trash2 } from 'lucide-react';

export default function AdminNotificationsHeader({
  activeFilter,
  onFilterChange,
  unreadCount,
  onMarkAllAsRead,
  onClearAll,
}) {
  const tabs = [
    { id: 'all', label: 'All Updates' },
    { id: 'unread', label: 'Unread' },
    { id: 'Courses', label: 'Courses' },
    { id: 'Assessments', label: 'Assignments' },
    { id: 'Payments', label: 'Payments' },
    { id: 'Users', label: 'Users' },
    { id: 'System', label: 'System' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Administrative Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="rounded-full px-2.5 py-0.5 text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Real-time audit log of course submissions, instructor payouts, and critical system alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition hover:opacity-80"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-secondary)',
              }}
            >
              <CheckCheck className="h-3.5 w-3.5 text-blue-500" />
              <span>Mark All as Read</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-500/10"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Log</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFilterChange(tab.id)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
              activeFilter === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:opacity-80'
            }`}
            style={
              activeFilter !== tab.id
                ? {
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }
                : undefined
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
