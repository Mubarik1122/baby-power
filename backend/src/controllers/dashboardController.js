const Product = require('../models/Product');
const Category = require('../models/Category');
const Lead = require('../models/Lead');

exports.getDashboardStats = async (_req, res) => {
  const [
    totalProducts,
    totalCategories,
    totalLeads,
    newQuotations,
    contactRequests,
    recentLeads,
    recentQuotations,
    monthlyLeads,
  ] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Lead.countDocuments(),
    Lead.countDocuments({ type: 'quotation', status: 'new' }),
    Lead.countDocuments({ type: 'contact', status: 'new' }),
    Lead.find().sort({ createdAt: -1 }).limit(5),
    Lead.find({ type: 'quotation' }).sort({ createdAt: -1 }).limit(5),
    getMonthlyLeads(),
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalProducts,
        totalCategories,
        totalLeads,
        newQuotations,
        contactRequests,
      },
      monthlyLeads,
      recentLeads,
      recentQuotations,
    },
  });
};

async function getMonthlyLeads() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const leads = await Lead.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          type: '$type',
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push({
      label: d.toLocaleString('default', { month: 'short', year: 'numeric' }),
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      contact: 0,
      quotation: 0,
    });
  }

  leads.forEach((l) => {
    const m = months.find((m) => m.year === l._id.year && m.month === l._id.month);
    if (m) m[l._id.type] = l.count;
  });

  return months;
}
