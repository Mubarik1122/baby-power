import { Metadata } from 'next';
import { Suspense } from 'react';
import { generateSEO } from '@/components/seo/SEOHead';
import { getCategoryBySlug } from '@/lib/api';
import ShopContent from '../ShopContent';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await getCategoryBySlug(slug);
    return generateSEO({
      title: data.seo?.metaTitle || `${data.name} Wholesale`,
      description: data.seo?.metaDescription || data.description,
      keywords: data.seo?.keywords,
      path: `/shop/${slug}`,
    });
  } catch {
    return generateSEO({ title: 'Shop', description: 'Browse wholesale baby clothing', path: `/shop/${slug}` });
  }
}

export default async function CategoryShopPage({ params }: Props) {
  const { slug } = await params;
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 animate-pulse"><div className="h-8 bg-gray-200 rounded w-48 mb-8" /></div>}>
      <ShopContent categorySlug={slug} />
    </Suspense>
  );
}
