const express = require('express');
const {
  getBanners, getBanner, createBanner, updateBanner, deleteBanner, toggleBanner,
} = require('../controllers/bannerController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getBanners);
router.get('/:id', protect, adminOnly, getBanner);
router.post('/', protect, adminOnly, upload.single('image'), createBanner);
router.put('/:id', protect, adminOnly, upload.single('image'), updateBanner);
router.patch('/:id/toggle', protect, adminOnly, toggleBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

module.exports = router;
