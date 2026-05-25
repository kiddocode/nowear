import {getRequestConfig} from 'next-intl/server'
import path from 'path'

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale || 'es'
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
