import React, { useState, useEffect } from 'react';

// Astro Examples - Comprehensive Guide to the Modern Web Framework
// Astro is a modern website build tool that combines powerful developer experience with lightweight output.
// It enables building fast, content-focused websites using multiple UI frameworks while shipping minimal JavaScript.

// ===== 1. BASIC ASTRO COMPONENTS =====

// Basic Astro component structure (demonstrated as JSX for compatibility)
// In real Astro, this would be: src/components/Card.astro
const CardComponent = ({ title, description, imageUrl, children }) => {
  return (
    <div className="card">
      {imageUrl && <img src={imageUrl} alt={title} />}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
};

// Astro equivalent:
// ---
// export interface Props {
//   title: string;
//   description?: string;
//   imageUrl?: string;
// }
// const { title, description, imageUrl } = Astro.props;
// ---
// <div class="card">
//   {imageUrl && <img src={imageUrl} alt={title} />}
//   <h2>{title}</h2>
//   {description && <p>{description}</p>}
//   <slot />
// </div>

// ===== 2. LAYOUT COMPONENTS =====

// Base layout component (demonstrated as JSX)
// In real Astro, this would be: src/layouts/Layout.astro
const LayoutComponent = ({ title, description, children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="description" content={description} />
        <title>{title}</title>
      </head>
      <body>
        <header>
          <nav>
            <a href="/">Home</a>
            <a href="/blog">Blog</a>
            <a href="/about">About</a>
          </nav>
        </header>
        
        <main>
          {children}
        </main>
        
        <footer>
          <p>&copy; 2024 My Astro Site</p>
        </footer>
      </body>
    </html>
  );
};

// ===== 3. PAGES AND ROUTING =====

// Index page (demonstrated as JSX)
// In real Astro, this would be: src/pages/index.astro
const IndexPage = () => {
  return (
    <LayoutComponent title="Welcome to Astro" description="Building fast, content-focused websites">
      <section className="hero">
        <h1>Welcome to My Astro Site</h1>
        <p>Building fast, content-focused websites</p>
      </section>
      
      <section className="features">
        <h2>Features</h2>
        <div className="card-grid">
          <CardComponent title="Fast by Default" description="Minimal JavaScript, maximum performance" />
          <CardComponent title="Multi-Framework" description="Use React, Vue, Svelte, and more" />
          <CardComponent title="SEO Optimized" description="Built-in SEO best practices" />
        </div>
      </section>
    </LayoutComponent>
  );
};

// Dynamic routing with params (demonstrated as JSX)
// In real Astro, this would be: src/pages/blog/[slug].astro
const BlogPostPage = ({ post }) => {
  // In real Astro:
  // export async function getStaticPaths() {
  //   const posts = await getCollection('blog');
  //   return posts.map(post => ({
  //     params: { slug: post.slug },
  //     props: { post }
  //   }));
  // }
  // const { post } = Astro.props;
  // const { Content } = await post.render();
  
  return (
    <LayoutComponent 
      title={post.title} 
      description={post.description}
    >
      <article className="blog-post">
        <header>
          <h1>{post.title}</h1>
          <time>{new Date(post.pubDate).toLocaleDateString()}</time>
          <p>By {post.author}</p>
          <div className="tags">
            {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
        </header>
        
        <div className="content">
          {/* In real Astro: <Content /> */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </LayoutComponent>
  );
};

// ===== 4. CONTENT COLLECTIONS =====

// Content configuration (demonstrated as JS object)
// In real Astro, this would be: src/content/config.ts
const contentConfig = {
  blog: {
    schema: {
      title: 'string',
      description: 'string',
      pubDate: 'date',
      updatedDate: 'date?',
      heroImage: 'string?',
      author: 'string',
      tags: 'array',
      draft: 'boolean',
      featured: 'boolean'
    }
  },
  projects: {
    schema: {
      title: 'string',
      description: 'string',
      demoUrl: 'url?',
      repoUrl: 'url',
      technologies: 'array',
      completed: 'boolean'
    }
  }
};

// Using content collections (demonstrated as JSX)
// In real Astro, this would be: src/pages/blog/index.astro
const BlogIndexPage = () => {
  // In real Astro:
  // const posts = await getCollection('blog', ({ data }) => !data.draft);
  // const featuredPosts = posts.filter(post => post.data.featured);
  // const regularPosts = posts.filter(post => !post.data.featured);
  
  const posts = [
    { slug: 'post-1', title: 'First Post', description: 'Description 1', featured: true },
    { slug: 'post-2', title: 'Second Post', description: 'Description 2', featured: false }
  ];
  
  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);
  
  return (
    <LayoutComponent title="Blog">
      <section>
        <h1>Blog</h1>
        
        {featuredPosts.length > 0 && (
          <section className="featured">
            <h2>Featured Posts</h2>
            <div className="card-grid">
              {featuredPosts.map(post => (
                <CardComponent 
                  key={post.slug}
                  title={post.title}
                  description={post.description}
                >
                  <a href={`/blog/${post.slug}/`}>Read more</a>
                </CardComponent>
              ))}
            </div>
          </section>
        )}
        
        <section className="recent">
          <h2>Recent Posts</h2>
          <div className="post-list">
            {regularPosts.map(post => (
              <article key={post.slug} className="post-item">
                <h3><a href={`/blog/${post.slug}/`}>{post.title}</a></h3>
                <p>{post.description}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </LayoutComponent>
  );
};

// ===== 5. FRAMEWORK INTEGRATIONS =====

// React component integration
const Counter = ({ initial = 0 }) => {
  const [count, setCount] = useState(initial);
  
  return (
    <div className="counter">
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
};

// Using React components in Astro (demonstrated as JSX)
// In real Astro, this would be: src/pages/interactive.astro
const InteractivePage = () => {
  return (
    <LayoutComponent title="Interactive Components">
      <section>
        <h1>Interactive Components</h1>
        
        <div className="component-demo">
          <h2>Counter Component</h2>
          {/* In real Astro: <Counter client:load initial={5} /> */}
          <Counter initial={5} />
        </div>
        
        <div className="component-demo">
          <h2>Chart Component</h2>
          {/* In real Astro: <InteractiveChart client:visible /> */}
          <div>Chart component would load when visible</div>
        </div>
        
        <div className="component-demo">
          <h2>Media-based Component</h2>
          {/* In real Astro: <Counter client:media="(max-width: 768px)" initial={10} /> */}
          <div>Counter would load on mobile devices</div>
        </div>
      </section>
    </LayoutComponent>
  );
};

// ===== 6. API ROUTES =====

// API route for data fetching (demonstrated as function)
// In real Astro, this would be: src/pages/api/posts.json.ts
const getPostsAPI = async ({ url }) => {
  const searchParams = new URL(url).searchParams;
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');
  const tag = searchParams.get('tag');
  
  // In real Astro:
  // let posts = await getCollection('blog', ({ data }) => !data.draft);
  // if (tag) {
  //   posts = posts.filter(post => post.data.tags.includes(tag));
  // }
  // const paginatedPosts = posts.slice(offset, offset + limit);
  
  const posts = [
    { slug: 'post-1', title: 'First Post', description: 'Description 1', tags: ['react', 'astro'] },
    { slug: 'post-2', title: 'Second Post', description: 'Description 2', tags: ['vue', 'astro'] }
  ];
  
  let filteredPosts = posts;
  if (tag) {
    filteredPosts = posts.filter(post => post.tags.includes(tag));
  }
  
  const paginatedPosts = filteredPosts.slice(offset, offset + limit);
  
  return {
    posts: paginatedPosts,
    total: filteredPosts.length,
    hasMore: offset + limit < filteredPosts.length
  };
};

// POST API route (demonstrated as function)
// In real Astro, this would be: src/pages/api/contact.json.ts
const contactAPI = async ({ request }) => {
  try {
    const data = await request.json();
    
    if (!data.name || !data.email || !data.message) {
      return {
        error: 'Missing required fields',
        status: 400
      };
    }
    
    // Process contact form (send email, save to database, etc.)
    await processContactForm(data);
    
    return {
      message: 'Contact form submitted successfully',
      status: 200
    };
  } catch (error) {
    return {
      error: 'Internal server error',
      status: 500
    };
  }
};

// Mock function for demonstration
const processContactForm = async (data) => {
  console.log('Processing contact form:', data);
};

// ===== 7. IMAGE OPTIMIZATION =====

// Image optimization examples (demonstrated as JSX)
// In real Astro, this would be: src/pages/gallery.astro
const GalleryPage = () => {
  // In real Astro:
  // import { Image, Picture } from 'astro:assets';
  // import heroImage from '../assets/hero.jpg';
  // import galleryImages from '../assets/gallery/*.jpg';
  
  return (
    <LayoutComponent title="Image Gallery">
      <section>
        <h1>Image Gallery</h1>
        
        <div className="hero-image">
          {/* In real Astro:
          <Image
            src={heroImage}
            alt="Hero image"
            width={1200}
            height={600}
            format="webp"
            quality={85}
            loading="eager"
          />
          */}
          <img src="/hero.jpg" alt="Hero image" width={1200} height={600} />
        </div>
        
        <div className="gallery-grid">
          {[1, 2, 3, 4, 5, 6].map(index => (
            <div key={index} className="gallery-item">
              {/* In real Astro:
              <Picture
                src={galleryImages[index - 1]}
                formats={['avif', 'webp', 'jpg']}
                alt={`Gallery image ${index}`}
                widths={[300, 600, 900]}
                sizes="(max-width: 600px) 300px, (max-width: 900px) 600px, 900px"
                loading="lazy"
              />
              */}
              <img 
                src={`/gallery/image${index}.jpg`} 
                alt={`Gallery image ${index}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>
    </LayoutComponent>
  );
};

// ===== 8. MDX INTEGRATION =====

// MDX page with components (demonstrated as JSX)
// In real Astro, this would be: src/pages/docs/getting-started.mdx
const GettingStartedPage = () => {
  return (
    <LayoutComponent title="Getting Started">
      <article>
        <h1>Getting Started</h1>
        <p>Welcome to the getting started guide! This page demonstrates how to use MDX in Astro.</p>
        
        <h2>Installation</h2>
        <pre><code>npm create astro@latest</code></pre>
        
        <h2>Interactive Components</h2>
        <p>You can include interactive components directly in your MDX:</p>
        <Counter initial={0} />
        
        <h2>Call to Action</h2>
        <button>Get Started</button>
        
        <h2>Features</h2>
        <ul>
          <li><strong>Fast by Default</strong>: Ships zero JavaScript by default</li>
          <li><strong>Islands Architecture</strong>: Add interactivity only where needed</li>
          <li><strong>Multi-Framework</strong>: Use React, Vue, Svelte, and more</li>
        </ul>
      </article>
    </LayoutComponent>
  );
};

// ===== 9. RSS FEEDS =====

// RSS feed generation (demonstrated as function)
// In real Astro, this would be: src/pages/rss.xml.ts
const generateRSSFeed = async (context) => {
  // In real Astro:
  // const posts = await getCollection('blog', ({ data }) => !data.draft);
  
  const posts = [
    { slug: 'post-1', title: 'First Post', description: 'Description 1', pubDate: new Date() },
    { slug: 'post-2', title: 'Second Post', description: 'Description 2', pubDate: new Date() }
  ];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>My Astro Blog</title>
        <description>A blog about web development and Astro</description>
        <link>${context.site}</link>
        ${posts.map(post => `
          <item>
            <title>${post.title}</title>
            <description>${post.description}</description>
            <link>${context.site}/blog/${post.slug}/</link>
            <pubDate>${post.pubDate.toUTCString()}</pubDate>
          </item>
        `).join('')}
      </channel>
    </rss>`;
};

// ===== 10. SITEMAP GENERATION =====

// Sitemap generation (demonstrated as function)
// In real Astro, this would be: src/pages/sitemap.xml.ts
const generateSitemap = async (site) => {
  const pages = [
    '',
    '/about',
    '/contact',
    '/blog',
    '/projects'
  ];
  
  const posts = [
    { slug: 'post-1', updatedDate: new Date() },
    { slug: 'post-2', updatedDate: new Date() }
  ];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages.map(page => `
        <url>
          <loc>${site}${page}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>${page === '' ? '1.0' : '0.8'}</priority>
        </url>
      `).join('')}
      ${posts.map(post => `
        <url>
          <loc>${site}/blog/${post.slug}/</loc>
          <lastmod>${post.updatedDate.toISOString()}</lastmod>
          <priority>0.6</priority>
        </url>
      `).join('')}
    </urlset>`;
};

// ===== 11. FORM HANDLING =====

// Contact form (demonstrated as JSX)
// In real Astro, this would be: src/pages/contact.astro
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  
  return (
    <LayoutComponent title="Contact Us">
      <section>
        <h1>Contact Us</h1>
        
        {submitted ? (
          <div className="success-message">
            <p>Thank you for your message! We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit">Send Message</button>
          </form>
        )}
      </section>
    </LayoutComponent>
  );
};

// ===== 12. SEARCH FUNCTIONALITY =====

// Search component
const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    
    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        // In real Astro: const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const response = await fetch('/api/search.json');
        const data = await response.json();
        setResults(data.results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(searchTimeout);
  }, [query]);
  
  return (
    <div className="search">
      <div className="search-input">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          autoFocus
        />
        {loading && <div className="loading">Searching...</div>}
      </div>
      
      {results.length > 0 && (
        <div className="search-results">
          <h3>Results ({results.length})</h3>
          <ul>
            {results.map(result => (
              <li key={result.slug}>
                <a href={`/blog/${result.slug}/`}>
                  <h4>{result.title}</h4>
                  <p>{result.description}</p>
                  <small>{result.date}</small>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Search page (demonstrated as JSX)
// In real Astro, this would be: src/pages/search.astro
const SearchPage = () => {
  return (
    <LayoutComponent title="Search">
      <section>
        <h1>Search</h1>
        <SearchComponent />
      </section>
    </LayoutComponent>
  );
};

// ===== 13. PAGINATION =====

// Pagination component
const Pagination = ({ currentPage, totalPages, baseUrl }) => {
  const pages = [];
  
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  
  return (
    <div className="pagination">
      {currentPage > 1 && (
        <a href={`${baseUrl}/${currentPage - 1}`} className="prev">Previous</a>
      )}
      
      {pages.map(page => (
        <a
          key={page}
          href={`${baseUrl}/${page}`}
          className={page === currentPage ? 'active' : ''}
        >
          {page}
        </a>
      ))}
      
      {currentPage < totalPages && (
        <a href={`${baseUrl}/${currentPage + 1}`} className="next">Next</a>
      )}
    </div>
  );
};

// Paginated blog listing (demonstrated as JSX)
// In real Astro, this would be: src/pages/blog/[page].astro
const BlogPage = ({ page }) => {
  // In real Astro:
  // export async function getStaticPaths({ paginate }) {
  //   const posts = await getCollection('blog', ({ data }) => !data.draft);
  //   return paginate(posts);
  // }
  // const { page } = Astro.props;
  
  return (
    <LayoutComponent title={`Blog - Page ${page.currentPage}`}>
      <section>
        <h1>Blog</h1>
        
        <div className="post-list">
          {page.data.map(post => (
            <article key={post.slug} className="post-item">
              <h2><a href={`/blog/${post.slug}/`}>{post.title}</a></h2>
              <p>{post.description}</p>
              <time>{new Date(post.pubDate).toLocaleDateString()}</time>
              <div className="tags">
                {post.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
        
        <Pagination 
          currentPage={page.currentPage}
          totalPages={page.lastPage}
          baseUrl="/blog"
        />
      </section>
    </LayoutComponent>
  );
};

// ===== 14. MIDDLEWARE =====

// Middleware for authentication (demonstrated as function)
// In real Astro, this would be: src/middleware.ts
const middleware = (context, next) => {
  const { url, request } = context;
  
  // Protect admin routes
  if (url.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !isValidAuth(authHeader)) {
      return new Response('Unauthorized', { status: 401 });
    }
  }
  
  // Continue to next middleware or route
  return next();
};

const isValidAuth = (header) => {
  // Implement your authentication logic
  return header === 'Bearer valid-token';
};

// ===== 15. ENVIRONMENT VARIABLES =====

// Using environment variables (demonstrated as function)
// In real Astro, this would be: src/pages/api/config.json.ts
const getConfig = () => {
  const config = {
    apiUrl: process.env.PUBLIC_API_URL || 'https://api.example.com',
    environment: process.env.PUBLIC_ENV || 'development',
    features: {
      analytics: process.env.PUBLIC_ENABLE_ANALYTICS === 'true',
      comments: process.env.PUBLIC_ENABLE_COMMENTS === 'true'
    }
  };
  
  return config;
};

// ===== USAGE EXAMPLES =====

// Example 1: Complete blog post with all features
const CompleteBlogPost = ({ post }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  
  useEffect(() => {
    // Fetch related posts based on tags
    const fetchRelatedPosts = async () => {
      // In real Astro: const response = await fetch(`/api/related-posts/${post.slug}`);
      const mockRelatedPosts = [
        { slug: 'related-1', title: 'Related Post 1' },
        { slug: 'related-2', title: 'Related Post 2' }
      ];
      setRelatedPosts(mockRelatedPosts);
    };
    
    // Fetch comments
    const fetchComments = async () => {
      // In real Astro: const response = await fetch(`/api/comments/${post.slug}`);
      const mockComments = [
        { id: 1, author: 'John', text: 'Great post!' },
        { id: 2, author: 'Jane', text: 'Very helpful!' }
      ];
      setComments(mockComments);
    };
    
    fetchRelatedPosts();
    fetchComments();
  }, [post.slug]);
  
  return (
    <LayoutComponent 
      title={post.title} 
      description={post.description}
    >
      <article>
        {post.heroImage && (
          <div className="hero-image">
            <img
              src={post.heroImage}
              alt={post.title}
              width={1200}
              height={600}
            />
          </div>
        )}
        
        <div className="table-of-contents">
          <h3>Table of Contents</h3>
          <ul>
            {post.headings?.map(heading => (
              <li key={heading.slug}>
                <a href={`#${heading.slug}`}>{heading.text}</a>
              </li>
            ))}
          </ul>
        </div>
        
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <div className="post-footer">
          <div className="tags">
            <h4>Tags:</h4>
            {post.tags.map(tag => (
              <a key={tag} href={`/blog/tag/${tag}`} className="tag">{tag}</a>
            ))}
          </div>
          
          <div className="share-buttons">
            <h4>Share:</h4>
            <button onClick={() => shareOnTwitter(post.title, window.location.href)}>Twitter</button>
            <button onClick={() => shareOnFacebook(window.location.href)}>Facebook</button>
            <button onClick={() => copyLink(window.location.href)}>Copy Link</button>
          </div>
        </div>
        
        {relatedPosts.length > 0 && (
          <div className="related-posts">
            <h3>Related Posts</h3>
            <div className="card-grid">
              {relatedPosts.map(relatedPost => (
                <CardComponent 
                  key={relatedPost.slug}
                  title={relatedPost.title}
                >
                  <a href={`/blog/${relatedPost.slug}/`}>Read more</a>
                </CardComponent>
              ))}
            </div>
          </div>
        )}
        
        <div className="comments-section">
          <h3>Comments</h3>
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <h4>{comment.author}</h4>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
          
          <form className="comment-form">
            <h4>Leave a Comment</h4>
            <div className="form-group">
              <input type="text" placeholder="Your name" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Your comment" rows={4} required></textarea>
            </div>
            <button type="submit">Submit Comment</button>
          </form>
        </div>
      </article>
    </LayoutComponent>
  );
};

// Helper functions for sharing
const shareOnTwitter = (title, url) => {
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
};

const shareOnFacebook = (url) => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
};

const copyLink = (url) => {
  navigator.clipboard.writeText(url);
  alert('Link copied to clipboard!');
};

// Example 2: E-commerce product page
const ProductPage = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  
  const addToCart = () => {
    // In real Astro: fetch('/api/cart', { method: 'POST', body: JSON.stringify({...}) });
    setCartCount(cartCount + quantity);
    alert(`Added ${quantity} ${product.title} to cart!`);
  };
  
  return (
    <LayoutComponent title={product.title}>
      <div className="product-page">
        <div className="product-images">
          <div className="main-image">
            <img src={product.images?.[0]} alt={product.title} />
          </div>
          <div className="thumbnail-grid">
            {product.images?.slice(1).map((image, index) => (
              <img key={index} src={image} alt={`${product.title} ${index + 1}`} />
            ))}
          </div>
        </div>
        
        <div className="product-info">
          <h1>{product.title}</h1>
          <p className="price">${product.price}</p>
          <p className="description">{product.description}</p>
          
          <div className="product-options">
            <div className="option-group">
              <label htmlFor="size">Size:</label>
              <select 
                id="size" 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Select size</option>
                {product.sizes?.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            
            <div className="option-group">
              <label htmlFor="color">Color:</label>
              <select 
                id="color" 
                value={selectedColor} 
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                <option value="">Select color</option>
                {product.colors?.map(color => (
                  <option key={color.value} value={color.value}>{color.name}</option>
                ))}
              </select>
            </div>
            
            <div className="option-group">
              <label htmlFor="quantity">Quantity:</label>
              <input 
                type="number" 
                id="quantity" 
                min="1" 
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <button 
            onClick={addToCart}
            disabled={!selectedSize || !selectedColor}
            className="add-to-cart-btn"
          >
            Add to Cart
          </button>
          
          <div className="product-details">
            <h3>Product Details</h3>
            <ul>
              {product.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
};

// Example 3: Dashboard with data visualization
const DashboardPage = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [activity, setActivity] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      // In real Astro: fetch data from API
      const mockStats = {
        totalUsers: 1234,
        totalRevenue: 5678,
        conversionRate: 3.4,
        avgOrderValue: 89
      };
      
      const mockChartData = [
        { date: '2024-01-01', value: 100 },
        { date: '2024-01-02', value: 150 },
        { date: '2024-01-03', value: 120 }
      ];
      
      const mockActivity = [
        { id: 1, type: 'user_signup', user: 'John Doe', timestamp: new Date() },
        { id: 2, type: 'purchase', user: 'Jane Smith', timestamp: new Date() }
      ];
      
      setStats(mockStats);
      setChartData(mockChartData);
      setActivity(mockActivity);
    };
    
    fetchDashboardData();
  }, [dateRange]);
  
  return (
    <LayoutComponent title="Dashboard">
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="date-range">
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </header>
        
        <div className="stats-cards">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-value">${stats.totalRevenue}</p>
          </div>
          <div className="stat-card">
            <h3>Conversion Rate</h3>
            <p className="stat-value">{stats.conversionRate}%</p>
          </div>
          <div className="stat-card">
            <h3>Avg Order Value</h3>
            <p className="stat-value">${stats.avgOrderValue}</p>
          </div>
        </div>
        
        <div className="dashboard-grid">
          <div className="chart-container">
            <h2>Analytics Overview</h2>
            <div className="chart">
              {/* In real Astro: <AnalyticsChart data={chartData} client:visible /> */}
              <div>Chart would render here with {chartData.length} data points</div>
            </div>
          </div>
          
          <div className="activity-container">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {activity.map(item => (
                <div key={item.id} className="activity-item">
                  <span className="activity-type">{item.type}</span>
                  <span className="activity-user">{item.user}</span>
                  <span className="activity-time">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
};

// ===== KEY CONCEPTS =====

/*
1. Islands Architecture: Ship zero JavaScript by default, hydrate only what's needed
2. Content-First: Built for content-focused sites with excellent content management
3. Multi-Framework: Use React, Vue, Svelte, and other frameworks together
4. Performance Optimized: Minimal JavaScript, optimized images, and fast builds
5. SEO Friendly: Server-side rendering with excellent SEO out of the box
6. Developer Experience: Fast refresh, TypeScript support, and modern tooling
7. Flexible Deployment: Deploy to any static host or server with adapters
8. Component-Based: Reusable components with scoped styles
9. File-Based Routing: Intuitive routing based on file structure
10. API Routes: Build full-stack applications with API endpoints
*/

// ===== BEST PRACTICES =====

/*
1. Use content collections for structured content management
2. Leverage client:* directives for optimal JavaScript loading
3. Optimize images with built-in Image component
4. Implement proper SEO with meta tags and structured data
5. Use TypeScript for better type safety and developer experience
6. Create reusable layout components for consistent design
7. Implement proper error handling and loading states
8. Use middleware for authentication and request processing
9. Optimize build performance with proper configuration
10. Test both static and dynamic functionality
*/

// ===== DEPLOYMENT EXAMPLES =====

/*
// Vercel deployment configuration
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "astro"
}

// Netlify deployment configuration
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "dist"

// Cloudflare Pages deployment
wrangler pages publish dist

// Docker deployment
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4321
CMD ["npm", "start"]
*/

// Export all components for use
export {
  CardComponent,
  LayoutComponent,
  IndexPage,
  BlogPostPage,
  BlogIndexPage,
  InteractivePage,
  GalleryPage,
  GettingStartedPage,
  ContactPage,
  SearchPage,
  BlogPage,
  CompleteBlogPost,
  ProductPage,
  DashboardPage,
  Counter,
  SearchComponent,
  Pagination,
  getPostsAPI,
  contactAPI,
  generateRSSFeed,
  generateSitemap,
  middleware,
  getConfig
};