import { Globe, Clock, Calendar } from 'lucide-react';

const FIELDS = [
  { key: 'language', label: 'Language', icon: Globe },
  { key: 'timezone', label: 'Timezone', icon: Clock },
  { key: 'dateFormat', label: 'Date Format', icon: Calendar },
];

export default function SettingsAppearanceSection({ appearance }) {
  return (
    <div
      className="rounded-2xl border p-6 space-y-5"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div>
        <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          Appearance & Regional
        </h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Language, timezone, and display format preferences.
        </p>
      </div>

      <div className="space-y-3">
        {FIELDS.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 rounded-xl px-4 py-3"
            style={{ backgroundColor: 'var(--bg-subtle)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  color: 'var(--color-primary-600)',
                }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {label}
              </p>
            </div>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              {appearance[key]}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        Appearance theme can be changed via the toolbox panel on the right side of the screen.
      </p>
    </div>
  );
}
