import { useNavigate } from 'react-router-dom';
import { Users, Video, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const STATS = [
  {
    icon: Users,
    label: 'Active Students',
    value: '1,240',
    color: 'var(--color-primary-600)',
    bg: 'var(--color-primary-50)',
  },
  {
    icon: Video,
    label: 'Published Courses',
    value: '6 Courses',
    color: '#059669',
    bg: 'rgba(16,185,129,0.1)',
  },
  {
    icon: DollarSign,
    label: 'Total Revenue',
    value: '$8,450',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.1)',
  },
];

export default function InstructorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div
      className="min-h-[80vh] py-10 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--bg-subtle)' }}
    >
      <div className="mx-auto max-w-5xl">
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <div>
            <div
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold mb-2"
              style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#059669' }}
            >
              Instructor Studio
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Instructor Portal · {user?.name || 'Suman Sharma'}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {user?.email} · Manage course curriculums, student enrollments, and reviews
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition hover:opacity-80"
            style={{
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {STATS.map(({ icon: Icon, label, value, color, bg }) => (
            <div
              key={label}
              className="rounded-2xl p-5"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: bg, color }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </p>
                  <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
