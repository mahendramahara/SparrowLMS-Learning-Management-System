import { useState } from 'react';
import { User, Camera } from 'lucide-react';

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  borderRadius: '0.75rem',
  fontSize: '0.875rem',
  outline: 'none',
  border: '1px solid var(--border-subtle)',
  backgroundColor: 'var(--bg-subtle)',
  color: 'var(--text-primary)',
};

export default function SettingsProfileSection({ profile, onSave }) {
  const [form, setForm] = useState(profile);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div
      className="rounded-2xl border p-6 space-y-5"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div>
        <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          Profile Information
        </h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Update your personal details and public profile.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
        >
          <User className="h-7 w-7" />
          <button
            type="button"
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 text-white"
            style={{ backgroundColor: 'var(--color-primary-600)', borderColor: 'var(--bg-card)' }}
          >
            <Camera className="h-3 w-3" />
          </button>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {form.name}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {form.role} · Joined {form.joinedDate}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name">
          <input
            style={inputStyle}
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
          />
        </Field>
        <Field label="Email Address">
          <input
            style={inputStyle}
            type="email"
            value={form.email}
            onChange={e => handleChange('email', e.target.value)}
          />
        </Field>
        <Field label="Phone">
          <input
            style={inputStyle}
            value={form.phone}
            onChange={e => handleChange('phone', e.target.value)}
          />
        </Field>
        <Field label="Location">
          <input
            style={inputStyle}
            value={form.location}
            onChange={e => handleChange('location', e.target.value)}
          />
        </Field>
        <Field label="Website">
          <input
            style={inputStyle}
            value={form.website}
            onChange={e => handleChange('website', e.target.value)}
          />
        </Field>
      </div>

      <Field label="Bio">
        <textarea
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
          value={form.bio}
          onChange={e => handleChange('bio', e.target.value)}
        />
      </Field>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSave?.(form)}
          className="rounded-xl px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
          style={{ backgroundColor: 'var(--color-primary-600)' }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
