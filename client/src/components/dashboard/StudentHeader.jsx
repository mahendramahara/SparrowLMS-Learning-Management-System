import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '../../services/notification.api';

export default function StudentHeader({ onToggleMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const studentName = user?.name || 'Mahendra Singh Mahara';
  const studentRole = user?.role || 'Student';

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

  return (
    <header
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 sm:px-6 lg:px-8 transition-colors"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onToggleMobile}
          className="rounded-xl p-2 lg:hidden transition hover:opacity-80"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search for courses, lessons, or anything..."
            className="w-full rounded-xl py-2 pl-10 pr-4 text-xs sm:text-sm border outline-none transition"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 ml-4">
        <button
          type="button"
          onClick={() => navigate('/student/notifications')}
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border transition hover:opacity-80"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
          }}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
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
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
              style={{ backgroundColor: 'var(--color-primary-600)' }}
            >
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                {studentName}
              </p>
              <p
                className="text-[11px] capitalize text-slate-400"
                style={{ color: 'var(--text-muted)' }}
              >
                {studentRole}
              </p>
            </div>
            <ChevronDown
              className="hidden sm:block h-3.5 w-3.5"
              style={{ color: 'var(--text-muted)' }}
            />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl border p-1.5 shadow-xl transition-all"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div
                className="px-3 py-2 border-b sm:hidden"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {studentName}
                </p>
                <p className="text-[10px] text-slate-400">{studentRole}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/student/profile');
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition hover:opacity-75"
                style={{ color: 'var(--text-primary)' }}
              >
                <User className="h-3.5 w-3.5" />
                <span>View Profile</span>
              </button>
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                style={{ color: '#ef4444' }}
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
