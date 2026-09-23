import { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  Shield,
  BookOpen,
  FolderTree,
  FileQuestion,
  CreditCard,
  ClipboardList,
  MessageSquare,
  Bell,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminSidebar({ isMobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [usersOpen, setUsersOpen] = useState(location.pathname.startsWith('/admin/users'));
  const [coursesOpen, setCoursesOpen] = useState(location.pathname.startsWith('/admin/courses'));

  const adminName = user?.name || 'Mahendra Singh Mahara';

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
        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-5">
          <div className="px-2 mb-6">
            <Link to="/admin" className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg"
                style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
              >
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-base font-extrabold tracking-tight text-white">SparrowLMS</span>
                <p className="text-[11px] text-slate-400 font-medium">LMS Admin Panel</p>
              </div>
            </Link>
          </div>

          <nav className="space-y-1">
            <NavLink
              to="/admin"
              end
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span>Dashboard</span>
              </div>
            </NavLink>

            <div>
              <button
                type="button"
                onClick={() => setUsersOpen(prev => !prev)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  location.pathname.startsWith('/admin/users')
                    ? 'text-white'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 shrink-0" />
                  <span>Users</span>
                </div>
                {usersOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>

              {usersOpen && (
                <div className="pl-9 pr-1 py-1 space-y-1">
                  <NavLink
                    to="/admin/users/students"
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                        isActive ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`
                    }
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Students</span>
                  </NavLink>

                  <NavLink
                    to="/admin/users/instructors"
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                        isActive ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`
                    }
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>Instructors</span>
                  </NavLink>

                  <NavLink
                    to="/admin/users/admins"
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                        isActive ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`
                    }
                  >
                    <Shield className="h-3.5 w-3.5" />
                    <span>Admins</span>
                  </NavLink>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setCoursesOpen(prev => !prev)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  location.pathname.startsWith('/admin/courses')
                    ? 'text-white'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span>Courses</span>
                </div>
                {coursesOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>

              {coursesOpen && (
                <div className="pl-9 pr-1 py-1 space-y-1">
                  <NavLink
                    to="/admin/courses"
                    end
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                        isActive ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`
                    }
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>All Courses</span>
                  </NavLink>

                  <NavLink
                    to="/admin/courses/categories"
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                        isActive ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`
                    }
                  >
                    <FolderTree className="h-3.5 w-3.5" />
                    <span>Categories</span>
                  </NavLink>

                  <NavLink
                    to="/admin/courses/requests"
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                        isActive ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`
                    }
                  >
                    <FileQuestion className="h-3.5 w-3.5" />
                    <span>Course Requests</span>
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink
              to="/admin/enrollments"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 shrink-0" />
                <span>Enrollments</span>
              </div>
            </NavLink>

            <NavLink
              to="/admin/assignments"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="h-4 w-4 shrink-0" />
                <span>Assignments</span>
              </div>
            </NavLink>

            <NavLink
              to="/admin/notifications"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 shrink-0" />
                <span>Notifications</span>
              </div>
            </NavLink>

            <NavLink
              to="/admin/messages"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span>Messages</span>
              </div>
            </NavLink>

            <NavLink
              to="/admin/reports"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 shrink-0" />
                <span>Reports</span>
              </div>
            </NavLink>

            <NavLink
              to="/admin/settings"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 shrink-0" />
                <span>Settings</span>
              </div>
            </NavLink>
          </nav>
        </div>

        <div className="p-4 pt-2 border-t border-white/10 space-y-3">
          <div className="rounded-2xl p-3.5 text-center bg-slate-800/40 border border-white/5">
            <div className="flex justify-center mb-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs font-bold text-white">Better Learning</p>
            <p className="text-[11px] text-slate-400">Through Technology</p>
            <p className="text-[10px] text-slate-500 mt-1">Manage · Support · Grow</p>
          </div>

          <div className="flex items-center justify-between rounded-xl p-2 bg-slate-800/30 border border-white/5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
              >
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-semibold text-white truncate">{adminName}</p>
                <p className="text-[10px] text-slate-400">Administrator</p>
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
