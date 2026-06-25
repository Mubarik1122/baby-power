const Product = require('../models/Product');
const Category = require('../models/Category');
const { saveUploadedFiles } = require('../utils/storage');

exports.getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) {
    const childIds = await Category.find({ parent: req.query.category }).distinct('_id');
    filter.category = childIds.length > 0
      ? { $in: [req.query.category, ...childIds] }
      : req.query.category;
  }
  if (req.query.featured === 'true') filter.isFeatured = true;
  if (req.query.active !== 'false') filter.isActive = true;

  let sort = { createdAt: -1 };
  if (req.query.sort === 'name') sort = { name: 1 };
  if (req.query.sort === 'oldest') sort = { createdAt: 1 };

  let query = Product.find(filter).populate('category', 'name slug image parent');

  if (req.query.search) {
    query = Product.find({
      ...filter,
      $text: { $search: req.query.search },
    }).populate('category', 'name slug image parent');
  }

  const total = await Product.countDocuments(
    req.query.search
      ? { ...filter, $text: { $search: req.query.search } }
      : filter
  );

  const products = await query.sort(sort).skip(skip).limit(limit);

  res.json({
    success: true,
    data: products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

exports.getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate(
    'category',
    'name slug'
  );

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, data: product });
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
};

exports.createProduct = async (req, res) => {
  const images = req.files?.length ? await saveUploadedFiles(req.files) : [];
  const body = { ...req.body };

  if (body.sizes && typeof body.sizes === 'string') body.sizes = JSON.parse(body.sizes);
  if (body.colors && typeof body.colors === 'string') body.colors = JSON.parse(body.colors);
  if (body.seo && typeof body.seo === 'string') body.seo = JSON.parse(body.seo);
  if (body.moq) body.moq = parseInt(body.moq);
  if (body.isFeatured) body.isFeatured = body.isFeatured === 'true';
  if (body.isActive !== undefined) body.isActive = body.isActive !== 'false';

  const product = await Product.create({ ...body, images });
  res.status(201).json({ success: true, data: product });
};

exports.updateProduct = async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const body = { ...req.body };
  if (body.sizes && typeof body.sizes === 'string') body.sizes = JSON.parse(body.sizes);
  if (body.colors && typeof body.colors === 'string') body.colors = JSON.parse(body.colors);
  if (body.seo && typeof body.seo === 'string') body.seo = JSON.parse(body.seo);
  if (body.moq) body.moq = parseInt(body.moq);
  if (body.isFeatured !== undefined) body.isFeatured = body.isFeatured === 'true' || body.isFeatured === true;
  if (body.isActive !== undefined) body.isActive = body.isActive !== 'false' && body.isActive !== false;

  if (req.files?.length) {
    const newImages = await saveUploadedFiles(req.files);
    body.images = [...(product.images || []), ...newImages];
  }

  product = await Product.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');

  res.json({ success: true, data: product });
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted' });
};

exports.toggleProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  product.isActive = !product.isActive;
  await product.save();
  res.json({ success: true, data: product });
};
