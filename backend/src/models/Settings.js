const mongoose = require('mongoose');
const brand = require('../config/brand');

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'site', unique: true },
    whatsappNumber: { type: String, default: '' },
    whatsappMessage: {
      type: String,
      default: brand.whatsappMessage,
    },
    smtpHost: { type: String, default: '' },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String, default: '' },
    smtpPass: { type: String, default: '' },
    smtpFrom: { type: String, default: '' },
    smtpNotifyEmail: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
