import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh-token');

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken: storedRefreshToken },
          { withCredentials: true }
        );
        if (res.data?.token) {
          const newToken = res.data.token;
          localStorage.setItem('token', newToken);
          if (res.data.refreshToken) {
            localStorage.setItem('refreshToken', res.data.refreshToken);
          }
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        if (
          !window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register') &&
          !window.location.pathname.startsWith('/forgot-password')
        ) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

