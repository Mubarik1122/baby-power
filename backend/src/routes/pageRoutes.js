const express = require('express');
const {
  getPageBySlug, getPages, createPage, updatePage, deletePage,
} = require('../controllers/pageController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, adminOnly, getPages);
router.get('/slug/:slug', getPageBySlug);
router.post('/', protect, adminOnly, createPage);
router.put('/:id', protect, adminOnly, updatePage);
router.delete('/:id', protect, adminOnly, deletePage);

module.exports = router;
