const Settings = require('../models/Settings');
const brand = require('../config/brand');

const defaultSiteSettings = {
  key: 'site',
  whatsappNumber: process.env.WHATSAPP_NUMBER || '',
  whatsappMessage: process.env.WHATSAPP_MESSAGE || brand.whatsappMessage,
  smtpHost: '',
  smtpPort: 587,
  smtpUser: '',
  smtpPass: '',
  smtpFrom: '',
  smtpNotifyEmail: '',
};

async function ensureSiteSettings() {
  await Settings.updateOne(
    { key: 'site' },
    { $setOnInsert: defaultSiteSettings },
    { upsert: true }
  );
}

module.exports = { ensureSiteSettings, defaultSiteSettings };
