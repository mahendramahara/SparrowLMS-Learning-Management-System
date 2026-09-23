import { Shield, Bell, Check } from 'lucide-react';

export default function AdminSettingsForm({ settings, onSave, onToggle }) {
  return (
    <form onSubmit={onSave} className="space-y-6 max-w-4xl">
      <div
        className="rounded-2xl p-6 border space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-500" />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            General Platform Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Platform Name
            </label>
            <input
              type="text"
              defaultValue={settings.platformName}
              className="w-full rounded-xl py-2 px-3 text-xs border outline-none"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              System Support Email
            </label>
            <input
              type="email"
              defaultValue={settings.supportEmail}
              className="w-full rounded-xl py-2 px-3 text-xs border outline-none"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Instructor Revenue Share (%)
          </label>
          <input
            type="number"
            defaultValue={settings.payoutPercentage}
            className="w-full sm:w-48 rounded-xl py-2 px-3 text-xs border outline-none"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      <div
        className="rounded-2xl p-6 border space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-500" />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Security &amp; Operational Controls
          </h2>
        </div>

        <div className="space-y-3">
          {[
            { id: 'allowRegistrations', label: 'Allow open student registrations without manual verification' },
            { id: 'emailNotifications', label: 'Send instant email notifications to admin on high-volume transactions' },
            { id: 'maintenanceMode', label: 'Maintenance Mode (temporarily restrict non-admin access)' },
          ].map(opt => (
            <label key={opt.id} className="flex items-center gap-3 cursor-pointer text-xs">
              <input
                type="checkbox"
                defaultChecked={!!settings[opt.id]}
                onChange={e => onToggle(opt.id, e.target.checked)}
                className="rounded border-slate-700 text-blue-600"
              />
              <span style={{ color: 'var(--text-secondary)' }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
          style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
        >
          <Check className="h-4 w-4" />
          <span>Save System Settings</span>
        </button>
      </div>
    </form>
  );
}
