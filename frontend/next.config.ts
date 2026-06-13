import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', pathname: '/uploads/**' },
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
