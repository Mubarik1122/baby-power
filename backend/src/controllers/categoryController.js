const Category = require('../models/Category');
const Product = require('../models/Product');
const { saveUploadedFile } = require('../utils/storage');

async function validateParent(parentId, categoryId) {
  if (!parentId) return null;

  if (categoryId && parentId === categoryId) {
    const error = new Error('A category cannot be its own parent');
    error.statusCode = 400;
    throw error;
  }

  const parent = await Category.findById(parentId);
  if (!parent) {
    const error = new Error('Parent category not found');
    error.statusCode = 400;
    throw error;
  }

  if (parent.parent) {
    const error = new Error('Subcategories can only be created under top-level categories');
    error.statusCode = 400;
    throw error;
  }

  return parentId;
}

function parseCategoryBody(req) {
  const body = { ...req.body };
  if (body.seo && typeof body.seo === 'string') body.seo = JSON.parse(body.seo);
  if (body.sortOrder) body.sortOrder = parseInt(body.sortOrder, 10);
  if (body.parent === '' || body.parent === 'null' || body.parent === 'undefined') {
    body.parent = null;
  }
  if (body.isActive !== undefined) {
    body.isActive = body.isActive !== 'false' && body.isActive !== false;
  }
  return body;
}

async function applyCategoryUpload(body, file) {
  if (file) {
    body.image = await saveUploadedFile(file);
  }
  return body;
}

exports.getCategories = async (req, res) => {
  const filter = req.query.active !== 'false' ? { isActive: true } : {};
  const categories = await Category.find(filter)
    .populate('parent', 'name slug')
    .sort({ sortOrder: 1, name: 1 });
  res.json({ success: true, data: categories });
};

exports.getCategoryBySlug = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true })
    .populate('parent', 'name slug');
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.json({ success: true, data: category });
};

exports.getCategory = async (req, res) => {
  const category = await Category.findById(req.params.id).populate('parent', 'name slug');
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.json({ success: true, data: category });
};

exports.createCategory = async (req, res) => {
  try {
    let body = parseCategoryBody(req);
    body = await applyCategoryUpload(body, req.file);
    body.parent = await validateParent(body.parent);

    const category = await Category.create(body);
    await category.populate('parent', 'name slug');
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to create category',
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    let body = parseCategoryBody(req);
    body = await applyCategoryUpload(body, req.file);
    if (body.parent !== undefined) {
      body.parent = await validateParent(body.parent, req.params.id);
    }

    const category = await Category.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).populate('parent', 'name slug');

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, data: category });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to update category',
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const childCount = await Category.countDocuments({ parent: req.params.id });
  if (childCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete category with ${childCount} subcategories`,
    });
  }

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
