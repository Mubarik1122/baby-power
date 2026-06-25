import Image, { ImageProps } from 'next/image';
import { getImageUrl } from '@/lib/api';

function resolveImageUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads/')) return getImageUrl(path);
  if (path.startsWith('/')) return path;
  return getImageUrl(path);
}

function shouldSkipOptimization(path: string, url: string) {
  if (path.startsWith('/uploads/')) return true;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(url);
}

type ApiImageProps = Omit<ImageProps, 'src'> & {
  /** DB path (`/uploads/...`) or full CDN URL */
  src: string;
};

export default function ApiImage({ src, alt, ...props }: ApiImageProps) {
  const url = resolveImageUrl(src);

  if (!url) return null;

  return (
    <Image
      src={url}
      alt={alt}
      unoptimized={shouldSkipOptimization(src, url)}
      {...props}
    />
  );
}
