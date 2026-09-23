const express = require('express');
const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearNotifications,
} = require('./notification.controller');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getMyNotifications);
router.put('/read-all', markAllNotificationsAsRead);
router.put('/:id/read', markNotificationAsRead);
router.delete('/clear-all', clearNotifications);
router.delete('/', clearNotifications);
router.delete('/:id', deleteNotification);

module.exports = router;
