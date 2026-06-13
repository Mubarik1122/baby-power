const express = require('express');
const {
  createContactLead, createQuotationLead,
  getLeads, getLead, updateLeadStatus, deleteLead,
} = require('../controllers/leadController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/contact', createContactLead);
router.post('/quotation', createQuotationLead);
router.get('/', protect, adminOnly, getLeads);
router.get('/:id', protect, adminOnly, getLead);
router.patch('/:id/status', protect, adminOnly, updateLeadStatus);
router.delete('/:id', protect, adminOnly, deleteLead);

module.exports = router;
