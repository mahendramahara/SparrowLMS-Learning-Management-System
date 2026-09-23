const asyncHandler = require('express-async-handler');
const Notification = require('./notification.model');

const getMyNotifications = asyncHandler(async (req, res) => {
  const { category, unreadOnly } = req.query;

  const query = {
    $or: [
      { recipient: req.user._id || req.user.id },
      { recipientRole: req.user.role },
      { recipientRole: 'all' },
    ],
  };

  if (category && category !== 'all') {
    query.category = new RegExp(`^${category}$`, 'i');
  }

  if (unreadOnly === 'true') {
    query.isRead = false;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    ...query,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    count: notifications.length,
    unreadCount,
    data: notifications,
  });
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification,
  });
});

const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const query = {
    $or: [
      { recipient: req.user._id || req.user.id },
      { recipientRole: req.user.role },
      { recipientRole: 'all' },
    ],
    isRead: false,
  };

  await Notification.updateMany(query, {
    $set: { isRead: true, readAt: new Date() },
  });

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
});

const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Notification removed',
  });
});

const clearNotifications = asyncHandler(async (req, res) => {
  const query = {
    $or: [
      { recipient: req.user._id || req.user.id },
      { recipientRole: req.user.role },
    ],
  };

  await Notification.deleteMany(query);

  res.status(200).json({
    success: true,
    message: 'Notification log cleared',
  });
});

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearNotifications,
};
