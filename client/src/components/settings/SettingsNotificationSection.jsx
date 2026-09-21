import { useState } from 'react';

const ROWS = [
  {
    key: 'emailAssignments',
    label: 'Assignment reminders',
    desc: 'Get notified before assignments are due',
    group: 'Email',
  },
  {
    key: 'emailGrades',
    label: 'Grade updates',
    desc: 'Receive results when instructors publish grades',
    group: 'Email',
  },
  {
    key: 'emailAnnouncements',
    label: 'Course announcements',
    desc: 'Course updates and instructor broadcasts',
    group: 'Email',
  },
  {
    key: 'emailNewCourses',
    label: 'New course recommendations',
    desc: 'Personalized course suggestions',
    group: 'Email',
  },
  {
    key: 'browserAssignments',
    label: 'Assignment alerts',
    desc: 'In-browser push for upcoming deadlines',
    group: 'Browser',
  },
  {
    key: 'browserMessages',
    label: 'New messages',
    desc: 'Push notification for direct messages',
    group: 'Browser',
  },
  {
    key: 'browserGrades',
    label: 'Grade published',
    desc: 'Instant push when grades are released',
    group: 'Browser',
  },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200"
      style={{ backgroundColor: checked ? 'var(--color-primary-600)' : 'var(--border-subtle)' }}
    >
      <span
        className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 mt-0.5"
        style={{ transform: checked ? 'translateX(1.125rem)' : 'translateX(0.125rem)' }}
      />
    </button>
  );
}

export default function SettingsNotificationSection({ notifications }) {
  const [prefs, setPrefs] = useState(notifications);

  const toggle = key => setPrefs(prev => ({ ...prev, [key]: !prev[key] }));

  const groups = ['Email', 'Browser'];

  return (
    <div
      className="rounded-2xl border p-6 space-y-5"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div>
        <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          Notification Preferences
        </h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Choose how and when you receive notifications.
        </p>
      </div>

      {groups.map(group => (
        <div key={group} className="space-y-3">
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            {group} Notifications
          </p>
          <div className="space-y-2">
            {ROWS.filter(r => r.group === group).map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 rounded-xl px-4 py-3"
                style={{ backgroundColor: 'var(--bg-subtle)' }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {label}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {desc}
                  </p>
                </div>
                <Toggle checked={!!prefs[key]} onChange={() => toggle(key)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
