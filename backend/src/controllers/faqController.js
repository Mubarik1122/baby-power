const FAQ = require('../models/FAQ');

exports.getFAQs = async (req, res) => {
  const filter = req.query.active !== 'false' ? { isActive: true } : {};
  const faqs = await FAQ.find(filter).sort({ sortOrder: 1, createdAt: -1 });
  res.json({ success: true, data: faqs });
};

exports.createFAQ = async (req, res) => {
  const faq = await FAQ.create(req.body);
  res.status(201).json({ success: true, data: faq });
};

exports.updateFAQ = async (req, res) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!faq) {
    return res.status(404).json({ success: false, message: 'FAQ not found' });
  }
  res.json({ success: true, data: faq });
};

exports.deleteFAQ = async (req, res) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);
  if (!faq) {
    return res.status(404).json({ success: false, message: 'FAQ not found' });
  }
  res.json({ success: true, message: 'FAQ deleted' });
};
