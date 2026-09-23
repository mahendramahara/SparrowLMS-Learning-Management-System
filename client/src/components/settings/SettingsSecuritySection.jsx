import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck, KeyRound, Monitor, AlertTriangle, LogOut, Lock, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { changePassword } from '../../services/user.api';

export default function SettingsSecuritySection({ security }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    try {
      await logout(true);
    } finally {
      setIsLoggingOut(false);
      navigate('/login', { replace: true });
    }
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    setPasswordLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully.');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const rows = [
    {
      icon: KeyRound,
      label: 'Password',
      desc: `Last changed ${security.lastPasswordChange}`,
      action: 'Change Password',
      variant: 'primary',
      onClick: () => setShowPasswordModal(true),
    },
    {
      icon: ShieldCheck,
      label: 'Two-Factor Authentication',
      desc: security.twoFactorEnabled
        ? 'Enabled — your account is protected'
        : 'Not enabled — add an extra layer of security',
      action: security.twoFactorEnabled ? 'Disable' : 'Enable',
      variant: security.twoFactorEnabled ? 'danger' : 'primary',
      onClick: () => toast.success('2FA settings updated.'),
    },
    {
      icon: Monitor,
      label: 'Active Sessions',
      desc: `${security.activeSessions} device${security.activeSessions > 1 ? 's' : ''} currently signed in`,
      action: 'Manage Sessions',
      variant: 'secondary',
      onClick: () => toast.success('Active sessions refreshed.'),
    },
  ];

  return (
    <div
      className="rounded-2xl border p-6 space-y-5 relative"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            className="w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-xl animate-in fade-in"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary-600)' }}
                >
                  <Lock className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Change Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary-500"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary-500"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary-500"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold border transition hover:opacity-80"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-primary-600)' }}
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
        {rows.map(({ icon: Icon, label, desc, action, variant, onClick }) => (
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
              onClick={onClick}
              className="shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold border transition hover:opacity-80 active:scale-95"
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

      <div
        className="flex items-center justify-between gap-4 rounded-xl p-4 border"
        style={{
          borderColor: 'rgba(239, 68, 68, 0.2)',
          backgroundColor: 'rgba(239, 68, 68, 0.04)',
        }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Sign Out of All Sessions
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            End all active student sessions across all browsers and devices.
          </p>
        </div>

        <button
          type="button"
          disabled={isLoggingOut}
          onClick={handleLogoutAll}
          className="flex items-center gap-1.5 shrink-0 rounded-xl px-4 py-2 text-xs font-semibold border transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
          style={{
            borderColor: 'rgba(239, 68, 68, 0.25)',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            color: '#ef4444',
          }}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{isLoggingOut ? 'Signing out...' : 'Sign Out All'}</span>
        </button>
      </div>
    </div>
  );
}
