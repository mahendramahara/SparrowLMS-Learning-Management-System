import { User } from 'lucide-react';

export default function InstructorProfileSection({ profile, onProfileChange }) {
  return (
    <div
      className="rounded-2xl p-6 border space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-2">
        <User className="h-4 w-4" style={{ color: 'var(--color-primary-600, #2563eb)' }} />
        <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          Public Instructor Profile
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Full Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={e => onProfileChange({ ...profile, name: e.target.value })}
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
            Professional Title
          </label>
          <input
            type="text"
            value={profile.title}
            onChange={e => onProfileChange({ ...profile, title: e.target.value })}
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
          Instructor Bio
        </label>
        <textarea
          rows={3}
          value={profile.bio}
          onChange={e => onProfileChange({ ...profile, bio: e.target.value })}
          className="w-full rounded-xl py-2 px-3 text-xs border outline-none"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        />
      </div>
    </div>
  );
}
