import React, { useState } from 'react';

// Reach Router Examples - Educational Examples for Reach Router
// Note: Reach Router is now part of React Router, but these examples show the original API

export default function ReachRouterExamples() {
  const [activeExample, setActiveExample] = useState('basic-routing');

  return (
    <div className="examples-container">
      <h1>Reach Router Examples</h1>
      <p className="intro">
        Reach Router is an accessible routing library for React applications. Note: Reach Router has been merged into React Router v6, so these examples show the original API for educational purposes.
      </p>
      
      <div className="example-nav">
        <button onClick={() => setActiveExample('basic-routing')} className={activeExample === 'basic-routing' ? 'active' : ''}>
          Basic Routing
        </button>
        <button onClick={() => setActiveExample('nested-routes')} className={activeExample === 'nested-routes' ? 'active' : ''}>
          Nested Routes
        </button>
        <button onClick={() => setActiveExample('dynamic-routes')} className={activeExample === 'dynamic-routes' ? 'active' : ''}>
          Dynamic Routes
        </button>
        <button onClick={() => setActiveExample('navigation')} className={activeExample === 'navigation' ? 'active' : ''}>
          Navigation
        </button>
        <button onClick={() => setActiveExample('route-params')} className={activeExample === 'route-params' ? 'active' : ''}>
          Route Parameters
        </button>
        <button onClick={() => setActiveExample('custom-link')} className={activeExample === 'custom-link' ? 'active' : ''}>
          Custom Link
        </button>
      </div>

      <div className="example-content">
        {activeExample === 'basic-routing' && <BasicRoutingExample />}
        {activeExample === 'nested-routes' && <NestedRoutesExample />}
        {activeExample === 'dynamic-routes' && <DynamicRoutesExample />}
        {activeExample === 'navigation' && <NavigationExample />}
        {activeExample === 'route-params' && <RouteParamsExample />}
        {activeExample === 'custom-link' && <CustomLinkExample />}
      </div>
    </div>
  );
}

// Basic Routing Example
function BasicRoutingExample() {
  return (
    <div className="example-section">
      <h2>Basic Routing with Reach Router</h2>
      <p>Setting up basic routing with Reach Router components.</p>
      
      <div className="code-block">
        <h3>App Setup</h3>
        <pre>
{`import React from 'react';
import { Router, Route } from '@reach/router';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      
      <Router>
        <Home path="/" />
        <About path="/about" />
        <Contact path="/contact" />
      </Router>
    </div>
  );
}

export default App;`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Page Components</h3>
        <pre>
{`// components/Home.js
import React from 'react';

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to our website!</p>
    </div>
  );
}

// components/About.js
import React from 'react';

export default function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Learn more about our company.</p>
    </div>
  );
}

// components/Contact.js
import React from 'react';

export default function Contact() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Get in touch with our team.</p>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Nested Routes Example
function NestedRoutesExample() {
  return (
    <div className="example-section">
      <h2>Nested Routes</h2>
      <p>Creating nested routes with Reach Router.</p>
      
      <div className="code-block">
        <h3>Parent and Child Routes</h3>
        <pre>
{`import React from 'react';
import { Router, Route } from '@reach/router';
import Dashboard from './components/Dashboard';
import DashboardHome from './components/DashboardHome';
import DashboardSettings from './components/DashboardSettings';
import DashboardProfile from './components/DashboardProfile';

function App() {
  return (
    <Router>
      <Dashboard path="/dashboard">
        <DashboardHome path="/" />
        <DashboardSettings path="/settings" />
        <DashboardProfile path="/profile" />
      </Dashboard>
    </Router>
  );
}

// components/Dashboard.js
import React from 'react';
import { Link } from '@reach/router';

export default function Dashboard({ children }) {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="/dashboard">Overview</Link>
        <Link to="/dashboard/settings">Settings</Link>
        <Link to="/dashboard/profile">Profile</Link>
      </nav>
      
      <main>
        {children}
      </main>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Dynamic Routes Example
function DynamicRoutesExample() {
  return (
    <div className="example-section">
      <h2>Dynamic Routes</h2>
      <p>Creating dynamic routes with URL parameters.</p>
      
      <div className="code-block">
        <h3>Dynamic Route Parameters</h3>
        <pre>
{`import React from 'react';
import { Router, Route } from '@reach/router';
import UserList from './components/UserList';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <Router>
      <UserList path="/users" />
      <UserProfile path="/users/:userId" />
    </Router>
  );
}

// components/UserProfile.js
import React from 'react';
import { Link } from '@reach/router';

export default function UserProfile({ userId }) {
  // In a real app, you would fetch user data based on userId
  const user = {
    id: userId,
    name: \`User \${userId}\`,
    email: \`user\${userId}@example.com\`
  };
  
  return (
    <div>
      <h1>User Profile</h1>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      
      <Link to="/users">Back to Users</Link>
    </div>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Multiple Dynamic Parameters</h3>
        <pre>
{`import React from 'react';
import { Router, Route } from '@reach/router';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import CommentDetail from './components/CommentDetail';

function App() {
  return (
    <Router>
      <PostList path="/posts" />
      <PostDetail path="/posts/:postId" />
      <CommentDetail path="/posts/:postId/comments/:commentId" />
    </Router>
  );
}

// components/CommentDetail.js
import React from 'react';
import { Link } from '@reach/router';

export default function CommentDetail({ postId, commentId }) {
  return (
    <div>
      <h1>Comment Detail</h1>
      <p>Post ID: {postId}</p>
      <p>Comment ID: {commentId}</p>
      
      <Link to={\`/posts/\${postId}\`}>Back to Post</Link>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Navigation Example
function NavigationExample() {
  return (
    <div className="example-section">
      <h2>Navigation with Reach Router</h2>
      <p>Using navigation components and hooks in Reach Router.</p>
      
      <div className="code-block">
        <h3>Link Component</h3>
        <pre>
{`import React from 'react';
import { Link } from '@reach/router';

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      
      {/* Link with custom styling */}
      <Link 
        to="/special" 
        style={{ 
          color: 'red', 
          fontWeight: 'bold' 
        }}
      >
        Special Page
      </Link>
      
      {/* Link that opens in a new tab */}
      <Link to="/external" target="_blank" rel="noopener noreferrer">
        External Link
      </Link>
    </nav>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Programmatic Navigation</h3>
        <pre>
{`import React from 'react';
import { navigate } from '@reach/router';

function LoginForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // After successful login, navigate to dashboard
    navigate('/dashboard');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Login</button>
    </form>
  );
}

function RedirectComponent() {
  // Navigate with replace (replaces current entry in history)
  React.useEffect(() => {
    navigate('/new-location', { replace: true });
  }, []);
  
  return <div>Redirecting...</div>;
}`}
        </pre>
      </div>
    </div>
  );
}

// Route Parameters Example
function RouteParamsExample() {
  return (
    <div className="example-section">
      <h2>Route Parameters</h2>
      <p>Working with route parameters in Reach Router.</p>
      
      <div className="code-block">
        <h3>Accessing Route Parameters</h3>
        <pre>
{`import React from 'react';
import { Router, Route } from '@reach/router';

function BlogPost({ slug, category }) {
  return (
    <div>
      <h1>Blog Post</h1>
      <p>Category: {category}</p>
      <p>Slug: {slug}</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <BlogPost path="/blog/:category/:slug" />
    </Router>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Optional Parameters</h3>
        <pre>
{`import React from 'react';
import { Router, Route } from '@reach/router';

function UserProfile({ userId }) {
  // If userId is not provided, show a default message
  if (!userId) {
    return <div>Please provide a user ID</div>;
  }
  
  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {userId}</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      {/* This route will match both /profile and /profile/123 */}
      <UserProfile path="/profile/:userId?" />
    </Router>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Custom Link Example
function CustomLinkExample() {
  return (
    <div className="example-section">
      <h2>Custom Link Components</h2>
      <p>Creating custom link components with Reach Router.</p>
      
      <div className="code-block">
        <h3>Styled Link Component</h3>
        <pre>
{`import React from 'react';
import { Link } from '@reach/router';
import styled from 'styled-components';

// Create a styled link component
const StyledLink = styled(Link)\`
  color: #007bff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
    text-decoration: underline;
  }
  
  &.active {
    background-color: #007bff;
    color: white;
  }
\`;

// Create a button-style link
const ButtonLink = styled(Link)\`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  display: inline-block;
  
  &:hover {
    background-color: #0069d9;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
\`;

function Navigation() {
  return (
    <nav>
      <StyledLink to="/">Home</StyledLink>
      <StyledLink to="/about">About</StyledLink>
      <ButtonLink to="/contact">Contact Us</ButtonLink>
    </nav>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Active Link Component</h3>
        <pre>
{`import React from 'react';
import { Link, useLocation } from '@reach/router';

function ActiveLink({ to, children, ...props }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      {...props}
      style={{
        ...props.style,
        fontWeight: isActive ? 'bold' : 'normal',
        color: isActive ? '#007bff' : '#333'
      }}
    >
      {children}
    </Link>
  );
}

function Navigation() {
  return (
    <nav>
      <ActiveLink to="/">Home</ActiveLink>
      <ActiveLink to="/about">About</ActiveLink>
      <ActiveLink to="/contact">Contact</ActiveLink>
    </nav>
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
`;
document.head.appendChild(style);