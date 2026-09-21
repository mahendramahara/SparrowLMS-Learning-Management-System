import api from '../utils/api';

export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard/stats');
  return response.data;
};

export const getAllUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const deleteUser = async userId => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const getAllCourses = async (params = {}) => {
  const response = await api.get('/admin/courses', { params });
  return response.data;
};

export const approveCourse = async courseId => {
  const response = await api.put(`/admin/courses/${courseId}/approve`);
  return response.data;
};

export const rejectCourse = async (courseId, reason) => {
  const response = await api.put(`/admin/courses/${courseId}/reject`, { reason });
  return response.data;
};

export const getSystemSettings = async () => {
  const response = await api.get('/admin/settings');
  return response.data;
};

export const updateSystemSettings = async settings => {
  const response = await api.put('/admin/settings', settings);
  return response.data;
};

export const getAnalytics = async (params = {}) => {
  const response = await api.get('/admin/analytics', { params });
  return response.data;
};

export const getRevenueReport = async (params = {}) => {
  const response = await api.get('/admin/analytics/revenue', { params });
  return response.data;
};

export const getUserActivity = async (params = {}) => {
  const response = await api.get('/admin/analytics/user-activity', { params });
  return response.data;
};
