import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.js')

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

export default withNextIntl(nextConfig)