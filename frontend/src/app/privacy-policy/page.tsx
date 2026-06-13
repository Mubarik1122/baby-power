import { Metadata } from 'next';
import { generateSEO } from '@/components/seo/SEOHead';
import { getPageBySlug } from '@/lib/api';
import PolicyPageView from '@/components/pages/PolicyPageView';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await getPageBySlug('privacy-policy');
    return generateSEO({
      title: data.seo?.metaTitle || data.title,
      description: data.seo?.metaDescription || 'Privacy policy for Baby Power wholesale customers.',
      keywords: data.seo?.keywords,
      path: '/privacy-policy',
    });
  } catch {
    return generateSEO({
      title: 'Privacy Policy',
      description: 'Privacy policy for Baby Power wholesale customers.',
      path: '/privacy-policy',
    });
  }
}

export const revalidate = 60;

export default async function PrivacyPolicyPage() {
  let page = null;
  try {
    const res = await getPageBySlug('privacy-policy');
    page = res.data;
  } catch {
    // API unavailable
  }

  return (
    <PolicyPageView
      title={page?.title || 'Privacy Policy'}
      content={page?.content || null}
    />
  );
}
