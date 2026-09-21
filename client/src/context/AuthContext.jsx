import { useEffect, useState } from 'react';
import { AuthContext } from './authContextDef';
import * as authService from '../services/auth.api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const response = await authService.getProfile();
        if (response?.data) {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (err) {
        void err;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleAuthSuccess = data => {
    const authToken = data.token;
    const authUser = data.user || data.data;
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(authUser));
    return authUser;
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      return handleAuthSuccess(response);
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async role => {
    setLoading(true);
    try {
      const response = await authService.demoLogin(role);
      return handleAuthSuccess(response);
    } finally {
      setLoading(false);
    }
  };

  const register = async userData => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      return handleAuthSuccess(response);
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async email => {
    return await authService.sendVerificationOTP(email);
  };

  const verifyOTP = async (email, otp, type) => {
    return await authService.verifyOTP(email, otp, type);
  };

  const forgotPassword = async email => {
    return await authService.forgotPassword(email);
  };

  const resetPassword = async (email, otp, newPassword) => {
    return await authService.resetPassword(email, otp, newPassword);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      void err;
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    demoLogin,
    register,
    sendOTP,
    verifyOTP,
    forgotPassword,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
