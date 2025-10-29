# SEO Optimization in Next.js

This example covers advanced SEO optimization techniques in Next.js, including meta tags management, Open Graph and Twitter Cards, structured data implementation, and sitemap generation.

## Learning Objectives

- Implement comprehensive meta tags management
- Create Open Graph and Twitter Cards
- Add structured data with JSON-LD
- Generate dynamic sitemaps
- Implement robots.txt configuration
- Optimize for search engine crawling

## Project Structure

```
03-advanced/02-seo/
├── app/
│   ├── layout.tsx                    # Root layout with SEO metadata
│   ├── page.tsx                      # Home page with SEO optimization
│   ├── blog/
│   │   ├── page.tsx                  # Blog listing page
│   │   └── [slug]/
│   │       └── page.tsx              # Blog post page with SEO
│   ├── products/
│   │   ├── page.tsx                  # Product listing page
│   │   └── [id]/
│   │       └── page.tsx              # Product detail page with SEO
│   ├── sitemap.xml                   # Dynamic sitemap
│   └── robots.txt                    # Robots configuration
├── components/
│   ├── SEOHead.tsx                   # SEO component for meta tags
│   ├── StructuredData.tsx            # Structured data component
│   └── Breadcrumb.tsx                # Breadcrumb navigation
├── lib/
│   ├── seo.ts                        # SEO utilities
│   ├── structured-data.ts            # Structured data generators
│   └── sitemap.ts                    # Sitemap generator
└── README.md
```

## Key Concepts

### 1. Dynamic Metadata API

Use Next.js Metadata API for dynamic SEO:

```tsx
// app/blog/[slug]/page.tsx
import { Metadata } from 'next'
import { getPostBySlug, getAllPosts } from '../../../lib/posts'
import StructuredData from '../../../components/StructuredData'

interface PostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata(
  { params }: PostPageProps
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
    alternates: {
      canonical: `https://example.com/blog/${params.slug}`,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div>
      <article>
        <h1>{post.title}</h1>
        <p>By {post.author} on {post.publishedAt}</p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
      
      <StructuredData
        type="BlogPosting"
        data={{
          headline: post.title,
          description: post.excerpt,
          author: {
            "@type": "Person",
            name: post.author,
          },
          datePublished: post.publishedAt,
          image: post.coverImage,
        }}
      />
    </div>
  )
}
```

### 2. SEO Component

Create a reusable SEO component:

```tsx
// components/SEOHead.tsx
import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  ogUrl?: string
  canonical?: string
  noindex?: boolean
  structuredData?: object
}

export default function SEOHead({
  title,
  description,
  keywords,
  ogImage,
  ogUrl,
  canonical,
  noindex = false,
  structuredData,
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </Head>
  )
}
```

### 3. Structured Data Component

Implement structured data for better search results:

```tsx
// components/StructuredData.tsx
interface StructuredDataProps {
  type: string
  data: object
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}
```

### 4. Dynamic Sitemap Generation

Generate a dynamic sitemap:

```tsx
// app/sitemap.xml/route.ts
import { MetadataRoute } from 'next'
import { getPosts, getProducts } from '../../lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://example.com'
  
  // Get dynamic data
  const posts = getPosts()
  const products = getProducts()
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]
  
  // Dynamic blog posts
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  
  // Dynamic product pages
  const productPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  return [...staticPages, ...blogPages, ...productPages]
}
```

### 5. Robots.txt Configuration

Configure robots.txt:

```tsx
// app/robots.txt/route.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

### 6. Breadcrumb Navigation

Implement breadcrumb navigation for better UX and SEO:

```tsx
// components/Breadcrumb.tsx
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            )}
            {index === items.length - 1 ? (
              <span className="text-gray-500">{item.name}</span>
            ) : (
              <Link
                href={item.href}
                className="text-blue-600 hover:text-blue-800"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
```

## Installation

```bash
npm install @heroicons/react
```

## Running This Example

1. Navigate to this directory
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open http://localhost:3000 in your browser

## SEO Checklist

- [ ] Unique title tags for each page
- [ ] Meta descriptions for each page
- [ ] Proper heading structure (H1, H2, H3)
- [ ] Alt text for all images
- [ ] Canonical URLs
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Structured data markup
- [ ] XML sitemap
- [ ] Robots.txt configuration
- [ ] Breadcrumb navigation
- [ ] Internal linking strategy

## SEO Tools

- Google Search Console
- Google PageSpeed Insights
- Schema.org Validator
- Screaming Frog SEO Spider
- Ahrefs or SEMrush

## Exercises

1. Implement local business structured data for a company website
2. Create an article schema for blog posts
3. Add product schema with reviews and ratings
4. Implement hreflang tags for multilingual support
5. Create a custom 404 page with SEO optimization

## Next Steps

After completing this example, proceed to the deployment example to learn about deploying Next.js applications to production.