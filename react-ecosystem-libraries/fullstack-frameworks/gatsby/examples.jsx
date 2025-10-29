import React, { useState, useEffect } from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';

// Gatsby Examples - Comprehensive Guide to the React-Based Static Site Generator
// Gatsby is a free, open-source framework based on React that helps developers build blazing-fast websites and apps
// by combining dynamic rendering with static-site generation.

// ===== 1. BASIC GATSBY PAGES =====

// Basic page component
// src/pages/index.js
const IndexPage = ({ data }) => {
  return (
    <div>
      <h1>Welcome to Gatsby</h1>
      <p>Building blazing-fast websites with React</p>
      
      <div className="features">
        <div className="feature">
          <h3>Blazing Fast</h3>
          <p>Automatic code splitting, image optimization, and caching</p>
        </div>
        <div className="feature">
          <h3>Modern Web</h3>
          <p>Progressive Web Apps, offline support, and more</p>
        </div>
        <div className="feature">
          <h3>Developer Experience</h3>
          <p>Hot reloading, modern tooling, and great DX</p>
        </div>
      </div>
    </div>
  );
};

// Page with GraphQL query
// src/pages/about.js
const AboutPage = ({ data }) => {
  const { site } = data;
  
  return (
    <div>
      <h1>About {site.siteMetadata.title}</h1>
      <p>{site.siteMetadata.description}</p>
      
      <div className="team">
        <h2>Our Team</h2>
        {data.team.edges.map(({ node }) => (
          <div key={node.id} className="team-member">
            <img src={node.avatar.childImageSharp.gatsbyImageData.images[0].src} alt={node.name} />
            <h3>{node.name}</h3>
            <p>{node.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const aboutPageQuery = graphql`
  query AboutPageQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
    team: allTeamJson {
      edges {
        node {
          id
          name
          role
          avatar {
            childImageSharp {
              gatsbyImageData(width: 150, height: 150, placeholder: BLURRED)
            }
          }
        }
      }
    }
  }
`;

// ===== 2. DYNAMIC PAGES WITH CREATE PAGES =====

// Template for blog posts
// src/templates/blog-post.js
const BlogPostTemplate = ({ data, pageContext }) => {
  const { markdownRemark } = data;
  const { frontmatter, html, timeToRead } = markdownRemark;
  const { previous, next } = pageContext;
  
  return (
    <div className="blog-post">
      <article>
        <header>
          <h1>{frontmatter.title}</h1>
          <div className="post-meta">
            <span>{frontmatter.date}</span>
            <span>•</span>
            <span>{timeToRead} min read</span>
            <span>•</span>
            <span>{frontmatter.author}</span>
          </div>
          {frontmatter.tags && (
            <div className="tags">
              {frontmatter.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </header>
        
        <div 
          className="post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        
        <footer>
          <div className="navigation">
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
            
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
};

export const blogPostQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        author
        tags
        featuredImage {
          childImageSharp {
            gatsbyImageData(width: 1200, quality: 85)
          }
        }
      }
    }
  }
`;

// gatsby-node.js - Create pages programmatically
// exports.createPages = async ({ graphql, actions }) => {
//   const { createPage } = actions;
//   
//   const result = await graphql(`
//     query {
//       allMarkdownRemark(sort: { fields: { date: DESC } }) {
//         edges {
//           node {
//             fields {
//               slug
//             }
//             frontmatter {
//               title
//             }
//           }
//         }
//       }
//     }
//   `);
//   
//   const posts = result.data.allMarkdownRemark.edges;
//   
//   posts.forEach((post, index) => {
//     const previous = index === posts.length - 1 ? null : posts[index + 1].node;
//     const next = index === 0 ? null : posts[index - 1].node;
//     
//     createPage({
//       path: post.node.fields.slug,
//       component: path.resolve('./src/templates/blog-post.js'),
//       context: {
//         slug: post.node.fields.slug,
//         previous,
//         next,
//       },
//     });
//   });
// };

// ===== 3. COMPONENTS WITH GATSBY IMAGE =====

// Image component with optimization
// src/components/optimized-image.js
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const OptimizedImage = ({ image, alt, className, ...props }) => {
  const gatsbyImage = getImage(image);
  
  if (!gatsbyImage) {
    return <img src={image} alt={alt} className={className} {...props} />;
  }
  
  return (
    <GatsbyImage
      image={gatsbyImage}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

// Gallery component
// src/components/image-gallery.js
const ImageGallery = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const openLightbox = (index) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };
  
  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };
  
  return (
    <div className="image-gallery">
      <div className="gallery-grid">
        {images.map((image, index) => (
          <div 
            key={image.id}
            className="gallery-item"
            onClick={() => openLightbox(index)}
          >
            <OptimizedImage
              image={image.localFile}
              alt={image.title}
              className="gallery-thumbnail"
            />
          </div>
        ))}
      </div>
      
      {isLightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content">
            <OptimizedImage
              image={images[selectedIndex].localFile}
              alt={images[selectedIndex].title}
              className="lightbox-image"
            />
            <button className="close-button" onClick={closeLightbox}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== 4. DATA SOURCING WITH PLUGINS =====

// Using GraphQL to query data
// src/pages/blog.js
const BlogPage = ({ data }) => {
  const posts = data.allMarkdownRemark.edges;
  
  return (
    <div className="blog">
      <h1>Blog</h1>
      
      <div className="posts-grid">
        {posts.map(({ node }) => (
          <article key={node.fields.slug} className="post-card">
            {node.frontmatter.featuredImage && (
              <Link to={node.fields.slug}>
                <OptimizedImage
                  image={node.frontmatter.featuredImage}
                  alt={node.frontmatter.title}
                  className="post-image"
                />
              </Link>
            )}
            
            <div className="post-content">
              <h2>
                <Link to={node.fields.slug}>
                  {node.frontmatter.title}
                </Link>
              </h2>
              <p>{node.frontmatter.description}</p>
              <div className="post-meta">
                <span>{node.frontmatter.date}</span>
                <span>•</span>
                <span>{node.timeToRead} min read</span>
              </div>
              
              {node.frontmatter.tags && (
                <div className="tags">
                  {node.frontmatter.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export const blogPageQuery = graphql`
  query BlogPageQuery {
    allMarkdownRemark(
      sort: { fields: { date: DESC } }
      filter: { frontmatter: { published: { eq: true } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            description
            date(formatString: "MMMM DD, YYYY")
            tags
            featuredImage {
              childImageSharp {
                gatsbyImageData(width: 400, height: 250, quality: 85)
              }
            }
          }
          timeToRead
        }
      }
    }
  }
`;

// ===== 5. GATSBY FUNCTIONS =====

// API function for contact form
// src/api/contact.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { name, email, message } = req.body;
  
  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Process contact form (send email, save to database, etc.)
  try {
    sendContactEmail({ name, email, message });
    
    return res.status(200).json({
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}

// Mock function for demonstration
const sendContactEmail = async ({ name, email, message }) => {
  console.log('Sending email:', { name, email, message });
  // In real implementation, use nodemailer, SendGrid, etc.
};

// Contact form component
// src/components/contact-form.js
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="success-message">
        <h3>Thank you for your message!</h3>
        <p>We'll get back to you as soon as possible.</p>
      </div>
    );
  }
  
  return (
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
      
      {error && <div className="error-message">{error}</div>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

// ===== 6. SEO COMPONENT =====

// SEO component for meta tags
// src/components/seo.js
const SEO = ({ 
  title, 
  description, 
  image, 
  article, 
  location, 
  keywords 
}) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            defaultTitle: title
            titleTemplate
            defaultDescription: description
            siteUrl
            defaultImage: image
            twitterUsername
          }
        }
      }
    `
  );
  
  const {
    defaultTitle,
    titleTemplate,
    defaultDescription,
    siteUrl,
    defaultImage,
    twitterUsername,
  } = site.siteMetadata;
  
  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${location.pathname}`,
    keywords: keywords || [],
  };
  
  return (
    <>
      <title>{titleTemplate ? titleTemplate.replace('%s', seo.title) : seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      <meta name="keywords" content={seo.keywords.join(', ')} />
      
      {seo.url && <meta property="og:url" content={seo.url} />}
      {(article ? true : null) && <meta property="og:type" content="article" />}
      {seo.title && <meta property="og:title" content={seo.title} />}
      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}
      {seo.image && <meta property="og:image" content={seo.image} />}
      
      <meta name="twitter:card" content="summary_large_image" />
      {twitterUsername && (
        <meta name="twitter:creator" content={twitterUsername} />
      )}
      {seo.title && <meta name="twitter:title" content={seo.title} />}
      {seo.description && (
        <meta name="twitter:description" content={seo.description} />
      )}
      {seo.image && <meta name="twitter:image" content={seo.image} />}
    </>
  );
};

// ===== 7. LAYOUT COMPONENT =====

// Main layout component
// src/components/layout.js
const Layout = ({ children, location, title, description, image }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className="layout">
      <SEO 
        title={title}
        description={description}
        image={image}
        location={location}
      />
      
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            My Gatsby Site
          </Link>
          
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" activeClassName="active">Home</Link>
            <Link to="/blog" activeClassName="active">Blog</Link>
            <Link to="/about" activeClassName="active">About</Link>
            <Link to="/contact" activeClassName="active">Contact</Link>
          </nav>
          
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '×' : '☰'}
          </button>
        </div>
      </header>
      
      <main className="main">
        {children}
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} My Gatsby Site</p>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ===== 8. SEARCH FUNCTIONALITY =====

// Search component with filtering
// src/components/search.js
const SearchComponent = ({ posts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  useEffect(() => {
    const filtered = posts.filter(post => {
      const titleMatch = post.node.frontmatter.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const contentMatch = post.node.frontmatter.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const tagMatch = post.node.frontmatter.tags?.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return titleMatch || contentMatch || tagMatch;
    });
    
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);
  
  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          className="search-input"
        />
        <div className="search-icon">🔍</div>
      </div>
      
      {searchTerm && isSearchFocused && (
        <div className="search-results">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(({ node }) => (
              <Link
                key={node.fields.slug}
                to={node.fields.slug}
                className="search-result-item"
              >
                <h4>{node.frontmatter.title}</h4>
                <p>{node.frontmatter.description}</p>
                <div className="search-tags">
                  {node.frontmatter.tags?.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </Link>
            ))
          ) : (
            <div className="no-results">
              No posts found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ===== 9. PAGINATION =====

// Pagination component
// src/components/pagination.js
const Pagination = ({ currentPage, numPages, basePath }) => {
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPage = currentPage - 1 === 1 ? basePath : `${basePath}/${currentPage - 1}`;
  const nextPage = `${basePath}/${currentPage + 1}`;
  
  return (
    <nav className="pagination">
      {!isFirst && (
        <Link to={prevPage} rel="prev" className="pagination-link">
          ← Previous
        </Link>
      )}
      
      <div className="pagination-numbers">
        {Array.from({ length: numPages }, (_, i) => {
          const pageNum = i + 1;
          const pagePath = pageNum === 1 ? basePath : `${basePath}/${pageNum}`;
          
          return (
            <Link
              key={pageNum}
              to={pagePath}
              className={`pagination-number ${
                currentPage === pageNum ? 'active' : ''
              }`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>
      
      {!isLast && (
        <Link to={nextPage} rel="next" className="pagination-link">
          Next →
        </Link>
      )}
    </nav>
  );
};

// Paginated blog page
// src/pages/blog/{pageNumber}.js
const BlogPaginatedPage = ({ data, pageContext }) => {
  const posts = data.allMarkdownRemark.edges;
  const { currentPage, numPages } = pageContext;
  
  return (
    <Layout>
      <div className="blog">
        <h1>Blog - Page {currentPage}</h1>
        
        <div className="posts-grid">
          {posts.map(({ node }) => (
            <article key={node.fields.slug} className="post-card">
              <Link to={node.fields.slug}>
                <h2>{node.frontmatter.title}</h2>
                <p>{node.frontmatter.description}</p>
                <time>{node.frontmatter.date}</time>
              </Link>
            </article>
          ))}
        </div>
        
        <Pagination
          currentPage={currentPage}
          numPages={numPages}
          basePath="/blog"
        />
      </div>
    </Layout>
  );
};

export const blogPaginatedQuery = graphql`
  query BlogPaginatedQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: { date: DESC } }
      limit: $limit
      skip: $skip
      filter: { frontmatter: { published: { eq: true } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            description
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;

// ===== 10. TAG PAGES =====

// Tag page template
// src/templates/tag.js
const TagTemplate = ({ pageContext, data }) => {
  const { tag } = pageContext;
  const { edges, totalCount } = data.allMarkdownRemark;
  const tagHeader = `${totalCount} post${totalCount === 1 ? '' : 's'} tagged with "${tag}"`;
  
  return (
    <Layout>
      <div className="tag-page">
        <h1>{tagHeader}</h1>
        
        <div className="posts-grid">
          {edges.map(({ node }) => (
            <article key={node.fields.slug} className="post-card">
              <Link to={node.fields.slug}>
                <h2>{node.frontmatter.title}</h2>
                <p>{node.frontmatter.description}</p>
                <time>{node.frontmatter.date}</time>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const tagQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: { date: DESC } }
      filter: { 
        frontmatter: { 
          tags: { in: [$tag] }
          published: { eq: true }
        } 
      }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            description
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;

// ===== 11. 404 PAGE =====

// Custom 404 page
// src/pages/404.js
const NotFoundPage = () => {
  return (
    <Layout>
      <div className="not-found">
        <h1>404: Page Not Found</h1>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        
        <div className="not-found-actions">
          <Link to="/" className="btn">
            Go Home
          </Link>
          
          <Link to="/blog" className="btn">
            Browse Blog
          </Link>
        </div>
        
        <div className="not-found-suggestions">
          <h3>Popular Pages</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/blog">Latest Posts</Link></li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

// ===== 12. CLIENT-ONLY ROUTES =====

// Client-only route for dynamic content
// src/pages/app.js
import { withPrefix } from 'gatsby';

const AppPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate authentication check
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const userData = await fetchUserData(token);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return (
      <div className="auth-container">
        <h2>Please Sign In</h2>
        <p>This is a protected area of the site.</p>
        <a href={`${withPrefix('/api/auth')}`}>Sign In with GitHub</a>
      </div>
    );
  }
  
  return (
    <div className="app-dashboard">
      <h1>Welcome, {user.name}!</h1>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Your Profile</h3>
          <img src={user.avatar} alt={user.name} />
          <p>{user.email}</p>
        </div>
        
        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <ul>
            <li>Viewed: Getting Started with Gatsby</li>
            <li>Commented on: React Hooks Guide</li>
            <li>Downloaded: Gatsby Starter Template</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Mock function for demonstration
const fetchUserData = async (token) => {
  // In real implementation, validate token with backend
  return {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://github.com/avatar.png'
  };
};

// ===== 13. PROGRESSIVE WEB APP =====

// PWA manifest configuration
// static/manifest.json
const pwaManifest = {
  name: 'My Gatsby Site',
  short_name: 'Gatsby Site',
  start_url: '/',
  background_color: '#ffffff',
  theme_color: '#663399',
  display: 'standalone',
  icons: [
    {
      src: 'icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: 'icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png'
    }
  ]
};

// Service worker for offline functionality
// gatsby-browser.js
export const onServiceWorkerUpdateReady = () => {
  // Show update notification to user
  const shouldShowUpdate = window.confirm(
    'A new version of this app is available. Reload to update?'
  );
  
  if (shouldShowUpdate) {
    window.location.reload();
  }
};

export const onServiceWorkerInstalled = () => {
  console.log('Service worker installed successfully');
};

export const onServiceWorkerActive = () => {
  console.log('Service worker is now active');
};

// ===== 14. ANALYTICS INTEGRATION =====

// Analytics tracking component
// src/components/analytics.js
const Analytics = ({ trackingId }) => {
  useEffect(() => {
    // Google Analytics
    if (typeof window !== 'undefined' && trackingId) {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', trackingId);
    }
  }, [trackingId]);
  
  return null; // This component doesn't render anything
};

// Custom event tracking
// src/hooks/use-analytics.js
export const useAnalytics = () => {
  const trackEvent = (eventName, parameters) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  };
  
  const trackPageView = (path) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_TRACKING_ID', {
        page_path: path
      });
    }
  };
  
  return { trackEvent, trackPageView };
};

// Usage in components
const BlogPostWithAnalytics = ({ data }) => {
  const { trackEvent } = useAnalytics();
  
  const handleShare = (platform) => {
    trackEvent('share', {
      method: platform,
      content_type: 'blog_post',
      item_id: data.markdownRemark.frontmatter.title
    });
  };
  
  return (
    <article>
      <h1>{data.markdownRemark.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
      
      <div className="share-buttons">
        <button onClick={() => handleShare('twitter')}>Share on Twitter</button>
        <button onClick={() => handleShare('facebook')}>Share on Facebook</button>
      </div>
    </article>
  );
};

// ===== 15. PERFORMANCE OPTIMIZATION =====

// Lazy loading component
// src/components/lazy-image.js
const LazyImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={imgRef} className="lazy-image-container">
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0 }}
          {...props}
        />
      )}
    </div>
  );
};

// Preloading critical resources
// gatsby-ssr.js
export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  const headComponents = getHeadComponents();
  
  // Add preconnect for external domains
  const preconnect = [
    <link key="preconnect-google" rel="preconnect" href="https://fonts.googleapis.com" />,
    <link key="preconnect-gstatic" rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  ];
  
  replaceHeadComponents([...preconnect, ...headComponents]);
};

// ===== USAGE EXAMPLES =====

// Example 1: Complete blog post with all features
const CompleteBlogPost = ({ data, pageContext }) => {
  const { markdownRemark } = data;
  const { frontmatter, html, tableOfContents } = markdownRemark;
  const { previous, next } = pageContext;
  const [readingProgress, setReadingProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setReadingProgress(scrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <Layout title={frontmatter.title} description={frontmatter.description}>
      <div className="reading-progress-bar" style={{ width: `${readingProgress}%` }} />
      
      <article className="blog-post">
        <header>
          <h1>{frontmatter.title}</h1>
          <div className="post-meta">
            <span>{frontmatter.date}</span>
            <span>•</span>
            <span>{markdownRemark.timeToRead} min read</span>
            <span>•</span>
            <span>{frontmatter.author}</span>
          </div>
          
          {frontmatter.tags && (
            <div className="tags">
              {frontmatter.tags.map(tag => (
                <Link key={tag} to={`/tags/${tag}`} className="tag">
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>
        
        {frontmatter.featuredImage && (
          <div className="featured-image">
            <OptimizedImage
              image={frontmatter.featuredImage}
              alt={frontmatter.title}
              className="post-hero"
            />
          </div>
        )}
        
        <div className="post-content-wrapper">
          {tableOfContents && (
            <aside className="table-of-contents">
              <h3>Table of Contents</h3>
              <div dangerouslySetInnerHTML={{ __html: tableOfContents }} />
            </aside>
          )}
          
          <div 
            className="post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
        
        <footer>
          <div className="author-bio">
            <img src={frontmatter.authorAvatar} alt={frontmatter.author} />
            <div>
              <h4>About {frontmatter.author}</h4>
              <p>{frontmatter.authorBio}</p>
            </div>
          </div>
          
          <div className="related-posts">
            <h3>Related Posts</h3>
            {/* Related posts would be fetched based on tags */}
          </div>
          
          <div className="post-navigation">
            {previous && (
              <Link to={previous.fields.slug} className="nav-link prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
            
            {next && (
              <Link to={next.fields.slug} className="nav-link next">
                {next.frontmatter.title} →
              </Link>
            )}
          </div>
          
          <div className="comments-section">
            <h3>Comments</h3>
            {/* Comments component would go here */}
          </div>
        </footer>
      </article>
    </Layout>
  );
};

// Example 2: E-commerce product page
const ProductPage = ({ data }) => {
  const { product } = data;
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  
  const addToCart = () => {
    // Add to cart logic
    setIsInCart(true);
    setTimeout(() => setIsInCart(false), 2000);
  };
  
  return (
    <Layout title={product.name} description={product.description}>
      <div className="product-page">
        <div className="product-images">
          <div className="main-image">
            <OptimizedImage
              image={selectedVariant.image}
              alt={product.name}
            />
          </div>
          
          <div className="thumbnail-grid">
            {product.variants.map((variant, index) => (
              <button
                key={index}
                onClick={() => setSelectedVariant(variant)}
                className={`thumbnail ${selectedVariant === variant ? 'active' : ''}`}
              >
                <OptimizedImage
                  image={variant.image}
                  alt={`${product.name} - ${variant.name}`}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="price">${selectedVariant.price}</div>
          <p className="description">{product.description}</p>
          
          <div className="product-options">
            <div className="variant-selector">
              <h3>Options</h3>
              {product.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedVariant(variant)}
                  className={`variant-option ${selectedVariant === variant ? 'active' : ''}`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
            
            <div className="quantity-selector">
              <h3>Quantity</h3>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <button 
            onClick={addToCart}
            className={`add-to-cart ${isInCart ? 'added' : ''}`}
            disabled={isInCart}
          >
            {isInCart ? 'Added to Cart!' : 'Add to Cart'}
          </button>
          
          <div className="product-details">
            <h3>Product Details</h3>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Example 3: Dashboard with data visualization
const DashboardPage = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In real Gatsby, this would be from Gatsby Functions or API
        const mockStats = {
          totalUsers: 1234,
          totalPosts: 56,
          totalViews: 7890,
          engagementRate: 4.5
        };
        
        const mockChartData = [
          { date: '2024-01-01', views: 100 },
          { date: '2024-01-02', views: 150 },
          { date: '2024-01-03', views: 120 }
        ];
        
        setStats(mockStats);
        setChartData(mockChartData);
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return <div>Loading dashboard...</div>;
  }
  
  return (
    <Layout title="Dashboard">
      <div className="dashboard">
        <h1>Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          
          <div className="stat-card">
            <h3>Total Posts</h3>
            <div className="stat-value">{stats.totalPosts}</div>
          </div>
          
          <div className="stat-card">
            <h3>Total Views</h3>
            <div className="stat-value">{stats.totalViews}</div>
          </div>
          
          <div className="stat-card">
            <h3>Engagement Rate</h3>
            <div className="stat-value">{stats.engagementRate}/5</div>
          </div>
        </div>
        
        <div className="chart-container">
          <h3>Views Over Time</h3>
          <div className="chart">
            {/* Chart component would render here */}
            {chartData.map((data, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar" 
                  style={{ height: `${data.views}px` }}
                />
                <span className="label">{data.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// ===== KEY CONCEPTS =====

/*
1. Static Site Generation: Pre-build pages at build time for optimal performance
2. GraphQL Data Layer: Unified data querying from various sources
3. Plugin Ecosystem: Extensive plugins for CMS, APIs, and functionality
4. Image Optimization: Automatic image optimization with gatsby-plugin-image
5. Code Splitting: Automatic code splitting for faster page loads
6. Progressive Web Apps: Built-in PWA support with service workers
7. SEO Optimization: Automatic SEO optimization with proper meta tags
8. Developer Experience: Hot reloading, modern tooling, and great DX
9. Blended Rendering: Mix static and dynamic content as needed
10. Performance Focus: Core Web Vitals optimization out of the box
*/

// ===== BEST PRACTICES =====

/*
1. Use GraphQL queries efficiently to avoid over-fetching data
2. Implement proper image optimization with gatsby-plugin-image
3. Structure content with markdown and frontmatter for consistency
4. Use page templates for dynamic content generation
5. Implement proper SEO with structured data and meta tags
6. Optimize build performance with proper plugin configuration
7. Use Gatsby Functions for dynamic functionality
8. Implement proper error handling and 404 pages
9. Use TypeScript for better type safety and developer experience
10. Test both development and production builds
*/

// ===== DEPLOYMENT EXAMPLES =====

/*
// Netlify deployment
[build]
  command = "gatsby build"
  publish = "public"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

// Vercel deployment
{
  "buildCommand": "gatsby build",
  "outputDirectory": "public",
  "installCommand": "npm install",
  "framework": "gatsby"
}

// GitHub Pages deployment
name: Deploy Gatsby Site
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Build Gatsby site
      run: npm run build
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./public
*/

// Export all components for use
export {
  IndexPage,
  AboutPage,
  BlogPostTemplate,
  BlogPage,
  OptimizedImage,
  ImageGallery,
  ContactForm,
  SEO,
  Layout,
  SearchComponent,
  Pagination,
  TagTemplate,
  NotFoundPage,
  AppPage,
  Analytics,
  LazyImage,
  CompleteBlogPost,
  ProductPage,
  DashboardPage
};