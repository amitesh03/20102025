# Personal Blog Project

A simple personal blog built with Next.js that supports markdown posts, tags, and a clean reading experience.

## Features

- Markdown blog posts with syntax highlighting
- Tag-based categorization
- Clean, responsive design
- SEO optimization
- Dark mode support
- Reading time estimation

## Learning Objectives

- Working with markdown in Next.js
- Dynamic routing for blog posts
- Static site generation
- SEO implementation
- Styling with Tailwind CSS

## Project Structure

```
personal-blog/
├── app/
│   ├── layout.tsx                  # Root layout with theme provider
│   ├── page.tsx                    # Home page with recent posts
│   ├── blog/
│   │   ├── page.tsx                # Blog listing page
│   │   ├── [slug]/
│   │   │   └── page.tsx            # Individual blog post
│   │   └── tag/
│   │       └── [tag]/
│   │           └── page.tsx        # Posts by tag
│   └── components/
│       ├── Header.tsx              # Site header with navigation
│       ├── Footer.tsx              # Site footer
│       ├── PostCard.tsx            # Blog post card
│       ├── PostContent.tsx         # Markdown content renderer
│       └── ThemeToggle.tsx         # Dark mode toggle
├── lib/
│   ├── posts.ts                    # Post utilities
│   ├── markdown.ts                 # Markdown processing
│   └── types.ts                    # TypeScript types
├── content/
│   ├── posts/                      # Blog post markdown files
│   └── tags/                       # Tag information
└── README.md
```

## Getting Started

1. Navigate to this directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 in your browser

## Adding New Posts

1. Create a new markdown file in `content/posts/`
2. Add front matter with metadata:
   ```yaml
   ---
   title: "Your Post Title"
   excerpt: "Brief description of the post"
   publishedAt: "2023-10-01"
   tags: ["tag1", "tag2"]
   ---
   ```
3. Write your post content in markdown
4. The post will automatically appear in the blog

## Key Concepts Demonstrated

### Markdown Processing

```tsx
// lib/markdown.ts
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

export async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(markdown)
  
  return result.toString()
}
```

### Dynamic Routing

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '../../../lib/posts'
import PostContent from '../../../components/PostContent'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <PostContent content={post.content} />
    </article>
  )
}
```

### SEO Optimization

```tsx
// app/blog/[slug]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
    },
  }
}
```

## Customization

- Modify the theme in `app/globals.css`
- Update the site information in `app/layout.tsx`
- Add new components to `app/components/`
- Extend the markdown processing with additional plugins

## Deployment

This blog is optimized for deployment on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Deploy automatically on push to main branch

## Extensions

- Add comments with Disqus or Giscus
- Implement a search feature
- Add RSS feed generation
- Include newsletter signup
- Add analytics with Google Analytics

## Next Steps

After completing this project:
- Try the portfolio website project
- Learn about API routes
- Explore database integration
- Implement authentication

Happy blogging!