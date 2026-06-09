import { getAllPosts } from '@/lib/blog'
import BlogGrid from './BlogGrid'

export async function generateMetadata({ params }) {
  const { locale } = await params
  const url = `https://nowear.es${locale === 'es' ? '' : '/' + locale}/blog`
  return {
    title: 'Blog NOWEAR | Guías de looks, tendencias y consejos para invitadas',
    description: 'Guías de moda para invitadas de boda, comunión, bautizo y graduación. Tendencias, dress codes, marcas y consejos para llegar perfecta a cualquier evento.',
    alternates: { canonical: url },
    openGraph: {
      title: 'Blog NOWEAR | Guías para invitadas',
      description: 'Guías de moda para invitadas de boda, comunión, bautizo y graduación.',
      url,
      siteName: 'NOWEAR',
      type: 'website',
    },
  }
}

export default async function BlogPage({ params }) {
  const { locale } = await params
  const posts = getAllPosts(locale)
  return <BlogGrid posts={posts} locale={locale} />
}
