'use client';

import { useState, useEffect } from 'react';
import ApiImage from '@/components/ui/ApiImage';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Banner } from '@/lib/types';

const fallbackSlides: Banner[] = [
  {
    _id: 'fallback-1',
    title: 'Wholesale Baby Clothing',
    subtitle: 'Premium collections crafted for retailers who care about quality',
    ctaText: 'Browse Catalog',
    ctaLink: '/shop',
    image: '',
    sortOrder: 0,
    isActive: true,
  },
];

interface Props {
  banners?: Banner[];
}

export default function HeroSlider({ banners = [] }: Props) {
  const slides = banners.length > 0 ? banners : fallbackSlides;
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setCurrent(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setAnimating(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setAnimating(true);
      }, 50);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];
  const hasImage = Boolean(slide.image);

  const goTo = (i: number) => {
    setAnimating(false);
    setCurrent(i);
    setTimeout(() => setAnimating(true), 50);
  };

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[16/6] max-h-[620px] grain">
        {slides.map((s, i) => (
          <div
            key={s._id}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {s.image ? (
              <>
                <ApiImage
                  src={s.image}
                  alt={s.title}
                  fill
                  priority={i === 0}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className={`object-cover object-center ${i === current ? 'animate-ken-burns' : ''}`}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/70 via-primary/30 to-transparent" />
              </>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br from-blush via-linen to-sage-light sparkle-bg ${i === current ? 'animate-ken-burns' : ''}`} />
            )}
          </div>
        ))}

        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className={`max-w-2xl ${animating ? 'animate-slide-up' : 'opacity-0'}`}>
              <p className={`text-[10px] uppercase tracking-[0.35em] mb-4 ${hasImage ? 'text-white/80' : 'text-gold'}`}>
                Trade Only · Est. 2010
              </p>
              <h2 className={`font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-wide ${hasImage ? 'text-white' : 'text-secondary'}`}>
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className={`mt-5 text-sm sm:text-base leading-relaxed max-w-md font-light ${hasImage ? 'text-white/85' : 'text-muted'}`}>
                  {slide.subtitle}
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={slide.ctaLink || '/shop'}>
                  <Button size="lg">{slide.ctaText || 'Shop Now'}</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className={hasImage ? 'border-white/60 text-white hover:bg-white/10' : ''}>
                    Our Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <div className={`absolute bottom-6 right-6 lg:bottom-8 lg:right-8 z-30 font-display text-sm ${hasImage ? 'text-white/60' : 'text-secondary/40'}`}>
            <span className={hasImage ? 'text-white' : 'text-secondary'}>{String(current + 1).padStart(2, '0')}</span>
            <span className="mx-1">/</span>
            <span>{String(slides.length).padStart(2, '0')}</span>
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-3 py-4 bg-surface border-b border-border">
          {slides.map((s, i) => (
            <button
              key={s._id}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`transition-all duration-500 ${
                i === current
                  ? 'w-10 h-1 bg-primary'
                  : 'w-4 h-1 bg-border hover:bg-gold'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
