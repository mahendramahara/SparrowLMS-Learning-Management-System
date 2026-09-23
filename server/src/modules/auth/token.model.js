const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      trim: true,
    },
    token: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['email_verification', 'password_reset', 'account_activation'],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    resendCount: {
      type: Number,
      default: 0,
    },
    lastSentAt: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

tokenSchema.pre('save', function (next) {
  if (this.otp && !this.token) {
    this.token = this.otp;
  } else if (this.token && !this.otp) {
    this.otp = this.token;
  }
  next();
});

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
tokenSchema.index({ email: 1, type: 1, isUsed: 1 });

const Token = mongoose.models.Token || mongoose.model('Token', tokenSchema);
module.exports = Token;
