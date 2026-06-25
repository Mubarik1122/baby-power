'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Category } from '@/lib/types';
import { getChildCategories, getRootCategories } from '@/lib/categories';

interface Props {
  categories: Category[];
  onNavigate: () => void;
}

export default function MobileCatalogMenu({ categories, onNavigate }: Props) {
  const roots = getRootCategories(categories);

  return (
    <div className="border-b border-border pb-3 mb-1">
      <p className="pt-2 pb-2 text-[9px] uppercase tracking-[0.25em] text-gold">Catalog</p>
      <Link
        href="/shop"
        className="block py-2.5 pl-3 text-sm font-medium text-secondary hover:text-primary"
        onClick={onNavigate}
      >
        All Products
      </Link>

      {roots.map((parent) => {
        const children = getChildCategories(categories, parent._id);

        if (children.length === 0) {
          return (
            <Link
              key={parent._id}
              href={`/shop/${parent.slug}`}
              className="block py-2.5 pl-3 text-sm text-secondary hover:text-primary"
              onClick={onNavigate}
            >
              {parent.name}
            </Link>
          );
        }

        return (
          <details key={parent._id} className="group border-t border-border/60">
            <summary className="flex items-center justify-between gap-2 py-2.5 pl-3 pr-2 text-sm text-secondary cursor-pointer list-none hover:text-primary transition-colors">
              <span className="font-medium">{parent.name}</span>
              <ChevronDown className="w-4 h-4 text-muted group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="pb-2">
              <Link
                href={`/shop/${parent.slug}`}
                className="block py-2 pl-6 text-xs uppercase tracking-wider text-primary"
                onClick={onNavigate}
              >
                View all {parent.name}
              </Link>
              {children.map((child) => (
                <Link
                  key={child._id}
                  href={`/shop/${child.slug}`}
                  className="block py-2 pl-8 text-sm text-muted hover:text-primary"
                  onClick={onNavigate}
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}
