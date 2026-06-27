import Link from 'next/link';
import { Metadata } from 'next';
import { generateSEO, FAQSchema } from '@/components/seo/SEOHead';
import { getFAQs, getCategories } from '@/lib/api';
import { FAQ, Category } from '@/lib/types';
import PageBanner from '@/components/ui/PageBanner';
import CategoryScrollStrip from '@/components/home/CategoryScrollStrip';
import Button from '@/components/ui/Button';

export const metadata: Metadata = generateSEO({
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about Little Star wholesale ordering, shipping, and trade accounts.',
  path: '/faq',
});

export const revalidate = 60;

const FAQ_BANNER = '/banners/faq-hero.jpg';

export default async function FAQPage() {
  let faqs: FAQ[] = [];
  let categories: Category[] = [];

  try {
    const [faq, cat] = await Promise.all([getFAQs(), getCategories()]);
    faqs = faq.data || [];
    categories = cat.data || [];
  } catch {
    // static content only
  }

  return (
    <>
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}
      <PageBanner
        title="FAQ"
        subtitle="Everything you need to know about wholesale ordering with Little Star"
        image={FAQ_BANNER}
      />
      <CategoryScrollStrip categories={categories} title="Shop by Category" />

      <section className="py-14 lg:py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-4">
          {faqs.length === 0 ? (
            <p className="text-center text-muted">No FAQs available at the moment.</p>
          ) : (
            <div className="border border-border">
              {faqs.map((faq) => (
                <details key={faq._id} className="group border-b border-border last:border-b-0 bg-cream">
                  <summary className="px-6 py-5 cursor-pointer text-sm text-secondary hover:text-primary transition-colors list-none flex items-center justify-between gap-4 bg-surface">
                    {faq.question}
                    <span className="text-muted text-lg shrink-0 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-5 text-muted text-sm leading-relaxed">{faq.answer}</div>
                </details>
              ))}
            </div>
          )}

          <div className="mt-12 text-center bg-linen border border-border p-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-3">Still have questions?</p>
            <p className="text-muted text-sm mb-6">Our trade team typically responds within 24 hours.</p>
            <Link href="/contact"><Button>Contact Us</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
