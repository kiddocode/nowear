import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin('./i18n/request.js')

const nextConfig = {
  trailingSlash: false,
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