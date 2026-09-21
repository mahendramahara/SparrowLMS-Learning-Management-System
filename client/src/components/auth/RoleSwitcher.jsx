import { GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';

const ROLES = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'instructor', label: 'Instructor', icon: BookOpen },
  { id: 'admin', label: 'Admin', icon: ShieldCheck },
];

export default function RoleSwitcher({ activeRole = 'student', onChange }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          Select portal
        </span>
        <span
          className="text-xs font-semibold capitalize"
          style={{ color: 'var(--color-primary-600)' }}
        >
          {activeRole} Mode
        </span>
      </div>

      <div className="role-switcher-track grid grid-cols-3 gap-1">
        {ROLES.map(({ id, label, icon: Icon }) => {
          const isActive = activeRole === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange?.(id)}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition ${isActive ? 'role-btn-active' : 'role-btn-inactive'}`}
            >
              <Icon
                className="h-3.5 w-3.5"
                style={isActive ? { color: '#ffffff' } : { color: 'var(--text-muted)' }}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
