/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.football-data.org'],
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', 'date-fns'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    }
  ],
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /[\\/]node_modules[\\/](@react|react|next|@next)[\\/]/,
            priority: 40,
            enforce: true
          },
          lib: {
            test(module) {
              return (
                module.size() > 160000 &&
                /node_modules[\\/]/.test(module.identifier())
              )
            },
            name(module) {
              const hash = crypto.createHash('sha1')
              hash.update(module.identifier())
              return hash.digest('hex').substring(0, 8)
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true
          }
        }
      }
    }
    return config
  }
}

module.exports = nextConfig