# SEO Optimization Exercises

These exercises will help you practice search engine optimization techniques in Next.js applications. SEO is crucial for improving your website's visibility and ranking in search engine results.

## Exercise 1: Basic SEO Metadata

Implement comprehensive SEO metadata for a blog website.

### Requirements

1. Create a Next.js blog with the following pages:
   - Home page (list of blog posts)
   - Blog post detail pages
   - About page
   - Contact page

2. Implement SEO metadata for each page:
   - Dynamic page titles
   - Meta descriptions
   - Open Graph tags for social sharing
   - Twitter Card tags
   - Canonical URLs
   - Structured data (JSON-LD)

3. Use the Next.js App Router's metadata API

### Hints

- Use the `metadata` object in page components
- Create reusable metadata functions
- Use the `generateMetadata` function for dynamic metadata
- Implement structured data for articles and organization

<details>
<summary>View Solution</summary>

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] }

export const metadata = {
  title: {
    default: 'My Blog',
    template: '%s | My Blog'
  },
  description: 'A blog about web development, technology, and more',
  keywords: ['blog', 'web development', 'technology', 'programming'],
  authors: [{ name: 'John Doe' }],
  creator: 'John Doe',
  publisher: 'John Doe',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://myblog.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://myblog.com',
    title: 'My Blog',
    description: 'A blog about web development, technology, and more',
    siteName: 'My Blog',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'My Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Blog',
    description: 'A blog about web development, technology, and more',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

```tsx
// lib/posts.ts
import fs from 'fs'
import path from 'path'

export interface Post {
  id: string
  title: string
  description: string
  content: string
  author: string
  date: string
  tags: string[]
  image?: string
}

const postsDirectory = path.join(process.cwd(), 'content/posts')

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    
    // In a real app, you would parse markdown frontmatter here
    // For simplicity, we'll just return mock data
    return {
      id,
      title: `Post ${id}`,
      description: `Description for post ${id}`,
      content: fileContents,
      author: 'John Doe',
      date: new Date().toISOString(),
      tags: ['web-development', 'technology'],
      image: `/posts/${id}.jpg`
    }
  })
  
  return allPostsData.sort((a, b) => a.date < b.date ? 1 : -1)
}

export function getPostById(id: string): Post | null {
  const posts = getAllPosts()
  return posts.find(post => post.id === id) || null
}

export function getPostSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map(name => name.replace(/\.md$/, ''))
}
```

```tsx
// app/page.tsx
import { getAllPosts } from '../lib/posts'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Latest Posts</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        {posts.map(post => (
          <div key={post.id} className="border rounded-lg overflow-hidden shadow-md">
            {post.image && (
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                <Link href={`/posts/${post.id}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 mb-4">{post.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{post.author}</span>
                <time dateTime={post.date} className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </time>
              </div>
              
              <div className="mt-4">
                {post.tags.map(tag => (
                  <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Home',
  description: 'Welcome to my blog. Read the latest articles about web development, technology, and more.',
  openGraph: {
    title: 'Home - My Blog',
    description: 'Welcome to my blog. Read the latest articles about web development, technology, and more.',
    type: 'website',
  },
}
```

```tsx
// app/posts/[id]/page.tsx
import { getPostById, getAllPosts } from '../../../lib/posts'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface PostPageProps {
  params: { id: string }
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostById(params.id)
  
  if (!post) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image ? `https://myblog.com${post.image}` : undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'My Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://myblog.com/logo.jpg',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to all posts
          </Link>
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-medium">{post.author}</p>
                <time dateTime={post.date} className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </time>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {post.image && (
          <div className="relative h-64 md:h-96 mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </>
  )
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = getPostById(params.id)
  
  if (!post) {
    return {
      title: 'Post not found',
    }
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author],
      images: post.image ? [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : [],
    },
    alternates: {
      canonical: `/posts/${params.id}`,
    },
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({
    id: post.id,
  }))
}
```

```tsx
// app/about/page.tsx
import Link from 'next/link'

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'John Doe',
    jobTitle: 'Web Developer',
    url: 'https://myblog.com/about',
    sameAs: [
      'https://twitter.com/johndoe',
      'https://github.com/johndoe',
      'https://linkedin.com/in/johndoe',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">About Me</h1>
        
        <div className="prose max-w-none">
          <p>
            Hi, I'm John Doe, a passionate web developer with a love for creating
            beautiful and functional web applications. I specialize in modern web
            technologies including React, Next.js, and Node.js.
          </p>
          
          <p>
            This blog is where I share my thoughts, experiences, and tutorials
            about web development. I cover topics ranging from beginner-friendly
            guides to advanced techniques.
          </p>
          
          <h2>My Skills</h2>
          <ul>
            <li>JavaScript/TypeScript</li>
            <li>React & Next.js</li>
            <li>Node.js & Express</li>
            <li>HTML & CSS</li>
            <li>Database Design</li>
            <li>UI/UX Design</li>
          </ul>
          
          <h2>Connect With Me</h2>
          <p>
            Feel free to reach out if you have any questions or just want to chat
            about web development!
          </p>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: 'About',
  description: 'Learn more about John Doe, a passionate web developer and blogger.',
  openGraph: {
    title: 'About - My Blog',
    description: 'Learn more about John Doe, a passionate web developer and blogger.',
    type: 'profile',
  },
  alternates: {
    canonical: '/about',
  },
}
```

```tsx
// app/contact/page.tsx
import Link from 'next/link'

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact',
    description: 'Contact John Doe for inquiries, collaborations, or just to say hello.',
    url: 'https://myblog.com/contact',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Contact Me</h1>
        
        <div className="prose max-w-none">
          <p>
            I'd love to hear from you! Whether you have a question, feedback,
            or just want to say hello, feel free to reach out using any of the
            methods below.
          </p>
          
          <h2>Email</h2>
          <p>
            You can email me at: <a href="mailto:john@example.com">john@example.com</a>
          </p>
          
          <h2>Social Media</h2>
          <ul>
            <li><a href="https://twitter.com/johndoe">Twitter</a></li>
            <li><a href="https://github.com/johndoe">GitHub</a></li>
            <li><a href="https://linkedin.com/in/johndoe">LinkedIn</a></li>
          </ul>
          
          <h2>Contact Form</h2>
          <form className="mt-8 max-w-lg">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: 'Contact',
  description: 'Contact John Doe for inquiries, collaborations, or just to say hello.',
  openGraph: {
    title: 'Contact - My Blog',
    description: 'Contact John Doe for inquiries, collaborations, or just to say hello.',
    type: 'website',
  },
  alternates: {
    canonical: '/contact',
  },
}
```

</details>

## Exercise 2: Sitemap and Robots.txt

Implement a dynamic sitemap and robots.txt for better search engine crawling.

### Requirements

1. Create a dynamic sitemap that includes:
   - All static pages (home, about, contact)
   - All blog posts
   - Proper lastmod dates
   - Change frequencies
   - Priority values

2. Create a robots.txt file that:
   - Allows crawling of important pages
   - Disallows crawling of admin or private areas
   - Includes a reference to the sitemap

3. Ensure both are accessible at the standard URLs:
   - `/sitemap.xml`
   - `/robots.txt`

### Hints

- Use Next.js API routes to generate the sitemap dynamically
- Use the app router's special file naming conventions for robots.txt
- Include all relevant URLs in the sitemap
- Set appropriate change frequencies and priorities

<details>
<summary>View Solution</summary>

```tsx
// app/sitemap.ts
import { getAllPosts } from '../lib/posts'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const baseUrl = 'https://myblog.com'
  
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]
  
  const postPages = posts.map(post => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  return [...staticPages, ...postPages]
}
```

```tsx
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/'],
      },
    ],
    sitemap: 'https://myblog.com/sitemap.xml',
  }
}
```

```tsx
// app/rss.xml/route.ts
import { getAllPosts } from '../../lib/posts'
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = getAllPosts()
  const baseUrl = 'https://myblog.com'
  
  const rssItems = posts.map(post => `
    <item>
      <title>${post.title}</title>
      <description>${post.description}</description>
      <link>${baseUrl}/posts/${post.id}</link>
      <guid>${baseUrl}/posts/${post.id}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>
  `).join('')
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>My Blog</title>
        <description>A blog about web development, technology, and more</description>
        <link>${baseUrl}</link>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${rssItems}
      </channel>
    </rss>
  `
  
  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
```

</details>

## Exercise 3: Performance and Core Web Vitals

Optimize your website for performance and Core Web Vitals.

### Requirements

1. Implement the following performance optimizations:
   - Image optimization with Next.js Image component
   - Lazy loading for images and components
   - Code splitting for better initial load time
   - Font optimization
   - Critical CSS inlining
   - Resource hints (preconnect, prefetch, preload)

2. Improve Core Web Vitals:
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

3. Add performance monitoring and reporting

### Hints

- Use the Next.js Image component for all images
- Implement dynamic imports for code splitting
- Use the `next/font` module for font optimization
- Use the `next/head` component for resource hints
- Add proper dimensions to images to prevent layout shift

<details>
<summary>View Solution</summary>

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: {
    default: 'My Blog',
    template: '%s | My Blog'
  },
  description: 'A blog about web development, technology, and more',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  other: {
    'theme-color': '#000000',
    'msapplication-TileColor': '#000000',
  },
  preconnect: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//analytics.example.com" />
      </head>
      <body className={inter.className}>
        {children}
        
        {/* Performance monitoring script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful');
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
```

```tsx
// app/components/OptimizedImage.tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cn('overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn(
          'duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
        )}
        onLoadingComplete={() => setIsLoading(false)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
```

```tsx
// app/components/LazyComponent.tsx
'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
)

export default function LazyComponent() {
  return (
    <Suspense fallback={<div>Loading component...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

```tsx
// app/components/HeavyComponent.tsx
'use client'

import { useEffect, useState } from 'react'

export default function HeavyComponent() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate heavy data fetching
    const timer = setTimeout(() => {
      setData(Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`))
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <div>Loading heavy component...</div>
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Heavy Component</h2>
      <p>This component was loaded on demand</p>
      <div className="mt-4 max-h-64 overflow-y-auto">
        {data.map((item, index) => (
          <div key={index} className="p-2 border-b">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
```

```tsx
// public/sw.js
const CACHE_NAME = 'my-blog-cache-v1';
const urlsToCache = [
  '/',
  '/about',
  '/contact',
  '/static/css/main.css',
  '/static/js/main.js',
  '/images/logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Check if valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
```

```tsx
// app/posts/[id]/page.tsx
import { getPostById, getAllPosts } from '../../../lib/posts'
import { notFound } from 'next/navigation'
import OptimizedImage from '../../../app/components/OptimizedImage'
import LazyComponent from '../../../app/components/LazyComponent'

interface PostPageProps {
  params: { id: string }
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostById(params.id)
  
  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      
      {post.image && (
        <div className="mb-8">
          <OptimizedImage
            src={post.image}
            alt={post.title}
            width={1200}
            height={630}
            priority={true}
            className="w-full rounded-lg"
          />
        </div>
      )}
      
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      
      {/* Lazy load related content */}
      <div className="mt-12">
        <LazyComponent />
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = getPostById(params.id)
  
  if (!post) {
    return {
      title: 'Post not found',
    }
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.image ? [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({
    id: post.id,
  }))
}
```

</details>

## Exercise 4: Structured Data and Rich Snippets

Implement structured data to enable rich snippets in search results.

### Requirements

1. Add structured data for:
   - Blog articles (Article schema)
   - Author information (Person schema)
   - Organization information (Organization schema)
   - Breadcrumb navigation (BreadcrumbList schema)
   - Website search functionality (WebSite schema)

2. Test your structured data with Google's Rich Results Test

3. Implement the following rich snippet types:
   - Article breadcrumbs
   - Author bylines
   - Publication dates
   - Search box for sitelinks

### Hints

- Use JSON-LD format for structured data
- Create reusable structured data components
- Test with Google's Rich Results Test tool
- Include all required properties for each schema type

<details>
<summary>View Solution</summary>

```tsx
// app/components/StructuredData.tsx
interface StructuredDataProps {
  data: object
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

```tsx
// app/components/BreadcrumbStructuredData.tsx
import StructuredData from './StructuredData'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[]
}

export default function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <StructuredData data={structuredData} />
}
```

```tsx
// app/components/ArticleStructuredData.tsx
import StructuredData from './StructuredData'

interface ArticleStructuredDataProps {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified?: string
  image?: string
  url: string
}

export default function ArticleStructuredData({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url,
}: ArticleStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: image ? [image] : undefined,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'My Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://myblog.com/logo.jpg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return <StructuredData data={structuredData} />
}
```

```tsx
// app/components/WebsiteStructuredData.tsx
import StructuredData from './StructuredData'

export default function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'My Blog',
    url: 'https://myblog.com',
    description: 'A blog about web development, technology, and more',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://myblog.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'My Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://myblog.com/logo.jpg',
      },
    },
  }

  return <StructuredData data={structuredData} />
}
```

```tsx
// app/components/Breadcrumb.tsx
import BreadcrumbStructuredData from './BreadcrumbStructuredData'
import Link from 'next/link'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <>
      <BreadcrumbStructuredData items={items} />
      
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {index === items.length - 1 ? (
                <span className="text-gray-500">{item.name}</span>
              ) : (
                <Link href={item.url} className="text-blue-600 hover:underline">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
```

```tsx
// app/posts/[id]/page.tsx
import { getPostById } from '../../../lib/posts'
import { notFound } from 'next/navigation'
import Breadcrumb from '../../../app/components/Breadcrumb'
import ArticleStructuredData from '../../../app/components/ArticleStructuredData'

interface PostPageProps {
  params: { id: string }
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostById(params.id)
  
  if (!post) {
    notFound()
  }

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Posts', url: '/' },
    { name: post.title, url: `/posts/${params.id}` },
  ]

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <ArticleStructuredData
        title={post.title}
        description={post.description}
        author={post.author}
        datePublished={post.date}
        image={post.image}
        url={`https://myblog.com/posts/${params.id}`}
      />
      
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      
      <div className="flex items-center mb-4">
        <span className="text-gray-600">By {post.author}</span>
        <span className="mx-2 text-gray-400">•</span>
        <time dateTime={post.date} className="text-gray-600">
          {new Date(post.date).toLocaleDateString()}
        </time>
      </div>
      
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = getPostById(params.id)
  
  if (!post) {
    return {
      title: 'Post not found',
    }
  }

  return {
    title: post.title,
    description: post.description,
  }
}
```

```tsx
// app/search/page.tsx
import { useState } from 'react'
import WebsiteStructuredData from '../../app/components/WebsiteStructuredData'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) return
    
    setLoading(true)
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <WebsiteStructuredData />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Search</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for articles..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        
        {results.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Search Results</h2>
            {results.map((result: any) => (
              <div key={result.id} className="border rounded-lg p-4">
                <h3 className="text-xl font-medium mb-2">
                  <a href={`/posts/${result.id}`} className="text-blue-600 hover:underline">
                    {result.title}
                  </a>
                </h3>
                <p className="text-gray-600 mb-2">{result.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(result.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : query && !loading ? (
          <p className="text-gray-500">No results found for "{query}"</p>
        ) : null}
      </div>
    </>
  )
}

export const metadata = {
  title: 'Search',
  description: 'Search for articles on My Blog',
}
```

</details>

## Additional Challenges

1. **International SEO**: Implement hreflang tags for multilingual content.

2. **Local SEO**: Add local business structured data and Google Maps integration.

3. **Analytics Integration**: Implement Google Analytics 4 and Google Search Console.

4. **Page Speed Monitoring**: Set up Lighthouse CI to monitor page speed over time.

5. **A/B Testing**: Implement A/B testing for SEO elements like titles and meta descriptions.

## Summary

These exercises cover the most important SEO optimization techniques for Next.js applications:

1. **Metadata Management**: Implementing comprehensive metadata for all pages
2. **Sitemap and Robots.txt**: Creating proper crawling instructions for search engines
3. **Performance Optimization**: Improving Core Web Vitals and page speed
4. **Structured Data**: Enabling rich snippets in search results

SEO is an ongoing process, but these exercises provide a solid foundation for building search-engine-friendly Next.js applications.