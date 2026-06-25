const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: { type: String, default: '' },
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.pre('save', async function (next) {
  try {
    if (this.isModified('name') || this.isModified('parent') || !this.slug) {
      let base = slugify(this.name, { lower: true, strict: true });
      if (this.parent) {
        const parent = await mongoose.model('Category').findById(this.parent);
        if (parent) {
          base = `${parent.slug}-${base}`;
        }
      }

      let slug = base;
      let counter = 1;
      const Category = mongoose.model('Category');
      while (await Category.findOne({ slug, _id: { $ne: this._id } })) {
        slug = `${base}-${counter}`;
        counter += 1;
      }
      this.slug = slug;
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Category', categorySchema);
