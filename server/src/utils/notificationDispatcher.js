const Notification = require('../modules/notification/notification.model');

const createNotification = async ({
  recipient = null,
  recipientRole = null,
  category = 'System',
  type,
  title,
  message,
  priority = 'normal',
  actionUrl = '',
  metadata = {},
}) => {
  try {
    return await Notification.create({
      recipient,
      recipientRole,
      category,
      type,
      title,
      message,
      priority,
      actionUrl,
      metadata,
    });
  } catch (err) {
    void err;
    return null;
  }
};

module.exports = { createNotification };
