import api from '../utils/api';

export const getNotifications = async (params = {}) => {
  const response = await api.get('/notifications', { params });
  return response.data;
};

export const markNotificationAsRead = async id => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data;
};

export const deleteNotification = async id => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

export const clearAllNotifications = async () => {
  const response = await api.delete('/notifications/clear-all');
  return response.data;
};

export const broadcastNotification = async payload => {
  const response = await api.post('/notifications', payload);
  return response.data;
};
