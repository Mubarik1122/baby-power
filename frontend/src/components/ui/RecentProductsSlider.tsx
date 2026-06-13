'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Product } from '@/lib/types';
import { getImageUrl } from '@/lib/api';

interface Props {
  products: Product[];
  title?: string;
}

export default function RecentProductsSlider({ products, title = 'Recent Products' }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scroll = (dir: 'left' | 'right') => {
    trackRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <section className="py-10 lg:py-14 bg-cream border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{title}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="w-9 h-9 border border-border bg-surface flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="w-9 h-9 border border-border bg-surface flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-1 px-1"
        >
          {products.map((product) => {
            const img = product.images?.[0];
            return (
              <Link
                key={product._id}
                href={`/product/${product.slug}`}
                className="snap-start shrink-0 w-[200px] sm:w-[220px] group"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-linen border border-border mb-3">
                  {img ? (
                    <Image
                      src={getImageUrl(img)}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="220px"
                    />
                  ) : null}
                </div>
                <h3 className="font-display text-sm text-secondary group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-[10px] text-muted mt-1 uppercase tracking-wider">MOQ {product.moq}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
