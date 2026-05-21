/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/demo',
        destination: '/demo/organizadora',
        permanent: false,
      },
    ]
  },
}

export default nextConfig