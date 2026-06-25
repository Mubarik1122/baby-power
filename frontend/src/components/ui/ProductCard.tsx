import Link from 'next/link';
import { Package } from 'lucide-react';
import ApiImage from '@/components/ui/ApiImage';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const imagePath = product.images?.[0] || '';

  return (
    <div
      className="group text-center"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link href={`/product/${product.slug}`} className="block relative">
        <div className="relative aspect-[4/5] bg-linen overflow-hidden mb-5">
          {imagePath ? (
            <ApiImage
              src={imagePath}
              alt={product.name}
              fill
              className="object-cover product-card-image"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blush via-linen to-sage-light">
              <Package className="w-10 h-10 text-primary/30" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="product-card-overlay absolute inset-0 bg-primary/25 flex items-center justify-center">
            <span className="bg-surface text-secondary text-[10px] uppercase tracking-[0.2em] px-5 py-2.5 shadow-lg">
              View Product
            </span>
          </div>

          {product.isFeatured && (
            <span className="absolute top-0 left-0 bg-primary text-white text-[9px] uppercase tracking-[0.2em] px-3 py-1.5">
              Featured
            </span>
          )}
        </div>
      </Link>

      <Link href={`/product/${product.slug}`}>
        <h3 className="font-display text-base lg:text-lg text-secondary leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2 px-2">
          {product.name}
        </h3>
      </Link>

      <p className="mt-2.5 text-[11px] text-muted italic tracking-wide">
        Request a quotation for pricing
      </p>

      <p className="mt-1 text-[10px] text-muted/60 uppercase tracking-widest">
        MOQ {product.moq}
      </p>
    </div>
  );
}
