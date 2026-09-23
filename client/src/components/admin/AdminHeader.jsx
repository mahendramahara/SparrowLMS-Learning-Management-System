import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { getNotifications } from '../../services/notification.api';

export default function AdminHeader({ onToggleMobile }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  const adminName = user?.name || 'Mahendra Singh Mahara';

  useEffect(() => {
    let isMounted = true;
    const fetchUnread = async () => {
      try {
        const res = await getNotifications({ unreadOnly: 'true' });
        if (isMounted) {
          setUnreadCount(typeof res?.unreadCount === 'number' ? res.unreadCount : 0);
        }
      } catch (err) {
        void err;
      }
    };
    fetchUnread();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/courses?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
    <header
      className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={onToggleMobile}
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border lg:hidden transition hover:opacity-80"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          <Menu className="h-5 w-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search users, courses, or anything..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border pl-10 pr-4 py-2 text-xs outline-none transition focus:ring-2 focus:ring-primary-500"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </form>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme mode"
          className="flex h-9 w-9 items-center justify-center rounded-xl border transition hover:opacity-80"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={() => navigate('/admin/notifications')}
          aria-label="Admin Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border transition hover:opacity-80"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center gap-2.5 rounded-xl p-1.5 transition hover:opacity-90"
          >
            <div
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs sm:text-sm font-bold text-white shadow-sm"
              style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
            >
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left leading-tight">
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                {adminName}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">Administrator</p>
            </div>
            <ChevronDown className="hidden md:block h-3.5 w-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-2xl border p-1.5 shadow-xl transition-all z-50 animate-in fade-in duration-100"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="px-3 py-2 border-b md:hidden" style={{ borderColor: 'var(--border-subtle)' }}>
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  {adminName}
                </p>
                <p className="text-[10px] text-slate-400">Administrator</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/admin/settings');
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition hover:opacity-80"
                style={{ color: 'var(--text-primary)' }}
              >
                <Settings className="h-3.5 w-3.5" />
                <span>System Settings</span>
              </button>

              <button
                type="button"
                disabled={isLoggingOut}
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-500/10 disabled:opacity-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
