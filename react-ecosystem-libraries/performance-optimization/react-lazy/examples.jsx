/**
 * React Lazy Examples
 * 
 * React.lazy() and Suspense enable code-splitting and lazy loading of components.
 * This helps reduce initial bundle size and improve performance by loading
 * components only when they're needed.
 */

// Example 1: Basic lazy loading with React.lazy
/*
// App.js
import React, { Suspense } from 'react';

// Lazy load the component
const LazyComponent = React.lazy(() => import('./components/LazyComponent'));

function App() {
  return (
    <div>
      <h1>React Lazy Loading Example</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}

export default App;
*/

// Example 2: Lazy loading with dynamic imports
/*
// components/LazyComponent.js
import React from 'react';

function LazyComponent() {
  return (
    <div>
      <h2>This is a lazily loaded component</h2>
      <p>This component was loaded only when needed!</p>
    </div>
  );
}

export default LazyComponent;

// App.js
import React, { Suspense, useState } from 'react';

function App() {
  const [showComponent, setShowComponent] = useState(false);

  const loadComponent = () => {
    setShowComponent(true);
  };

  return (
    <div>
      <h1>Dynamic Import Example</h1>
      <button onClick={loadComponent}>
        Load Component
      </button>
      
      {showComponent && (
        <Suspense fallback={<div>Loading component...</div>}>
          <React.lazy(() => import('./components/LazyComponent')) />
        </Suspense>
      )}
    </div>
  );
}

export default App;
*/

// Example 3: Route-based code splitting with React Router
/*
// App.js
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Lazy load route components
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
      
      <main>
        <Suspense fallback={<div>Loading page...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
*/

// Example 4: Custom lazy loading with loading states
/*
// components/LazyImage.js
import React, { useState, useEffect } from 'react';

function LazyImage({ src, alt, placeholder }) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.src = src;
  }, [src]);

  return (
    <div className="lazy-image">
      {isLoading ? (
        <div className="image-placeholder">
          <div className="spinner"></div>
          <p>Loading image...</p>
        </div>
      ) : (
        <img src={imageSrc} alt={alt} />
      )}
    </div>
  );
}

export default LazyImage;

// App.js
import React from 'react';
import LazyImage from './components/LazyImage';

function App() {
  return (
    <div>
      <h1>Custom Lazy Loading</h1>
      <LazyImage 
        src="https://example.com/large-image.jpg"
        alt="Large image"
        placeholder="https://example.com/placeholder.jpg"
      />
    </div>
  );
}

export default App;
*/

// Example 5: Lazy loading with error boundaries
/*
// components/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Failed to load component</h2>
          <p>{this.state.error && this.state.error.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// App.js
import React, { Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

const LazyComponent = React.lazy(() => import('./components/LazyComponent'));

function App() {
  return (
    <div>
      <h1>Lazy Loading with Error Boundary</h1>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
*/

// Example 6: Preloading lazy components
/*
// utils/preloadComponent.js
import React from 'react';

export const preloadComponent = (componentImport) => {
  const component = React.lazy(componentImport);
  
  // Start loading the component
  const preloadPromise = componentImport();
  
  return {
    component,
    preload: () => preloadPromise
  };
};

// App.js
import React, { Suspense, useEffect } from 'react';
import { preloadComponent } from './utils/preloadComponent';

// Preload components
const { component: Home, preload: preloadHome } = preloadComponent(() => import('./pages/Home'));
const { component: About, preload: preloadAbout } = preloadComponent(() => import('./pages/About'));

function App() {
  useEffect(() => {
    // Preload components on hover or other user actions
    const handleMouseOver = () => {
      preloadAbout();
    };
    
    document.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div>
      <h1>Preloading Lazy Components</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Home />
      </Suspense>
    </div>
  );
}

export default App;
*/

// Example 7: Lazy loading with intersection observer
/*
// components/LazyLoad.js
import React, { useState, useEffect, useRef } from 'react';

function LazyLoad({ children, rootMargin, threshold }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: rootMargin || '0px',
        threshold: threshold || 0.1
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [rootMargin, threshold]);

  return (
    <div ref={elementRef}>
      {isIntersecting ? children : null}
    </div>
  );
}

export default LazyLoad;

// App.js
import React from 'react';
import LazyLoad from './components/LazyLoad';
import HeavyComponent from './components/HeavyComponent';

function App() {
  return (
    <div>
      <h1>Intersection Observer Lazy Loading</h1>
      <LazyLoad rootMargin="100px">
        <HeavyComponent />
      </LazyLoad>
    </div>
  );
}

export default App;
*/

// Example 8: Lazy loading with Webpack magic comments
/*
// Webpack will create separate chunks for these imports
const LazyComponent1 = React.lazy(() => import(
  /* webpackChunkName: "lazy-component-1" */ 
  './components/LazyComponent1'
));

const LazyComponent2 = React.lazy(() => import(
  /* webpackChunkName: "lazy-component-2" */ 
  './components/LazyComponent2'
));

// App.js
import React, { Suspense } from 'react';

function App() {
  return (
    <div>
      <h1>Webpack Magic Comments</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent1 />
        <LazyComponent2 />
      </Suspense>
    </div>
  );
}

export default App;
*/

// Example 9: Lazy loading with custom loading component
/*
// components/LoadingSpinner.js
import React from 'react';

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

export default LoadingSpinner;

// components/LazyWrapper.js
import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

function LazyWrapper({ children, fallback = <LoadingSpinner /> }) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

export default LazyWrapper;

// App.js
import React from 'react';
import LazyWrapper from './components/LazyWrapper';

const LazyComponent = React.lazy(() => import('./components/LazyComponent'));

function App() {
  return (
    <div>
      <h1>Custom Loading Component</h1>
      <LazyWrapper>
        <LazyComponent />
      </LazyWrapper>
    </div>
  );
}

export default App;
*/

// Example 10: Lazy loading with retry mechanism
/*
// utils/retryLazy.js
import React from 'react';

export const retryLazy = (componentImport, retries = 3, interval = 1000) => {
  return React.lazy(() => {
    return new Promise((resolve, reject) => {
      const tryImport = (attempt) => {
        componentImport()
          .then(resolve)
          .catch(error => {
            if (attempt < retries) {
              setTimeout(() => tryImport(attempt + 1), interval);
            } else {
              reject(error);
            }
          });
      };
      
      tryImport(1);
    });
  });
};

// App.js
import React, { Suspense } from 'react';
import { retryLazy } from './utils/retryLazy';

const LazyComponent = retryLazy(() => import('./components/LazyComponent'), 3, 1000);

function App() {
  return (
    <div>
      <h1>Lazy Loading with Retry</h1>
      <Suspense fallback={<div>Loading with retry...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}

export default App;
*/

export const reactLazyExamples = {
  description: "Examples of using React.lazy() for code splitting and lazy loading",
  concepts: [
    "React.lazy() - Function to lazy load components",
    "Suspense - Component to handle loading states",
    "Code splitting - Breaking code into smaller chunks",
    "Dynamic imports() - Import modules on demand"
  ],
  benefits: [
    "Reduced initial bundle size",
    "Faster initial page load",
    "Better performance on slow networks",
    "Improved user experience",
    "Resource efficiency"
  ],
  patterns: [
    "Route-based splitting",
    "Component-based splitting",
    "Conditional loading",
    "Preloading strategies",
    "Error handling",
    "Retry mechanisms"
  ],
  bestPractices: [
    "Always wrap lazy components in Suspense",
    "Provide meaningful loading states",
    "Handle loading errors gracefully",
    "Use intersection observer for better UX",
    "Consider preloading critical components",
    "Use Webpack magic comments for chunk naming"
  ]
};