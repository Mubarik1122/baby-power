const Settings = require('../models/Settings');

const defaultSiteSettings = {
  key: 'site',
  whatsappNumber: process.env.WHATSAPP_NUMBER || '',
  whatsappMessage:
    process.env.WHATSAPP_MESSAGE || 'Hello, I have a question about Baby Power wholesale.',
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
