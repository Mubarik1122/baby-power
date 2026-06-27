import Link from 'next/link';
import ApiImage from '@/components/ui/ApiImage';
import { Metadata } from 'next';
import { generateSEO } from '@/components/seo/SEOHead';
import PageBanner from '@/components/ui/PageBanner';
import CategoryScrollStrip from '@/components/home/CategoryScrollStrip';
import Button from '@/components/ui/Button';
import { getCategories, getPageBySlug } from '@/lib/api';
import { Category, Page } from '@/lib/types';

export const revalidate = 60;

const ABOUT_BANNER = '/banners/about-hero.jpg';
const FALLBACK_STORY_IMAGE =
  'https://cdn.shopify.com/s/files/1/0873/9861/3317/collections/Untitled_design_6.jpg?v=1768585452';

const defaultCards = [
  { title: 'Our Mission', desc: 'To provide retailers across the UK and Northern Ireland with premium quality baby clothing at competitive wholesale prices, while maintaining the highest standards of safety and sustainability.' },
  { title: 'Our Vision', desc: 'To become the most trusted wholesale baby clothing partner globally, known for innovation, quality, and exceptional customer service.' },
  { title: 'Manufacturing', desc: 'Our state-of-the-art manufacturing facility produces over 500 styles annually, using OEKO-TEX certified materials and ethical production practices.' },
  { title: 'Why Choose Us', desc: '15+ years of experience, 1000+ satisfied retail partners, competitive MOQs, and dedicated account management.' },
];

type AboutExtras = {
  storyImage?: string;
  sectionLabel?: string;
  sectionHeading?: string;
  cards?: Array<{ title: string; desc: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await getPageBySlug('about');
    const page = res.data;
    return generateSEO({
      title: page.seo?.metaTitle || page.title,
      description: page.seo?.metaDescription || 'About Little Star wholesale baby clothing.',
      path: '/about',
    });
  } catch {
    return generateSEO({
      title: 'About Us',
      description: 'Learn about Little Star wholesale baby clothing.',
      path: '/about',
    });
  }
}

export default async function AboutPage() {
  let categories: Category[] = [];
  let page: Page | null = null;

  try {
    const [catRes, pageRes] = await Promise.all([getCategories(), getPageBySlug('about')]);
    categories = catRes.data || [];
    page = pageRes.data;
  } catch {
    // fall back to defaults below
  }

  const extras = (page?.extras || {}) as AboutExtras;
  const cards = extras.cards?.length ? extras.cards : defaultCards;
  const storyImage = extras.storyImage || FALLBACK_STORY_IMAGE;

  return (
    <div>
      <PageBanner
        title={page?.title || 'About Us'}
        subtitle={page?.subtitle || 'Crafting comfort for little ones since 2010 — trusted by 1,000+ retail partners'}
        image={ABOUT_BANNER}
      />
      <CategoryScrollStrip categories={categories} title="Shop by Category" />

      <section className="py-14 lg:py-20 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden frame-corners">
                <ApiImage
                  src={storyImage}
                  alt="Little Star wholesale baby clothing"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 to-transparent" />
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-4">
                {extras.sectionLabel || 'Who We Are'}
              </p>
              <h2 className="font-display text-3xl lg:text-4xl text-secondary tracking-wide mb-6">
                {extras.sectionHeading || 'Your Wholesale Baby Clothing Partner'}
              </h2>
              {page?.content ? (
                <div className="space-y-4 text-muted text-sm leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
              ) : (
                <div className="space-y-4 text-muted text-sm leading-relaxed">
                  <p>
                    Little Star is a UK-based wholesale baby clothing manufacturer dedicated to providing retailers
                    with premium quality garments at competitive trade prices.
                  </p>
                </div>
              )}
              <div className="mt-8">
                <Link href="/contact"><Button variant="outline">Contact Us</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-cream border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6">
            {cards.map((item) => (
              <div key={item.title} className="bg-surface border border-border p-8">
                <h3 className="font-display text-xl text-secondary mb-3">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-linen border-t border-border text-center">
        <Link
          href="/contact"
          className="text-xs uppercase tracking-widest text-secondary border-b border-secondary hover:text-primary hover:border-primary transition-colors pb-0.5"
        >
          Request a Trade Account
        </Link>
      </section>
    </div>
  );
}
