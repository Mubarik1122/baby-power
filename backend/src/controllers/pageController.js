const Page = require('../models/Page');

exports.getPageBySlug = async (req, res) => {
  const page = await Page.findOne({ slug: req.params.slug, isActive: true });
  if (!page) {
    return res.status(404).json({ success: false, message: 'Page not found' });
  }
  res.json({ success: true, data: page });
};

exports.getPages = async (_req, res) => {
  const pages = await Page.find().sort({ title: 1 });
  res.json({ success: true, data: pages });
};

exports.createPage = async (req, res) => {
  const page = await Page.create(req.body);
  res.status(201).json({ success: true, data: page });
};

exports.updatePage = async (req, res) => {
  const page = await Page.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!page) {
    return res.status(404).json({ success: false, message: 'Page not found' });
  }
  res.json({ success: true, data: page });
};

exports.deletePage = async (req, res) => {
  const page = await Page.findByIdAndDelete(req.params.id);
  if (!page) {
    return res.status(404).json({ success: false, message: 'Page not found' });
  }
  res.json({ success: true, message: 'Page deleted' });
};
