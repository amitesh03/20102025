# React Router

React Router is the standard routing library for React. It enables navigation among different components in a React application, allows changing the browser URL, and keeps the UI in sync with the URL.

## Overview

React Router provides declarative routing for your React applications. It allows you to define routes in your application using components, making it easy to create single-page applications with multiple views.

## Key Features

- **Declarative Routing**: Define routes using JSX components
- **Nested Routes**: Support for nested routing and layouts
- **Dynamic Routing**: Route parameters and query strings
- **Code Splitting**: Lazy loading components for better performance
- **Navigation Guards**: Protect routes and handle redirects
- **Scroll Restoration**: Control scroll behavior on navigation

## Installation

```bash
# Using npm
npm install react-router-dom

# Using yarn
yarn add react-router-dom

# Using pnpm
pnpm add react-router-dom
```

## Basic Usage

### Setting Up Routes

```jsx
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

// Components
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Dynamic Routes

```jsx
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

// User component that shows user details
function User() {
  const { userId } = useParams();
  
  return (
    <div>
      <h2>User Profile</h2>
      <p>User ID: {userId}</p>
      {/* Fetch and display user data */}
    </div>
  );
}

// Blog post component
function BlogPost() {
  const { postId } = useParams();
  
  return (
    <div>
      <h2>Blog Post</h2>
      <p>Post ID: {postId}</p>
      {/* Fetch and display blog post */}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user/:userId" element={<User />} />
        <Route path="/blog/:postId" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Nested Routes

```jsx
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
} from 'react-router-dom';

// Layout component with nested routes
function Layout() {
  return (
    <div>
      <nav>
        <Link to="dashboard">Dashboard</Link>
        <Link to="settings">Settings</Link>
        <Link to="profile">Profile</Link>
      </nav>
      
      <main>
        <Outlet /> {/* Nested routes will render here */}
      </main>
    </div>
  );
}

// Dashboard component
function Dashboard() {
  return <h2>Dashboard</h2>;
}

// Settings component
function Settings() {
  return <h2>Settings</h2>;
}

// Profile component
function Profile() {
  return <h2>Profile</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## Navigation

### Programmatic Navigation

```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Perform login logic
    // ...
    
    // Navigate to dashboard after successful login
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
}
```

### Navigation with State

```jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ProductList() {
  const navigate = useNavigate();

  const products = [
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 20 },
  ];

  const goToProduct = (product) => {
    // Navigate with state
    navigate(`/product/${product.id}`, {
      state: { product }
    });
  };

  return (
    <div>
      <h2>Products</h2>
      {products.map((product) => (
        <div key={product.id}>
          <span>{product.name}</span>
          <button onClick={() => goToProduct(product)}>
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}

function ProductDetail() {
  const location = useLocation();
  const { productId } = useParams();
  const product = location.state?.product;

  return (
    <div>
      <h2>Product Details</h2>
      {product ? (
        <div>
          <p>Name: {product.name}</p>
          <p>Price: ${product.price}</p>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
}
```

## Route Protection

### Private Routes

```jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Authentication hook (example)
function useAuth() {
  // In a real app, this would check authentication state
  const isAuthenticated = localStorage.getItem('token') !== null;
  return { isAuthenticated };
}

// Private route component
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Usage in routes
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

## Query Parameters

```jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q');
  const page = searchParams.get('page') || '1';
  const category = searchParams.get('category');

  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery, page: '1' });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ q: query, page: newPage });
  };

  return (
    <div>
      <h2>Search Results</h2>
      <p>Query: {query}</p>
      <p>Page: {page}</p>
      <p>Category: {category}</p>
      
      <input
        type="text"
        value={query || ''}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      
      <button onClick={() => handlePageChange(Number(page) + 1)}>
        Next Page
      </button>
    </div>
  );
}
```

## Code Splitting

### Lazy Loading Routes

```jsx
import React, { Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

// Lazy load components
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

## Custom Hooks

### useActiveRoute Hook

```jsx
import { useLocation, matchPath } from 'react-router-dom';

export function useActiveRoute(patterns) {
  const { pathname } = useLocation();

  for (const pattern of patterns) {
    const match = matchPath(pattern, pathname);
    if (match) {
      return match;
    }
  }

  return null;
}

// Usage
function Navigation() {
  const isActive = useActiveRoute(['/dashboard', '/profile']);
  
  return (
    <nav>
      <Link 
        to="/dashboard" 
        className={isActive?.pattern === '/dashboard' ? 'active' : ''}
      >
        Dashboard
      </Link>
      <Link 
        to="/profile" 
        className={isActive?.pattern === '/profile' ? 'active' : ''}
      >
        Profile
      </Link>
    </nav>
  );
}
```

## Best Practices

1. **Use Relative Links**: Use relative paths for internal navigation
2. **Lazy Load Routes**: Implement code splitting for better performance
3. **Protect Routes**: Implement authentication guards for protected routes
4. **Handle 404s**: Always include a catch-all route for 404 pages
5. **Use Outlet**: Utilize Outlet for nested route layouts
6. **Scroll Restoration**: Implement scroll restoration for better UX

## Advanced Features

### Scroll Restoration

```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Usage in App
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Your routes here */}
      </Routes>
    </BrowserRouter>
  );
}
```

### Route Config

```jsx
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

const routes = [
  {
    path: '/',
    element: <Home />,
    index: true,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/products',
    element: <Products />,
    children: [
      {
        path: ':id',
        element: <ProductDetail />,
      },
    ],
  },
];

function renderRoutes(routes) {
  return routes.map((route, index) => {
    if (route.children) {
      return (
        <Route key={index} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    return (
      <Route
        key={index}
        path={route.path}
        element={route.element}
        index={route.index}
      />
    );
  });
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {renderRoutes(routes)}
      </Routes>
    </BrowserRouter>
  );
}
```

## Resources

- [Official Documentation](https://reactrouter.com/)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [API Reference](https://reactrouter.com/en/main)
- [GitHub Repository](https://github.com/remix-run/react-router)