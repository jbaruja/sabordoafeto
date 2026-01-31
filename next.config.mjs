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

  // Turbopack config (Next.js 16+)
  turbopack: {},

  // Otimizar dev server
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig
