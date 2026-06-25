import ApiImage from '@/components/ui/ApiImage';
import Link from 'next/link';

interface Props {
  images: string[];
  title?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export default function ImageMoodBoard({
  images,
  title = 'From Our Catalogue',
  ctaHref = '/shop',
  ctaLabel = 'Explore All Styles',
}: Props) {
  const tiles = images.filter(Boolean).slice(0, 8);
  if (tiles.length < 4) return null;

  const layout = [
    'col-span-2 row-span-2',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-2',
    'col-span-1 row-span-1',
    'col-span-2 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
  ];

  return (
    <section className="py-14 lg:py-20 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 sparkle-bg opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-2">Visual Edit</p>
            <h2 className="font-display text-3xl lg:text-4xl text-white tracking-wide">{title}</h2>
          </div>
          <Link
            href={ctaHref}
            className="text-[10px] uppercase tracking-[0.25em] text-white/80 border-b border-white/40 hover:text-gold hover:border-gold transition-colors pb-0.5"
          >
            {ctaLabel} →
          </Link>
        </div>
        <div className="grid grid-cols-4 auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px] gap-2 lg:gap-3">
          {tiles.map((img, i) => (
            <div key={i} className={`relative overflow-hidden group ${layout[i] || 'col-span-1 row-span-1'}`}>
              <ApiImage
                src={img}
                alt=""
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
