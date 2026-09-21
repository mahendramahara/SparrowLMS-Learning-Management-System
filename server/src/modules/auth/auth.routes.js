const express = require('express');
const {
  sendVerificationOTP,
  verifyOTP,
  register,
  login,
  demoLogin,
  forgotPassword,
  resetPassword,
  logout,
  getProfile,
  updateProfile,
  updatePreferences,
} = require('./auth.controller');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/send-otp', sendVerificationOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', demoLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/preferences', protect, updatePreferences);

module.exports = router;
