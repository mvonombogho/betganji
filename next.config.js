/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.football-data.org', 'media.api-sports.io'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.football-data.org',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '**.api-sports.io',
        pathname: '/media/**',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@headlessui/react', '@heroicons/react', 'date-fns'],
  },
  compress: true,
}

module.exports = nextConfig