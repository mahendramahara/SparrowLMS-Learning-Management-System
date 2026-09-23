import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  ClipboardList,
  GraduationCap,
  MessageSquare,
  Bell,
  Calendar,
  Settings,
  LogOut,
  Mountain,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', to: '/student', icon: LayoutDashboard },
  { id: 'courses', label: 'My Courses', to: '/student/courses', icon: BookOpen },
  { id: 'browse', label: 'Browse Courses', to: '/student/browse', icon: Compass },
  { id: 'assignments', label: 'Assignments', to: '/student/assignments', icon: ClipboardList },
  { id: 'grades', label: 'Grades', to: '/student/grades', icon: GraduationCap },
  { id: 'purchases', label: 'Purchases', to: '/student/purchases', icon: ShoppingBag },
  { id: 'messages', label: 'Messages', to: '/student/messages', icon: MessageSquare },
  { id: 'notifications', label: 'Notifications', to: '/student/notifications', icon: Bell },
  { id: 'calendar', label: 'Calendar', to: '/student/calendar', icon: Calendar },
  { id: 'settings', label: 'Settings', to: '/student/settings', icon: Settings },
];

export default function StudentSidebar({ isMobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      navigate('/login', { replace: true });
    }
  };

  const workspacePath =
    user?.role === 'admin' ? '/admin' : user?.role === 'instructor' ? '/instructor' : '/student';

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
            <Link to={workspacePath} className="flex items-center gap-2.5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg"
                style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
              >
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-lg font-bold tracking-tight text-white">SparrowLMS</span>
                <p className="text-[10px] text-slate-400">Learn · Grow · Succeed</p>
              </div>
            </Link>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map(({ id, label, to, icon: Icon, badge }) => (
              <NavLink
                key={id}
                to={to}
                end={to === '/student'}
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

        <div className="p-4 pt-2 border-t border-white/10">
          <div className="rounded-2xl p-3.5 text-center bg-slate-800/40 border border-white/5 mb-3">
            <div className="flex justify-center mb-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <Mountain className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs font-semibold text-white">Better Learning</p>
            <p className="text-[11px] text-slate-400">Brighter Future</p>
          </div>

          <div className="flex items-center justify-between px-1 text-[10px] text-slate-500">
            <span>© 2025 SparrowLMS</span>
            <button
              type="button"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition disabled:opacity-50"
            >
              <LogOut className="h-3 w-3" />
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
