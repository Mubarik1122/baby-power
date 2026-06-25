import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  href?: string | null;
  priority?: boolean;
}

const sizes = {
  sm: { width: 120, height: 71, img: 'h-10 w-auto' },
  md: { width: 150, height: 88, img: 'h-11 lg:h-12 w-auto' },
  lg: { width: 180, height: 106, img: 'h-12 lg:h-14 w-auto' },
};

export default function Logo({ className, size = 'md', href = '/', priority }: LogoProps) {
  const s = sizes[size];
  const image = (
    <Image
      src="/logo.png"
      alt="Baby Power — Clothes and Accessories"
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
