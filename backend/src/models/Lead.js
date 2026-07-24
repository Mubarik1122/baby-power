const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    leadId: { type: String, unique: true },
    type: { type: String, enum: ['contact', 'quotation'], required: true },
    name: { type: String, required: true, trim: true },
    company: { type: String, default: '', trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '', trim: true },
    message: { type: String, default: '' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, default: '' },
    productSku: { type: String, default: '' },
    category: { type: String, default: '' },
    quantity: { type: Number },
    selectedSize: { type: String, default: '' },
    selectedColor: { type: String, default: '' },
    selectedSizes: [{ type: String }],
    selectedColors: [{ type: String }],
    variants: [
      {
        size: { type: String, default: '' },
        color: { type: String, default: '' },
        label: { type: String, default: '' },
        quantity: { type: Number },
      },
    ],
    country: { type: String, default: '' },
    city: { type: String, default: '' },
    address: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in_progress', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

leadSchema.pre('save', async function () {
  if (this.leadId) return;
  // Avoid async + next() (breaks under Mongoose 8). Use a unique id that
  // does not race on countDocuments under concurrent form submits.
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  this.leadId = `BP-${stamp}-${rand}`;
});

module.exports = mongoose.model('Lead', leadSchema);
