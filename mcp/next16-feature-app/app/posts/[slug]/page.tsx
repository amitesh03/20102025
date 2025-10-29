import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Post = {
  slug: string
  title: string
  content: string
  ogImage?: string
  date?: string
  author?: string
}

function getAllPosts(): Post[] {
  return [
    {
      slug: 'welcome',
      title: 'Welcome to Next.js 16',
      content:
        'This is a demo post showcasing dynamic routes, generateStaticParams, and generateMetadata in the App Router.',
      ogImage: '/next.svg',
      date: '2025-10-01',
      author: 'Next Team',
    },
    {
      slug: 'features',
      title: 'Latest Features Overview',
      content:
        'Next.js 16 introduces cacheComponents, improved caching APIs (updateTag/refresh), Edge routes, Middleware geolocation, PPR, and more.',
      ogImage: '/vercel.svg',
      date: '2025-10-10',
      author: 'Roo',
    },
  ]
}

function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return notFound()
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
        {post.title}
      </h1>
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        {post.author && <span>By {post.author}</span>}
        {post.date && <span className="ml-2">• {post.date}</span>}
      </div>
      <article className="prose dark:prose-invert">
        <p>{post.content}</p>
      </article>
    </main>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    // You could also `notFound()` here, but returning minimal metadata is fine.
    return { title: 'Post Not Found' }
  }

  const title = `${post.title} | Next16 Feature App`
  return {
    title,
    openGraph: {
      title,
      images: post.ogImage ? [post.ogImage] : undefined,
    },
  }
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }))
}

// Optional: disable on-the-fly param discovery to stick to generated params
export const dynamicParams = false