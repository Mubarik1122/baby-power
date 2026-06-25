const express = require('express');
const { getSettings, getAdminSettings, updateSettings } = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSettings);
router.get('/admin', protect, adminOnly, getAdminSettings);
router.put('/', protect, adminOnly, updateSettings);

module.exports = router;
