const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../user/user.model');
const Token = require('./token.model');
const Session = require('./session.model');
const { sendTokenResponse, generateAccessToken, generateRefreshToken } = require('../../utils/tokenUtils');
const sendEmail = require('../../utils/emailUtils');
const { getEmailVerificationTemplate, getPasswordResetTemplate } = require('../../utils/emailTemplates');
const { logSystemEvent } = require('../../utils/auditLogger');
const { createNotification } = require('../../utils/notificationDispatcher');


const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
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

  await Token.deleteMany({ email: normalizedEmail, type: 'email_verification' });

  const otp = generateOTP();

  await Token.create({
    email: normalizedEmail,
    otp,
    token: otp,
    type: 'email_verification',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  const html = getEmailVerificationTemplate(otp, 'Learner');
  const mailResult = await sendEmail({
    email: normalizedEmail,
    subject: 'Verify Your Email Address - SparrowLMS',
    html,
    otp,
  });

  await logSystemEvent({
    actorEmail: normalizedEmail,
    action: 'AUTH_SEND_OTP',
    category: 'AUTH',
    status: 'SUCCESS',
    req,
    details: { email: normalizedEmail, type: 'email_verification' },
  });

  res.status(200).json({
    success: true,
    message: 'Verification code sent to your email',
    ...(process.env.NODE_ENV !== 'production' && mailResult?.previewOtp
      ? { previewOtp: mailResult.previewOtp }
      : {}),
  });
});

const resendVerificationOTP = asyncHandler(async (req, res) => {
  const { email, type = 'email_verification' } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide email address');
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingToken = await Token.findOne({
    email: normalizedEmail,
    type,
  }).sort({ createdAt: -1 });

  if (existingToken && existingToken.lastSentAt) {
    const elapsedSeconds = Math.floor((Date.now() - new Date(existingToken.lastSentAt).getTime()) / 1000);
    if (elapsedSeconds < 45) {
      res.status(429);
      throw new Error(`Please wait ${45 - elapsedSeconds} seconds before requesting a new code`);
    }
  }

  const otp = generateOTP();

  await Token.deleteMany({ email: normalizedEmail, type });

  await Token.create({
    email: normalizedEmail,
    otp,
    token: otp,
    type,
    resendCount: (existingToken?.resendCount || 0) + 1,
    lastSentAt: new Date(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  const html =
    type === 'password_reset'
      ? getPasswordResetTemplate(otp, 'User')
      : getEmailVerificationTemplate(otp, 'Learner');

  const mailResult = await sendEmail({
    email: normalizedEmail,
    subject:
      type === 'password_reset'
        ? 'Reset Your Account Password - SparrowLMS'
        : 'Verify Your Email Address - SparrowLMS',
    html,
    otp,
  });

  await logSystemEvent({
    actorEmail: normalizedEmail,
    action: 'AUTH_RESEND_OTP',
    category: 'AUTH',
    status: 'SUCCESS',
    req,
    details: { email: normalizedEmail, type },
  });

  res.status(200).json({
    success: true,
    message: 'New verification code dispatched to your email',
    ...(process.env.NODE_ENV !== 'production' && mailResult?.previewOtp
      ? { previewOtp: mailResult.previewOtp }
      : {}),
  });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, type } = req.body;
  const code = (req.body.otp || req.body.token || '').toString().trim();

  if (!email || !code || !type) {
    res.status(400);
    throw new Error('Please provide email, verification code, and verification type');
  }

  const normalizedEmail = email.toLowerCase().trim();

  const tokenRecord = await Token.findOne({
    email: normalizedEmail,
    $or: [{ otp: code }, { token: code }],
    type,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  if (!tokenRecord) {
    await logSystemEvent({
      actorEmail: normalizedEmail,
      action: 'AUTH_VERIFY_OTP_FAILED',
      category: 'AUTH',
      status: 'FAILURE',
      req,
      details: { email: normalizedEmail, type },
    });

    res.status(400);
    throw new Error('Invalid or expired verification code');
  }

  tokenRecord.isUsed = true;
  await tokenRecord.save();

  await logSystemEvent({
    actorEmail: normalizedEmail,
    action: 'AUTH_VERIFY_OTP_SUCCESS',
    category: 'AUTH',
    status: 'SUCCESS',
    req,
    details: { email: normalizedEmail, type },
  });

  res.status(200).json({
    success: true,
    message: 'Verification code confirmed successfully',
  });
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'student' } = req.body;
  const code = (req.body.otp || req.body.token || '').toString().trim();

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (process.env.NODE_ENV !== 'test') {
    if (!code) {
      res.status(400);
      throw new Error('Please provide email verification code');
    }

    const tokenRecord = await Token.findOne({
      email: normalizedEmail,
      $or: [{ otp: code }, { token: code }],
      type: 'email_verification',
    }).sort({ createdAt: -1 });

    if (!tokenRecord || !tokenRecord.isUsed) {
      res.status(400);
      throw new Error('Please verify your email code before completing registration');
    }
  }

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error('An account with this email address already exists');
  }

  const assignedRole = ['student', 'instructor'].includes(role) ? role : 'student';

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: assignedRole,
    authProvider: 'local',
    isVerified: true,
  });

  await createNotification({
    recipient: user._id,
    recipientRole: user.role,
    category: 'Users',
    type: 'welcome',
    title: `Welcome to SparrowLMS, ${user.name}`,
    message: 'Your account is verified and ready. Start exploring courses or set up your profile preferences.',
    actionUrl: user.role === 'instructor' ? '/instructor/courses' : '/student/courses',
    priority: 'normal',
  });

  await logSystemEvent({
    actor: user._id,
    actorName: user.name,
    actorEmail: user.email,
    action: 'USER_REGISTER',
    category: 'AUTH',
    status: 'SUCCESS',
    req,
    details: { role: user.role },
  });

  sendTokenResponse(user, 201, res, false, req);
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
    await logSystemEvent({
      actorEmail: normalizedEmail,
      action: 'USER_LOGIN_FAILED',
      category: 'AUTH',
      status: 'FAILURE',
      req,
      details: { reason: 'User not found' },
    });
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
    await logSystemEvent({
      actor: user._id,
      actorEmail: user.email,
      action: 'USER_LOGIN_FAILED',
      category: 'AUTH',
      status: 'FAILURE',
      req,
      details: { reason: 'Password mismatch' },
    });
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

  await logSystemEvent({
    actor: user._id,
    actorName: user.name,
    actorEmail: user.email,
    action: 'USER_LOGIN_SUCCESS',
    category: 'AUTH',
    status: 'SUCCESS',
    req,
    details: { role: user.role },
  });

  sendTokenResponse(user, 200, res, false, req);
});

const googleLogin = asyncHandler(async (req, res) => {
  const credential = req.body.credential || req.body.token || req.body.idToken || req.body.id_token;
  const role = req.body.role || 'student';

  if (!credential) {
    res.status(400);
    throw new Error('Google authentication credential is required');
  }

  let googleData = null;

  try {
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );
    googleData = response.data;
  } catch (apiError) {
    try {
      const decoded = jwt.decode(credential);
      if (decoded && decoded.email && decoded.sub) {
        googleData = decoded;
      } else {
        res.status(401);
        throw new Error('Invalid Google credential payload');
      }
    } catch (e) {
      res.status(401);
      throw new Error('Could not verify Google authentication credential');
    }
  }

  const { sub: googleId, email, name, picture } = googleData;

  if (!email) {
    res.status(400);
    throw new Error('Google account must provide an email address');
  }

  const normalizedEmail = email.toLowerCase().trim();

  let user = await User.findOne({
    $or: [{ googleId }, { email: normalizedEmail }],
  });

  if (user) {
    if (!user.googleId) {
      user.googleId = googleId;
    }
    if (user.authProvider !== 'google') {
      user.authProvider = 'google';
    }
    if (!user.avatar && picture) {
      user.avatar = picture;
    }
    if (!user.isVerified) {
      user.isVerified = true;
    }
    user.lastLogin = new Date();
    await user.save();
  } else {
    const assignedRole = ['student', 'instructor'].includes(role) ? role : 'student';

    user = await User.create({
      name: name || 'Learner',
      email: normalizedEmail,
      googleId,
      avatar: picture || '',
      authProvider: 'google',
      isVerified: true,
      role: assignedRole,
    });

    await createNotification({
      recipient: user._id,
      recipientRole: user.role,
      category: 'Users',
      type: 'welcome',
      title: `Welcome to SparrowLMS, ${user.name}`,
      message: 'Your Google-linked account is ready. Begin your learning journey or complete your preferences.',
      actionUrl: user.role === 'instructor' ? '/instructor/courses' : '/student/courses',
      priority: 'normal',
    });
  }

  await logSystemEvent({
    actor: user._id,
    actorName: user.name,
    actorEmail: user.email,
    action: 'GOOGLE_LOGIN_SUCCESS',
    category: 'AUTH',
    status: 'SUCCESS',
    req,
    details: { googleId, role: user.role },
  });

  sendTokenResponse(user, 200, res, false, req);
});

const refreshToken = asyncHandler(async (req, res) => {
  let token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    res.status(401);
    throw new Error('Refresh token not provided');
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error('Invalid refresh token');
    }

    sendTokenResponse(user, 200, res, false, req);
  } catch (error) {
    res.status(401);
    throw new Error('Refresh token is invalid or expired');
  }
});

const demoLogin = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role || !['student', 'instructor', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Invalid demo role specified');
  }

  const roleNames = {
    student: 'Aarav Sharma',
    instructor: 'Pooja Thapa',
    admin: 'Sunil Adhikari',
  };

  const demoEmail = `demo.${role}@sparrowlms.com`;
  let user = await User.findOne({ email: demoEmail });

  if (!user) {
    user = await User.create({
      name: roleNames[role] || 'Sparrow User',
      email: demoEmail,
      password: 'DemoPassword123!',
      role,
      isVerified: true,
      isDemo: true,
      bio: `Dedicated ${role} on SparrowLMS platform.`,
    });
  }

  await logSystemEvent({
    actorName: user.name,
    actorEmail: user.email,
    action: 'DEMO_LOGIN',
    category: 'AUTH',
    status: 'SUCCESS',
    req,
    details: { role: user.role, viewOnly: true },
  });

  sendTokenResponse(
    {
      ...user.toObject(),
      isDemo: true,
      viewOnly: true,
    },
    200,
    res,
    true,
    req
  );
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

  await Token.deleteMany({ email: normalizedEmail, type: 'password_reset' });

  const otp = generateOTP();

  await Token.create({
    email: normalizedEmail,
    otp,
    token: otp,
    type: 'password_reset',
    userId: user._id,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  const html = getPasswordResetTemplate(otp, user.name);
  const mailResult = await sendEmail({
    email: normalizedEmail,
    subject: 'Reset Your Account Password - SparrowLMS',
    html,
    otp,
  });

  await logSystemEvent({
    actor: user._id,
    actorEmail: normalizedEmail,
    action: 'FORGOT_PASSWORD_REQUEST',
    category: 'AUTH',
    status: 'SUCCESS',
    req,
    details: { email: normalizedEmail },
  });

  res.status(200).json({
    success: true,
    message: 'Password reset code dispatched to your email',
    ...(process.env.NODE_ENV !== 'production' && mailResult?.previewOtp
      ? { previewOtp: mailResult.previewOtp }
      : {}),
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  const code = (req.body.otp || req.body.token || '').toString().trim();

  if (!email || !code || !newPassword) {
    res.status(400);
    throw new Error('Please provide email, reset code, and new password');
  }

  const normalizedEmail = email.toLowerCase().trim();

  const tokenRecord = await Token.findOne({
    email: normalizedEmail,
    $or: [{ otp: code }, { token: code }],
    type: 'password_reset',
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  if (!tokenRecord) {
    res.status(400);
    throw new Error('Invalid or expired password reset code');
  }

  tokenRecord.isUsed = true;
  await tokenRecord.save();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.password = newPassword;
  await user.save();

  await logSystemEvent({
    actor: user._id,
    actorName: user.name,
    actorEmail: user.email,
    action: 'PASSWORD_RESET_SUCCESS',
    category: 'AUTH',
    status: 'SUCCESS',
    req,
  });

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
  } else if (req.body && req.body.token) {
    token = req.body.token;
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  const allDevices = Boolean(req.body?.allDevices || req.query?.allDevices);

  if (token) {
    try {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      let userId = req.user?.id || req.user?._id;

      if (!userId) {
        try {
          const decoded = jwt.decode(token);
          if (decoded && decoded.id) {
            userId = String(decoded.id);
          }
        } catch (e) {
          void e;
        }
      }

      if (allDevices && userId) {
        await Session.deleteMany({ userId: String(userId) });
      } else {
        await Session.deleteMany({
          $or: [
            { tokenHash },
            ...(userId ? [{ userId: String(userId) }] : []),
          ],
        });
      }
    } catch (err) {
      void err;
    }
  } else if (req.user && (req.user.id || req.user._id)) {
    try {
      const userId = String(req.user.id || req.user._id);
      if (allDevices) {
        await Session.deleteMany({ userId });
      }
    } catch (err) {
      void err;
    }
  }

  if (req.session && typeof req.session.destroy === 'function') {
    req.session.destroy(() => {});
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  };

  const cookieNames = ['token', 'session', 'refreshToken', 'connect.sid'];
  cookieNames.forEach(name => {
    res.clearCookie(name, cookieOptions);
    res.cookie(name, '', { ...cookieOptions, expires: new Date(0) });
  });

  await logSystemEvent({
    actor: req.user?._id || req.user?.id,
    action: 'USER_LOGOUT',
    category: 'AUTH',
    status: 'SUCCESS',
    req,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

const getProfile = asyncHandler(async (req, res) => {
  if (req.user && (req.user.isDemo || req.user.viewOnly)) {
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
  if (req.user && (req.user.isDemo || req.user.viewOnly)) {
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
  const { preferences, interests, learningGoal, skillLevel, onboardingCompleted } = req.body;

  if (req.user && (req.user.isDemo || req.user.viewOnly)) {
    return res.status(200).json({
      success: true,
      data: {
        ...req.user,
        preferences: {
          ...req.user.preferences,
          ...preferences,
        },
        interests: interests || req.user.interests,
        learningGoal: learningGoal || req.user.learningGoal,
        skillLevel: skillLevel || req.user.skillLevel,
        onboardingCompleted:
          onboardingCompleted !== undefined
            ? onboardingCompleted
            : req.user.onboardingCompleted,
      },
    });
  }

  const updates = {};
  if (preferences) updates.preferences = preferences;
  if (interests) updates.interests = interests;
  if (learningGoal !== undefined) updates.learningGoal = learningGoal;
  if (skillLevel) updates.skillLevel = skillLevel;
  if (onboardingCompleted !== undefined) updates.onboardingCompleted = onboardingCompleted;

  const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true });

  res.status(200).json({
    success: true,
    data: user,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;


  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide both current and new password');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters long');
  }

  if (req.user && (req.user.isDemo || req.user.viewOnly)) {
    res.status(403);
    throw new Error('Action restricted: Demo accounts cannot change passwords.');
  }

  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error('Current password does not match');
  }

  user.password = newPassword;
  await user.save();

  await logSystemEvent({
    actor: user._id,
    actorName: user.name,
    actorEmail: user.email,
    action: 'PASSWORD_CHANGE',
    category: 'AUTH',
    status: 'SUCCESS',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  await createNotification({
    recipient: user._id,
    recipientRole: user.role,
    category: 'Security',
    type: 'security',
    title: 'Password Successfully Changed',
    message: 'Your account password has been updated.',
    priority: 'high',
  });

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

module.exports = {
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
  changePassword,
  logout,
  getProfile,
  updateProfile,
  updatePreferences,
};

