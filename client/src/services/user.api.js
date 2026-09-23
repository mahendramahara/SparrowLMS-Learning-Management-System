import api from '../utils/api';

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfile = async profileData => {
  const response = await api.put('/auth/profile', profileData);
  return response.data;
};

export const updatePreferences = async preferencesData => {
  const response = await api.put('/auth/preferences', preferencesData);
  return response.data;
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  const response = await api.put('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const getUsers = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

export const getUserById = async id => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const saveInitialInterests = async data => {
  const response = await api.post('/users/interests/initial', data);
  return response.data;
};

export const getMyInterests = async () => {
  const response = await api.get('/users/interests');
  return response.data;
};

export const trackInteraction = async interactionData => {
  const response = await api.post('/users/interactions', interactionData);
  return response.data;
};
