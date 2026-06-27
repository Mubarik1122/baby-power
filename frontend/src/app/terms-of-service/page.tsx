import { Metadata } from 'next';
import { generateSEO } from '@/components/seo/SEOHead';
import { getPageBySlug } from '@/lib/api';
import PolicyPageView from '@/components/pages/PolicyPageView';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await getPageBySlug('terms-of-service');
    return generateSEO({
      title: data.seo?.metaTitle || data.title,
      description: data.seo?.metaDescription || 'Terms of service for Little Star wholesale customers.',
      keywords: data.seo?.keywords,
      path: '/terms-of-service',
    });
  } catch {
    return generateSEO({
      title: 'Terms of Service',
      description: 'Terms of service for Little Star wholesale customers.',
      path: '/terms-of-service',
    });
  }
}

export const revalidate = 60;

export default async function TermsPage() {
  let page = null;
  try {
    const res = await getPageBySlug('terms-of-service');
    page = res.data;
  } catch {
    // API unavailable
  }

  return (
    <PolicyPageView
      title={page?.title || 'Terms of Service'}
      content={page?.content || null}
    />
  );
}
