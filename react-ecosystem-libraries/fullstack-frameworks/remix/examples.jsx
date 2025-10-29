import React, { useState } from 'react';

// Remix Examples - Educational Examples for Remix Framework
// Source: Context7 Documentation for Remix

export default function RemixExamples() {
  const [activeExample, setActiveExample] = useState('basic-routing');

  return (
    <div className="examples-container">
      <h1>Remix Framework Examples</h1>
      <p className="intro">
        Remix is a full-stack web framework that enables developers to build fast, resilient user experiences that deploy to any Node.js server or edge environments.
      </p>
      
      <div className="example-nav">
        <button onClick={() => setActiveExample('basic-routing')} className={activeExample === 'basic-routing' ? 'active' : ''}>
          Basic Routing
        </button>
        <button onClick={() => setActiveExample('data-loading')} className={activeExample === 'data-loading' ? 'active' : ''}>
          Data Loading
        </button>
        <button onClick={() => setActiveExample('form-handling')} className={activeExample === 'form-handling' ? 'active' : ''}>
          Form Handling
        </button>
        <button onClick={() => setActiveExample('file-uploads')} className={activeExample === 'file-uploads' ? 'active' : ''}>
          File Uploads
        </button>
        <button onClick={() => setActiveExample('authentication')} className={activeExample === 'authentication' ? 'active' : ''}>
          Authentication
        </button>
        <button onClick={() => setActiveExample('api-routes')} className={activeExample === 'api-routes' ? 'active' : ''}>
          API Routes
        </button>
      </div>

      <div className="example-content">
        {activeExample === 'basic-routing' && <BasicRoutingExample />}
        {activeExample === 'data-loading' && <DataLoadingExample />}
        {activeExample === 'form-handling' && <FormHandlingExample />}
        {activeExample === 'file-uploads' && <FileUploadsExample />}
        {activeExample === 'authentication' && <AuthenticationExample />}
        {activeExample === 'api-routes' && <ApiRoutesExample />}
      </div>
    </div>
  );
}

// Basic Routing Example
function BasicRoutingExample() {
  return (
    <div className="example-section">
      <h2>Basic Routing in Remix</h2>
      <p>Remix uses file-based routing with nested routes and layouts.</p>
      
      <div className="code-block">
        <h3>File Structure</h3>
        <pre>
{`app/
├── root.tsx              # Root layout
├── routes/
│   ├── _index.tsx        # Home page (/)
│   ├── about.tsx         # About page (/about)
│   ├── blog/
│   │   ├── _index.tsx    # Blog index (/blog)
│   │   └── $slug.tsx     # Blog post (/blog/:slug)
│   └── dashboard/
│       ├── _index.tsx    # Dashboard index (/dashboard)
│       └── settings.tsx  # Settings (/dashboard/settings)`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Root Layout (app/root.tsx)</h3>
        <pre>
{`import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import styles from "./styles/global.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/blog">Blog</Link>
          </nav>
        </header>
        
        <main>
          <Outlet />
        </main>
        
        <footer>
          <p>&copy; {new Date().getFullYear()} My App</p>
        </footer>
        
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Dynamic Route (app/routes/blog/$slug.tsx)</h3>
        <pre>
{`import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getPost } from "~/models/post.server";

export const loader = async ({ params }) => {
  const post = await getPost(params.slug);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
};

export default function PostSlug() {
  const { post } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.createdAt}</p>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div>
      <h1>Post not found</h1>
      <p>Sorry, we couldn't find the post you're looking for.</p>
      <Link to="/blog">Back to blog</Link>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Data Loading Example
function DataLoadingExample() {
  return (
    <div className="example-section">
      <h2>Data Loading in Remix</h2>
      <p>Remix provides built-in data loading with loaders that run on the server.</p>
      
      <div className="code-block">
        <h3>Basic Loader</h3>
        <pre>
{`import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPosts } from "~/models/post.server";

export const loader = async () => {
  const posts = await getPosts();
  return json({ posts });
};

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={\`/blog/\${post.slug}\`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Loading Data with Parameters</h3>
        <pre>
{`import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/models/user.server";

export const loader = async ({ params }) => {
  const user = await getUser(params.userId);
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }
  return json({ user });
};

export default function UserProfile() {
  const { user } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Client-side Data Fetching with useFetcher</h3>
        <pre>
{`import { useFetcher } from "@remix-run/react";

function SearchForm() {
  const fetcher = useFetcher();
  
  return (
    <div>
      <fetcher.Form method="get" action="/search">
        <input
          type="search"
          name="query"
          placeholder="Search..."
          defaultValue={fetcher.data?.query}
        />
        <button type="submit" disabled={fetcher.state === "loading"}>
          {fetcher.state === "loading" ? "Searching..." : "Search"}
        </button>
      </fetcher.Form>
      
      {fetcher.data?.results && (
        <ul>
          {fetcher.data.results.map((result) => (
            <li key={result.id}>{result.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Form Handling Example
function FormHandlingExample() {
  return (
    <div className="example-section">
      <h2>Form Handling in Remix</h2>
      <p>Remix provides built-in form handling with progressive enhancement.</p>
      
      <div className="code-block">
        <h3>Basic Form with Action</h3>
        <pre>
{`import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createPost } from "~/models/post.server";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  
  const errors = {
    title: title ? null : "Title is required",
    content: content ? null : "Content is required",
  };
  
  const hasErrors = Object.values(errors).some(Boolean);
  if (hasErrors) {
    return json({ errors });
  }
  
  const post = await createPost({ title, content });
  return redirect(\`/blog/\${post.slug}\`);
};

export default function NewPost() {
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors;
  
  return (
    <div>
      <h1>Create New Post</h1>
      
      <Form method="post">
        <div>
          <label>
            Title:{" "}
            {errors?.title ? (
              <em className="error">{errors.title}</em>
            ) : null}
          </label>
          <input type="text" name="title" />
        </div>
        
        <div>
          <label>
            Content:{" "}
            {errors?.content ? (
              <em className="error">{errors.content}</em>
            ) : null}
          </label>
          <textarea name="content" rows={10} />
        </div>
        
        <button type="submit">Create Post</button>
      </Form>
    </div>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Form Validation</h3>
        <pre>
{`import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

function validateTitle(title) {
  if (!title || title.length < 3) {
    return "Title must be at least 3 characters";
  }
}

function validateContent(content) {
  if (!content || content.length < 10) {
    return "Content must be at least 10 characters";
  }
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  
  const errors = {
    title: validateTitle(title),
    content: validateContent(content),
  };
  
  if (Object.values(errors).some(Boolean)) {
    return json({ errors });
  }
  
  // Process valid form data...
  return redirect("/success");
};

export default function ContactForm() {
  const actionData = useActionData<typeof action>();
  
  return (
    <Form method="post">
      <div>
        <label>
          Title:{" "}
          {actionData?.errors?.title && (
            <em>{actionData.errors.title}</em>
          )}
        </label>
        <input type="text" name="title" />
      </div>
      
      <div>
        <label>
          Content:{" "}
          {actionData?.errors?.content && (
            <em>{actionData.errors.content}</em>
          )}
        </label>
        <textarea name="content" />
      </div>
      
      <button type="submit">Submit</button>
    </Form>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// File Uploads Example
function FileUploadsExample() {
  return (
    <div className="example-section">
      <h2>File Uploads in Remix</h2>
      <p>Remix provides built-in support for handling file uploads with multipart form data.</p>
      
      <div className="code-block">
        <h3>Basic File Upload</h3>
        <pre>
{`import { unstable_parseMultipartFormData } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { uploadFile } from "~/utils/storage.server";

export const action = async ({ request }) => {
  const formData = await unstable_parseMultipartFormData(
    request,
    async ({ name, data, filename }) => {
      if (name === "avatar") {
        const url = await uploadFile(data, filename);
        return url;
      }
      return undefined;
    }
  );
  
  const avatarUrl = formData.get("avatar");
  // Save avatarUrl to database...
  
  return redirect("/profile");
};

export default function ProfileSettings() {
  return (
    <div>
      <h1>Profile Settings</h1>
      
      <Form method="post" encType="multipart/form-data">
        <div>
          <label htmlFor="avatar">Avatar:</label>
          <input type="file" name="avatar" id="avatar" accept="image/*" />
        </div>
        
        <button type="submit">Update Profile</button>
      </Form>
    </div>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Multiple File Upload</h3>
        <pre>
{`import { unstable_parseMultipartFormData } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { uploadFile } from "~/utils/storage.server";

export const action = async ({ request }) => {
  const formData = await unstable_parseMultipartFormData(
    request,
    async ({ name, data, filename }) => {
      if (name.startsWith("document-")) {
        const url = await uploadFile(data, filename);
        return url;
      }
      return undefined;
    }
  );
  
  // Extract uploaded file URLs
  const files = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("document-") && typeof value === "string") {
      files.push({ name: key, url: value });
    }
  }
  
  // Save file references to database...
  return json({ files });
};

export default function DocumentUpload() {
  return (
    <div>
      <h1>Upload Documents</h1>
      
      <Form method="post" encType="multipart/form-data">
        <div>
          <label htmlFor="doc1">Document 1:</label>
          <input type="file" name="document-1" id="doc1" />
        </div>
        
        <div>
          <label htmlFor="doc2">Document 2:</label>
          <input type="file" name="document-2" id="doc2" />
        </div>
        
        <div>
          <label htmlFor="doc3">Document 3:</label>
          <input type="file" name="document-3" id="doc3" />
        </div>
        
        <button type="submit">Upload Documents</button>
      </Form>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Authentication Example
function AuthenticationExample() {
  return (
    <div className="example-section">
      <h2>Authentication in Remix</h2>
      <p>Remix provides flexible authentication patterns that work with any auth provider.</p>
      
      <div className="code-block">
        <h3>Login Form with Session Management</h3>
        <pre>
{`import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createUserSession, login } from "~/utils/session.server";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  
  const user = await login({ username, password });
  if (!user) {
    return json({ errors: { username: "Invalid username or password" } });
  }
  
  return createUserSession({
    request,
    userId: user.id,
    redirectTo: "/dashboard",
  });
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  
  return (
    <div>
      <h1>Login</h1>
      
      <Form method="post">
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" id="username" required />
          {actionData?.errors?.username && (
            <div>{actionData.errors.username}</div>
          )}
        </div>
        
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" required />
        </div>
        
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Protected Routes</h3>
        <pre>
{`import { redirect } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";

export const loader = async ({ request }) => {
  const userId = await requireUserId(request);
  // Load user data...
  return json({ user });
};

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>This is your protected dashboard.</p>
    </div>
  );
}

// utils/session.server.ts
import { createCookieSessionStorage, redirect } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

export async function requireUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    throw redirect("/login");
  }
  return userId;
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
      <h2>API Routes in Remix</h2>
      <p>Remix can be used to build APIs alongside your UI routes.</p>
      
      <div className="code-block">
        <h3>JSON API Endpoint</h3>
        <pre>
{`import { json } from "@remix-run/node";
import { getPosts } from "~/models/post.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") || 10);
  const offset = Number(url.searchParams.get("offset") || 0);
  
  const posts = await getPosts({ limit, offset });
  
  return json({
    posts,
    pagination: {
      limit,
      offset,
      total: posts.length,
    },
  });
};

// This route can be accessed at /api/posts
export default function ApiPosts() {
  // This component won't render for API requests
  return null;
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>RESTful API with Different HTTP Methods</h3>
        <pre>
{`import { json } from "@remix-run/node";
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
} from "~/models/post.server";

// GET /api/posts/:id - Get a single post
export const loader = async ({ params }) => {
  const post = await getPost(params.id);
  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }
  return json({ post });
};

// PUT /api/posts/:id - Update a post
// DELETE /api/posts/:id - Delete a post
export const action = async ({ request, params }) => {
  const method = request.method;
  
  if (method === "PUT") {
    const data = await request.json();
    const post = await updatePost(params.id, data);
    return json({ post });
  }
  
  if (method === "DELETE") {
    await deletePost(params.id);
    return new Response(null, { status: 204 });
  }
  
  throw new Response("Method Not Allowed", { status: 405 });
};

export default function ApiPost() {
  return null;
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>API Resource Routes</h3>
        <pre>
{`// app/routes/resources/posts.ts
import { json } from "@remix-run/node";
import { getPosts } from "~/models/post.server";

export const loader = async ({ request }) => {
  const posts = await getPosts();
  return json(posts, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};

// This route can be accessed at /resources/posts
export default function PostsResource() {
  return null;
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
`;
document.head.appendChild(style);