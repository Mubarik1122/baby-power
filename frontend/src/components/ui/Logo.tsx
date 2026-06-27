import Image from 'next/image';
import { BRAND_NAME } from '@/lib/brand';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  href?: string | null;
  priority?: boolean;
}

const sizes = {
  sm: { width: 120, height: 120, img: 'h-12 w-auto' },
  md: { width: 150, height: 150, img: 'h-14 lg:h-16 w-auto' },
  lg: { width: 180, height: 180, img: 'h-16 lg:h-[6.5rem] w-auto' },
};

export default function Logo({ className, size = 'md', href = '/', priority }: LogoProps) {
  const s = sizes[size];
  const image = (
    <Image
      src="/logo.png"
      alt={`${BRAND_NAME} — Wholesale Baby Clothing`}
      width={s.width}
      height={s.height}
      className={cn(s.img, 'object-contain', className)}
      priority={priority ?? size === 'lg'}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {image}
      </Link>
    );
  }

  return image;
}
