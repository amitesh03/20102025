/**
 * Mixpanel Examples
 * 
 * Mixpanel is a product analytics platform that helps you analyze user behavior,
 * track conversions, and optimize your product through data-driven insights.
 */

// Example 1: Basic setup with Mixpanel
/*
// Install package:
// npm install mixpanel-browser --save

// utils/mixpanel.js
import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = 'your-mixpanel-token'; // Your Mixpanel token

export const initMixpanel = () => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV === 'development',
      track_pageview: true,
      persistence: 'localStorage',
    });
  }
};

export const trackEvent = (eventName, properties = {}) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.track(eventName, properties);
  }
};

export const identifyUser = (userId, properties = {}) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.identify(userId);
    mixpanel.people.set(properties);
  }
};

export const setUserProperties = (properties) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.people.set(properties);
  }
};

// App.js
import React, { useEffect } from 'react';
import { initMixpanel, identifyUser } from './utils/mixpanel';

function App() {
  const [user, setUser] = React.useState(null);
  
  useEffect(() => {
    initMixpanel();
    
    // Simulate user authentication
    const authenticatedUser = {
      id: '12345',
      name: 'John Doe',
      email: 'john@example.com',
      plan: 'premium'
    };
    
    setUser(authenticatedUser);
    identifyUser(authenticatedUser.id, {
      $name: authenticatedUser.name,
      $email: authenticatedUser.email,
      Plan: authenticatedUser.plan
    });
  }, []);

  return (
    <div>
      <h1>Welcome to Mixpanel Demo</h1>
      {user && <p>Hello, {user.name}!</p>}
    </div>
  );
}

export default App;
*/

// Example 2: Custom hook for Mixpanel
/*
// hooks/useMixpanel.js
import { useEffect, useRef } from 'react';
import mixpanel from 'mixpanel-browser';

export const useMixpanel = (token, options = {}) => {
  const isInitialized = useRef(false);
  
  useEffect(() => {
    if (!isInitialized.current && process.env.NODE_ENV === 'production') {
      mixpanel.init(token, options);
      isInitialized.current = true;
    }
  }, [token, options]);
  
  const track = (eventName, properties = {}) => {
    if (isInitialized.current) {
      mixpanel.track(eventName, properties);
    }
  };
  
  const identify = (userId, properties = {}) => {
    if (isInitialized.current) {
      mixpanel.identify(userId);
      mixpanel.people.set(properties);
    }
  };
  
  const setUserProperties = (properties) => {
    if (isInitialized.current) {
      mixpanel.people.set(properties);
    }
  };
  
  const incrementProperty = (property, value = 1) => {
    if (isInitialized.current) {
      mixpanel.people.increment(property, value);
    }
  };
  
  return {
    track,
    identify,
    setUserProperties,
    incrementProperty,
    isReady: isInitialized.current
  };
};

export default useMixpanel;

// components/AnalyticsProvider.jsx
import React, { createContext, useContext } from 'react';
import useMixpanel from '../hooks/useMixpanel';

const AnalyticsContext = createContext();

export function AnalyticsProvider({ children, token, options }) {
  const mixpanel = useMixpanel(token, options);
  
  return (
    <AnalyticsContext.Provider value={mixpanel}>
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

// components/UserProfile.jsx
import React from 'react';
import { useAnalytics } from './AnalyticsProvider';

function UserProfile({ user }) {
  const { identify, track, setUserProperties } = useAnalytics();
  
  React.useEffect(() => {
    if (user) {
      identify(user.id, {
        $name: user.name,
        $email: user.email,
        Plan: user.plan
      });
    }
  }, [user, identify]);
  
  const handleProfileUpdate = (field) => {
    track('profile_updated', { field });
    setUserProperties({
      [`Last ${field} Update`]: new Date().toISOString()
    });
  };
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Plan: {user.plan}</p>
      <button onClick={() => handleProfileUpdate('name')}>
        Update Name
      </button>
      <button onClick={() => handleProfileUpdate('email')}>
        Update Email
      </button>
    </div>
  );
}

export default UserProfile;
*/

// Example 3: E-commerce tracking
/*
// utils/ecommerceAnalytics.js
import mixpanel from 'mixpanel-browser';

export const trackProductView = (product) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.track('Product Viewed', {
      'Product ID': product.id,
      'Product Name': product.name,
      'Category': product.category,
      'Price': product.price,
      'Currency': 'USD'
    });
  }
};

export const trackAddToCart = (product, quantity = 1) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.track('Added to Cart', {
      'Product ID': product.id,
      'Product Name': product.name,
      'Category': product.category,
      'Price': product.price,
      'Quantity': quantity,
      'Currency': 'USD'
    });
  }
};

export const trackPurchase = (order) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.track('Order Completed', {
      'Order ID': order.id,
      'Total': order.total,
      'Currency': 'USD',
      'Products': order.products.map(product => ({
        'Product ID': product.id,
        'Product Name': product.name,
        'Price': product.price,
        'Quantity': product.quantity
      }))
    });
    
    // Track revenue
    mixpanel.people.track_charge(order.total, {
      '$time': new Date().toISOString(),
      'Order ID': order.id
    });
  }
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

// Example 4: Funnel tracking
/*
// utils/funnelAnalytics.js
import mixpanel from 'mixpanel-browser';

export const trackFunnelStep = (funnelName, step, properties = {}) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.track(`${funnelName} - ${step}`, {
      'Funnel': funnelName,
      'Step': step,
      ...properties
    });
  }
};

export const trackFunnelCompletion = (funnelName, properties = {}) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.track(`${funnelName} - Completed`, {
      'Funnel': funnelName,
      ...properties
    });
  }
};

// components/SignupFlow.jsx
import React, { useState } from 'react';
import { trackFunnelStep, trackFunnelCompletion } from '../utils/funnelAnalytics';

function SignupFlow() {
  const [step, setStep] = useState('start');
  const [userData, setUserData] = useState({});
  
  const handleStepChange = (newStep, data = {}) => {
    setStep(newStep);
    setUserData({ ...userData, ...data });
    trackFunnelStep('Signup', newStep, data);
  };
  
  const handleCompletion = () => {
    trackFunnelCompletion('Signup', userData);
    // Complete signup logic here
  };
  
  return (
    <div>
      <h1>Sign Up</h1>
      
      {step === 'start' && (
        <div>
          <h2>Step 1: Email</h2>
          <input 
            type="email" 
            placeholder="Enter your email"
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
          <button onClick={() => handleStepChange('email', { email: userData.email })}>
            Next
          </button>
        </div>
      )}
      
      {step === 'email' && (
        <div>
          <h2>Step 2: Password</h2>
          <input 
            type="password" 
            placeholder="Enter your password"
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
          <button onClick={() => handleStepChange('password', { hasPassword: true })}>
            Next
          </button>
        </div>
      )}
      
      {step === 'password' && (
        <div>
          <h2>Step 3: Profile</h2>
          <input 
            type="text" 
            placeholder="Enter your name"
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
          <button onClick={handleCompletion}>
            Complete Signup
          </button>
        </div>
      )}
    </div>
  );
}

export default SignupFlow;
*/

// Example 5: A/B testing integration
/*
// utils/abTesting.js
import mixpanel from 'mixpanel-browser';

export const trackExperiment = (experimentName, variant) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.track('Experiment Viewed', {
      'Experiment': experimentName,
      'Variant': variant
    });
    
    // Set user property for the experiment
    mixpanel.people.set({
      [`Experiment - ${experimentName}`]: variant
    });
  }
};

export const trackConversion = (experimentName, variant, conversionType) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.track('Experiment Conversion', {
      'Experiment': experimentName,
      'Variant': variant,
      'Conversion Type': conversionType
    });
  }
};

// hooks/useABTest.js
import { useEffect, useState } from 'react';
import { trackExperiment } from '../utils/abTesting';

export const useABTest = (experimentName, variants) => {
  const [variant, setVariant] = useState(null);
  
  useEffect(() => {
    // Simple A/B test logic - in production, use a proper A/B testing service
    const randomIndex = Math.floor(Math.random() * variants.length);
    const selectedVariant = variants[randomIndex];
    
    setVariant(selectedVariant);
    trackExperiment(experimentName, selectedVariant.name);
  }, [experimentName, variants]);
  
  return variant;
};

// components/ABTestButton.jsx
import React from 'react';
import { useABTest } from '../hooks/useABTest';
import { trackConversion } from '../utils/abTesting';

function ABTestButton({ experimentName, variants, onConversion }) {
  const variant = useABTest(experimentName, variants);
  
  if (!variant) {
    return <div>Loading...</div>;
  }
  
  const handleClick = () => {
    trackConversion(experimentName, variant.name, 'click');
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

// Example 6: User engagement tracking
/*
// utils/engagementAnalytics.js
import mixpanel from 'mixpanel-browser';

export const trackPageView = (pageName, properties = {}) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.track('Page Viewed', {
      'Page': pageName,
      ...properties
    });
  }
};

export const trackFeatureUsage = (featureName, properties = {}) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.track('Feature Used', {
      'Feature': featureName,
      ...properties
    });
  }
};

export const trackSessionStart = () => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.track('Session Started', {
      'Timestamp': new Date().toISOString()
    });
  }
};

export const trackSessionEnd = (duration) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.track('Session Ended', {
      'Duration': duration,
      'Timestamp': new Date().toISOString()
    });
  }
};

// hooks/useSessionTracking.js
import { useEffect, useRef } from 'react';
import { trackSessionStart, trackSessionEnd } from '../utils/engagementAnalytics';

export const useSessionTracking = () => {
  const sessionStartTime = useRef(Date.now());
  
  useEffect(() => {
    trackSessionStart();
    
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - sessionStartTime.current;
      trackSessionEnd(sessionDuration);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      const sessionDuration = Date.now() - sessionStartTime.current;
      trackSessionEnd(sessionDuration);
    };
  }, []);
};

// components/Dashboard.jsx
import React from 'react';
import { useSessionTracking } from '../hooks/useSessionTracking';
import { trackPageView, trackFeatureUsage } from '../utils/engagementAnalytics';

function Dashboard() {
  useSessionTracking();
  
  React.useEffect(() => {
    trackPageView('Dashboard');
  }, []);
  
  const handleFeatureClick = (featureName) => {
    trackFeatureUsage(featureName, {
      'Page': 'Dashboard'
    });
  };
  
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => handleFeatureClick('Reports')}>
        Reports
      </button>
      <button onClick={() => handleFeatureClick('Analytics')}>
        Analytics
      </button>
      <button onClick={() => handleFeatureClick('Settings')}>
        Settings
      </button>
    </div>
  );
}

export default Dashboard;
*/

// Example 7: Error tracking
/*
// utils/errorAnalytics.js
import mixpanel from 'mixpanel-browser';

export const trackError = (error, errorInfo = {}) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.track('Error Occurred', {
      'Error Message': error.message,
      'Error Stack': error.stack,
      'Component': errorInfo.componentName || 'Unknown',
      'User Agent': navigator.userAgent,
      'URL': window.location.href
    });
  }
};

export const trackApiError = (apiName, error, requestInfo = {}) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.track('API Error', {
      'API': apiName,
      'Status Code': error.status,
      'Error Message': error.message,
      'URL': requestInfo.url,
      'Method': requestInfo.method
    });
  }
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

export const mixpanelExamples = {
  description: "Examples of using Mixpanel for product analytics and user behavior tracking",
  installation: "npm install mixpanel-browser --save",
  features: [
    "Event tracking",
    "User identification",
    "User properties",
    "Funnel analysis",
    "A/B testing",
    "E-commerce tracking",
    "Session tracking",
    "Error tracking"
  ],
  configuration: [
    "Token initialization",
    "Debug mode",
    "Persistence options",
    "Page view tracking",
    "Custom properties"
  ],
  integrations: [
    "React hooks",
    "Context providers",
    "Error boundaries",
    "E-commerce flows",
    "User funnels",
    "A/B testing"
  ],
  bestPractices: [
    "Initialize early in app lifecycle",
    "Use consistent event naming",
    "Track meaningful user actions",
    "Set user properties for segmentation",
    "Monitor conversion funnels",
    "Track errors for debugging"
  ]
};