const Category = require('../models/Category');
const Product = require('../models/Product');

exports.getCategories = async (req, res) => {
  const filter = req.query.active !== 'false' ? { isActive: true } : {};
  const categories = await Category.find(filter).sort({ sortOrder: 1, name: 1 });
  res.json({ success: true, data: categories });
};

exports.getCategoryBySlug = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.json({ success: true, data: category });
};

exports.getCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.json({ success: true, data: category });
};

exports.createCategory = async (req, res) => {
  const body = { ...req.body };
  if (req.file) body.image = `/uploads/${req.file.filename}`;
  if (body.seo && typeof body.seo === 'string') body.seo = JSON.parse(body.seo);
  if (body.sortOrder) body.sortOrder = parseInt(body.sortOrder);

  const category = await Category.create(body);
  res.status(201).json({ success: true, data: category });
};

exports.updateCategory = async (req, res) => {
  const body = { ...req.body };
  if (req.file) body.image = `/uploads/${req.file.filename}`;
  if (body.seo && typeof body.seo === 'string') body.seo = JSON.parse(body.seo);
  if (body.sortOrder) body.sortOrder = parseInt(body.sortOrder);
  if (body.isActive !== undefined) body.isActive = body.isActive !== 'false';

  const category = await Category.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  res.json({ success: true, data: category });
};

exports.deleteCategory = async (req, res) => {
  const productCount = await Product.countDocuments({ category: req.params.id });
  if (productCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete category with ${productCount} products`,
    });
  }

  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.json({ success: true, message: 'Category deleted' });
};
