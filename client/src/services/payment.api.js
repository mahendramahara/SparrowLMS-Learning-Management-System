import api from '../utils/api';

export const initiatePayment = async courseId => {
  const response = await api.post('/payments/create', { courseId });
  return response.data;
};

export const verifyPayment = async verificationData => {
  const response = await api.post('/payments/verify', verificationData);
  return response.data;
};

export const getMyPaymentHistory = async () => {
  const response = await api.get('/payments/my-history');
  return response.data;
};

export const getInstructorEarnings = async () => {
  const response = await api.get('/payments/instructor-earnings');
  return response.data;
};
