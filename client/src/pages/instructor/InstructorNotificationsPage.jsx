import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Loader2 } from 'lucide-react';
import NotificationHeader from '../../components/notifications/NotificationHeader';
import NotificationFilterTabs from '../../components/notifications/NotificationFilterTabs';
import NotificationItemCard from '../../components/notifications/NotificationItemCard';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
} from '../../services/notification.api';

export default function InstructorNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        const res = await getNotifications();
        const raw = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.notifications)
          ? res.data.notifications
          : [];

        if (isMounted) {
          const mapped = raw.map(n => ({
            id: n._id || n.id,
            type: n.type || 'course',
            title: n.title,
            message: n.message,
            time: n.createdAt
              ? new Date(n.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recently',
            read: n.isRead,
            actionUrl: n.actionUrl,
            category: n.category,
          }));
          setNotifications(mapped);
        }
      } catch (e) {
        void e;
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadNotifications();
    return () => {
      isMounted = false;
    };
  }, []);

  const counts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      assignment: notifications.filter(n => n.type === 'assignment').length,
      course: notifications.filter(n => n.type === 'course').length,
      grade: notifications.filter(n => n.type === 'grade').length,
    };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (activeFilter === 'unread') return !n.read;
      if (activeFilter === 'assignment') return n.type === 'assignment';
      if (activeFilter === 'course') return n.type === 'course';
      if (activeFilter === 'grade') return n.type === 'grade';
      return true;
    });
  }, [notifications, activeFilter]);

  const handleToggleRead = async id => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: !n.read } : n)));
    try {
      await markNotificationAsRead(id);
    } catch (e) {
      void e;
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await markAllNotificationsAsRead();
    } catch (e) {
      void e;
    }
  };

  const handleClearRead = async () => {
    setNotifications(prev => prev.filter(n => !n.read));
    try {
      await clearAllNotifications();
    } catch (e) {
      void e;
    }
  };

  const handleDismiss = async id => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await deleteNotification(id);
    } catch (e) {
      void e;
    }
  };

  const handleNavigate = url => {
    if (url) navigate(url);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-1">
        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Instructor Notifications
        </h1>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Real-time activity on student enrollments, assignment submissions, reviews, and disbursements.
        </p>
      </div>

      <NotificationHeader
        unreadCount={counts.unread}
        onMarkAllRead={handleMarkAllRead}
        onClearRead={handleClearRead}
      />

      <NotificationFilterTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      {isLoading ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl p-12 text-center border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          <Loader2 className="h-6 w-6 animate-spin mb-2 text-blue-500" />
          <p className="text-xs font-semibold">Loading notifications...</p>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map(notification => (
            <NotificationItemCard
              key={notification.id}
              notification={notification}
              onToggleRead={handleToggleRead}
              onDismiss={handleDismiss}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-2xl p-12 text-center border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl mb-3"
            style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
          >
            <Bell className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            No notifications found
          </h3>
          <p className="text-xs max-w-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            You are all caught up! There are no instructor notifications matching your filter.
          </p>
        </div>
      )}
    </div>
  );
}
