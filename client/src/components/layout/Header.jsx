import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogIn, Menu, X, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import Logo from '../ui/Logo';
import { useAuth } from '../../hooks/useAuth';

const NAVIGATION = [
  { label: 'Home', to: '/' },
  { label: 'Courses', to: '/courses' },
  { label: 'Instructors', to: '/instructors' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const getWorkspacePath = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'instructor') return '/instructor';
    return '/student';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = user?.name || 'Mahendra Singh Mahara';
  const displayRole = user?.role || 'student';

  return (
    <header className="header-root">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          to={isAuthenticated ? getWorkspacePath() : '/'}
          aria-label="SparrowLMS home"
          className="shrink-0"
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {NAVIGATION.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'font-semibold' : 'hover:opacity-80'
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-primary-600)' : 'var(--text-secondary)',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={getWorkspacePath()}
                className="hidden sm:flex items-center gap-2 rounded-xl border px-3 py-1.5 transition hover:opacity-80"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-card)',
                }}
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: 'var(--color-primary-600)' }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left leading-none">
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {displayName}
                  </p>
                  <p
                    className="text-[10px] capitalize mt-0.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {displayRole}
                  </p>
                </div>
              </Link>

              <Link
                to={getWorkspacePath()}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary-600)' }}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Workspace</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className="hidden sm:flex items-center justify-center h-9 w-9 rounded-xl border transition hover:opacity-75"
                style={{
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-card)',
                }}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium sm:flex transition-colors hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary-600)' }}
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Get Started</span>
              </Link>
            </>
          )}

          <button
            type="button"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(open => !open)}
            className="rounded-xl p-2 transition-colors md:hidden hover:opacity-80"
            style={{ color: 'var(--text-secondary)' }}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          className="border-t px-4 py-4 md:hidden"
          style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}
          aria-label="Mobile navigation"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4">
            {NAVIGATION.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium py-1.5 transition-colors"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                })}
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <div
                className="pt-2 border-t flex flex-col gap-2"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <Link
                  to={getWorkspacePath()}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm font-semibold"
                  style={{ color: 'var(--color-primary-600)' }}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Go to Workspace ({displayName})</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 py-1.5 text-sm"
                  style={{ color: '#ef4444' }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium py-1.5 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                Login
              </NavLink>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
