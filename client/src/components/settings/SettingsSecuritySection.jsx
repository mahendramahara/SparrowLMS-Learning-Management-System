import { ShieldCheck, KeyRound, Monitor, AlertTriangle } from 'lucide-react';

export default function SettingsSecuritySection({ security }) {
  const rows = [
    {
      icon: KeyRound,
      label: 'Password',
      desc: `Last changed ${security.lastPasswordChange}`,
      action: 'Change Password',
      variant: 'primary',
    },
    {
      icon: ShieldCheck,
      label: 'Two-Factor Authentication',
      desc: security.twoFactorEnabled
        ? 'Enabled — your account is protected'
        : 'Not enabled — add an extra layer of security',
      action: security.twoFactorEnabled ? 'Disable' : 'Enable',
      variant: security.twoFactorEnabled ? 'danger' : 'primary',
    },
    {
      icon: Monitor,
      label: 'Active Sessions',
      desc: `${security.activeSessions} device${security.activeSessions > 1 ? 's' : ''} currently signed in`,
      action: 'Manage Sessions',
      variant: 'secondary',
    },
  ];

  return (
    <div
      className="rounded-2xl border p-6 space-y-5"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div>
        <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          Security
        </h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Manage password, two-factor auth, and active sessions.
        </p>
      </div>

      {!security.twoFactorEnabled && (
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3 border"
          style={{
            backgroundColor: 'rgba(217, 119, 6, 0.08)',
            borderColor: 'rgba(217, 119, 6, 0.2)',
          }}
        >
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: '#d97706' }} />
          <p className="text-xs font-medium" style={{ color: '#d97706' }}>
            Two-factor authentication is not enabled. Enable it to keep your account secure.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {rows.map(({ icon: Icon, label, desc, action, variant }) => (
          <div
            key={label}
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
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {label}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {desc}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold border transition hover:opacity-80"
              style={
                variant === 'danger'
                  ? {
                      borderColor: 'rgba(220, 38, 38, 0.3)',
                      color: '#dc2626',
                      backgroundColor: 'rgba(220, 38, 38, 0.08)',
                    }
                  : variant === 'primary'
                    ? { backgroundColor: 'var(--color-primary-600)', color: '#fff', border: 'none' }
                    : {
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--bg-card)',
                      }
              }
            >
              {action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
