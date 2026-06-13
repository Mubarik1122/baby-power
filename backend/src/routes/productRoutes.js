const express = require('express');
const {
  getProducts, getProductBySlug, getProduct,
  createProduct, updateProduct, deleteProduct, toggleProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', protect, adminOnly, getProduct);
router.post('/', protect, adminOnly, upload.array('images', 10), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 10), updateProduct);
router.patch('/:id/toggle', protect, adminOnly, toggleProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
