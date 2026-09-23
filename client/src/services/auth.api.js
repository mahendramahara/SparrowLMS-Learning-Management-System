import api from '../utils/api';

export const sendVerificationOTP = async email => {
  const response = await api.post('/auth/send-otp', { email });
  return response.data;
};

export const resendVerificationOTP = async (email, type = 'email_verification') => {
  const response = await api.post('/auth/resend-otp', { email, type });
  return response.data;
};

export const verifyOTP = async (email, otp, type) => {
  const response = await api.post('/auth/verify-otp', { email, otp, type });
  return response.data;
};

export const register = async userData => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async credentials => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const googleLogin = async (credential, role = 'student') => {
  const response = await api.post('/auth/google', { credential, role });
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post('/auth/refresh-token');
  return response.data;
};

export const demoLogin = async role => {
  const response = await api.post('/auth/demo-login', { role });
  return response.data;
};

export const forgotPassword = async email => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const response = await api.post('/auth/reset-password', { email, otp, newPassword });
  return response.data;
};

export const logout = async (allDevices = false) => {
  const response = await api.post('/auth/logout', { allDevices });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfile = async profileData => {
  const response = await api.put('/auth/profile', profileData);
  return response.data;
};

export const updatePreferences = async preferences => {
  const response = await api.put('/auth/preferences', preferences);
  return response.data;
};
