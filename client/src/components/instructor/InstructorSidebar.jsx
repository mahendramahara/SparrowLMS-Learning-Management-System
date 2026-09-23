import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  ClipboardList,
  HelpCircle,
  MessageSquare,
  Star,
  Wallet,
  Settings,
  GraduationCap,
  LogOut,
  Sparkles,
  Bell,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', to: '/instructor', icon: LayoutDashboard },
  { id: 'courses', label: 'My Courses', to: '/instructor/courses', icon: BookOpen },
  { id: 'createCourse', label: 'Create Course', to: '/instructor/courses/create', icon: PlusCircle },
  { id: 'students', label: 'Students', to: '/instructor/students', icon: Users },
  { id: 'assignments', label: 'Assignments', to: '/instructor/assignments', icon: ClipboardList },
  { id: 'quizzes', label: 'Quizzes', to: '/instructor/quizzes', icon: HelpCircle },
  { id: 'messages', label: 'Messages', to: '/instructor/messages', icon: MessageSquare },
  { id: 'reviews', label: 'Reviews', to: '/instructor/reviews', icon: Star },
  { id: 'earnings', label: 'Earnings', to: '/instructor/earnings', icon: Wallet },
  { id: 'calendar', label: 'Calendar', to: '/instructor/calendar', icon: Calendar },
  { id: 'notifications', label: 'Notifications', to: '/instructor/notifications', icon: Bell },
  { id: 'settings', label: 'Settings', to: '/instructor/settings', icon: Settings },
];

export default function InstructorSidebar({ isMobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const instructorName = user?.name || 'Mahendra Singh Mahara';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      navigate('/login', { replace: true });
    }
  };

  return (
    <>
      {isMobileOpen && (
        <div onClick={onCloseMobile} className="fixed inset-0 z-40 bg-black/50 lg:hidden" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col justify-between transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: '#0c1527',
          color: '#e2e8f0',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6">
          <div className="px-2 mb-6">
            <Link to="/instructor" className="flex items-center gap-2.5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg"
                style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
              >
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-lg font-bold tracking-tight text-white">SparrowLMS</span>
                <p className="text-[10px] text-slate-400">Teach · Inspire · Grow</p>
              </div>
            </Link>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map(({ id, label, to, icon: Icon, badge }) => (
              <NavLink
                key={id}
                to={to}
                end={to === '/instructor'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500/30 px-1.5 text-[11px] font-bold text-blue-300 group-hover:bg-blue-500 group-hover:text-white">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 pt-2 border-t border-white/10 space-y-3">
          <div className="rounded-2xl p-3.5 text-center bg-slate-800/40 border border-white/5">
            <div className="flex justify-center mb-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs font-semibold text-white">Great teachers</p>
            <p className="text-[11px] text-slate-400">build a better future</p>
            <p className="text-[10px] text-slate-500 mt-1">Keep creating, keep inspiring!</p>
          </div>

          <div className="flex items-center justify-between rounded-xl p-2 bg-slate-800/30 border border-white/5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
              >
                {instructorName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-semibold text-white truncate">{instructorName}</p>
                <p className="text-[10px] text-slate-400">Instructor</p>
              </div>
            </div>

            <button
              type="button"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 transition rounded-lg hover:bg-slate-700/50 disabled:opacity-50"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
