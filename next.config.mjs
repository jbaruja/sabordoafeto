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

  // Otimizações de performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Experimental features para melhor performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', '@supabase/supabase-js', '@supabase/ssr'],
  },

  // Otimizar build
  productionBrowserSourceMaps: false,

  // Webpack optimizations
  webpack: (config, { dev }) => {
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

    return config
  },

  // Otimizar dev server
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig
