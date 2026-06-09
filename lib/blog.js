import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const blogDir = path.join(process.cwd(), 'content/blog')

export function getPostSlugs(locale = 'es') {
  const dir = path.join(blogDir, locale)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''))
}

export function getPostBySlug(slug, locale = 'es') {
  const dir = path.join(blogDir, locale)
  const esDir = path.join(blogDir, 'es')
  let filePath = path.join(dir, `${slug}.md`)
  if (!fs.existsSync(filePath)) filePath = path.join(esDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  return { slug, ...data, content }
}

export async function getPostHtml(slug, locale = 'es') {
  const post = getPostBySlug(slug, locale)
  if (!post) return null
  const processed = await remark().use(html).process(post.content)
  return { ...post, contentHtml: processed.toString() }
}

export function getAllPosts(locale = 'es') {
  const slugs = getPostSlugs(locale)
  if (slugs.length === 0) {
    const esSlugs = getPostSlugs('es')
    return esSlugs.map(slug => getPostBySlug(slug, 'es')).filter(Boolean).sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  }
  return slugs.map(slug => getPostBySlug(slug, locale)).filter(Boolean).sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
}
