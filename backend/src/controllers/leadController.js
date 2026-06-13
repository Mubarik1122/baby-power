const Lead = require('../models/Lead');

exports.createContactLead = async (req, res) => {
  const { name, email, phone, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email and message are required' });
  }

  const lead = await Lead.create({
    type: 'contact',
    name,
    email,
    phone: phone || '',
    company: company || '',
    message,
  });

  res.status(201).json({ success: true, data: lead, message: 'Contact request submitted' });
};

exports.createQuotationLead = async (req, res) => {
  const {
    name, company, email, phone, country, city, address,
    quantity, notes, productId, productName, productSku, category,
    selectedSize, selectedColor,
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  const totalQty = parseInt(quantity, 10);
  if (!totalQty || totalQty < 1) {
    return res.status(400).json({ success: false, message: 'Quantity is required' });
  }

  const lead = await Lead.create({
    type: 'quotation',
    name,
    company: company || '',
    email,
    phone: phone || '',
    country: country || '',
    city: city || '',
    address: address || '',
    quantity: totalQty,
    selectedSize: selectedSize || '',
    selectedColor: selectedColor || '',
    notes: notes || '',
    product: productId || undefined,
    productName: productName || '',
    productSku: productSku || '',
    category: category || '',
  });

  res.status(201).json({ success: true, data: lead, message: 'Quotation request submitted' });
};

exports.getLeads = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.status) filter.status = req.query.status;

  const total = await Lead.countDocuments(filter);
  const leads = await Lead.find(filter)
    .populate('product', 'name sku slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    data: leads,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

exports.getLead = async (req, res) => {
  const lead = await Lead.findById(req.params.id).populate('product', 'name sku slug images');
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }
  res.json({ success: true, data: lead });
};

exports.updateLeadStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['new', 'contacted', 'in_progress', 'closed'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  res.json({ success: true, data: lead });
};

exports.deleteLead = async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }
  res.json({ success: true, message: 'Lead deleted' });
};
