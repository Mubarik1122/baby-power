import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCategories, getFAQs, getBanners, getImageUrl } from '@/lib/api';
import { Product, Category, FAQ, Banner } from '@/lib/types';
import CategoryCard from '@/components/ui/CategoryCard';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';
import HeroSlider from '@/components/home/HeroSlider';
import TrustMarquee from '@/components/home/TrustMarquee';
import StatsRow from '@/components/home/StatsRow';
import CategoryScrollStrip from '@/components/home/CategoryScrollStrip';
import PromoBannerMosaic from '@/components/home/PromoBannerMosaic';
import BenefitsGrid from '@/components/home/BenefitsGrid';
import ImageMoodBoard from '@/components/home/ImageMoodBoard';
import ProductShowcaseSection from '@/components/ui/ProductShowcaseSection';
import Button from '@/components/ui/Button';
import ApiUnavailable from '@/components/ui/ApiUnavailable';
import TrustBadges from '@/components/ui/TrustBadges';

export const revalidate = 60;

const FALLBACK_IMAGES = [
  'https://cdn.shopify.com/s/files/1/0873/9861/3317/files/05_06_26-orange-safari-romper-model.jpg?v=1781022660',
  'https://cdn.shopify.com/s/files/1/0873/9861/3317/files/3WEB_9e16b8db-12a8-428c-9698-ea0575301a05.jpg?v=1781084285',
  'https://cdn.shopify.com/s/files/1/0873/9861/3317/files/7WEB_413c7775-d0e8-41da-8b05-5952d152424f.jpg?v=1781020170',
  'https://cdn.shopify.com/s/files/1/0873/9861/3317/files/6WEB_3a84c041-7334-474e-acd1-db333c4ea554.jpg?v=1781020168',
  'https://cdn.shopify.com/s/files/1/0873/9861/3317/collections/Untitled_design_6.jpg?v=1768585452',
  'https://cdn.shopify.com/s/files/1/0873/9861/3317/collections/Untitled_design_5.jpg?v=1768825264',
  'https://cdn.shopify.com/s/files/1/0873/9861/3317/files/8WEB_4bcdbbc4-b313-416d-aa99-509963c4bd12.jpg?v=1781020169',
  'https://cdn.shopify.com/s/files/1/0873/9861/3317/collections/Untitled_design_18.jpg?v=1768585454',
];

export default async function HomePage() {
  let featuredProducts: Product[] = [];
  let latestProducts: Product[] = [];
  let categories: Category[] = [];
  let faqs: FAQ[] = [];
  let banners: Banner[] = [];
  let apiAvailable = true;

  try {
    const [fp, all, cat, faq, ban] = await Promise.all([
      getProducts({ featured: 'true', limit: '8' }),
      getProducts({ limit: '12' }),
      getCategories(),
      getFAQs(),
      getBanners(),
    ]);
    featuredProducts = fp.data || [];
    latestProducts = all.data || [];
    categories = cat.data || [];
    faqs = (faq.data || []).slice(0, 6);
    banners = ban.data || [];
  } catch {
    apiAvailable = false;
  }

  const moodImages = [
    ...featuredProducts.flatMap((p) => p.images || []),
    ...categories.map((c) => c.image).filter(Boolean),
    ...FALLBACK_IMAGES,
  ];

  const storyImage = moodImages[0] || FALLBACK_IMAGES[0];

  return (
    <>
      {!apiAvailable && <ApiUnavailable />}
      <HeroSlider banners={banners} />
      <CategoryScrollStrip categories={categories} />
      <TrustBadges />
      <TrustMarquee />
      <PromoBannerMosaic banners={banners} />

      <ProductShowcaseSection
        products={featuredProducts}
        label="Bestsellers"
        title="Featured Wholesale Styles"
        subtitle="Our most requested bodysuits, rompers and gift sets — tap any style for trade pricing"
        className="bg-surface"
      />

      <ProductShowcaseSection
        products={latestProducts.filter((p) => !featuredProducts.some((f) => f._id === p._id)).slice(0, 8)}
        label="Just In"
        title="Latest Arrivals"
        subtitle="Fresh additions to the Baby Power catalogue this season"
        className="bg-cream"
        dense
      />

      <StatsRow />

      {categories.length > 0 && (
        <section className="py-14 lg:py-20 bg-surface border-t border-border relative grain">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionTitle
                label="Full Catalogue"
                title="Shop Every Category"
                subtitle="Bodysuits, rompers, sleepsuits, sets, blankets & accessories"
              />
            </Reveal>

            <div className="grid md:grid-cols-12 gap-4 lg:gap-5 mb-5">
              {categories.slice(0, 2).map((cat, i) => (
                <Reveal key={cat._id} delay={(i + 1) as 1 | 2} className="md:col-span-6">
                  <CategoryCard category={cat} variant="overlay" large />
                </Reveal>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-12">
              {categories.map((cat, i) => (
                <Reveal key={cat._id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <CategoryCard category={cat} variant="stacked" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <BenefitsGrid />
      <ImageMoodBoard images={moodImages} />

      {/* About preview */}
      <section className="py-14 lg:py-20 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <Reveal className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative aspect-[3/4] overflow-hidden col-span-2">
                  <Image src={getImageUrl(storyImage)} alt="" fill className="object-cover" sizes="40vw" />
                </div>
                {moodImages.slice(1, 3).map((img, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden">
                    <Image src={getImageUrl(img)} alt="" fill className="object-cover" sizes="20vw" />
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal className="lg:col-span-7" delay={2}>
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-4">Our Story</p>
              <h2 className="font-display text-3xl lg:text-[2.75rem] text-secondary tracking-wide leading-tight">
                Crafting Comfort for Little Ones
              </h2>
              <p className="mt-6 text-muted text-sm leading-[1.9]">
                Baby Power is a leading wholesale baby clothing manufacturer serving discerning retailers
                across 30+ countries. From organic cotton bodysuits to cosy fleece sleepsuits, every garment
                reflects our commitment to quality, safety, and timeless design.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/about"><Button variant="outline">About Us</Button></Link>
                <Link href="/contact"><Button>Request Account</Button></Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="py-14 lg:py-20 bg-cream border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7">
                <Reveal>
                  <SectionTitle label="Support" title="Frequently Asked Questions" />
                </Reveal>
                <Reveal delay={2}>
                  <div className="border border-border bg-surface divide-y divide-border">
                    {faqs.map((faq) => (
                      <details key={faq._id} className="group">
                        <summary className="px-6 py-5 cursor-pointer text-sm text-secondary hover:text-primary transition-colors list-none flex items-center justify-between gap-4">
                          <span>{faq.question}</span>
                          <span className="text-gold shrink-0 border border-border w-6 h-6 flex items-center justify-center group-open:rotate-45 transition-transform">+</span>
                        </summary>
                        <div className="px-6 pb-5 text-muted text-sm leading-relaxed border-t border-border/50 pt-4">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </Reveal>
                <div className="mt-8">
                  <Link href="/faq"><Button variant="ghost">All FAQs →</Button></Link>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="sticky top-24 space-y-4">
                  {categories.slice(0, 4).map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/shop/${cat.slug}`}
                      className="flex items-center gap-4 p-4 bg-surface border border-border hover:border-primary transition-colors group"
                    >
                      <div className="relative w-16 h-16 shrink-0 overflow-hidden">
                        {cat.image && <Image src={getImageUrl(cat.image)} alt="" fill className="object-cover group-hover:scale-105 transition-transform" sizes="64px" />}
                      </div>
                      <div>
                        <p className="font-display text-secondary group-hover:text-primary transition-colors">{cat.name}</p>
                        <p className="text-xs text-muted mt-0.5">Browse wholesale styles →</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="relative py-16 lg:py-24 overflow-hidden grain border-t border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-linen via-blush/60 to-sage-light/50" />
        <div className="absolute inset-0 sparkle-bg" />
        <Reveal>
          <div className="relative max-w-2xl mx-auto px-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-5">Trade Partners Welcome</p>
            <h2 className="font-display text-4xl lg:text-5xl text-secondary tracking-wide leading-tight">
              Ready to Stock Baby Power?
            </h2>
            <p className="mt-5 text-muted text-sm leading-relaxed max-w-md mx-auto">
              Join our network of wholesale partners for exclusive pricing and access to our full catalogue.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/contact"><Button size="lg">Request Account</Button></Link>
              <Link href="/shop"><Button variant="outline" size="lg">Browse Catalog</Button></Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
