import ApiImage from '@/components/ui/ApiImage';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  image?: string;
}

export default function PageBanner({ title, subtitle, image }: PageBannerProps) {
  const hasImage = Boolean(image);

  return (
    <section className="relative border-b border-border py-16 lg:py-24 overflow-hidden grain min-h-[220px] lg:min-h-[280px] flex items-center">
      {hasImage ? (
        <>
          <ApiImage
            src={image!}
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/50 via-secondary/25 to-transparent" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-linen" />
          <div className="absolute inset-0 sparkle-bg" />
        </>
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <p className={`text-[10px] uppercase tracking-[0.35em] mb-4 ${hasImage ? 'text-gold' : 'text-gold'}`}>
          Baby Power Wholesale
        </p>
        <h1 className={`font-display text-4xl lg:text-5xl xl:text-6xl tracking-wide leading-tight ${hasImage ? 'text-white' : 'text-secondary'}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`mt-5 text-sm max-w-xl mx-auto leading-relaxed font-light ${hasImage ? 'text-white/85' : 'text-muted'}`}>
            {subtitle}
          </p>
        )}
        <div className="ornament-divider max-w-[200px] mx-auto mt-8">
          <span className="text-gold text-xs">✦</span>
        </div>
      </div>
    </section>
  );
}
