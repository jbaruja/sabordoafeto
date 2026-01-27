/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  // Otimizações AGRESSIVAS de performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Reduzir bundle size
  swcMinify: true,

  // Experimental features para melhor performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', '@supabase/supabase-js', '@supabase/ssr'],
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Otimizar build
  productionBrowserSourceMaps: false,

  // Webpack optimizations AGRESSIVAS
  webpack: (config, { dev, isServer }) => {
    // Otimizar cache
    config.cache = {
      type: 'filesystem',
      compression: 'gzip',
      maxAge: 604800000, // 1 week
    }

    // Reduzir bundle splitting em dev
    if (dev) {
      config.optimization = {
        ...config.optimization,
        runtimeChunk: false,
        splitChunks: false,
        minimize: false,
      }
    }

    // Ignorar source maps em desenvolvimento
    if (dev) {
      config.devtool = false
    }

    // Resolver aliases para imports mais rápidos
    config.resolve.alias = {
      ...config.resolve.alias,
    }

    return config
  },

  // Desabilitar telemetria
  telemetry: false,

  // Otimizar dev server
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig
