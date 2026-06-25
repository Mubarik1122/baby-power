'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ApiImage from '@/components/ui/ApiImage';
import { Category } from '@/lib/types';
import { getChildCategories, getRootCategories } from '@/lib/categories';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  categories: Category[];
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function CategoryColumn({ parent, children }: { parent: Category; children: Category[] }) {
  return (
    <div className="min-w-0 flex flex-col">
      <Link href={`/shop/${parent.slug}`} className="group block">
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-linen border border-border mb-3">
          {parent.image ? (
            <ApiImage
              src={parent.image}
              alt={parent.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1280px) 25vw, 200px"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center font-display text-3xl text-primary/30">
              {parent.name.charAt(0)}
            </span>
          )}
        </div>
        <p className="font-display text-[15px] text-secondary group-hover:text-primary transition-colors leading-snug">
          {parent.name}
        </p>
      </Link>

      {children.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {children.map((child) => (
            <li key={child._id}>
              <Link
                href={`/shop/${child.slug}`}
                className="text-[12px] text-muted hover:text-primary transition-colors"
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href={`/shop/${parent.slug}`}
        className="mt-3 text-[10px] uppercase tracking-[0.15em] text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1"
      >
        Shop collection
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

export default function CatalogMegaMenu({ open, categories, onMouseEnter, onMouseLeave }: Props) {
  const roots = getRootCategories(categories);

  return (
    <div
      className={cn(
        'hidden lg:block absolute inset-x-0 top-full z-[60] transition-all duration-200',
        open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-surface border-b border-border shadow-[0_20px_50px_-12px_rgba(44,44,44,0.2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex items-end justify-between gap-6 mb-6 pb-5 border-b border-border">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-gold mb-2">Wholesale Catalog</p>
              <h3 className="font-display text-xl text-secondary">Shop by Collection</h3>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] bg-primary text-white px-4 py-2.5 hover:bg-primary-dark transition-colors shrink-0"
            >
              All Products
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {roots.length === 0 ? (
            <p className="text-sm text-muted">Loading collections…</p>
          ) : (
            <div
              className={cn(
                'grid gap-x-6 gap-y-8',
                roots.length <= 3 && 'grid-cols-3',
                roots.length === 4 && 'grid-cols-2 lg:grid-cols-4',
                roots.length >= 5 && 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
              )}
            >
              {roots.map((parent) => (
                <CategoryColumn
                  key={parent._id}
                  parent={parent}
                  children={getChildCategories(categories, parent._id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-linen border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <p className="text-[11px] text-muted">Trade-only pricing · MOQ applies on first order</p>
            <Link
              href="/contact"
              className="text-[10px] uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors shrink-0"
            >
              Request wholesale account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
