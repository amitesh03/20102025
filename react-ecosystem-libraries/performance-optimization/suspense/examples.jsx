/**
 * React Suspense Examples
 * 
 * React Suspense lets components wait for something before rendering,
 * showing a fallback UI while waiting. It's commonly used with
 * React.lazy() for code splitting and data fetching libraries.
 */

// Example 1: Basic Suspense with lazy loading
/*
// App.js
import React, { Suspense } from 'react';

// Lazy load components
const Home = React.lazy(() => import('./components/Home'));
const About = React.lazy(() => import('./components/About'));
const Contact = React.lazy(() => import('./components/Contact'));

function App() {
  return (
    <div>
      <h1>React Suspense Example</h1>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      
      <main>
        <Suspense fallback={<div>Loading page...</div>}>
          <Home />
        </Suspense>
      </main>
    </div>
  );
}

export default App;
*/

// Example 2: Nested Suspense components
/*
// components/Layout.js
import React, { Suspense } from 'react';

function Layout({ children }) {
  return (
    <div className="layout">
      <header>
        <h1>My App</h1>
      </header>
      
      <Suspense fallback={<div>Loading content...</div>}>
        <main>{children}</main>
      </Suspense>
      
      <footer>
        <p>&copy; 2023 My App</p>
      </footer>
    </div>
  );
}

export default Layout;

// components/Content.js
import React, { Suspense } from 'react';

const LazyContent = React.lazy(() => import('./LazyContent'));

function Content() {
  return (
    <div>
      <h2>Page Content</h2>
      <Suspense fallback={<div>Loading lazy content...</div>}>
        <LazyContent />
      </Suspense>
    </div>
  );
}

export default Content;

// App.js
import React from 'react';
import Layout from './components/Layout';
import Content from './components/Content';

function App() {
  return (
    <Layout>
      <Content />
    </Layout>
  );
}

export default App;
*/

// Example 3: Suspense with custom loading components
/*
// components/Spinner.js
import React from 'react';

function Spinner({ size = 'medium' }) {
  const sizeMap = {
    small: '16px',
    medium: '24px',
    large: '32px'
  };
  
  return (
    <div className="spinner" style={{ width: sizeMap[size], height: sizeMap[size] }}>
      <div className="spinner-circle"></div>
      <div className="spinner-text">Loading...</div>
    </div>
  );
}

export default Spinner;

// components/SkeletonLoader.js
import React from 'react';

function SkeletonLoader({ lines = 3 }) {
  return (
    <div className="skeleton-loader">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="skeleton-line"></div>
      ))}
    </div>
  );
}

export default SkeletonLoader;

// components/LazyImage.js
import React, { Suspense } from 'react';

const LazyImage = React.lazy(() => import('./Image'));

function ImageWithSuspense({ src, alt, ...props }) {
  return (
    <Suspense 
      fallback={
        <div className="image-placeholder">
          <SkeletonLoader lines={1} />
        </div>
      }
    >
      <LazyImage src={src} alt={alt} {...props} />
    </Suspense>
  );
}

export default ImageWithSuspense;

// App.js
import React from 'react';
import Spinner from './components/Spinner';
import SkeletonLoader from './components/SkeletonLoader';
import ImageWithSuspense from './components/ImageWithSuspense';

function App() {
  return (
    <div>
      <h1>Custom Loading Components</h1>
      
      <div>
        <h2>Spinner Loading</h2>
        <Suspense fallback={<Spinner />}>
          <div>Content loaded with spinner</div>
        </Suspense>
      </div>
      
      <div>
        <h2>Skeleton Loading</h2>
        <Suspense fallback={<SkeletonLoader lines={3} />}>
          <div>Content loaded with skeleton</div>
        </Suspense>
      </div>
      
      <div>
        <h2>Image Loading</h2>
        <ImageWithSuspense 
          src="https://example.com/large-image.jpg"
          alt="Large image"
        />
      </div>
    </div>
  );
}

export default App;
*/

// Example 4: Suspense with error boundaries
/*
// components/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState(prevState => ({
      error,
      retryCount: prevState.retryCount + 1
    }));
    console.error('Suspense error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Failed to load content</h2>
          <p>{this.state.error && this.state.error.message}</p>
          <button onClick={this.handleRetry}>
            Retry (Attempt {this.state.retryCount})
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
      <h1>Suspense with Error Boundary</h1>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading with error handling...</div>}>
          <LazyComponent />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
*/

// Example 5: Suspense with data fetching (experimental)
/*
// utils/fetchData.js
// This is a simplified example - in production, use libraries like React Query or SWR

let cache = new Map();

export function fetchData(url) {
  // Return cached data if available
  if (cache.has(url)) {
    return cache.get(url);
  }
  
  // Start fetching data
  const promise = fetch(url)
    .then(response => response.json())
    .then(data => {
      cache.set(url, data);
      return data;
    });
  
  // Store the promise in cache
  cache.set(url, promise);
  
  // Throw the promise to trigger Suspense
  throw promise;
}

// components/UserProfile.js
import React from 'react';
import { fetchData } from '../utils/fetchData';

function UserProfile({ userId }) {
  // This will throw a promise if data not cached
  const user = fetchData(`/api/users/${userId}`);
  
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
    </div>
  );
}

// App.js
import React, { Suspense } from 'react';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <div>
      <h1>Data Fetching with Suspense</h1>
      <Suspense fallback={<div>Loading user data...</div>}>
        <UserProfile userId={123} />
      </Suspense>
    </div>
  );
}

export default App;
*/

// Example 6: Suspense with multiple fallbacks
/*
// components/LoadingStates.js
import React from 'react';

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="skeleton">
      <div className="skeleton-header"></div>
      <div className="skeleton-content"></div>
    </div>
  );
}

function LoadingMessage({ message }) {
  return (
    <div className="loading-message">
      <p>{message}</p>
    </div>
  );
}

export { LoadingSpinner, LoadingSkeleton, LoadingMessage };

// components/ConditionalSuspense.js
import React, { Suspense } from 'react';
import { LoadingSpinner, LoadingSkeleton, LoadingMessage } from './LoadingStates';

function ConditionalSuspense({ 
  children, 
  fallbackType = 'spinner', 
  customMessage 
}) {
  const getFallback = () => {
    switch (fallbackType) {
      case 'spinner':
        return <LoadingSpinner />;
      case 'skeleton':
        return <LoadingSkeleton />;
      case 'message':
        return <LoadingMessage message={customMessage || 'Loading...'} />;
      default:
        return <LoadingSpinner />;
    }
  };

  return (
    <Suspense fallback={getFallback()}>
      {children}
    </Suspense>
  );
}

export default ConditionalSuspense;

// App.js
import React from 'react';
import ConditionalSuspense from './components/ConditionalSuspense';

const LazyComponent = React.lazy(() => import('./components/LazyComponent'));

function App() {
  return (
    <div>
      <h1>Multiple Fallback Types</h1>
      
      <ConditionalSuspense fallbackType="spinner">
        <LazyComponent />
      </ConditionalSuspense>
      
      <ConditionalSuspense fallbackType="skeleton">
        <LazyComponent />
      </ConditionalSuspense>
      
      <ConditionalSuspense 
        fallbackType="message" 
        customMessage="Please wait while we load your content..."
      >
        <LazyComponent />
      </ConditionalSuspense>
    </div>
  );
}

export default App;
*/

// Example 7: Suspense with progressive loading
/*
// components/ProgressiveLoader.js
import React, { useState, useEffect } from 'react';

function ProgressiveLoader({ children, steps = 3 }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps - 1) {
          return prev + 1;
        } else {
          setShowContent(true);
          clearInterval(timer);
          return prev;
        }
      });
    }, 500);
    
    return () => clearInterval(timer);
  }, [steps]);
  
  const getLoadingMessage = () => {
    const messages = [
      'Initializing...',
      'Loading resources...',
      'Almost ready...'
    ];
    return messages[currentStep] || 'Loading...';
  };
  
  if (showContent) {
    return children;
  }
  
  return (
    <div className="progressive-loader">
      <div className="loading-steps">
        {Array.from({ length: steps }).map((_, index) => (
          <div 
            key={index}
            className={`step ${index <= currentStep ? 'active' : 'completed'}`}
          ></div>
        ))}
      </div>
      <div className="loading-message">
        {getLoadingMessage()}
      </div>
    </div>
  );
}

export default ProgressiveLoader;

// App.js
import React from 'react';
import ProgressiveLoader from './components/ProgressiveLoader';

const LazyComponent = React.lazy(() => import('./components/LazyComponent'));

function App() {
  return (
    <div>
      <h1>Progressive Loading</h1>
      <ProgressiveLoader steps={3}>
        <LazyComponent />
      </ProgressiveLoader>
    </div>
  );
}

export default App;
*/

// Example 8: Suspense with timeout handling
/*
// components/TimeoutSuspense.js
import React, { Suspense, useState, useEffect } from 'react';

function TimeoutSuspense({ children, fallback, timeout = 5000 }) {
  const [timedOut, setTimedOut] = useState(false);
  const [showFallback, setShowFallback] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, timeout);
    
    return () => clearTimeout(timer);
  }, [timeout]);
  
  const handleRetry = () => {
    setTimedOut(false);
    setShowFallback(true);
  };
  
  return (
    <div>
      {showFallback && (
        <div className="suspense-fallback">
          {timedOut ? (
            <div className="timeout-message">
              <p>Loading is taking longer than expected...</p>
              <button onClick={handleRetry}>Retry</button>
            </div>
          ) : (
            fallback
          )}
        </div>
      )}
      
      {!timedOut && (
        <Suspense onFulfilled={() => setShowFallback(false)}>
          {children}
        </Suspense>
      )}
    </div>
  );
}

export default TimeoutSuspense;

// App.js
import React from 'react';
import TimeoutSuspense from './components/TimeoutSuspense';

const LazyComponent = React.lazy(() => import('./components/LazyComponent'));

function App() {
  return (
    <div>
      <h1>Suspense with Timeout</h1>
      <TimeoutSuspense 
        fallback={<div>Loading with timeout protection...</div>}
        timeout={3000}
      >
        <LazyComponent />
      </TimeoutSuspense>
    </div>
  );
}

export default App;
*/

// Example 9: Suspense with route-based loading
/*
// components/RouteSuspense.js
import React, { Suspense } from 'react';

function RouteSuspense({ children, fallback = null }) {
  return (
    <Suspense fallback={fallback || <div>Loading route...</div>}>
      {children}
    </Suspense>
  );
}

export default RouteSuspense;

// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RouteSuspense from './components/RouteSuspense';

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
        <Routes>
          <Route path="/" element={
            <RouteSuspense>
              <Home />
            </RouteSuspense>
          } />
          <Route path="/about" element={
            <RouteSuspense fallback={<div>Loading about page...</div>}>
              <About />
            </RouteSuspense>
          } />
          <Route path="/contact" element={
            <RouteSuspense fallback={<div>Loading contact page...</div>}>
              <Contact />
            </RouteSuspense>
          } />
          <Route path="/dashboard" element={
            <RouteSuspense fallback={
              <div>
                <div className="dashboard-loading">
                  <h2>Loading Dashboard</h2>
                  <p>Please wait while we load your data...</p>
                </div>
              </div>
            }>
              <Dashboard />
            </RouteSuspense>
          } />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
*/

// Example 10: Suspense with performance monitoring
/*
// utils/performanceMonitor.js
export const withSuspensePerformance = (WrappedComponent) => {
  const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  return React.memo(function SuspensePerformance({ ...props }) {
    const startTime = React.useRef(Date.now());
    
    React.useEffect(() => {
      const endTime = Date.now();
      const loadTime = endTime - startTime.current;
      
      console.log(`${componentName} loaded in ${loadTime}ms`);
      
      // Report to analytics service
      if (window.gtag) {
        window.gtag('event', 'component_load_time', {
          component_name: componentName,
          load_time: loadTime
        });
      }
    });
    
    return <WrappedComponent {...props} />;
  });
};

// components/MonitoredSuspense.js
import React, { Suspense } from 'react';
import { withSuspensePerformance } from '../utils/performanceMonitor';

const MonitoredLazyComponent = withSuspensePerformance(
  React.lazy(() => import('./LazyComponent'))
);

function MonitoredSuspense({ children, fallback }) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

export default MonitoredSuspense;

// App.js
import React from 'react';
import MonitoredSuspense from './components/MonitoredSuspense';
import MonitoredLazyComponent from './components/MonitoredLazyComponent';

function App() {
  return (
    <div>
      <h1>Suspense with Performance Monitoring</h1>
      <MonitoredSuspense fallback={<div>Loading with monitoring...</div>}>
        <MonitoredLazyComponent />
      </MonitoredSuspense>
    </div>
  );
}

export default App;
*/

export const suspenseExamples = {
  description: "Examples of using React Suspense for loading states and code splitting",
  concepts: [
    "Suspense - Component for handling async operations",
    "React.lazy() - Lazy loading of components",
    "Fallback UI - Loading states during async operations",
    "Error Boundaries - Handling loading errors",
    "Code Splitting - Breaking code into chunks"
  ],
  benefits: [
    "Better user experience with loading states",
    "Reduced initial bundle size",
    "Progressive loading of content",
    "Error handling for failed loads",
    "Performance monitoring capabilities"
  ],
  patterns: [
    "Route-based code splitting",
    "Component-based lazy loading",
    "Custom loading components",
    "Error boundary integration",
    "Timeout handling",
    "Progressive loading"
  ],
  bestPractices: [
    "Always provide meaningful fallbacks",
    "Handle loading errors gracefully",
    "Use appropriate loading indicators",
    "Consider timeout handling",
    "Monitor loading performance",
    "Test slow network conditions"
  ]
};