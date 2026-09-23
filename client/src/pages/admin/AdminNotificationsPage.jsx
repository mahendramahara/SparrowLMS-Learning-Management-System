import { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import AdminNotificationsHeader from '../../components/admin/notifications/AdminNotificationsHeader';
import AdminNotificationsList from '../../components/admin/notifications/AdminNotificationsList';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
} from '../../services/notification.api';

export default function AdminNotificationsPage() {
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
            title: n.title,
            message: n.message,
            description: n.message,
            category: n.category || 'System',
            timestamp: n.createdAt,
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
            severity: n.priority === 'urgent' ? 'high' : n.priority || 'info',
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

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'unread') {
      return notifications.filter(n => !n.read);
    }
    if (activeFilter !== 'all') {
      return notifications.filter(n => n.category.toLowerCase() === activeFilter.toLowerCase());
    }
    return notifications;
  }, [notifications, activeFilter]);

  const handleToggleRead = async id => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: !n.read } : n))
    );
    try {
      await markNotificationAsRead(id);
    } catch (e) {
      void e;
    }
  };

  const handleDelete = async id => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await deleteNotification(id);
      toast.success('Notification removed.');
    } catch (e) {
      toast.success('Notification removed.' + e.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await markAllNotificationsAsRead();
      toast.success('All notifications marked as read.');
    } catch (e) {
      toast.success('All notifications marked as read.'+e.message);
    }
  };

  const handleClearAll = async () => {
    setNotifications([]);
    try {
      await clearAllNotifications();
      toast.success('Notification audit log cleared.');
    } catch (e) {
      toast.success('Notification audit log cleared.' + e.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <AdminNotificationsHeader
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
      />

      {isLoading ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl p-12 text-center border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          <Loader2 className="h-6 w-6 animate-spin mb-2 text-blue-500" />
          <p className="text-xs font-semibold">Loading notifications...</p>
        </div>
      ) : (
        <AdminNotificationsList
          notifications={filteredNotifications}
          onToggleRead={handleToggleRead}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
