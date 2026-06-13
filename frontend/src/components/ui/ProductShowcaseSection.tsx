import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ui/ProductCard';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

interface Props {
  products: Product[];
  label: string;
  title: string;
  subtitle?: string;
  columns?: 3 | 4;
  showCta?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
  dense?: boolean;
  className?: string;
}

export default function ProductShowcaseSection({
  products,
  label,
  title,
  subtitle,
  columns = 4,
  showCta = true,
  ctaHref = '/shop',
  ctaLabel = 'View All Products',
  dense = false,
  className = 'bg-surface',
}: Props) {
  if (products.length === 0) return null;

  const colClass = columns === 3
    ? 'grid-cols-2 md:grid-cols-3'
    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  const gapClass = dense ? 'gap-x-3 gap-y-8 lg:gap-x-5 lg:gap-y-10' : 'gap-x-5 gap-y-12 lg:gap-x-8 lg:gap-y-14';

  return (
    <section className={`py-14 lg:py-20 relative grain border-t border-border ${className}`}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionTitle label={label} title={title} subtitle={subtitle} />
        </Reveal>
        <div className={`grid ${colClass} ${gapClass}`}>
          {products.map((product, i) => (
            <Reveal key={product._id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <ProductCard product={product} index={i} />
            </Reveal>
          ))}
        </div>
        {showCta && (
          <Reveal>
            <div className="text-center mt-10">
              <Link href={ctaHref}><Button variant="outline">{ctaLabel}</Button></Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
