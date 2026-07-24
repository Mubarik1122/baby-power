const express = require('express');
const {
  createContactLead, createQuotationLead,
  getLeads, getLead, updateLeadStatus, deleteLead,
} = require('../controllers/leadController');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.post('/contact', asyncHandler(createContactLead));
router.post('/quotation', asyncHandler(createQuotationLead));
router.get('/', protect, adminOnly, asyncHandler(getLeads));
router.get('/:id', protect, adminOnly, asyncHandler(getLead));
router.patch('/:id/status', protect, adminOnly, asyncHandler(updateLeadStatus));
router.delete('/:id', protect, adminOnly, asyncHandler(deleteLead));

module.exports = router;
