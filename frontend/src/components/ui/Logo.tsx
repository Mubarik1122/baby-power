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
  sm: { width: 130, height: 76, img: 'h-9 w-auto' },
  md: { width: 165, height: 97, img: 'h-11 lg:h-12 w-auto' },
  lg: { width: 210, height: 124, img: 'h-14 lg:h-[4.25rem] w-auto' },
};

export default function Logo({ className, size = 'md', href = '/', priority }: LogoProps) {
  const s = sizes[size];
  const image = (
    <Image
      src="/logo.png"
      alt="Baby Power — Wholesale Clothing"
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
