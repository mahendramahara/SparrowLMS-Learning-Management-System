import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import NotificationHeader from '../../components/notifications/NotificationHeader';
import NotificationFilterTabs from '../../components/notifications/NotificationFilterTabs';
import NotificationItemCard from '../../components/notifications/NotificationItemCard';
import notifData from '../../demo/studentNotifications.json';

export default function StudentNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(notifData.notifications);
  const [activeFilter, setActiveFilter] = useState('all');

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

  const handleToggleRead = id => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearRead = () => {
    setNotifications(prev => prev.filter(n => !n.read));
  };

  const handleDismiss = id => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNavigate = url => {
    if (url) navigate(url);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
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

      {filteredNotifications.length > 0 ? (
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
            You are all caught up! There are no notifications matching your current filter.
          </p>
        </div>
      )}
    </div>
  );
}
