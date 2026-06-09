import { getAllPosts } from '@/lib/blog'
import BlogGrid from './BlogGrid'

export default async function BlogPage({ params }) {
  const { locale } = await params
  const posts = getAllPosts(locale)
  return <BlogGrid posts={posts} locale={locale} />
}
