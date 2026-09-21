import api from '../utils/api';

export const createPaymentIntent = async courseId => {
  const response = await api.post('/payments/create', { courseId });
  return response.data;
};

export const verifyPayment = async paymentData => {
  const response = await api.post('/payments/verify', paymentData);
  return response.data;
};

export const getPaymentHistory = async (params = {}) => {
  const response = await api.get('/payments/history', { params });
  return response.data;
};

export const getPaymentById = async paymentId => {
  const response = await api.get(`/payments/${paymentId}`);
  return response.data;
};

export const refundPayment = async (paymentId, reason) => {
  const response = await api.post(`/payments/${paymentId}/refund`, { reason });
  return response.data;
};

export const downloadInvoice = async paymentId => {
  const response = await api.get(`/payments/${paymentId}/invoice`, {
    responseType: 'blob',
  });
  return response.data;
};
