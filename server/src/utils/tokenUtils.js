const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Session = require('../modules/auth/session.model');

const generateAccessToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const generateRefreshToken = id => {
  return jwt.sign(
    { id },
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '30d',
    }
  );
};

const sendTokenResponse = (user, statusCode, res, isDemo = false, req = null) => {
  const userId = user._id || user.id;
  const token = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  };

  const refreshCookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  };

  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    Session.create({
      userId: String(userId),
      userEmail: user.email,
      role: user.role,
      isDemo: Boolean(user.isDemo || isDemo),
      tokenHash,
      ipAddress: req?.ip || req?.connection?.remoteAddress || '127.0.0.1',
      userAgent: req?.headers?.['user-agent'] || 'Web Client',
      expiresAt: refreshCookieOptions.expires,
    }).catch(() => {});
  } catch (err) {
    void err;
  }

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .cookie('refreshToken', refreshToken, refreshCookieOptions)
    .json({
      success: true,
      token,
      refreshToken,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        isDemo: Boolean(user.isDemo || isDemo),
        viewOnly: Boolean(user.viewOnly || user.isDemo || isDemo),
        avatar: user.avatar || '',
        preferences: user.preferences,
        authProvider: user.authProvider || 'local',
      },
    });
};

module.exports = {
  generateToken: generateAccessToken,
  generateAccessToken,
  generateRefreshToken,
  sendTokenResponse,
};
