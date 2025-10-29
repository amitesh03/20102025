import React, { useState } from 'react';

// Gatsby Examples - Educational Examples for Gatsby
// Source: Context7 Documentation for Gatsby

export default function GatsbyExamples() {
  const [activeExample, setActiveExample] = useState('getting-started');

  return (
    <div className="examples-container">
      <h1>Gatsby Examples</h1>
      <p className="intro">
        Gatsby is a free, open-source framework based on React that helps developers build blazing-fast websites and apps by combining dynamic rendering with static-site generation.
      </p>
      
      <div className="example-nav">
        <button onClick={() => setActiveExample('getting-started')} className={activeExample === 'getting-started' ? 'active' : ''}>
          Getting Started
        </button>
        <button onClick={() => setActiveExample('pages-routing')} className={activeExample === 'pages-routing' ? 'active' : ''}>
          Pages & Routing
        </button>
        <button onClick={() => setActiveExample('data-sourcing')} className={activeExample === 'data-sourcing' ? 'active' : ''}>
          Data Sourcing
        </button>
        <button onClick={() => setActiveExample('styling')} className={activeExample === 'styling' ? 'active' : ''}>
          Styling
        </button>
        <button onClick={() => setActiveExample('functions')} className={activeExample === 'functions' ? 'active' : ''}>
          Functions
        </button>
        <button onClick={() => setActiveExample('plugins')} className={activeExample === 'plugins' ? 'active' : ''}>
          Plugins
        </button>
      </div>

      <div className="example-content">
        {activeExample === 'getting-started' && <GettingStartedExample />}
        {activeExample === 'pages-routing' && <PagesRoutingExample />}
        {activeExample === 'data-sourcing' && <DataSourcingExample />}
        {activeExample === 'styling' && <StylingExample />}
        {activeExample === 'functions' && <FunctionsExample />}
        {activeExample === 'plugins' && <PluginsExample />}
      </div>
    </div>
  );
}

// Getting Started Example
function GettingStartedExample() {
  return (
    <div className="example-section">
      <h2>Getting Started with Gatsby</h2>
      <p>Learn how to create and set up a new Gatsby project.</p>
      
      <div className="code-block">
        <h3>Install Gatsby CLI</h3>
        <pre>
{`# Install Gatsby CLI globally
npm install -g gatsby-cli

# Or using yarn
yarn global add gatsby-cli`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Create a New Gatsby Site</h3>
        <pre>
{`# Create a new site using the default starter
gatsby new my-gatsby-site

# Create a site with a specific starter
gatsby new my-blog https://github.com/gatsbyjs/gatsby-starter-blog

# Create a site with the hello-world starter
gatsby new my-hello-world https://github.com/gatsbyjs/gatsby-starter-hello-world`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Navigate and Start Development</h3>
        <pre>
{`# Navigate into your new site directory
cd my-gatsby-site

# Start the development server
gatsby develop

# Or using npm scripts
npm run develop`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Build for Production</h3>
        <pre>
{`# Build the site for production
gatsby build

# Serve the built site locally
gatsby serve`}
        </pre>
      </div>
    </div>
  );
}

// Pages & Routing Example
function PagesRoutingExample() {
  return (
    <div className="example-section">
      <h2>Pages and Routing in Gatsby</h2>
      <p>Gatsby uses a file-based routing system where React components in the pages directory become pages.</p>
      
      <div className="code-block">
        <h3>Basic Page Component</h3>
        <pre>
{`// src/pages/index.js
import React from 'react';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to My Gatsby Site</h1>
      <p>This is the home page.</p>
    </div>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Creating Additional Pages</h3>
        <pre>
{`// src/pages/about.js
import React from 'react';

export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Learn more about our company.</p>
    </div>
  );
}

// src/pages/contact.js
import React from 'react';

export default function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Get in touch with our team.</p>
    </div>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Linking Between Pages</h3>
        <pre>
{`import React from 'react';
import { Link } from 'gatsby';

export default function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </nav>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Dynamic Routes with createPages</h3>
        <pre>
{`// gatsby-node.js
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  
  // Query for data to create pages from
  const result = await graphql(\`
    query {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
    }
  \`);
  
  // Create pages for each markdown file
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: \`/blog/\${node.frontmatter.slug}\`,
      component: require.resolve('./src/templates/blog-post.js'),
      context: {
        slug: node.frontmatter.slug,
      },
    });
  });
};`}
        </pre>
      </div>
    </div>
  );
}

// Data Sourcing Example
function DataSourcingExample() {
  return (
    <div className="example-section">
      <h2>Data Sourcing in Gatsby</h2>
      <p>Gatsby can pull data from various sources using source plugins.</p>
      
      <div className="code-block">
        <h3>Using GraphQL to Query Data</h3>
        <pre>
{`// src/pages/index.js
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

export default function HomePage() {
  const data = useStaticQuery(graphql\`
    query {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  \`);
  
  return (
    <div>
      <h1>{data.site.siteMetadata.title}</h1>
      <p>{data.site.siteMetadata.description}</p>
    </div>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Sourcing from Markdown Files</h3>
        <pre>
{`// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: \`gatsby-source-filesystem\`,
      options: {
        name: \`pages\`,
        path: \`\${__dirname}/src/pages\`,
      },
    },
    {
      resolve: \`gatsby-source-filesystem\`,
      options: {
        name: \`posts\`,
        path: \`\${__dirname}/src/posts\`,
      },
    },
    \`gatsby-transformer-remark\`,
  ],
};`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Querying Markdown Data</h3>
        <pre>
{`// src/pages/blog.js
import React from 'react';
import { graphql, Link } from 'gatsby';

export default function BlogPage({ data }) {
  return (
    <div>
      <h1>Blog Posts</h1>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          <Link to={node.fields.slug}>
            <h3>{node.frontmatter.title}</h3>
          </Link>
          <p>{node.frontmatter.date}</p>
          <p>{node.excerpt}</p>
        </div>
      ))}
    </div>
  );
}

export const query = graphql\`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          id
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
\`;`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Sourcing from CMS (WordPress Example)</h3>
        <pre>
{`// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: \`gatsby-source-wordpress\`,
      options: {
        url: \`https://yoursite.com/graphql\`,
      },
    },
  ],
};`}
        </pre>
      </div>
    </div>
  );
}

// Styling Example
function StylingExample() {
  return (
    <div className="example-section">
      <h2>Styling in Gatsby</h2>
      <p>Gatsby supports various styling approaches including CSS Modules, Styled Components, and Emotion.</p>
      
      <div className="code-block">
        <h3>Using CSS Modules</h3>
        <pre>
{`// src/components/header.module.css
.header {
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.title {
  color: #343a40;
  font-size: 1.5rem;
}

// src/components/header.js
import React from 'react';
import styles from './header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>My Gatsby Site</h1>
    </header>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Using Styled Components</h3>
        <pre>
{`// Install dependencies
npm install gatsby-plugin-styled-components styled-components babel-plugin-styled-components

// gatsby-config.js
module.exports = {
  plugins: [
    \`gatsby-plugin-styled-components\`,
  ],
};

// src/components/button.js
import React from 'react';
import styled from 'styled-components';

const Button = styled.button\`
  background-color: \${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  
  &:hover {
    background-color: \${props => props.primary ? '#0069d9' : '#5a6268'};
  }
\`;

export default function StyledButton({ children, primary, ...props }) {
  return (
    <Button primary={primary} {...props}>
      {children}
    </Button>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Using Emotion</h3>
        <pre>
{`// Install dependencies
npm install gatsby-plugin-emotion @emotion/react @emotion/styled

// gatsby-config.js
module.exports = {
  plugins: [
    \`gatsby-plugin-emotion\`,
  ],
};

// src/components/card.js
import React from 'react';
import styled from '@emotion/styled';

const Card = styled.div\`
  background-color: white;
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  padding: 1.25rem;
  margin-bottom: 1rem;
\`;

const CardTitle = styled.h3\`
  margin-top: 0;
  color: #495057;
\`;

export default function CardComponent({ title, children }) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      {children}
    </Card>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Functions Example
function FunctionsExample() {
  return (
    <div className="example-section">
      <h2>Gatsby Functions</h2>
      <p>Gatsby Functions allow you to build server-side logic directly in your Gatsby site.</p>
      
      <div className="code-block">
        <h3>Basic Function</h3>
        <pre>
{`// src/api/hello-world.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello, world!' });
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Function with Request Parameters</h3>
        <pre>
{`// src/api/user.js
export default function handler(req, res) {
  const { id } = req.query;
  
  // In a real app, you would fetch user data from a database
  const user = {
    id,
    name: \`User \${id}\`,
    email: \`user\${id}@example.com\`,
  };
  
  res.status(200).json(user);
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Function with POST Request</h3>
        <pre>
{`// src/api/contact.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { name, email, message } = req.body;
  
  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Process the form data (e.g., send email, save to database)
  console.log(\`Received contact form from \${name} (\${email})\`);
  
  res.status(200).json({ message: 'Form submitted successfully' });
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Function with Environment Variables</h3>
        <pre>
{`// src/api/send-email.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { to, subject, text } = req.body;
  
  // Use environment variables for sensitive data
  const apiKey = process.env.EMAIL_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;
  
  if (!apiKey || !fromEmail) {
    return res.status(500).json({ message: 'Server configuration error' });
  }
  
  // Send email using your email service
  // This is just a placeholder example
  console.log(\`Sending email to \${to} with subject: \${subject}\`);
  
  res.status(200).json({ message: 'Email sent successfully' });
}`}
        </pre>
      </div>
    </div>
  );
}

// Plugins Example
function PluginsExample() {
  return (
    <div className="example-section">
      <h2>Gatsby Plugins</h2>
      <p>Plugins extend Gatsby's functionality with features like image optimization, SEO, and more.</p>
      
      <div className="code-block">
        <h3>Image Optimization with gatsby-plugin-image</h3>
        <pre>
{`// Install dependencies
npm install gatsby-plugin-image gatsby-plugin-sharp gatsby-transformer-sharp

// gatsby-config.js
module.exports = {
  plugins: [
    \`gatsby-plugin-image\`,
    \`gatsby-plugin-sharp\`,
    \`gatsby-transformer-sharp\`,
    {
      resolve: \`gatsby-source-filesystem\`,
      options: {
        name: \`images\`,
        path: \`\${__dirname}/src/images\`,
      },
    },
  ],
};

// src/components/optimized-image.js
import React from 'react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

export default function OptimizedImage({ image, alt }) {
  const gatsbyImage = getImage(image);
  
  return (
    <GatsbyImage
      image={gatsbyImage}
      alt={alt}
    />
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>SEO with gatsby-plugin-react-helmet</h3>
        <pre>
{`// Install dependencies
npm install gatsby-plugin-react-helmet react-helmet

// gatsby-config.js
module.exports = {
  plugins: [
    \`gatsby-plugin-react-helmet\`,
  ],
};

// src/components/seo.js
import React from 'react';
import { Helmet } from 'react-helmet';

export default function SEO({ title, description }) {
  return (
    <Helmet
      title={title}
      meta={[
        {
          name: 'description',
          content: description,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: description,
        },
      ]}
    />
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Site Search with gatsby-plugin-local-search</h3>
        <pre>
{`// Install dependencies
npm install gatsby-plugin-local-search gatsby-plugin-use-flexsearch flexsearch

// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: \`gatsby-plugin-local-search\`,
      options: {
        name: \`pages\`,
        engine: \`flexsearch\`,
        engineOptions: {
          tokenize: 'forward',
        },
        query: \`
          {
            allMarkdownRemark {
              edges {
                node {
                  id
                  frontmatter {
                    title
                    description
                  }
                  rawMarkdownBody
                }
              }
            }
          }
        \`,
        ref: 'id',
        index: ['title', 'description', 'rawMarkdownBody'],
        store: ['id', 'title', 'description'],
        normalizer: ({ data }) =>
          data.allMarkdownRemark.edges.map(({ node }) => node),
      },
    },
  ],
};`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Analytics with gatsby-plugin-google-analytics</h3>
        <pre>
{`// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: \`gatsby-plugin-google-analytics\`,
      options: {
        trackingId: 'GA_TRACKING_ID',
        head: false,
        anonymize: true,
        respectDNT: true,
      },
    },
  ],
};`}
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
`;
document.head.appendChild(style);