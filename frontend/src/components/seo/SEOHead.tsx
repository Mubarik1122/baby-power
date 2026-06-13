import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_NAME = 'Baby Power';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  image?: string;
  type?: string;
}

export function generateSEO({
  title,
  description,
  keywords = 'wholesale baby clothing, baby bodysuits, baby rompers, baby power',
  path = '',
  image = '/og-image.jpg',
  type = 'website',
}: SEOProps): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME} Wholesale`;

  return {
    title: { absolute: fullTitle },
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image.startsWith('http') ? image : `${SITE_URL}${image}`, width: 1200, height: 630 }],
      type: type as 'website',
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image.startsWith('http') ? image : `${SITE_URL}${image}`],
    },
  };
}

export function ProductSchema({ product }: { product: { name: string; description: string; sku: string; images?: string[] } }) {
  const image = product.images?.[0]
    ? (product.images[0].startsWith('http') ? product.images[0] : `${SITE_URL}${product.images[0]}`)
    : `${SITE_URL}/og-image.jpg`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: 'Baby Power' },
    image: image,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Baby Power',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Premium wholesale baby clothing manufacturer and supplier.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'info@babypower.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
