import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', pathname: '/uploads/**' },
      { protocol: 'https', hostname: '**' },
      { protocol: 'https', hostname: 'baby-power-api.onrender.com', pathname: '/uploads/**' },
    ],
  },
};

export default nextConfig;
