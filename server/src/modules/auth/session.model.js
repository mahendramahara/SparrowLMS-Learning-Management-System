const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      required: true,
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    userAgent: {
      type: String,
      default: 'Unknown Device',
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB Time-To-Live index for automatic session expiration and deletion
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
sessionSchema.index({ userId: 1, isDemo: 1 });

module.exports = mongoose.model('Session', sessionSchema);
