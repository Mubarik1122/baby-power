import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/types';
import { getImageUrl } from '@/lib/api';

interface Props {
  categories: Category[];
  title?: string;
}

export default function CategoryScrollStrip({ categories, title = 'Shop by Category' }: Props) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-surface border-b border-border py-5 lg:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-4">{title}</p>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-1 px-1">
          <Link
            href="/shop"
            className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs uppercase tracking-widest hover:bg-primary-dark transition-colors"
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/shop/${cat.slug}`}
              className="snap-start shrink-0 flex items-center gap-3 px-3 py-2 border border-border bg-cream hover:border-primary hover:bg-sage-light/40 transition-all group min-w-[160px]"
            >
              <div className="relative w-10 h-10 shrink-0 overflow-hidden bg-linen">
                {cat.image ? (
                  <Image src={getImageUrl(cat.image)} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="40px" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center font-display text-primary text-lg">{cat.name.charAt(0)}</span>
                )}
              </div>
              <span className="text-xs text-secondary group-hover:text-primary transition-colors whitespace-nowrap">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
