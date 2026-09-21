import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StudentProfileCard({
  name = 'Mahendra Singh Mahara',
  role = 'Student',
  program = 'BCA | Triton International College',
  onViewProfile,
}) {
  const navigate = useNavigate();

  const handleView = () => {
    if (onViewProfile) onViewProfile();
    else navigate('/student/profile');
  };

  return (
    <div
      className="flex flex-col items-center rounded-2xl p-6 text-center border transition-all"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="relative mb-3">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-extrabold text-white shadow-lg ring-4 ring-blue-500/20"
          style={{ backgroundColor: 'var(--color-primary-600)' }}
        >
          {name.charAt(0)}
        </div>
      </div>

      <h3 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
        {name}
      </h3>
      <p className="text-xs font-medium capitalize mt-0.5" style={{ color: 'var(--text-muted)' }}>
        {role}
      </p>
      <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
        {program}
      </p>

      <button
        type="button"
        onClick={handleView}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2 px-4 text-xs font-semibold border transition hover:opacity-85 active:scale-95"
        style={{
          borderColor: 'var(--border-subtle)',
          backgroundColor: 'var(--bg-subtle)',
          color: 'var(--color-primary-600)',
        }}
      >
        <User className="h-3.5 w-3.5" />
        <span>View Profile</span>
      </button>
    </div>
  );
}
