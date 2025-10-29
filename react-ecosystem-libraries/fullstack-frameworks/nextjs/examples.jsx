// Next.js Examples with Detailed Comments
// This file demonstrates various Next.js concepts with comprehensive explanations

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

// ===== EXAMPLE 1: BASIC PAGES AND ROUTING =====
/**
 * Basic Next.js pages demonstrating file-based routing
 * Next.js uses file-based routing system where each file in pages/ becomes a route
 */

// Index page (home page)
function HomePage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>Next.js Examples - Home</title>
        <meta name="description" content="Welcome to Next.js examples" />
      </Head>
      
      <h1>Welcome to Next.js Examples</h1>
      <p>This is the home page demonstrating basic Next.js routing.</p>
      
      <nav style={{ marginBottom: '20px' }}>
        <Link href="/about" style={{ marginRight: '15px' }}>
          About Page
        </Link>
        <Link href="/contact" style={{ marginRight: '15px' }}>
          Contact Page
        </Link>
        <Link href="/blog/hello-world">
          Dynamic Blog Post
        </Link>
      </nav>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Features Demonstrated:</h2>
        <ul>
          <li>File-based routing</li>
          <li>Head component for meta tags</li>
          <li>Link component for navigation</li>
          <li>Basic page structure</li>
        </ul>
      </div>
    </div>
  );
}

// About page
function AboutPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>About - Next.js Examples</title>
        <meta name="description" content="About Next.js examples" />
      </Head>
      
      <h1>About This Project</h1>
      <p>This page demonstrates basic routing in Next.js.</p>
      
      <Link href="/" style={{ color: '#007bff' }}>
        ← Back to Home
      </Link>
    </div>
  );
}

// Contact page
function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>Contact - Next.js Examples</title>
        <meta name="description" content="Contact Next.js examples" />
      </Head>
      
      <h1>Contact Us</h1>
      
      {isSubmitted ? (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#d4edda', 
          color: '#155724',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          Thank you for your message! We'll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Message:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ddd',
                borderRadius: '4px',
                resize: 'vertical'
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Send Message
          </button>
        </form>
      )}
      
      <Link href="/" style={{ color: '#007bff', marginTop: '20px', display: 'inline-block' }}>
        ← Back to Home
      </Link>
    </div>
  );
}

// ===== EXAMPLE 2: DYNAMIC ROUTES =====
/**
 * Dynamic routes demonstrating URL parameters
 * Files with brackets [param] create dynamic routes
 */

// Dynamic blog post page
function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query; // Get URL parameter
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetching post data based on slug
  useEffect(() => {
    if (slug) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setPost({
          slug,
          title: `Blog Post: ${slug}`,
          content: `This is the content for the blog post with slug: ${slug}. 
                    In a real application, this would be fetched from a database or CMS.`,
          author: 'John Doe',
          date: new Date().toLocaleDateString(),
          tags: ['Next.js', 'React', 'Web Development']
        });
        setLoading(false);
      }, 1000);
    }
  }, [slug]);

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <Head>
          <title>Loading...</title>
        </Head>
        <p>Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <Head>
          <title>Post Not Found</title>
        </Head>
        <h1>Post Not Found</h1>
        <p>The requested blog post could not be found.</p>
        <Link href="/blog">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>{post.title} - Next.js Examples</title>
        <meta name="description" content={post.content.substring(0, 160)} />
      </Head>
      
      <article>
        <header style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
          <h1>{post.title}</h1>
          <div style={{ color: '#666', fontSize: '0.9em' }}>
            By {post.author} • {post.date}
          </div>
          <div style={{ marginTop: '10px' }}>
            {post.tags.map((tag, index) => (
              <span 
                key={index}
                style={{
                  backgroundColor: '#e9ecef',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8em',
                  marginRight: '5px'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </header>
        
        <div style={{ lineHeight: '1.6' }}>
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: '16px' }}>
              {paragraph}
            </p>
          ))}
        </div>
      </article>
      
      <nav style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <Link href="/blog" style={{ color: '#007bff' }}>
          ← Back to Blog
        </Link>
      </nav>
    </div>
  );
}

// Blog listing page
function BlogIndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching blog posts
    setTimeout(() => {
      setPosts([
        { slug: 'hello-world', title: 'Hello World', excerpt: 'Welcome to Next.js!' },
        { slug: 'getting-started', title: 'Getting Started', excerpt: 'Learn the basics of Next.js' },
        { slug: 'advanced-features', title: 'Advanced Features', excerpt: 'Explore advanced Next.js concepts' },
        { slug: 'deployment', title: 'Deployment', excerpt: 'How to deploy Next.js apps' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>Blog - Next.js Examples</title>
        <meta name="description" content="Blog posts about Next.js" />
      </Head>
      
      <h1>Blog Posts</h1>
      
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {posts.map((post) => (
            <article 
              key={post.slug}
              style={{ 
                padding: '20px', 
                border: '1px solid #ddd', 
                borderRadius: '8px',
                backgroundColor: 'white'
              }}
            >
              <h2>
                <Link href={`/blog/${post.slug}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                  {post.title}
                </Link>
              </h2>
              <p style={{ color: '#666', marginBottom: '10px' }}>
                {post.excerpt}
              </p>
              <Link href={`/blog/${post.slug}`} style={{ color: '#007bff' }}>
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}
      
      <Link href="/" style={{ color: '#007bff', marginTop: '20px', display: 'inline-block' }}>
        ← Back to Home
      </Link>
    </div>
  );
}

// ===== EXAMPLE 3: API ROUTES =====
/**
 * API routes demonstrating backend functionality
 * Files in pages/api/ become API endpoints
 */

// This would be in pages/api/hello.js
function HelloAPIExample() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const callAPI = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/hello');
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error calling API: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>API Example - Next.js Examples</title>
      </Head>
      
      <h1>API Routes Example</h1>
      <p>Click the button to call a Next.js API route.</p>
      
      <button
        onClick={callAPI}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginRight: '10px'
        }}
      >
        {loading ? 'Calling API...' : 'Call API'}
      </button>
      
      {message && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '8px',
          border: '1px solid #c3e6cb'
        }}>
          <strong>API Response:</strong> {message}
        </div>
      )}
      
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px' 
      }}>
        <h3>API Route Code (pages/api/hello.js):</h3>
        <pre style={{ 
          backgroundColor: '#f1f3f4', 
          padding: '15px', 
          borderRadius: '4px',
          overflow: 'auto'
        }}>
{`export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ 
      message: 'Hello from Next.js API!',
      timestamp: new Date().toISOString()
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(\`Method \${req.method} Not Allowed\`);
  }
}`}
        </pre>
      </div>
      
      <Link href="/" style={{ color: '#007bff', marginTop: '20px', display: 'inline-block' }}>
        ← Back to Home
      </Link>
    </div>
  );
}

// ===== EXAMPLE 4: DATA FETCHING =====
/**
 * Data fetching examples demonstrating different methods
 * Next.js supports SSR, SSG, and CSR
 */

// Server-Side Rendering (SSR) example
function SSRExample({ serverData }) {
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    // Client-side data fetching
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setClientData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>SSR Example - Next.js Examples</title>
      </Head>
      
      <h1>Server-Side Rendering (SSR)</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>Data fetched on server:</h3>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '8px',
          border: '1px solid #bbdefb'
        }}>
          <pre>{JSON.stringify(serverData, null, 2)}</pre>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>Data fetched on client:</h3>
        {clientData ? (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f3e5f5', 
            borderRadius: '8px',
            border: '1px solid #e1bee7'
          }}>
            <pre>{JSON.stringify(clientData, null, 2)}</pre>
          </div>
        ) : (
          <p>Loading client data...</p>
        )}
      </div>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px' 
      }}>
        <h3>How SSR Works:</h3>
        <ol>
          <li>Server runs getServerSideProps before rendering the page</li>
          <li>Data is fetched on the server for each request</li>
          <li>Page is rendered on the server with the data</li>
          <li>HTML is sent to the client with data already included</li>
          <li>Client-side JavaScript hydrates the page</li>
        </ol>
        
        <h4>Use Cases:</h4>
        <ul>
          <li>Pages that need real-time data</li>
          <li>User-specific content</li>
          <li>Pages that require authentication</li>
          <li>Data that changes frequently</li>
        </ul>
      </div>
      
      <Link href="/" style={{ color: '#007bff', marginTop: '20px', display: 'inline-block' }}>
        ← Back to Home
      </Link>
    </div>
  );
}

// getServerSideProps runs on server for each request
export async function getServerSideProps(context) {
  // Fetch data on server
  const serverData = {
    message: 'This data was fetched on the server',
    timestamp: new Date().toISOString(),
    userAgent: context.req.headers['user-agent'] || 'Unknown',
    method: 'getServerSideProps'
  };

  return {
    props: {
      serverData, // Will be passed to the page component as props
    },
  };
}

// Static Site Generation (SSG) example
function SSGExample({ staticData }) {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>SSG Example - Next.js Examples</title>
      </Head>
      
      <h1>Static Site Generation (SSG)</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>Data generated at build time:</h3>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e8f5e8', 
          borderRadius: '8px',
          border: '1px solid #c8e6c9'
        }}>
          <pre>{JSON.stringify(staticData, null, 2)}</pre>
        </div>
      </div>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px' 
      }}>
        <h3>How SSG Works:</h3>
        <ol>
          <li>getStaticProps runs at build time</li>
          <li>Data is fetched once during build</li>
          <li>Page is pre-rendered as static HTML</li>
          <li>Static files are served from CDN</li>
          <li>No server-side processing needed for requests</li>
        </ol>
        
        <h4>Use Cases:</h4>
        <ul>
          <li>Blog posts</li>
          <li>Documentation</li>
          <li>Marketing pages</li>
          <li>E-commerce product pages</li>
          <li>Any content that doesn't change frequently</li>
        </ul>
      </div>
      
      <Link href="/" style={{ color: '#007bff', marginTop: '20px', display: 'inline-block' }}>
        ← Back to Home
      </Link>
    </div>
  );
}

// getStaticProps runs at build time
export async function getStaticProps() {
  // Fetch data at build time
  const staticData = {
    message: 'This data was generated at build time',
    buildTime: new Date().toISOString(),
    method: 'getStaticProps'
  };

  return {
    props: {
      staticData,
    },
    // Optional: revalidate every 60 seconds
    revalidate: 60,
  };
}

// ===== EXAMPLE 5: STYLING AND CSS =====
/**
 * Styling examples demonstrating different approaches
 * Next.js supports CSS Modules, global CSS, and CSS-in-JS
 */

function StylingExample() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: theme === 'dark' ? '#1a1a1a' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
      minHeight: '100vh'
    }}>
      <Head>
        <title>Styling Example - Next.js Examples</title>
        <style jsx global>{`
          body {
            margin: 0;
            padding: 0;
            transition: background-color 0.3s ease;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .card {
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .light-theme {
            background-color: #f5f5f5;
            color: #333;
          }
          
          .dark-theme {
            background-color: #1a1a1a;
            color: #fff;
          }
        `}</style>
      </Head>
      
      <div className="container">
        <h1>Styling in Next.js</h1>
        
        <button
          onClick={toggleTheme}
          style={{
            padding: '10px 20px',
            backgroundColor: theme === 'dark' ? '#fff' : '#000',
            color: theme === 'dark' ? '#000' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
        
        <div className={`card ${theme}-theme`}>
          <h3>CSS Modules Example</h3>
          <p>This card uses CSS Modules for styling.</p>
        </div>
        
        <div className={`card ${theme}-theme`}>
          <h3>Global CSS Example</h3>
          <p>This card uses global CSS classes.</p>
        </div>
        
        <div className={`card ${theme}-theme`}>
          <h3>CSS-in-JS Example</h3>
          <p>This card uses styled-jsx for component-scoped styling.</p>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          marginTop: '30px'
        }}>
          <h3>Styling Approaches in Next.js:</h3>
          
          <h4>1. CSS Modules</h4>
          <ul>
            <li>File naming: Component.module.css</li>
            <li>Scoped styles by default</li>
            <li>No class name collisions</li>
            <li>Build-time optimization</li>
          </ul>
          
          <h4>2. Global CSS</h4>
          <ul>
            <li>Import in _app.js or pages/_app.js</li>
            <li>Global styles available everywhere</li>
            <li>Good for base styles and themes</li>
          </ul>
          
          <h4>3. CSS-in-JS (styled-jsx)</h4>
          <ul>
            <li>Component-scoped styles</li>
            <li>Dynamic styling based on props</li>
            <li>No runtime overhead</li>
            <li>Built-in to Next.js</li>
          </ul>
        </div>
        
        <Link href="/" style={{ 
          color: theme === 'dark' ? '#90caf9' : '#007bff', 
          marginTop: '20px', 
          display: 'inline-block' 
        }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

// ===== MAIN APP COMPONENT =====
/**
 * Main component that demonstrates all Next.js examples
 * In a real Next.js app, these would be separate page files
 */
function NextJSExamples() {
  const [currentExample, setCurrentExample] = useState('home');

  const examples = [
    { id: 'home', name: 'Home', component: HomePage },
    { id: 'about', name: 'About', component: AboutPage },
    { id: 'contact', name: 'Contact', component: ContactPage },
    { id: 'blog', name: 'Blog Index', component: BlogIndexPage },
    { id: 'blog-post', name: 'Blog Post', component: BlogPostPage },
    { id: 'api', name: 'API Routes', component: HelloAPIExample },
    { id: 'ssr', name: 'SSR', component: SSRExample },
    { id: 'ssg', name: 'SSG', component: SSGExample },
    { id: 'styling', name: 'Styling', component: StylingExample },
  ];

  const CurrentExampleComponent = examples.find(ex => ex.id === currentExample)?.component || HomePage;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>Next.js Examples</title>
        <meta name="description" content="Comprehensive Next.js examples" />
      </Head>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6'
      }}>
        <h1>Next.js Examples</h1>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {examples.map(example => (
            <button
              key={example.id}
              onClick={() => setCurrentExample(example.id)}
              style={{
                padding: '8px 16px',
                backgroundColor: currentExample === example.id ? '#007bff' : '#e9ecef',
                color: currentExample === example.id ? 'white' : 'black',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {example.name}
            </button>
          ))}
        </div>
        
        <p style={{ color: '#6c757d', fontSize: '14px' }}>
          Note: In a real Next.js application, each example would be a separate page file in the pages/ directory.
          This is a demonstration component showing all examples in one place.
        </p>
      </div>
      
      <div style={{ padding: '20px' }}>
        <CurrentExampleComponent />
      </div>
      
      <div style={{ 
        padding: '30px 20px', 
        backgroundColor: '#e9ecef',
        marginTop: '20px'
      }}>
        <h2>About Next.js</h2>
        <p>
          Next.js is a React framework for building full-stack web applications. 
          It provides features like server-side rendering, static site generation, 
          API routes, file-based routing, and more out of the box.
        </p>
        
        <h3>Key Features Demonstrated:</h3>
        <ul>
          <li><strong>File-based Routing:</strong> Automatic route creation based on file structure</li>
          <li><strong>Dynamic Routes:</strong> URL parameters with bracket notation</li>
          <li><strong>API Routes:</strong> Backend endpoints within the same project</li>
          <li><strong>Data Fetching:</strong> SSR, SSG, and CSR methods</li>
          <li><strong>Styling:</strong> Multiple styling approaches supported</li>
          <li><strong>Head Component:</strong> Meta tag management</li>
          <li><strong>Link Component:</strong> Optimized client-side navigation</li>
        </ul>
      </div>
    </div>
  );
}

export default NextJSExamples;