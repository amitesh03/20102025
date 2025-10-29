# Beginner Blog Project

This is a simple blog project built with Next.js that demonstrates the fundamental concepts of Next.js including routing, static site generation, and markdown content management.

## Learning Objectives

After completing this project, you'll understand:

- How to set up a Next.js project with TypeScript
- How to create pages and layouts
- How to implement dynamic routing
- How to fetch and render markdown content
- How to use Static Site Generation (SSG)
- How to style with Tailwind CSS

## Features

- Home page with a list of blog posts
- Dynamic blog post pages
- Markdown content support
- Responsive design with Tailwind CSS
- Clean and semantic HTML structure

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
04-projects/01-beginner-blog/
├── app/
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout component
│   ├── page.tsx              # Home page
│   └── posts/
│       └── [id]/
│           └── page.tsx      # Dynamic blog post page
├── lib/
│   └── posts.ts              # Utility functions for posts
├── posts/
│   ├── pre-rendering.md      # Sample blog post
│   └── ssr-vs-ssg.md         # Sample blog post
└── README.md                 # This file
```

## Key Concepts Demonstrated

### 1. App Router Structure

The project uses the Next.js 14 App Router, which organizes routes in a file-based system:

- `app/page.tsx` - Home page at `/`
- `app/posts/[id]/page.tsx` - Dynamic routes for blog posts at `/posts/{id}`

### 2. Static Site Generation (SSG)

The blog posts are statically generated at build time using the `generateStaticParams` function:

```typescript
export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths
}
```

This function tells Next.js which pages to pre-build at build time.

### 3. Markdown Content Management

The blog posts are written in Markdown and stored in the `posts/` directory. The `lib/posts.ts` file contains utility functions to:

- Read Markdown files
- Parse front matter (metadata)
- Convert Markdown to HTML
- Sort posts by date

### 4. Dynamic Metadata

Each blog post page generates dynamic metadata based on the post content:

```typescript
export async function generateMetadata({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id)
  
  return {
    title: postData.title,
  }
}
```

### 5. Responsive Design

The project uses Tailwind CSS for styling, ensuring the blog looks good on all devices.

## How to Add New Blog Posts

1. Create a new Markdown file in the `posts/` directory
2. Add front matter with title and date:
   ```markdown
   ---
   title: 'Your Post Title'
   date: '2023-11-15'
   ---
   
   Your post content here...
   ```
3. The post will automatically appear on the home page after rebuilding

## Next Steps

- Add pagination to the home page
- Implement a search functionality
- Add comments to blog posts
- Create an about page
- Add tags and categories to posts
- Implement a dark mode toggle