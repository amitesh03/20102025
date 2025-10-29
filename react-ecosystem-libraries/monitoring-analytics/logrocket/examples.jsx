/**
 * LogRocket Examples
 * 
 * LogRocket is a frontend application monitoring solution that helps you reproduce bugs,
 * understand user behavior, and fix issues faster by providing session recordings
 * and performance analytics.
 */

// Example 1: Basic setup with LogRocket
/*
// Install the package:
// npm install logrocket --save

// utils/logrocket.js
import LogRocket from 'logrocket';

const APP_ID = 'your-app-id'; // Your LogRocket app ID

export const initLogRocket = () => {
  if (process.env.NODE_ENV === 'production') {
    LogRocket.init(APP_ID, {
      release: process.env.REACT_APP_VERSION || '1.0.0',
      network: {
        requestSanitizer: (request) => {
          // Remove sensitive headers
          if (request.headers) {
            delete request.headers['authorization'];
            delete request.headers['cookie'];
          }
          
          // Sanitize URL parameters
          if (request.url.includes('/api/')) {
            request.url = request.url.replace(/password=[^&]*/, 'password=***');
          }
          
          return request;
        },
        responseSanitizer: (response) => {
          // Remove sensitive response data
          if (response.body && response.body.token) {
            response.body.token = '***';
          }
          return response;
        }
      }
    });
  }
};

export const identifyUser = (user) => {
  if (process.env.NODE_ENV === 'production' && user) {
    LogRocket.identify(user.id, {
      name: user.name,
      email: user.email,
      subscriptionType: user.subscriptionType,
      // Add any other user traits you want to track
    });
  }
};

export const trackEvent = (eventName, properties = {}) => {
  if (process.env.NODE_ENV === 'production') {
    LogRocket.track(eventName, properties);
  }
};

// App.js
import React, { useEffect } from 'react';
import { initLogRocket, identifyUser } from './utils/logrocket';

function App() {
  const [user, setUser] = React.useState(null);
  
  useEffect(() => {
    initLogRocket();
    
    // Simulate user authentication
    const authenticatedUser = {
      id: '12345',
      name: 'John Doe',
      email: 'john@example.com',
      subscriptionType: 'premium'
    };
    
    setUser(authenticatedUser);
    identifyUser(authenticatedUser);
  }, []);

  return (
    <div>
      <h1>Welcome to LogRocket Demo</h1>
      {user && <p>Hello, {user.name}!</p>}
    </div>
  );
}

export default App;
*/

// Example 2: Custom hook for LogRocket
/*
// hooks/useLogRocket.js
import { useEffect, useRef } from 'react';
import LogRocket from 'logrocket';

export const useLogRocket = (appId, options = {}) => {
  const isInitialized = useRef(false);
  
  useEffect(() => {
    if (!isInitialized.current && process.env.NODE_ENV === 'production') {
      LogRocket.init(appId, options);
      isInitialized.current = true;
    }
  }, [appId, options]);
  
  const identify = (uid, traits = {}) => {
    if (isInitialized.current) {
      LogRocket.identify(uid, traits);
    }
  };
  
  const track = (eventName, properties = {}) => {
    if (isInitialized.current) {
      LogRocket.track(eventName, properties);
    }
  };
  
  const getSessionURL = (callback) => {
    if (isInitialized.current) {
      LogRocket.getSessionURL(callback);
    }
  };
  
  return {
    identify,
    track,
    getSessionURL,
    isReady: isInitialized.current
  };
};

export default useLogRocket;

// components/AnalyticsProvider.jsx
import React, { createContext, useContext } from 'react';
import useLogRocket from '../hooks/useLogRocket';

const AnalyticsContext = createContext();

export function AnalyticsProvider({ children, appId, options }) {
  const logRocket = useLogRocket(appId, options);
  
  return (
    <AnalyticsContext.Provider value={logRocket}>
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
  const { identify, track } = useAnalytics();
  
  React.useEffect(() => {
    if (user) {
      identify(user.id, {
        name: user.name,
        email: user.email,
        plan: user.plan
      });
    }
  }, [user, identify]);
  
  const handleProfileUpdate = (field) => {
    track('profile_updated', { field });
    // Profile update logic here
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

// Example 3: Error tracking with LogRocket
/*
// utils/errorTracking.js
import LogRocket from 'logrocket';

export const trackError = (error, errorInfo = {}) => {
  if (process.env.NODE_ENV === 'production') {
    // Track the error with LogRocket
    LogRocket.captureException(error, {
      extra: errorInfo,
      tags: {
        component: errorInfo.componentName || 'Unknown',
        severity: error.fatal ? 'critical' : 'error'
      }
    });
    
    // Also track as a custom event
    LogRocket.track('error_occurred', {
      message: error.message,
      stack: error.stack,
      component: errorInfo.componentName
    });
  }
};

export const trackApiError = (apiName, error, requestInfo = {}) => {
  if (process.env.NODE_ENV === 'production') {
    LogRocket.track('api_error', {
      api: apiName,
      status: error.status,
      message: error.message,
      url: requestInfo.url,
      method: requestInfo.method
    });
  }
};

// components/ErrorBoundary.jsx
import React from 'react';
import { trackError } from '../utils/errorTracking';

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

// hooks/useApi.js
import { useState, useEffect } from 'react';
import { trackApiError } from '../utils/errorTracking';

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
        trackApiError(url, err, { url, method: options.method || 'GET' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url, options]);
  
  return { data, loading, error };
};
*/

// Example 4: Performance monitoring
/*
// utils/performanceTracking.js
import LogRocket from 'logrocket';

export const trackPageLoad = () => {
  if (process.env.NODE_ENV === 'production' && window.performance) {
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    
    LogRocket.track('page_load_completed', {
      loadTime,
      url: window.location.pathname
    });
  }
};

export const trackComponentRender = (componentName, renderTime) => {
  if (process.env.NODE_ENV === 'production') {
    LogRocket.track('component_rendered', {
      component: componentName,
      renderTime
    });
  }
};

export const trackApiCall = (apiName, startTime, endTime, success) => {
  if (process.env.NODE_ENV === 'production') {
    const duration = endTime - startTime;
    
    LogRocket.track('api_call_completed', {
      api: apiName,
      duration,
      success
    });
  }
};

// hooks/usePerformanceTracking.js
import { useEffect, useRef } from 'react';
import { trackComponentRender } from '../utils/performanceTracking';

export const usePerformanceTracking = (componentName) => {
  const renderStartTime = useRef(Date.now());
  
  useEffect(() => {
    const renderEndTime = Date.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    trackComponentRender(componentName, renderTime);
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

// Example 5: Integration with issue tracking systems
/*
// utils/issueTracking.js
import LogRocket from 'logrocket';

export const createJiraTicket = (sessionUrl, error) => {
  // This would typically be a server-side API call
  // Here's a client-side example for demonstration
  const jiraUrl = 'https://your-domain.atlassian.net/rest/api/2/issue/';
  
  const issueData = {
    fields: {
      project: { key: 'PROJ' },
      summary: `Error reported by user: ${error.message}`,
      description: `LogRocket session: ${sessionUrl}\n\nError: ${error.stack}`,
      issuetype: { name: 'Bug' }
    }
  };
  
  // In a real app, this would be a secure server-side call
  console.log('Creating JIRA ticket:', issueData);
};

export const trackErrorWithTicket = (error, errorInfo = {}) => {
  if (process.env.NODE_ENV === 'production') {
    LogRocket.getSessionURL(sessionUrl => {
      if (sessionUrl) {
        createJiraTicket(sessionUrl, error);
      }
    });
  }
};

// components/ErrorReporting.jsx
import React from 'react';
import { trackErrorWithTicket } from '../utils/issueTracking';

function ErrorReporting({ error }) {
  const [ticketCreated, setTicketCreated] = React.useState(false);
  
  const handleCreateTicket = () => {
    trackErrorWithTicket(error);
    setTicketCreated(true);
  };
  
  return (
    <div>
      <h2>An error occurred</h2>
      <p>{error.message}</p>
      <button onClick={handleCreateTicket} disabled={ticketCreated}>
        {ticketCreated ? 'Ticket Created' : 'Create Support Ticket'}
      </button>
    </div>
  );
}

export default ErrorReporting;
*/

// Example 6: User feedback integration
/*
// components/FeedbackWidget.jsx
import React, { useState } from 'react';
import LogRocket from 'logrocket';

function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    LogRocket.getSessionURL(sessionUrl => {
      // Send feedback with session URL to your backend
      fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          feedback,
          email,
          sessionUrl
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Feedback submitted:', data);
        setIsOpen(false);
        setFeedback('');
        setEmail('');
      })
      .catch(error => {
        console.error('Error submitting feedback:', error);
      });
    });
  };
  
  return (
    <div>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          padding: '10px 15px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Feedback
      </button>
      
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: 70,
          right: 20,
          width: 300,
          padding: 20,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Send Feedback</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 10 }}>
              <label>Email:</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: 5 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Feedback:</label>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                style={{ width: '100%', height: 100, padding: 5 }}
              />
            </div>
            <div>
              <button type="submit" style={{ marginRight: 10 }}>
                Submit
              </button>
              <button type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default FeedbackWidget;
*/

// Example 7: A/B testing integration
/*
// utils/abTesting.js
import LogRocket from 'logrocket';

export const trackExperiment = (experimentName, variant) => {
  if (process.env.NODE_ENV === 'production') {
    LogRocket.track('experiment_viewed', {
      experiment: experimentName,
      variant
    });
  }
};

export const trackConversion = (experimentName, variant, conversionType) => {
  if (process.env.NODE_ENV === 'production') {
    LogRocket.track('experiment_conversion', {
      experiment: experimentName,
      variant,
      conversionType
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

export const logrocketExamples = {
  description: "Examples of using LogRocket for session recording and error tracking in React applications",
  installation: "npm install logrocket --save",
  features: [
    "Session recording",
    "Error tracking",
    "Performance monitoring",
    "User identification",
    "Custom event tracking",
    "Network request monitoring",
    "Console log capture",
    "DOM recording"
  ],
  configuration: [
    "App ID initialization",
    "Network request/response sanitization",
    "Release version tracking",
    "User identification",
    "Custom event tracking"
  ],
  integrations: [
    "Error boundaries",
    "API error tracking",
    "Performance monitoring",
    "Issue tracking systems",
    "A/B testing",
    "User feedback widgets"
  ],
  bestPractices: [
    "Initialize early in app lifecycle",
    "Sanitize sensitive data",
    "Identify users for better context",
    "Track meaningful user actions",
    "Monitor performance metrics",
    "Integrate with error reporting"
  ]
};