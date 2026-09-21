import { Bell, CheckCheck, Trash2 } from 'lucide-react';

export default function NotificationHeader({ unreadCount = 0, onMarkAllRead, onClearRead }) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b"
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            backgroundColor: 'rgba(37, 99, 235, 0.12)',
            color: 'var(--color-primary-600)',
          }}
        >
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1
              className="text-xl sm:text-2xl font-extrabold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-rose-500/10 text-rose-600 text-xs font-bold px-2.5 py-0.5 border border-rose-500/20">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Stay updated with course releases, deadline reminders, and evaluation grades.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold border transition hover:opacity-80 disabled:opacity-40"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
          }}
        >
          <CheckCheck className="h-3.5 w-3.5" />
          <span>Mark all as read</span>
        </button>

        <button
          type="button"
          onClick={onClearRead}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold border transition hover:opacity-80 text-rose-500"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear read</span>
        </button>
      </div>
    </div>
  );
}
