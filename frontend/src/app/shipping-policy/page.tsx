import { Metadata } from 'next';
import { generateSEO } from '@/components/seo/SEOHead';
import { getPageBySlug } from '@/lib/api';
import PolicyPageView from '@/components/pages/PolicyPageView';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await getPageBySlug('shipping-policy');
    return generateSEO({
      title: data.seo?.metaTitle || data.title,
      description: data.seo?.metaDescription || 'Shipping policy for Baby Power wholesale customers.',
      keywords: data.seo?.keywords,
      path: '/shipping-policy',
    });
  } catch {
    return generateSEO({
      title: 'Shipping Policy',
      description: 'Shipping policy for Baby Power wholesale customers.',
      path: '/shipping-policy',
    });
  }
}

export const revalidate = 60;

export default async function ShippingPolicyPage() {
  let page = null;
  try {
    const res = await getPageBySlug('shipping-policy');
    page = res.data;
  } catch {
    // API unavailable
  }

  return (
    <PolicyPageView
      title={page?.title || 'Shipping Policy'}
      content={page?.content || null}
    />
  );
}
