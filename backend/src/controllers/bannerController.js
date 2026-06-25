const Banner = require('../models/Banner');
const { saveUploadedFile } = require('../utils/storage');

exports.getBanners = async (req, res) => {
  const filter = req.query.active !== 'false' ? { isActive: true } : {};
  const banners = await Banner.find(filter).sort({ sortOrder: 1, createdAt: -1 });
  res.json({ success: true, data: banners });
};

exports.getBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    return res.status(404).json({ success: false, message: 'Banner not found' });
  }
  res.json({ success: true, data: banner });
};

exports.createBanner = async (req, res) => {
  const body = { ...req.body };
  if (req.file) body.image = await saveUploadedFile(req.file);
  else if (body.imageUrl) body.image = body.imageUrl;
  delete body.imageUrl;
  if (body.sortOrder) body.sortOrder = parseInt(body.sortOrder);
  if (body.isActive !== undefined) body.isActive = body.isActive !== 'false';

  if (!body.image) {
    return res.status(400).json({ success: false, message: 'Banner image is required' });
  }

  const banner = await Banner.create(body);
  res.status(201).json({ success: true, data: banner });
};

exports.updateBanner = async (req, res) => {
  const body = { ...req.body };
  if (req.file) body.image = await saveUploadedFile(req.file);
  else if (body.imageUrl) body.image = body.imageUrl;
  delete body.imageUrl;
  if (body.sortOrder) body.sortOrder = parseInt(body.sortOrder);
  if (body.isActive !== undefined) body.isActive = body.isActive !== 'false' && body.isActive !== false;

  const banner = await Banner.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!banner) {
    return res.status(404).json({ success: false, message: 'Banner not found' });
  }

  res.json({ success: true, data: banner });
};

exports.deleteBanner = async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) {
    return res.status(404).json({ success: false, message: 'Banner not found' });
  }
  res.json({ success: true, message: 'Banner deleted' });
};

exports.toggleBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    return res.status(404).json({ success: false, message: 'Banner not found' });
  }
  banner.isActive = !banner.isActive;
  await banner.save();
  res.json({ success: true, data: banner });
};
