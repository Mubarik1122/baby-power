import { Metadata } from 'next';
import { Suspense } from 'react';
import { generateSEO } from '@/components/seo/SEOHead';
import ShopContent from './ShopContent';

export const metadata: Metadata = generateSEO({
  title: 'Shop Wholesale Baby Clothing',
  description: 'Browse our complete range of wholesale baby clothing. Bodysuits, rompers, sleepsuits, sets and more.',
  path: '/shop',
});

export const revalidate = 60;

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 animate-pulse"><div className="h-8 bg-gray-200 rounded w-48 mb-8" /><div className="grid grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 bg-gray-200 rounded-2xl" />)}</div></div>}>
      <ShopContent />
    </Suspense>
  );
}
