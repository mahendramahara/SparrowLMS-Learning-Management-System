const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: 'SparrowLMS Learning Platform',
      trim: true,
    },
    supportEmail: {
      type: String,
      default: 'admin@sparrowlms.com',
      trim: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    allowRegistrations: {
      type: Boolean,
      default: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    payoutPercentage: {
      type: Number,
      default: 80,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
