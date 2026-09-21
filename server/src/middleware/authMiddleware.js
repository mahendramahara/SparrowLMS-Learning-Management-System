const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../modules/user/user.model');
const demoUsers = require('../demo/users.json');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized to access this route');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support demo users without MongoDB CastError
    if (typeof decoded.id === 'string' && decoded.id.startsWith('demo_')) {
      const demoUser = demoUsers.find(u => u._id === decoded.id);
      if (!demoUser) {
        res.status(401);
        throw new Error('Demo session expired or user not found');
      }
      req.user = {
        ...demoUser,
        id: demoUser._id,
      };
      return next();
    }

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized to access this route');
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `User role ${req.user?.role || 'unknown'} is not authorized to access this route`
      );
    }
    next();
  };
};

const restrictDemo = (req, res, next) => {
  if (req.user && (req.user.isDemo || req.user.viewOnly)) {
    // Read-only methods allowed
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    // Allow demo user to update frontend preferences (theme, font)
    if (req.path === '/preferences' || req.originalUrl?.includes('/auth/preferences')) {
      return next();
    }

    return res.status(403).json({
      success: false,
      isDemoRestriction: true,
      message:
        'Demo accounts operate in view-only mode. Please register a full account to modify data.',
    });
  }
  next();
};

module.exports = { protect, authorize, restrictDemo };
