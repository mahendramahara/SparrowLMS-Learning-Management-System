import { useState, useEffect } from 'react';
import { X, Save, Shield } from 'lucide-react';

export default function AdminEditUserModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Student',
    status: 'Active',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'Student',
        status: user.status || 'Active',
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = e => {
    e.preventDefault();
    onSave({
      ...user,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-3xl p-6 border shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Edit User Account
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Update credentials, role permissions, and access status.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl transition hover:opacity-80"
            style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-xs outline-none transition"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-xs outline-none transition"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Role
              </label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full rounded-xl border px-3 py-2 text-xs outline-none transition"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Account Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-xl border px-3 py-2 text-xs outline-none transition"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold transition hover:opacity-80"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
              style={{ backgroundColor: 'var(--color-primary-600)' }}
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
