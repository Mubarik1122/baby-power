import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${SITE_URL}/shop`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${SITE_URL}/return-policy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/shipping-policy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${API_URL}/products?limit=1000`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } }),
    ]);

    const products = await productsRes.json();
    const categories = await categoriesRes.json();

    if (products.data) {
      dynamicPages = dynamicPages.concat(
        products.data.map((p: { slug: string; updatedAt?: string }) => ({
          url: `${SITE_URL}/product/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }))
      );
    }

    if (categories.data) {
      dynamicPages = dynamicPages.concat(
        categories.data.map((c: { slug: string }) => ({
          url: `${SITE_URL}/shop/${c.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }))
      );
    }
  } catch {
    // API unavailable during build
  }

  return [...staticPages, ...dynamicPages];
}
