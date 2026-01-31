import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 1. Add this to allow large image payloads (Base64)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  reactStrictMode: false,
  // distDir: 'build', // Custom build directory
    output: 'export',
 trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
      ignoreBuildErrors: true, 
    },
    images: { unoptimized: true },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ]
  },
}

export default nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
//   // distDir: 'build', // Custom build directory
//     output: 'export',
//  trailingSlash: true,
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//       ignoreBuildErrors: true, 
//     },
//     images: { unoptimized: true }, 
// };

// module.exports = nextConfig;