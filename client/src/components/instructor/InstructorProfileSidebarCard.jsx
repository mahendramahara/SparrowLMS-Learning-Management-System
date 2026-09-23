import { useNavigate } from 'react-router-dom';
import { UserCheck, Edit3 } from 'lucide-react';

export default function InstructorProfileSidebarCard({ instructor }) {
  const navigate = useNavigate();
  const { name = 'Mahendra Singh Mahara', role = 'Instructor', bio = '' } = instructor || {};

  return (
    <div
      className="rounded-2xl p-6 border text-center space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex flex-col items-center">
        <div
          className="relative flex h-20 w-20 items-center justify-center rounded-full text-2xl font-black text-white shadow-md mb-3"
          style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
        >
          {name.charAt(0)}
          <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
            <UserCheck className="h-3 w-3" />
          </span>
        </div>

        <h3 className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
          {name}
        </h3>
        <p className="text-xs font-semibold text-slate-400 capitalize">{role}</p>

        <button
          type="button"
          onClick={() => navigate('/instructor/settings')}
          className="mt-3 flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold border transition hover:opacity-80"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
          }}
        >
          <Edit3 className="h-3.5 w-3.5 text-blue-500" />
          <span>Edit Profile</span>
        </button>
      </div>

      <p className="text-xs leading-relaxed text-left border-t pt-3" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
        {bio}
      </p>
    </div>
  );
}
