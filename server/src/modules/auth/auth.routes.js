const express = require('express');
const {
  sendVerificationOTP,
  resendVerificationOTP,
  verifyOTP,
  register,
  login,
  googleLogin,
  refreshToken,
  demoLogin,
  forgotPassword,
  resetPassword,
  logout,
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
} = require('./auth.controller');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/send-otp', sendVerificationOTP);
router.post('/resend-otp', resendVerificationOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/refresh-token', refreshToken);
router.post('/demo-login', demoLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/preferences', protect, updatePreferences);
router.put('/change-password', protect, changePassword);

module.exports = router;

