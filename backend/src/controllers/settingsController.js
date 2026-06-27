const Settings = require('../models/Settings');
const brand = require('../config/brand');

const MASKED_PASSWORD = '********';

async function getOrCreateSettings() {
  let settings = await Settings.findOne({ key: 'site' });
  if (!settings) {
    settings = await Settings.create({ key: 'site' });
  }
  return settings;
}

function publicSettingsData(settings) {
  return {
    whatsappNumber: settings.whatsappNumber || '',
    whatsappMessage: settings.whatsappMessage || brand.whatsappMessage,
    smtpHost: settings.smtpHost || '',
    smtpPort: settings.smtpPort || 587,
    smtpUser: settings.smtpUser || '',
    smtpFrom: settings.smtpFrom || '',
    smtpNotifyEmail: settings.smtpNotifyEmail || '',
  };
}

function adminSettingsData(settings) {
  return {
    whatsappNumber: settings.whatsappNumber || '',
    whatsappMessage: settings.whatsappMessage || brand.whatsappMessage,
    smtpHost: settings.smtpHost || '',
    smtpPort: settings.smtpPort || 587,
    smtpUser: settings.smtpUser || '',
    smtpPass: settings.smtpPass ? MASKED_PASSWORD : '',
    smtpFrom: settings.smtpFrom || '',
    smtpNotifyEmail: settings.smtpNotifyEmail || '',
  };
}

exports.getSettings = async (_req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ success: true, data: publicSettingsData(settings) });
};

exports.getAdminSettings = async (_req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ success: true, data: adminSettingsData(settings) });
};

exports.updateSettings = async (req, res) => {
  const {
    whatsappNumber,
    whatsappMessage,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    smtpFrom,
    smtpNotifyEmail,
  } = req.body;

  const update = {
    whatsappNumber: whatsappNumber ?? '',
    ...(whatsappMessage !== undefined ? { whatsappMessage } : {}),
    smtpHost: smtpHost ?? '',
    smtpPort: smtpPort ? parseInt(smtpPort, 10) : 587,
    smtpUser: smtpUser ?? '',
    smtpFrom: smtpFrom ?? '',
    smtpNotifyEmail: smtpNotifyEmail ?? '',
  };

  if (smtpPass !== undefined && smtpPass !== MASKED_PASSWORD) {
    update.smtpPass = smtpPass;
  }

  const settings = await Settings.findOneAndUpdate(
    { key: 'site' },
    update,
    { new: true, upsert: true, runValidators: true }
  );

  res.json({ success: true, data: adminSettingsData(settings) });
};
