import React, { useState } from 'react';

// Next.js Examples - Educational Examples for Next.js
// Source: Context7 Documentation for Next.js

export default function NextJSExamples() {
  const [activeExample, setActiveExample] = useState('app-router');

  return (
    <div className="examples-container">
      <h1>Next.js Examples</h1>
      <p className="intro">
        Next.js is a React framework for building full-stack web applications. It provides additional features and optimizations, automatically configuring lower-level tools to help developers focus on building products quickly.
      </p>
      
      <div className="example-nav">
        <button onClick={() => setActiveExample('app-router')} className={activeExample === 'app-router' ? 'active' : ''}>
          App Router
        </button>
        <button onClick={() => setActiveExample('pages-router')} className={activeExample === 'pages-router' ? 'active' : ''}>
          Pages Router
        </button>
        <button onClick={() => setActiveExample('data-fetching')} className={activeExample === 'data-fetching' ? 'active' : ''}>
          Data Fetching
        </button>
        <button onClick={() => setActiveExample('api-routes')} className={activeExample === 'api-routes' ? 'active' : ''}>
          API Routes
        </button>
        <button onClick={() => setActiveExample('server-actions')} className={activeExample === 'server-actions' ? 'active' : ''}>
          Server Actions
        </button>
        <button onClick={() => setActiveExample('optimization')} className={activeExample === 'optimization' ? 'active' : ''}>
          Optimization
        </button>
      </div>

      <div className="example-content">
        {activeExample === 'app-router' && <AppRouterExample />}
        {activeExample === 'pages-router' && <PagesRouterExample />}
        {activeExample === 'data-fetching' && <DataFetchingExample />}
        {activeExample === 'api-routes' && <ApiRoutesExample />}
        {activeExample === 'server-actions' && <ServerActionsExample />}
        {activeExample === 'optimization' && <OptimizationExample />}
      </div>
    </div>
  );
}

// App Router Example
function AppRouterExample() {
  return (
    <div className="example-section">
      <h2>App Router in Next.js</h2>
      <p>The App Router uses a file-system based routing where folders define routes and special files define UI components.</p>
      
      <div className="code-block">
        <h3>Basic Page Structure</h3>
        <pre>
{`// app/page.tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}

// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Dynamic Routes</h3>
        <pre>
{`// app/posts/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";

export default async function Post({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      <article className="mb-32">
        <PostHeader
          title={post.title}
          coverImage={post.coverImage}
          date={post.date}
          author={post.author}
        />
        <PostBody content={content} />
      </article>
    </main>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = \`\${post.title} | Next.js Blog Example\`;

  return {
    title,
    openGraph: {
      title,
      images: [post.ogImage.url],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Nested Layouts</h3>
        <pre>
{`// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <nav>
        <h2>Dashboard Navigation</h2>
        <ul>
          <li><Link href="/dashboard">Overview</Link></li>
          <li><Link href="/dashboard/settings">Settings</Link></li>
        </ul>
      </nav>
      {children}
    </section>
  );
}

// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard Overview</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Pages Router Example
function PagesRouterExample() {
  return (
    <div className="example-section">
      <h2>Pages Router in Next.js</h2>
      <p>The Pages Router is the traditional routing system in Next.js with file-based routing.</p>
      
      <div className="code-block">
        <h3>Basic Page</h3>
        <pre>
{`// pages/index.tsx
import type { NextPage } from "next";

const HomePage: NextPage = () => {
  return (
    <div>
      <h1>Welcome to Next.js</h1>
      <p>This is the home page.</p>
    </div>
  );
};

export default HomePage;`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Dynamic Routes</h3>
        <pre>
{`// pages/posts/[id].tsx
import type { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { useRouter } from "next/router";

type PostProps = {
  post: {
    id: number;
    title: string;
    content: string;
  };
};

const PostPage: NextPage<PostProps> = ({ post }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch all post IDs
  const posts = await fetchPosts();
  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  const post = await fetchPost(params.id as string);
  
  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { post },
  };
};

export default PostPage;`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Custom App Component</h3>
        <pre>
{`// pages/_app.tsx
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Data Fetching Example
function DataFetchingExample() {
  return (
    <div className="example-section">
      <h2>Data Fetching in Next.js</h2>
      <p>Next.js provides multiple ways to fetch data, both on the server and client.</p>
      
      <div className="code-block">
        <h3>Server-Side Data Fetching</h3>
        <pre>
{`// app/posts/page.tsx
import { cache } from "react";

async function getPosts() {
  const res = await fetch("https://api.example.com/posts", {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  return res.json();
}

const getPostsCached = cache(getPosts);

export default async function PostsPage() {
  const posts = await getPostsCached();
  
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={\`/posts/\${post.id}\`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Client-Side Data Fetching with SWR</h3>
        <pre>
{`// app/posts/client-posts.tsx
"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ClientPosts() {
  const { data, error, isLoading } = useSWR("/api/posts", fetcher);

  if (error) return <div>Failed to load posts</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Posts (Client-Side)</h1>
      <ul>
        {data.map((post) => (
          <li key={post.id}>
            <Link href={\`/posts/\${post.id}\`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Parallel Data Fetching</h3>
        <pre>
{`// app/dashboard/page.tsx
import { Suspense } from "react";
import PostsList from "./posts-list";
import UserStats from "./user-stats";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid">
        <Suspense fallback={<div>Loading posts...</div>}>
          <PostsList />
        </Suspense>
        <Suspense fallback={<div>Loading stats...</div>}>
          <UserStats />
        </Suspense>
      </div>
    </div>
  );
}

// app/dashboard/posts-list.tsx
async function getPosts() {
  const res = await fetch("https://api.example.com/posts");
  return res.json();
}

export default async function PostsList() {
  const posts = await getPosts();
  
  return (
    <div>
      <h2>Recent Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// API Routes Example
function ApiRoutesExample() {
  return (
    <div className="example-section">
      <h2>API Routes in Next.js</h2>
      <p>Next.js allows you to build API endpoints directly in your application.</p>
      
      <div className="code-block">
        <h3>App Router API Routes</h3>
        <pre>
{`// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await getUsersFromDatabase();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const user = await request.json();
  const newUser = await createUserInDatabase(user);
  return NextResponse.json(newUser, { status: 201 });
}

// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUserById(params.id);
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  return NextResponse.json(user);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userData = await request.json();
  const updatedUser = await updateUser(params.id, userData);
  return NextResponse.json(updatedUser);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await deleteUser(params.id);
  return new Response(null, { status: 204 });
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Pages Router API Routes</h3>
        <pre>
{`// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const users = await getUsersFromDatabase();
    return res.status(200).json(users);
  }
  
  if (req.method === 'POST') {
    const user = req.body;
    const newUser = await createUserInDatabase(user);
    return res.status(201).json(newUser);
  }
  
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(\`Method \${req.method} Not Allowed\`);
}

// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    const user = await getUserById(id as string);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json(user);
  }
  
  if (req.method === 'PUT') {
    const userData = req.body;
    const updatedUser = await updateUser(id as string, userData);
    return res.status(200).json(updatedUser);
  }
  
  if (req.method === 'DELETE') {
    await deleteUser(id as string);
    return res.status(204).end();
  }
  
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(\`Method \${req.method} Not Allowed\`);
}`}
        </pre>
      </div>
    </div>
  );
}

// Server Actions Example
function ServerActionsExample() {
  return (
    <div className="example-section">
      <h2>Server Actions in Next.js</h2>
      <p>Server Actions allow you to define server-side functions that can be called from Client Components.</p>
      
      <div className="code-block">
        <h3>Basic Server Action</h3>
        <pre>
{`// app/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  
  // Validate input
  if (!title || !content) {
    return { error: "Title and content are required" };
  }
  
  // Create post in database
  const post = await createPostInDatabase({ title, content });
  
  // Revalidate the posts page to show the new post
  revalidatePath("/posts");
  
  // Redirect to the new post
  redirect(\`/posts/\${post.id}\`);
}

// app/posts/new/page.tsx
import { createPost } from "@/app/actions";

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" required />
      </div>
      
      <div>
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" rows={10} required />
      </div>
      
      <button type="submit">Create Post</button>
    </form>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Server Action with useActionState</h3>
        <pre>
{`// app/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

export async function createPost(prevState: any, formData: FormData) {
  const validatedFields = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const { title, content } = validatedFields.data;
    const post = await createPostInDatabase({ title, content });
    
    revalidatePath("/posts");
    
    return {
      success: true,
      message: "Post created successfully",
      postId: post.id,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create post",
    };
  }
}

// app/posts/new/page.tsx
"use client";

import { useActionState } from "react";
import { createPost } from "@/app/actions";

export default function NewPostPage() {
  const [state, formAction, isPending] = useActionState(createPost, null);
  
  return (
    <form action={formAction}>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
        {state?.errors?.title && (
          <p className="error">{state.errors.title}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" rows={10} />
        {state?.errors?.content && (
          <p className="error">{state.errors.content}</p>
        )}
      </div>
      
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Post"}
      </button>
      
      {state?.message && (
        <p className={state.success ? "success" : "error"}>
          {state.message}
        </p>
      )}
    </form>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Optimization Example
function OptimizationExample() {
  return (
    <div className="example-section">
      <h2>Optimization in Next.js</h2>
      <p>Next.js provides built-in optimizations for images, fonts, scripts, and more.</p>
      
      <div className="code-block">
        <h3>Image Optimization</h3>
        <pre>
{`// app/page.tsx
import Image from "next/image";
import profilePic from "../public/me.png";

export default function HomePage() {
  return (
    <div>
      <h1>Image Optimization</h1>
      
      {/* Local image */}
      <Image
        src={profilePic}
        alt="Picture of the author"
        width={500}
        height={500}
        priority
      />
      
      {/* Remote image */}
      <Image
        src="https://example.com/nextjs.png"
        alt="Next.js Logo"
        width={500}
        height={500}
      />
    </div>
  );
}

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Dynamic Import and Code Splitting</h3>
        <pre>
{`// app/page.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Load component dynamically
const DynamicComponent = dynamic(() => import("../components/heavy-component"), {
  loading: () => <p>Loading component...</p>,
  ssr: false, // Disable server-side rendering
});

// Load component with custom loading UI
const DynamicComponentWithLoading = dynamic(
  () => import("../components/another-component"),
  {
    loading: () => <div>Loading...</div>,
  }
);

export default function HomePage() {
  const [showComponent, setShowComponent] = useState(false);
  
  return (
    <div>
      <h1>Dynamic Imports</h1>
      
      <button onClick={() => setShowComponent(!showComponent)}>
        {showComponent ? "Hide" : "Show"} Component
      </button>
      
      {showComponent && <DynamicComponent />}
      
      <DynamicComponentWithLoading />
    </div>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Font Optimization</h3>
        <pre>
{`// app/layout.tsx
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={\`\${inter.variable} \${robotoMono.variable}\`}>
      <body>{children}</body>
    </html>
  );
}

// app/globals.css
body {
  font-family: var(--font-inter);
}

code {
  font-family: var(--font-roboto-mono);
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Script Optimization</h3>
        <pre>
{`// app/layout.tsx
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        
        {/* Load analytics script after page becomes interactive */}
        <Script
          src="https://www.google-analytics.com/analytics.js"
          strategy="afterInteractive"
        />
        
        {/* Load third-party script only when idle */}
        <Script
          src="https://example.com/third-party-script.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Add some basic styles for the examples
const style = document.createElement('style');
style.textContent = `
.examples-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.intro {
  font-size: 1.1em;
  color: #666;
  margin-bottom: 30px;
}

.example-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.example-nav button {
  padding: 10px 15px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 4px;
}

.example-nav button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.example-content {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #f9f9f9;
}

.example-section h2 {
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.code-block {
  margin: 20px 0;
}

.code-block h3 {
  color: #555;
  margin-bottom: 10px;
}

.code-block pre {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
}

.error {
  color: #d32f2f;
  font-style: italic;
}

.success {
  color: #388e3c;
  font-style: italic;
}
`;
document.head.appendChild(style);