require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const FAQ = require('../models/FAQ');
const Page = require('../models/Page');
const Banner = require('../models/Banner');
const { ensureSiteSettings } = require('./ensureSiteSettings');
const { contentPages } = require('./ensureContentPages');

// Images sourced from mnb-wholesale.com (Shopify CDN)
const MNB = {
  categories: {
    bodysuits: 'https://cdn.shopify.com/s/files/1/0873/9861/3317/collections/Untitled_design_6.jpg?v=1768585452',
    rompers: 'https://cdn.shopify.com/s/files/1/0873/9861/3317/collections/Untitled_design_5.jpg?v=1768825264',
    sleepsuits: 'https://cdn.shopify.com/s/files/1/0873/9861/3317/collections/Untitled_design_18.jpg?v=1768585454',
    sets: 'https://cdn.shopify.com/s/files/1/0873/9861/3317/collections/Untitled_design_17.jpg?v=1768585453',
    blankets: 'https://cdn.shopify.com/s/files/1/0873/9861/3317/collections/Untitled_design_14.jpg?v=1768585451',
    accessories: 'https://cdn.shopify.com/s/files/1/0873/9861/3317/collections/Untitled_design_16.jpg?v=1768585452',
  },
  products: [
    'https://cdn.shopify.com/s/files/1/0873/9861/3317/files/3WEB_9e16b8db-12a8-428c-9698-ea0575301a05.jpg?v=1781084285',
    'https://cdn.shopify.com/s/files/1/0873/9861/3317/files/05_06_26-orange-safari-romper-model.jpg?v=1781022660',
    'https://cdn.shopify.com/s/files/1/0873/9861/3317/files/7WEB_413c7775-d0e8-41da-8b05-5952d152424f.jpg?v=1781020170',
    'https://cdn.shopify.com/s/files/1/0873/9861/3317/files/6WEB_3a84c041-7334-474e-acd1-db333c4ea554.jpg?v=1781020168',
    'https://cdn.shopify.com/s/files/1/0873/9861/3317/files/4WEB_06b5996a-26cf-4a16-a72a-f9ad6566331a.jpg?v=1781020168',
    'https://cdn.shopify.com/s/files/1/0873/9861/3317/collections/Untitled_design_16.jpg?v=1768585452',
    'https://cdn.shopify.com/s/files/1/0873/9861/3317/files/1WEB_2e2a5f73-8b96-4a93-ba93-1f51e84a298a.jpg?v=1781084285',
    'https://cdn.shopify.com/s/files/1/0873/9861/3317/files/8WEB_4bcdbbc4-b313-416d-aa99-509963c4bd12.jpg?v=1781020169',
  ],
  banners: [
    {
      title: 'Safari Collection',
      subtitle: 'Premium wholesale baby clothing — outstanding service, exclusive pricing, industry expertise',
      ctaText: 'Browse Catalog',
      ctaLink: '/shop',
      image: 'https://cdn.shopify.com/s/files/1/0873/9861/3317/files/05_06_26-orange-safari-romper-model.jpg?v=1781022660',
      sortOrder: 1,
    },
    {
      title: 'New Season Arrivals',
      subtitle: 'Bodysuits, rompers, sleepsuits & gift sets — trade pricing on request',
      ctaText: 'Explore Collections',
      ctaLink: '/shop',
      image: 'https://cdn.shopify.com/s/files/1/0873/9861/3317/files/3WEB_9e16b8db-12a8-428c-9698-ea0575301a05.jpg?v=1781084285',
      sortOrder: 2,
    },
    {
      title: 'Partner With Baby Power',
      subtitle: 'Wholesale accounts for retailers worldwide — request your trade account today',
      ctaText: 'Request Account',
      ctaLink: '/contact',
      image: 'https://cdn.shopify.com/s/files/1/0873/9861/3317/collections/Untitled_design_6.jpg?v=1768585452',
      sortOrder: 3,
    },
  ],
};

const categories = [
  { name: 'Baby Bodysuits', sortOrder: 1, description: 'Soft and comfortable baby bodysuits for wholesale.', image: MNB.categories.bodysuits },
  { name: 'Baby Rompers', sortOrder: 2, description: 'Stylish baby rompers in various designs.', image: MNB.categories.rompers },
  { name: 'Baby Sleepsuits', sortOrder: 3, description: 'Cozy sleepsuits for peaceful nights.', image: MNB.categories.sleepsuits },
  { name: 'Baby Sets', sortOrder: 4, description: 'Complete baby clothing sets for retailers.', image: MNB.categories.sets },
  { name: 'Baby Blankets', sortOrder: 5, description: 'Premium quality baby blankets.', image: MNB.categories.blankets },
  { name: 'Baby Accessories', sortOrder: 6, description: 'Essential baby accessories for wholesale.', image: MNB.categories.accessories },
];

const products = [
  { name: 'Premium Cotton Baby Bodysuit', sku: 'BP-BS-001', category: 'Baby Bodysuits', moq: 50, isFeatured: true, sizes: ['0-3M', '3-6M', '6-9M', '9-12M'], colors: ['White', 'Pink', 'Blue', 'Grey'], description: 'Made from 100% organic cotton, our premium baby bodysuit offers unmatched softness and durability for wholesale buyers.', images: [MNB.products[0], MNB.products[6]] },
  { name: 'Classic Baby Romper', sku: 'BP-RM-001', category: 'Baby Rompers', moq: 50, isFeatured: true, sizes: ['0-3M', '3-6M', '6-9M'], colors: ['Yellow', 'Green', 'Navy'], description: 'A timeless romper design perfect for retail stores. Easy snap closures and breathable fabric.', images: [MNB.products[1]] },
  { name: 'Cozy Fleece Sleepsuit', sku: 'BP-SS-001', category: 'Baby Sleepsuits', moq: 100, isFeatured: true, sizes: ['0-6M', '6-12M', '12-18M'], colors: ['Cream', 'Lilac', 'Mint'], description: 'Ultra-soft fleece sleepsuit keeping babies warm and comfortable all night long.', images: [MNB.products[2]] },
  { name: 'Gift Box Baby Set', sku: 'BP-ST-001', category: 'Baby Sets', moq: 30, isFeatured: true, sizes: ['0-3M', '3-6M'], colors: ['Neutral', 'Pink', 'Blue'], description: 'Complete 3-piece baby set including bodysuit, hat, and mittens. Perfect for gift retailers.', images: [MNB.products[3]] },
  { name: 'Organic Muslin Blanket', sku: 'BP-BL-001', category: 'Baby Blankets', moq: 50, sizes: ['70x70cm', '100x100cm'], colors: ['White', 'Sage', 'Blush'], description: 'Lightweight organic muslin blanket, ideal for swaddling and everyday use.', images: [MNB.categories.blankets] },
  { name: 'Knitted Baby Booties Set', sku: 'BP-AC-001', category: 'Baby Accessories', moq: 100, sizes: ['0-6M', '6-12M'], colors: ['Cream', 'Grey', 'Pink'], description: 'Hand-finished knitted booties with matching headband. Premium wholesale accessory.', images: [MNB.products[5]] },
  { name: 'Striped Long Sleeve Bodysuit', sku: 'BP-BS-002', category: 'Baby Bodysuits', moq: 50, sizes: ['3-6M', '6-9M', '9-12M'], colors: ['Navy/White', 'Red/White'], description: 'Classic striped design with envelope neckline for easy dressing.', images: [MNB.products[4]] },
  { name: 'Floral Print Romper', sku: 'BP-RM-002', category: 'Baby Rompers', moq: 50, isFeatured: true, sizes: ['0-3M', '3-6M', '6-9M'], colors: ['Floral Pink', 'Floral Blue'], description: 'Delicate floral print romper, a bestseller for spring and summer collections.', images: [MNB.products[7]] },
];

const faqs = [
  { question: 'What is the minimum order quantity (MOQ)?', answer: 'Our MOQ varies by product, typically starting from 30-100 pieces per style. Check individual product pages for specific MOQ requirements.', sortOrder: 1 },
  { question: 'Do you ship internationally?', answer: 'We deliver wholesale orders across the United Kingdom and Northern Ireland. Contact us for delivery options and lead times.', sortOrder: 2 },
  { question: 'What payment methods do you accept?', answer: 'We accept bank transfers, letters of credit, and other standard B2B payment methods. Payment terms are discussed during the quotation process.', sortOrder: 3 },
  { question: 'How do I place a wholesale order?', answer: 'Browse our catalogue, request a quotation for the styles you need, and our team will confirm pricing, MOQs, and delivery details.', sortOrder: 4 },
  { question: 'What is your production lead time?', answer: 'Standard orders are typically fulfilled within 15-30 business days. Custom orders may require additional time.', sortOrder: 5 },
  { question: 'Do you provide samples before bulk orders?', answer: 'Yes, we offer sample orders for quality verification. Sample costs can be credited against your first bulk order.', sortOrder: 6 },
];

const returnPolicy = {
  slug: 'return-policy',
  title: 'Return Policy',
  content: `<h2>Return & Exchange Policy</h2>
<p>At Baby Power, we are committed to delivering high-quality wholesale baby clothing. We understand that occasionally issues may arise, and we have established the following return policy for our B2B customers.</p>
<h3>Quality Issues</h3>
<p>If you receive products with manufacturing defects, please notify us within 7 days of delivery with photographic evidence. We will arrange replacement or credit at no additional cost.</p>
<h3>Incorrect Orders</h3>
<p>If you receive incorrect items, contact us within 5 business days. We will arrange collection and dispatch of correct items promptly.</p>
<h3>Non-Returnable Items</h3>
<p>Custom-made or personalized items cannot be returned unless there is a quality defect. Sale items are final sale unless defective.</p>
<h3>Return Process</h3>
<p>Contact our team at returns@babypower.com with your order number and details. Our team will provide a return authorization and instructions within 2 business days.</p>`,
  seo: {
    metaTitle: 'Return Policy | Baby Power Wholesale',
    metaDescription: 'Learn about Baby Power wholesale return and exchange policy for B2B customers.',
    keywords: 'return policy, wholesale returns, baby clothing returns',
  },
};

const shippingPolicy = {
  slug: 'shipping-policy',
  title: 'Shipping Policy',
  content: `<h2>Shipping Policy</h2>
<p>Baby Power delivers wholesale orders across the United Kingdom and Northern Ireland. Shipping terms are agreed during the quotation and order confirmation process.</p>
<h3>Dispatch Times</h3>
<p>Standard orders are typically dispatched within 15–30 business days after payment confirmation. Seasonal orders may require additional lead time.</p>
<h3>Delivery Areas</h3>
<p>We ship to addresses throughout the UK mainland and Northern Ireland. Your account manager will confirm delivery options and estimated timescales for your order.</p>
<h3>Delivery & Tracking</h3>
<p>Tracking information is provided once your order leaves our warehouse. Delivery times vary by location and carrier.</p>
<h3>Shipping Costs</h3>
<p>Shipping is quoted separately based on volume, weight, and destination within the UK and Northern Ireland. Contact our team for a detailed freight estimate with your quotation.</p>`,
  seo: {
    metaTitle: 'Shipping Policy | Baby Power Wholesale',
    metaDescription: 'Shipping and delivery information for Baby Power wholesale orders.',
    keywords: 'shipping policy, wholesale delivery, baby clothing freight',
  },
};

const termsOfService = {
  slug: 'terms-of-service',
  title: 'Terms of Service',
  content: `<h2>Terms of Service</h2>
<p>These terms govern trade accounts and wholesale purchases with Baby Power. By requesting an account or placing an order, you agree to these terms.</p>
<h3>Trade Accounts</h3>
<p>Baby Power is a trade-only wholesaler. Accounts are subject to approval. We reserve the right to decline or suspend accounts at our discretion.</p>
<h3>Orders & Payment</h3>
<p>All orders are subject to acceptance and availability. Payment terms, including deposits and balances, are confirmed in writing before production or dispatch.</p>
<h3>Pricing</h3>
<p>Quoted prices are valid for the period stated on the quotation. Prices exclude shipping, duties, and taxes unless otherwise agreed.</p>
<h3>Intellectual Property</h3>
<p>Product designs, branding, and marketing materials remain the property of Baby Power.</p>`,
  seo: {
    metaTitle: 'Terms of Service | Baby Power Wholesale',
    metaDescription: 'Terms of service for Baby Power wholesale trade customers.',
    keywords: 'terms of service, wholesale terms, trade account',
  },
};

const privacyPolicy = {
  slug: 'privacy-policy',
  title: 'Privacy Policy',
  content: `<h2>Privacy Policy</h2>
<p>Baby Power respects your privacy and is committed to protecting personal data submitted through our website and trade account applications.</p>
<h3>Information We Collect</h3>
<p>We collect contact details, company information, and enquiry data when you submit contact forms, quotation requests, or account applications.</p>
<h3>How We Use Your Data</h3>
<p>Your information is used to respond to enquiries, process quotations, manage trade accounts, and improve our services. We do not sell your data to third parties.</p>
<h3>Data Retention</h3>
<p>We retain lead and account information for as long as necessary to fulfil business purposes or as required by law.</p>
<h3>Your Rights</h3>
<p>You may request access, correction, or deletion of your personal data by contacting privacy@babypower.com.</p>
<h3>Cookies</h3>
<p>Our website may use essential cookies for functionality. We do not use invasive tracking cookies on the public storefront.</p>`,
  seo: {
    metaTitle: 'Privacy Policy | Baby Power Wholesale',
    metaDescription: 'How Baby Power collects, uses, and protects your personal data.',
    keywords: 'privacy policy, data protection, wholesale privacy',
  },
};

async function seed() {
  await connectDB();

  const force = process.env.SEED_FORCE === 'true';
  const userCount = await User.countDocuments();

  if (!force && userCount > 0) {
    console.log('Database already has data — skipping seed to keep saved settings and content.');
    await ensureSiteSettings();
    await mongoose.connection.close();
    process.exit(0);
  }

  if (force) {
    console.log('SEED_FORCE=true — clearing existing data...');
  } else {
    console.log('Empty database — seeding sample data...');
  }

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany(),
    Category.deleteMany(),
    Product.deleteMany(),
    FAQ.deleteMany(),
    Page.deleteMany(),
    Banner.deleteMany(),
  ]);

  console.log('Creating admin user...');
  await User.create({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@babypower.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin',
  });

  console.log('Creating categories...');
  const createdCategories = {};
  for (const cat of categories) {
    const created = await Category.create({
      ...cat,
      seo: {
        metaTitle: `${cat.name} Wholesale | Baby Power`,
        metaDescription: cat.description,
        keywords: `${cat.name.toLowerCase()}, wholesale baby clothing, baby power`,
      },
    });
    createdCategories[cat.name] = created._id;
  }

  console.log('Creating products...');
  for (const prod of products) {
    await Product.create({
      name: prod.name,
      sku: prod.sku,
      category: createdCategories[prod.category],
      description: prod.description,
      specifications: 'Material: 100% Cotton | Care: Machine wash 30°C | Certifications: OEKO-TEX Standard 100',
      sizes: prod.sizes,
      colors: prod.colors,
      images: prod.images || [],
      moq: prod.moq,
      isFeatured: prod.isFeatured || false,
      seo: {
        metaTitle: `${prod.name} | Baby Power Wholesale`,
        metaDescription: prod.description,
        keywords: `${prod.name.toLowerCase()}, wholesale, baby clothing`,
      },
    });
  }

  console.log('Creating banners...');
  await Banner.insertMany(MNB.banners);

  console.log('Creating FAQs...');
  await FAQ.insertMany(faqs);

  console.log('Creating pages...');
  await Page.insertMany([...contentPages, returnPolicy, shippingPolicy, termsOfService, privacyPolicy]);

  console.log('Ensuring site settings...');
  await ensureSiteSettings();

  console.log('Seed completed successfully!');
  console.log(`Admin login: ${process.env.ADMIN_EMAIL || 'admin@babypower.com'}`);
  console.log(`Admin password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
