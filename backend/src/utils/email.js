const nodemailer = require('nodemailer');
const Settings = require('../models/Settings');

async function getSiteSettings() {
  let settings = await Settings.findOne({ key: 'site' });
  if (!settings) {
    settings = await Settings.create({ key: 'site' });
  }
  return settings;
}

function isSmtpConfigured(settings) {
  return Boolean(settings.smtpHost && settings.smtpNotifyEmail);
}

async function sendLeadNotification(subject, html) {
  const settings = await getSiteSettings();
  if (!isSmtpConfigured(settings)) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort || 587,
    secure: settings.smtpPort === 465,
    auth: settings.smtpUser
      ? { user: settings.smtpUser, pass: settings.smtpPass }
      : undefined,
  });

  await transporter.sendMail({
    from: settings.smtpFrom || settings.smtpUser || settings.smtpNotifyEmail,
    to: settings.smtpNotifyEmail,
    subject,
    html,
  });

  return true;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildContactEmail(lead) {
  return `
    <h2>New Contact Request</h2>
    <p><strong>Lead ID:</strong> ${escapeHtml(lead.leadId)}</p>
    <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>
    <p><strong>Company:</strong> ${escapeHtml(lead.company)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(lead.message).replace(/\n/g, '<br>')}</p>
  `;
}

function buildQuotationEmail(lead) {
  return `
    <h2>New Quotation Request</h2>
    <p><strong>Lead ID:</strong> ${escapeHtml(lead.leadId)}</p>
    <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>
    <p><strong>Company:</strong> ${escapeHtml(lead.company)}</p>
    <p><strong>Product:</strong> ${escapeHtml(lead.productName)} (${escapeHtml(lead.productSku)})</p>
    <p><strong>Category:</strong> ${escapeHtml(lead.category)}</p>
    <p><strong>Quantity:</strong> ${escapeHtml(lead.quantity)}</p>
    <p><strong>Size:</strong> ${escapeHtml(lead.selectedSize)}</p>
    <p><strong>Color:</strong> ${escapeHtml(lead.selectedColor)}</p>
    <p><strong>Country:</strong> ${escapeHtml(lead.country)}</p>
    <p><strong>City:</strong> ${escapeHtml(lead.city)}</p>
    <p><strong>Address:</strong> ${escapeHtml(lead.address)}</p>
    <p><strong>Notes:</strong></p>
    <p>${escapeHtml(lead.notes).replace(/\n/g, '<br>')}</p>
  `;
}

module.exports = {
  sendLeadNotification,
  buildContactEmail,
  buildQuotationEmail,
};
