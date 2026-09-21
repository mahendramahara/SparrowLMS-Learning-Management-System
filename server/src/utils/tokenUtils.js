const jwt = require('jsonwebtoken');

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const sendTokenResponse = (user, statusCode, res, isDemo = false) => {
  const token = isDemo ? generateToken(user._id) : generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isDemo: user.isDemo || isDemo,
        avatar: user.avatar,
        preferences: user.preferences,
      },
    });
};

module.exports = { generateToken, sendTokenResponse };
