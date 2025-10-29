# Next.js

Next.js is a React framework for building full-stack web applications. It provides a comprehensive solution with features like server-side rendering, static site generation, API routes, and more.

## Overview

Next.js by Vercel is a production-ready framework that enables you to build fast, scalable web applications with React. It handles the tooling and configuration needed for React, and provides additional structure, features, and optimizations for your application.

## Key Features

- **Hybrid Rendering**: Server-Side Rendering (SSR) and Static Site Generation (SSG)
- **API Routes**: Build API endpoints directly in your Next.js app
- **File-based Routing**: Automatic routing based on file structure
- **Image Optimization**: Built-in image optimization with next/image
- **Code Splitting**: Automatic code splitting for faster page loads
- **Fast Refresh**: Instant feedback during development
- **TypeScript Support**: First-class TypeScript support
- **CSS Support**: Built-in CSS and Sass support
- **Environment Variables**: Built-in support for environment variables

## Installation

### Creating a New Next.js App

```bash
# Using create-next-app (recommended)
npx create-next-app@latest my-app

# Or with TypeScript
npx create-next-app@latest my-app --typescript

# Or with specific template
npx create-next-app@latest my-app --example with-tailwindcss
```

### Manual Installation

```bash
# Create a new directory
mkdir my-app
cd my-app

# Initialize npm
npm init -y

# Install Next.js, React, and React DOM
npm install next react react-dom

# Install TypeScript (optional)
npm install --save-dev typescript @types/react @types/node
```

## Basic Usage

### Project Structure

```
my-app/
├── pages/              # Pages directory (App Router: app/)
├── public/             # Static assets
├── styles/             # CSS files
├── components/         # Reusable components
├── api/                # API routes
├── utils/              # Utility functions
├── hooks/              # Custom hooks
├── .next/              # Next.js build output
├── next.config.js      # Next.js configuration
└── package.json        # Dependencies
```

### Creating Pages

```jsx
// pages/index.js
export default function Home() {
  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <p>This is the home page.</p>
    </div>
  );
}
```

```jsx
// pages/about.js
export default function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Learn more about our company.</p>
    </div>
  );
}
```

### Dynamic Routes

```jsx
// pages/posts/[id].js
import { useRouter } from 'next/router';

export default function Post() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Post {id}</h1>
      <p>This is a dynamic post page.</p>
    </div>
  );
}
```

### Navigation

```jsx
import Link from 'next/link';

function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/posts/1">Post 1</Link>
    </nav>
  );
}
```

## Data Fetching

### Server-Side Rendering (SSR)

```jsx
// pages/posts/[id].js
function Post({ post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const post = await res.json();

  return {
    props: {
      post,
    },
  };
}

export default Post;
```

### Static Site Generation (SSG)

```jsx
// pages/posts/[id].js
function Post({ post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return {
    paths,
    fallback: false, // Can also be true or 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`);
  const post = await res.json();

  return {
    props: {
      post,
    },
  };
}

export default Post;
```

### Client-Side Data Fetching

```jsx
import { useState, useEffect } from 'react';

function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    }

    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default PostsList;
```

## API Routes

### Creating API Endpoints

```javascript
// pages/api/posts.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    // Handle GET request
    res.status(200).json({ message: 'GET posts' });
  } else if (req.method === 'POST') {
    // Handle POST request
    res.status(201).json({ message: 'Post created' });
  } else {
    // Handle other HTTP methods
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

```javascript
// pages/api/posts/[id].js
export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    res.status(200).json({ message: `Get post ${id}` });
  } else if (req.method === 'PUT') {
    res.status(200).json({ message: `Update post ${id}` });
  } else if (req.method === 'DELETE') {
    res.status(200).json({ message: `Delete post ${id}` });
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

## Styling

### CSS Modules

```jsx
// styles/Home.module.css
.container {
  padding: 20px;
  background-color: #f5f5f5;
}

.title {
  color: #333;
  font-size: 2rem;
}

// pages/index.js
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Next.js!</h1>
    </div>
  );
}
```

### Global CSS

```css
/* styles/globals.css */
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
```

```jsx
// pages/_app.js
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

### Tailwind CSS

```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Images

### Using next/image

```jsx
import Image from 'next/image';

function Profile() {
  return (
    <div>
      <h1>User Profile</h1>
      <Image
        src="/profile.jpg"
        alt="Profile Picture"
        width={500}
        height={500}
        priority // Load this image immediately
      />
    </div>
  );
}

export default Profile;
```

### Remote Images

```jsx
import Image from 'next/image';

function RemoteImage() {
  return (
    <Image
      src="https://example.com/image.jpg"
      alt="Remote Image"
      width={500}
      height={300}
    />
  );
}
```

## Environment Variables

### Creating Environment Variables

```bash
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
API_KEY="your-api-key-here"
NEXT_PUBLIC_API_URL="https://api.example.com"
```

### Using Environment Variables

```jsx
// Server-side only
export async function getServerSideProps() {
  const databaseUrl = process.env.DATABASE_URL;
  const apiKey = process.env.API_KEY;
  
  // Fetch data using environment variables
  
  return {
    props: {},
  };
}

// Client-side (must start with NEXT_PUBLIC_)
function MyComponent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  return <div>API URL: {apiUrl}</div>;
}
```

## Deployment

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

## Best Practices

1. **Use App Router**: Use the new App Router for new projects
2. **Optimize Images**: Always use next/image for images
3. **Code Splitting**: Leverage automatic code splitting
4. **Environment Variables**: Use proper environment variable naming
5. **Error Handling**: Implement proper error boundaries
6. **Performance**: Use getStaticProps when possible
7. **SEO**: Implement proper meta tags and structured data

## Resources

- [Official Documentation](https://nextjs.org/docs)
- [Next.js Tutorial](https://nextjs.org/learn)
- [API Reference](https://nextjs.org/docs/api-reference)
- [Examples](https://github.com/vercel/next.js/tree/canary/examples)