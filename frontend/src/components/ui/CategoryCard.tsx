import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/types';
import { getImageUrl } from '@/lib/api';

interface CategoryCardProps {
  category: Category;
  variant?: 'overlay' | 'stacked';
  large?: boolean;
}

const placeholderGradients = [
  'from-blush to-blush-dark',
  'from-sage-light to-blush',
  'from-[#FFF0E0] to-blush',
  'from-sage-light to-[#E8F4FF]',
  'from-blush to-sage-light',
  'from-[#FFF8E8] to-blush',
];

export default function CategoryCard({ category, variant = 'stacked', large = false }: CategoryCardProps) {
  const imageUrl = category.image ? getImageUrl(category.image) : '';
  const gradient = placeholderGradients[category.name.length % placeholderGradients.length];

  if (variant === 'overlay') {
    return (
      <Link
        href={`/shop/${category.slug}`}
        className="group relative block aspect-[4/5] overflow-hidden"
      >
        {imageUrl ? (
          <Image src={imageUrl} alt={category.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" sizes="33vw" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/65 via-primary/10 to-transparent group-hover:from-primary/50 transition-all duration-500" />
        <div className="absolute inset-0 flex items-end justify-center pb-10">
          <h3 className="font-display text-2xl lg:text-3xl text-white text-center px-4 tracking-wide group-hover:tracking-wider transition-all duration-500">
            {category.name}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/shop/${category.slug}`} className="group block text-center">
      <div className={`relative overflow-hidden bg-linen mb-5 ${large ? 'aspect-[3/4]' : 'aspect-square'}`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center grain`}>
            <span className="font-display text-5xl text-secondary/15 group-hover:text-secondary/25 transition-colors duration-500">
              {category.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
      <h3 className="font-display text-lg lg:text-xl text-secondary group-hover:text-primary transition-colors duration-300 tracking-wide">
        {category.name}
      </h3>
      <span className="inline-block mt-2 text-[10px] uppercase tracking-[0.2em] text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Shop Now →
      </span>
    </Link>
  );
}
