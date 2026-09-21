const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../user/user.model');
const OTP = require('./auth.model');
const Session = require('./session.model');
const { sendTokenResponse } = require('../../utils/tokenUtils');
const sendEmail = require('../../utils/emailUtils');
const demoUsers = require('../../demo/users.json');

const recordUserSession = async (user, token, req) => {
  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await Session.create({
      userId: user._id || user.id,
      userEmail: user.email,
      role: user.role,
      isDemo: Boolean(user.isDemo),
      tokenHash,
      ipAddress: req.ip || req.connection?.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Web Client',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  } catch (err) {
    // Session model has TTL index; silent catch if DB is in test/offline mode
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, type) => {
  const isVerification = type === 'email_verification';
  const subject = isVerification
    ? 'Verify Your Email Address - SparrowLMS'
    : 'Reset Your Account Password - SparrowLMS';

  const heading = isVerification ? 'Verify Your Account' : 'Password Reset Request';
  const description = isVerification
    ? 'Thank you for choosing SparrowLMS. Please use the following one-time verification code to activate your account:'
    : 'We received a request to reset your password. Use the verification code below to proceed with setting a new password:';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .container { max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        .header { background: #0f172a; padding: 24px; text-align: center; }
        .logo { font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; }
        .content { padding: 32px 24px; }
        .title { font-size: 18px; font-weight: 600; margin-bottom: 12px; color: #0f172a; }
        .text { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
        .otp-box { background: #f1f5f9; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 18px; text-align: center; margin-bottom: 24px; }
        .otp-code { font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #0f172a; font-family: monospace; }
        .notice { font-size: 12px; color: #64748b; line-height: 1.5; }
        .footer { border-top: 1px solid #e2e8f0; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; background: #f8fafc; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SparrowLMS</div>
        </div>
        <div class="content">
          <div class="title">${heading}</div>
          <div class="text">${description}</div>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <div class="notice">
            This verification code will expire in 10 minutes. If you did not make this request, please disregard this email.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SparrowLMS Learning Management System. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    email,
    subject,
    html,
    otp,
  });
};

const sendVerificationOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide a valid email address');
  }

  const normalizedEmail = email.toLowerCase().trim();

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error('An account with this email address already exists');
  }

  await OTP.deleteMany({ email: normalizedEmail, type: 'email_verification' });

  const otp = generateOTP();

  await OTP.create({
    email: normalizedEmail,
    otp,
    type: 'email_verification',
  });

  const mailResult = await sendOTPEmail(normalizedEmail, otp, 'email_verification');

  res.status(200).json({
    success: true,
    message: 'Verification code sent to your email',
    ...(process.env.NODE_ENV !== 'production' && mailResult?.previewOtp
      ? { previewOtp: mailResult.previewOtp }
      : {}),
  });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp, type } = req.body;

  if (!email || !otp || !type) {
    res.status(400);
    throw new Error('Please provide email, verification code, and verification type');
  }

  const normalizedEmail = email.toLowerCase().trim();

  const otpRecord = await OTP.findOne({
    email: normalizedEmail,
    otp: otp.trim(),
    type,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    res.status(400);
    throw new Error('Invalid or expired verification code');
  }

  otpRecord.isUsed = true;
  await otpRecord.save();

  res.status(200).json({
    success: true,
    message: 'Verification code confirmed successfully',
  });
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, otp } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const normalizedEmail = email.toLowerCase().trim();

  // If not running automated test without OTP, enforce OTP verification
  if (process.env.NODE_ENV !== 'test') {
    if (!otp) {
      res.status(400);
      throw new Error('Please provide email verification code');
    }

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      otp: otp.trim(),
      type: 'email_verification',
    }).sort({ createdAt: -1 });

    if (!otpRecord || !otpRecord.isUsed) {
      res.status(400);
      throw new Error('Please verify your email code before completing registration');
    }
  }

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error('An account with this email address already exists');
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    isVerified: true,
  });

  sendTokenResponse(user, 201, res);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (user.isLocked()) {
    res.status(423);
    throw new Error(
      'Account temporarily locked due to excessive failed attempts. Please try again later.'
    );
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    await user.incLoginAttempts();
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error('Please verify your email address to log in');
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLogin = new Date();
  await user.save();

  sendTokenResponse(user, 200, res);
});

const demoLogin = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role || !['student', 'instructor', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Invalid demo role specified');
  }

  const demoUser = demoUsers.find(u => u.role === role);

  if (!demoUser) {
    res.status(404);
    throw new Error('Demo account profile not found');
  }

  sendTokenResponse(demoUser, 200, res, true);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide registered email address');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    res.status(404);
    throw new Error('No registered account found with that email address');
  }

  await OTP.deleteMany({ email: normalizedEmail, type: 'password_reset' });

  const otp = generateOTP();

  await OTP.create({
    email: normalizedEmail,
    otp,
    type: 'password_reset',
  });

  const mailResult = await sendOTPEmail(normalizedEmail, otp, 'password_reset');

  res.status(200).json({
    success: true,
    message: 'Password reset code dispatched to your email',
    ...(process.env.NODE_ENV !== 'production' && mailResult?.previewOtp
      ? { previewOtp: mailResult.previewOtp }
      : {}),
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    res.status(400);
    throw new Error('Please provide email, reset code, and new password');
  }

  const normalizedEmail = email.toLowerCase().trim();

  const otpRecord = await OTP.findOne({
    email: normalizedEmail,
    otp: otp.trim(),
    type: 'password_reset',
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    res.status(400);
    throw new Error('Invalid or expired password reset code');
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.password = newPassword;
  await user.save();

  otpRecord.isUsed = true;
  await otpRecord.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully. You can now log in with your new password.',
  });
});

const logout = asyncHandler(async (req, res) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      await Session.deleteMany({ tokenHash });
    } catch (err) {
      // Safe catch
    }
  }

  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

const getProfile = asyncHandler(async (req, res) => {
  if (req.user && req.user.isDemo) {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  }

  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  if (req.user && req.user.isDemo) {
    return res.status(200).json({
      success: true,
      data: {
        ...req.user,
        name: req.body.name || req.user.name,
        bio: req.body.bio || req.user.bio,
      },
    });
  }

  const fieldsToUpdate = {
    name: req.body.name,
    bio: req.body.bio,
    avatar: req.body.avatar,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

const updatePreferences = asyncHandler(async (req, res) => {
  const { theme, fontSize, colorScheme } = req.body;

  if (req.user && req.user.isDemo) {
    const updatedPreferences = {
      ...(req.user.preferences || {}),
      ...(theme ? { theme } : {}),
      ...(fontSize ? { fontSize } : {}),
      ...(colorScheme ? { colorScheme } : {}),
    };
    return res.status(200).json({
      success: true,
      data: updatedPreferences,
    });
  }

  const user = await User.findById(req.user.id);

  if (user) {
    if (theme) user.preferences.theme = theme;
    if (fontSize) user.preferences.fontSize = fontSize;
    if (colorScheme) user.preferences.colorScheme = colorScheme;
    await user.save();

    return res.status(200).json({
      success: true,
      data: user.preferences,
    });
  }

  res.status(404);
  throw new Error('User not found');
});

module.exports = {
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
};
