import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['es', 'fr', 'en', 'pt', 'de', 'nl', 'it'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
  localeDetection: false
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
