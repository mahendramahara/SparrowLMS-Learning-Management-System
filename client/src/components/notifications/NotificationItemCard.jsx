import { BookOpen, FileText, Award, Bell, Clock, ArrowRight, CheckCircle2, X } from 'lucide-react';

const ICON_MAP = {
  assignment: { icon: FileText, color: '#d97706', bg: 'rgba(245, 158, 11, 0.12)' },
  course: { icon: BookOpen, color: '#2563eb', bg: 'rgba(37, 99, 235, 0.12)' },
  grade: { icon: Award, color: '#059669', bg: 'rgba(16, 185, 129, 0.12)' },
  system: { icon: Bell, color: '#9333ea', bg: 'rgba(147, 51, 234, 0.12)' },
};

export default function NotificationItemCard({
  notification,
  onToggleRead,
  onDismiss,
  onNavigate,
}) {
  if (!notification) return null;

  const styleConfig = ICON_MAP[notification.type] || ICON_MAP.system;
  const Icon = styleConfig.icon;

  return (
    <div
      className={`group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all ${
        !notification.read ? 'shadow-sm' : 'opacity-85'
      }`}
      style={{
        backgroundColor: !notification.read ? 'var(--bg-card)' : 'var(--bg-subtle)',
        borderColor: !notification.read
          ? 'var(--color-primary-200, var(--border-subtle))'
          : 'var(--border-subtle)',
      }}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl relative"
          style={{ backgroundColor: styleConfig.bg, color: styleConfig.color }}
        >
          <Icon className="h-5 w-5" />
          {!notification.read && (
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
          )}
        </div>

        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={`text-xs sm:text-sm tracking-tight truncate ${
                !notification.read ? 'font-bold' : 'font-semibold'
              }`}
              style={{ color: 'var(--text-primary)' }}
            >
              {notification.title}
            </h4>
            {!notification.read && (
              <span className="shrink-0 text-[10px] font-bold text-blue-600 bg-blue-500/10 rounded px-1.5 py-0.2">
                Unread
              </span>
            )}
          </div>

          <p
            className="text-xs leading-relaxed line-clamp-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            {notification.message}
          </p>

          <div
            className="flex items-center gap-3 pt-1 text-[11px]"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="font-medium truncate">{notification.sender}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{notification.time}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {notification.actionUrl && (
          <button
            type="button"
            onClick={() => onNavigate?.(notification.actionUrl)}
            className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--color-primary-600)' }}
          >
            <span>View</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onToggleRead?.(notification.id)}
          title={notification.read ? 'Mark as unread' : 'Mark as read'}
          className="p-1.5 rounded-lg border text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}
        >
          <CheckCircle2 className={`h-3.5 w-3.5 ${notification.read ? 'text-emerald-500' : ''}`} />
        </button>

        <button
          type="button"
          onClick={() => onDismiss?.(notification.id)}
          title="Dismiss notification"
          className="p-1.5 rounded-lg border text-slate-400 hover:text-rose-500 transition"
          style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
