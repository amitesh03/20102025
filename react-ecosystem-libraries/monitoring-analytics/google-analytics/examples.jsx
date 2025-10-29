/**
 * Google Analytics Examples
 * 
 * Google Analytics is a web analytics service that tracks and reports website traffic
 * and user behavior. These examples show how to integrate GA with React applications.
 */

// Example 1: Basic setup with React GA
/*
// Install the package:
// npm install react-ga --save

// utils/analytics.js
import ReactGA from 'react-ga';

const TRACKING_ID = 'UA-XXXXXXXXX-X'; // Your Google Analytics tracking ID

export const initGA = () => {
  ReactGA.initialize(TRACKING_ID);
};

export const logPageView = (path) => {
  ReactGA.set({ page: path });
  ReactGA.pageview(path);
};

export const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA.event({
      category,
      action,
    });
  }
};

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({
      description,
      fatal,
    });
  }
};

// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import { initGA, logPageView } from './utils/analytics';

function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <Router>
      <RouteChangeTracker />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
      </Switch>
    </Router>
  );
}

function RouteChangeTracker() {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname);
  }, [location]);

  return null;
}

export default App;
*/

// Example 2: Custom hook for Google Analytics
/*
// hooks/useGoogleAnalytics.js
import { useEffect } from 'react';
import ReactGA from 'react-ga';

const useGoogleAnalytics = (trackingId) => {
  useEffect(() => {
    if (!trackingId) return;

    ReactGA.initialize(trackingId);
  }, [trackingId]);

  const trackPageView = (path) => {
    ReactGA.set({ page: path });
    ReactGA.pageview(path);
  };

  const trackEvent = (category, action, label, value) => {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  };

  const trackException = (description, fatal) => {
    ReactGA.exception({
      description,
      fatal,
    });
  };

  const trackTiming = (category, variable, value, label) => {
    ReactGA.timing({
      category,
      variable,
      value,
      label,
    });
  };

  return {
    trackPageView,
    trackEvent,
    trackException,
    trackTiming,
  };
};

export default useGoogleAnalytics;

// components/AnalyticsProvider.jsx
import React, { createContext, useContext } from 'react';
import useGoogleAnalytics from '../hooks/useGoogleAnalytics';

const AnalyticsContext = createContext();

export function AnalyticsProvider({ children, trackingId }) {
  const analytics = useGoogleAnalytics(trackingId);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

// components/Button.jsx
import React from 'react';
import { useAnalytics } from './AnalyticsProvider';

function Button({ onClick, children, analyticsEvent, ...props }) {
  const { trackEvent } = useAnalytics();

  const handleClick = (event) => {
    if (analyticsEvent) {
      trackEvent(
        analyticsEvent.category || 'Button',
        analyticsEvent.action || 'Click',
        analyticsEvent.label,
        analyticsEvent.value
      );
    }
    
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

export default Button;
*/

// Example 3: Enhanced E-commerce tracking
/*
// utils/ecommerceAnalytics.js
import ReactGA from 'react-ga';

export const trackProductView = (product) => {
  ReactGA.plugin.execute('ec', 'addProduct', {
    id: product.id,
    name: product.name,
    category: product.category,
    brand: product.brand,
    price: product.price,
  });
  
  ReactGA.plugin.execute('ec', 'setAction', 'detail');
  ReactGA.pageview('/product/' + product.id);
};

export const trackAddToCart = (product, quantity = 1) => {
  ReactGA.plugin.execute('ec', 'addProduct', {
    id: product.id,
    name: product.name,
    category: product.category,
    brand: product.brand,
    price: product.price,
    quantity,
  });
  
  ReactGA.plugin.execute('ec', 'setAction', 'add');
  ReactGA.event({
    category: 'Ecommerce',
    action: 'Add to Cart',
    label: product.name,
  });
};

export const trackPurchase = (transaction) => {
  ReactGA.plugin.execute('ec', 'addTransaction', {
    id: transaction.id,
    affiliation: transaction.affiliation,
    revenue: transaction.revenue,
    tax: transaction.tax,
    shipping: transaction.shipping,
  });
  
  transaction.products.forEach(product => {
    ReactGA.plugin.execute('ec', 'addProduct', {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
    });
  });
  
  ReactGA.plugin.execute('ec', 'setAction', 'purchase');
  ReactGA.event({
    category: 'Ecommerce',
    action: 'Purchase',
    label: transaction.id,
    value: transaction.revenue,
  });
};

// components/Product.jsx
import React from 'react';
import { trackProductView, trackAddToCart } from '../utils/ecommerceAnalytics';

function Product({ product }) {
  const handleAddToCart = () => {
    trackAddToCart(product);
    // Add to cart logic here
  };

  React.useEffect(() => {
    trackProductView(product);
  }, [product]);

  return (
    <div>
      <h2>{product.name}</h2>
      <p>Price: ${product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

export default Product;
*/

// Example 4: Custom dimensions and metrics
/*
// utils/analytics.js
import ReactGA from 'react-ga';

const TRACKING_ID = 'UA-XXXXXXXXX-X';

export const initGA = () => {
  ReactGA.initialize(TRACKING_ID, {
    debug: process.env.NODE_ENV === 'development',
    gaOptions: {
      cookieDomain: 'none',
    },
  });
};

export const setUserDimensions = (userId, userType, subscriptionLevel) => {
  ReactGA.set({
    userId,
    dimension1: userType, // Custom dimension 1: User Type
    dimension2: subscriptionLevel, // Custom dimension 2: Subscription Level
  });
};

export const trackCustomEvent = (category, action, label, value, customDimensions = {}) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
    ...customDimensions,
  });
};

// components/UserDashboard.jsx
import React, { useEffect } from 'react';
import { setUserDimensions, trackCustomEvent } from '../utils/analytics';

function UserDashboard({ user }) {
  useEffect(() => {
    setUserDimensions(user.id, user.type, user.subscriptionLevel);
  }, [user]);

  const handleFeatureClick = (featureName) => {
    trackCustomEvent(
      'Dashboard',
      'Feature Click',
      featureName,
      null,
      {
        dimension3: user.department, // Custom dimension 3: Department
      }
    );
  };

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={() => handleFeatureClick('Reports')}>Reports</button>
      <button onClick={() => handleFeatureClick('Analytics')}>Analytics</button>
      <button onClick={() => handleFeatureClick('Settings')}>Settings</button>
    </div>
  );
}

export default UserDashboard;
*/

// Example 5: Performance tracking
/*
// utils/performanceAnalytics.js
import ReactGA from 'react-ga';

export const trackPageLoadTime = () => {
  if (window.performance) {
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    
    ReactGA.timing({
      category: 'Page Load',
      variable: 'load',
      value: loadTime, // in milliseconds
      label: 'Page Load Time',
    });
  }
};

export const trackApiCallTime = (apiName, startTime, endTime) => {
  const duration = endTime - startTime;
  
  ReactGA.timing({
    category: 'API Performance',
    variable: apiName,
    value: duration,
    label: `${apiName} Response Time`,
  });
};

export const trackComponentRenderTime = (componentName, renderTime) => {
  ReactGA.timing({
    category: 'Component Performance',
    variable: componentName,
    value: renderTime,
    label: `${componentName} Render Time`,
  });
};

// hooks/usePerformanceTracking.js
import { useEffect, useRef } from 'react';
import { trackComponentRenderTime } from '../utils/performanceAnalytics';

export const usePerformanceTracking = (componentName) => {
  const renderStartTime = useRef(Date.now());
  
  useEffect(() => {
    const renderEndTime = Date.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    trackComponentRenderTime(componentName, renderTime);
  });
};

// components/HeavyComponent.jsx
import React from 'react';
import { usePerformanceTracking } from '../hooks/usePerformanceTracking';

function HeavyComponent({ data }) {
  usePerformanceTracking('HeavyComponent');
  
  // Simulate heavy computation
  const processedData = React.useMemo(() => {
    return data.map(item => {
      // Complex processing logic
      return { ...item, processed: true };
    });
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

export default HeavyComponent;
*/

// Example 6: Error tracking
/*
// utils/errorAnalytics.js
import ReactGA from 'react-ga';

export const trackError = (error, errorInfo = {}) => {
  ReactGA.exception({
    description: error.message || 'Unknown error',
    fatal: error.fatal || false,
  });
  
  // Track additional error context
  ReactGA.event({
    category: 'Error',
    action: error.name || 'Error',
    label: error.stack || 'No stack trace',
  });
};

export const trackApiError = (apiName, error, requestInfo = {}) => {
  ReactGA.event({
    category: 'API Error',
    action: apiName,
    label: `${error.status || 'Unknown'}: ${error.message || 'Unknown error'}`,
  });
};

// components/ErrorBoundary.jsx
import React from 'react';
import { trackError } from '../utils/errorAnalytics';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    trackError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>We've been notified about this issue.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
*/

// Example 7: A/B testing integration
/*
// utils/abTestingAnalytics.js
import ReactGA from 'react-ga';

export const trackExperiment = (experimentId, variantId) => {
  ReactGA.event({
    category: 'Experiment',
    action: experimentId,
    label: variantId,
    nonInteraction: true,
  });
};

export const trackConversion = (experimentId, variantId, conversionType) => {
  ReactGA.event({
    category: 'Experiment Conversion',
    action: experimentId,
    label: `${variantId} - ${conversionType}`,
  });
};

// hooks/useABTest.js
import { useEffect, useState } from 'react';
import { trackExperiment } from '../utils/abTestingAnalytics';

export const useABTest = (experimentId, variants) => {
  const [variant, setVariant] = useState(null);
  
  useEffect(() => {
    // Simple A/B test logic - in production, use a proper A/B testing service
    const randomIndex = Math.floor(Math.random() * variants.length);
    const selectedVariant = variants[randomIndex];
    
    setVariant(selectedVariant);
    trackExperiment(experimentId, selectedVariant.id);
  }, [experimentId, variants]);
  
  return variant;
};

// components/ABTestButton.jsx
import React from 'react';
import { useABTest } from '../hooks/useABTest';
import { trackConversion } from '../utils/abTestingAnalytics';

function ABTestButton({ experimentId, variants, onConversion }) {
  const variant = useABTest(experimentId, variants);
  
  if (!variant) {
    return <div>Loading...</div>;
  }
  
  const handleClick = () => {
    trackConversion(experimentId, variant.id, 'click');
    if (onConversion) {
      onConversion();
    }
  };
  
  return (
    <button 
      onClick={handleClick}
      style={{ backgroundColor: variant.color }}
    >
      {variant.text}
    </button>
  );
}

export default ABTestButton;
*/

// Example 8: Google Analytics 4 (GA4) with gtag
/*
// utils/ga4.js
export const GA_TRACKING_ID = 'G-XXXXXXXXXX';

export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = (action, category, label, value) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const initGA4 = () => {
  // Add Google Analytics script to head
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID);
};

// components/GA4Tracker.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import { initGA4, pageview, event } from '../utils/ga4';

function App() {
  useEffect(() => {
    initGA4();
  }, []);

  return (
    <Router>
      <RouteChangeTracker />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </Router>
  );
}

function RouteChangeTracker() {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname);
  }, [location]);

  return null;
}

function SignupButton() {
  const handleSignup = () => {
    event('sign_up', 'engagement', 'header_button');
    // Signup logic here
  };

  return <button onClick={handleSignup}>Sign Up</button>;
}
*/

export const googleAnalyticsExamples = {
  description: "Examples of integrating Google Analytics with React applications",
  installation: {
    reactGA: "npm install react-ga --save",
    ga4: "Add gtag script directly to HTML"
  },
  features: [
    "Page view tracking",
    "Event tracking",
    "E-commerce tracking",
    "Custom dimensions and metrics",
    "Performance monitoring",
    "Error tracking",
    "A/B testing integration",
    "GA4 support"
  ],
  bestPractices: [
    "Initialize analytics early in app lifecycle",
    "Track meaningful user interactions",
    "Use custom dimensions for user segmentation",
    "Monitor performance metrics",
    "Track errors for debugging",
    "Respect user privacy and GDPR"
  ]
};