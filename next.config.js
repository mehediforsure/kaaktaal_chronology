/** @type {import('next').NextConfig} */
const nextConfig = {
  // Preserve the @ path alias (equivalent to the old vite.config resolve.alias)
  // Next.js reads paths from tsconfig.json automatically, so no extra config needed.

  // Allow external images from the existing favicon/asset host
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react','motion']
  }
}
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer(nextConfig)