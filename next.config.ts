import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Matches the root URL (http://localhost:3000)
        source: '/',
        // Redirects to your login page
        destination: '/login',
        // Set to false for a 307 temporary redirect.
        // Use true (308) only when the move is permanent for SEO.
        permanent: false,
      },
    ]
  },
  /* You can add other experimental turbo options here if needed */
}

export default nextConfig