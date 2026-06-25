import Link from 'next/link';
import ApiImage from '@/components/ui/ApiImage';
import { Banner } from '@/lib/types';
import Button from '@/components/ui/Button';

interface Props {
  banners: Banner[];
}

export default function PromoBannerMosaic({ banners }: Props) {
  if (banners.length === 0) return null;

  const tiles = banners.slice(0, 3);

  return (
    <section className="py-8 lg:py-10 bg-cream border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-4 ${tiles.length === 1 ? 'grid-cols-1' : tiles.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-12'}`}>
          {tiles.map((banner, i) => (
            <Link
              key={banner._id}
              href={banner.ctaLink || '/shop'}
              className={`group relative overflow-hidden min-h-[200px] lg:min-h-[260px] ${
                tiles.length === 3 && i === 0 ? 'md:col-span-7' : tiles.length === 3 ? 'md:col-span-5' : ''
              }`}
            >
              {banner.image ? (
                <ApiImage
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blush via-sage-light to-linen" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/75 via-primary/20 to-transparent" />
              <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold mb-2">New Collection</p>
                <h3 className="font-display text-2xl lg:text-3xl text-white tracking-wide">{banner.title}</h3>
                {banner.subtitle && (
                  <p className="mt-2 text-white/80 text-sm line-clamp-2 max-w-sm">{banner.subtitle}</p>
                )}
                <span className="mt-4 inline-flex">
                  <Button size="sm" className="pointer-events-none">{banner.ctaText || 'Shop Now'}</Button>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
