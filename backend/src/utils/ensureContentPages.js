const Page = require('../models/Page');

const STORY_IMAGE =
  'https://cdn.shopify.com/s/files/1/0873/9861/3317/collections/Untitled_design_6.jpg?v=1768585452';

const contentPages = [
  {
    slug: 'about',
    title: 'About Us',
    subtitle: 'Crafting comfort for little ones since 2010 — trusted by 1,000+ retail partners',
    content: `<p>Little Star is a UK-based wholesale baby clothing manufacturer dedicated to providing retailers with premium quality garments at competitive trade prices. Founded in 2010, we have grown from a small family business to a trusted supplier serving over 1,000 retail partners across the UK and Northern Ireland.</p>
<p>Our extensive product range includes baby bodysuits, rompers, sleepsuits, clothing sets, blankets, and accessories — all crafted from the finest materials with meticulous attention to detail.</p>`,
    extras: {
      storyImage: STORY_IMAGE,
      sectionLabel: 'Who We Are',
      sectionHeading: 'Your Wholesale Baby Clothing Partner',
      cards: [
        { title: 'Our Mission', desc: 'To provide retailers across the UK and Northern Ireland with premium quality baby clothing at competitive wholesale prices, while maintaining the highest standards of safety and sustainability.' },
        { title: 'Our Vision', desc: 'To become the most trusted wholesale baby clothing partner globally, known for innovation, quality, and exceptional customer service.' },
        { title: 'Manufacturing', desc: 'Our state-of-the-art manufacturing facility produces over 500 styles annually, using OEKO-TEX certified materials and ethical production practices.' },
        { title: 'Why Choose Us', desc: '15+ years of experience, 1000+ satisfied retail partners, competitive MOQs, and dedicated account management.' },
      ],
    },
    seo: {
      metaTitle: 'About Us | Little Star',
      metaDescription: 'Learn about Little Star — wholesale baby clothing for UK and Northern Ireland retailers.',
      keywords: 'about little star, wholesale baby clothing, UK wholesaler',
    },
  },
  {
    slug: 'contact',
    title: 'Contact Us',
    subtitle: 'Request a trade account or send us an enquiry — we respond within 24 hours',
    content: '',
    extras: {
      address: '123 Textile Lane, Manchester, M1 1AA, UK',
      phone: '+44 123 456 7890',
      email: 'info@littlestar.co.uk',
      hours: 'Mon – Fri: 9:00 AM – 6:00 PM GMT',
    },
    seo: {
      metaTitle: 'Contact Us | Little Star',
      metaDescription: 'Contact Little Star for wholesale enquiries and trade accounts.',
      keywords: 'contact little star, wholesale enquiry, trade account',
    },
  },
  {
    slug: 'home-story',
    title: 'Crafting Comfort for Little Ones',
    subtitle: '',
    content: 'Little Star is a leading wholesale baby clothing manufacturer serving discerning retailers across the UK and Northern Ireland. From organic cotton bodysuits to cosy fleece sleepsuits, every garment reflects our commitment to quality, safety, and timeless design.',
    extras: {
      label: 'Our Story',
    },
    seo: {
      metaTitle: 'Little Star | Wholesale Baby Clothing',
      metaDescription: 'Wholesale baby clothing for UK and Northern Ireland retailers.',
      keywords: 'wholesale baby clothing, little star',
    },
  },
];

async function ensureContentPages() {
  for (const page of contentPages) {
    await Page.updateOne({ slug: page.slug }, { $setOnInsert: page }, { upsert: true });
  }
}

module.exports = { ensureContentPages, contentPages };
