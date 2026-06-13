import { Metadata } from 'next';
import { generateSEO } from '@/components/seo/SEOHead';
import { getPageBySlug } from '@/lib/api';
import PolicyPageView from '@/components/pages/PolicyPageView';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await getPageBySlug('return-policy');
    return generateSEO({
      title: data.seo?.metaTitle || data.title,
      description: data.seo?.metaDescription || 'Return and exchange policy for Baby Power wholesale customers.',
      keywords: data.seo?.keywords,
      path: '/return-policy',
    });
  } catch {
    return generateSEO({
      title: 'Return Policy',
      description: 'Return and exchange policy for Baby Power wholesale customers.',
      path: '/return-policy',
    });
  }
}

export const revalidate = 60;

export default async function ReturnPolicyPage() {
  let page = null;
  try {
    const res = await getPageBySlug('return-policy');
    page = res.data;
  } catch {
    // API unavailable
  }

  return (
    <PolicyPageView
      title={page?.title || 'Return Policy'}
      content={page?.content || null}
    />
  );
}
