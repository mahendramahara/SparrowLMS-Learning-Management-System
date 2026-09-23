import { Bell } from 'lucide-react';

export default function InstructorNotificationsSection({ notifications, onNotificationToggle }) {
  const options = [
    { id: 'emailOnEnrollment', label: 'Email when a student enrolls in a course' },
    { id: 'emailOnReview', label: 'Email when a student submits a review' },
    { id: 'emailOnAssignment', label: 'Email when an assignment submission is uploaded' },
  ];

  return (
    <div
      className="rounded-2xl p-6 border space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4" style={{ color: 'var(--color-primary-600, #2563eb)' }} />
        <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          Notifications
        </h2>
      </div>

      <div className="space-y-3">
        {options.map(item => (
          <label key={item.id} className="flex items-center gap-3 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={!!notifications[item.id]}
              onChange={e => onNotificationToggle(item.id, e.target.checked)}
              className="rounded border-slate-700 text-blue-600"
            />
            <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
