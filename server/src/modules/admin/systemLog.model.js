const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    actorName: {
      type: String,
      default: 'System',
    },
    actorEmail: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['AUTH', 'COURSE', 'FINANCE', 'SYSTEM', 'USER', 'SECURITY'],
      default: 'SYSTEM',
      index: true,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILURE', 'WARNING', 'INFO'],
      default: 'SUCCESS',
      index: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

systemLogSchema.index({ createdAt: -1 });
systemLogSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('SystemLog', systemLogSchema);
