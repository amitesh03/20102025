/**
 * Sentry Examples
 * 
 * Sentry is an error tracking platform that helps developers monitor and fix crashes
 * in real-time. It provides detailed error reports, performance monitoring,
 * and release tracking for web applications.
 */

// Example 1: Basic setup with Sentry
/*
// Install packages:
// npm install @sentry/react @sentry/tracing --save

// utils/sentry.js
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

const SENTRY_DSN = 'https://your-dsn@sentry.io/project-id'; // Your Sentry DSN

export const initSentry = () => {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
    release: process.env.REACT_APP_VERSION || '1.0.0',
    beforeSend(event) {
      // Modify the event here if needed
      if (event.exception) {
        console.error('Exception caught by Sentry:', event.exception);
      }
      return event;
    },
  });
};

export const captureException = (error, errorInfo = {}) => {
  Sentry.withScope((scope) => {
    if (errorInfo.componentName) {
      scope.setTag('component', errorInfo.componentName);
    }
    if (errorInfo.userId) {
      scope.setUser({ id: errorInfo.userId });
    }
    if (errorInfo.extra) {
      Object.keys(errorInfo.extra).forEach(key => {
        scope.setExtra(key, errorInfo.extra[key]);
      });
    }
    Sentry.captureException(error);
  });
};

export const captureMessage = (message, level = 'info') => {
  Sentry.captureMessage(message, level);
};

// App.js
import React from 'react';
import { initSentry } from './utils/sentry';

function App() {
  React.useEffect(() => {
    initSentry();
  }, []);

  return (
    <div>
      <h1>Welcome to Sentry Demo</h1>
      <button onClick={() => {
        throw new Error('Test error');
      }}>
        Trigger Error
      </button>
    </div>
  );
}

export default App;
*/

// Example 2: Error Boundary with Sentry
/*
// components/ErrorBoundary.jsx
import React from 'react';
import * as Sentry from '@sentry/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, eventId: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
    
    this.setState({ error, eventId });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>We've been notified about this issue.</p>
          {this.state.eventId && (
            <p>
              Error ID: {this.state.eventId}
              <button 
                onClick={() => {
                  const userFeedback = {
                    event_id: this.state.eventId,
                    email: 'user@example.com',
                    comments: 'This error occurred when I clicked the submit button.',
                  };
                  Sentry.captureUserFeedback(userFeedback);
                }}
              >
                Report Feedback
              </button>
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
*/

// Example 3: Custom hook for Sentry
/*
// hooks/useSentry.js
import { useCallback } from 'react';
import * as Sentry from '@sentry/react';

export const useSentry = () => {
  const captureException = useCallback((error, errorInfo = {}) => {
    Sentry.withScope((scope) => {
      if (errorInfo.componentName) {
        scope.setTag('component', errorInfo.componentName);
      }
      if (errorInfo.userId) {
        scope.setUser({ id: errorInfo.userId });
      }
      if (errorInfo.tags) {
        Object.keys(errorInfo.tags).forEach(key => {
          scope.setTag(key, errorInfo.tags[key]);
        });
      }
      if (errorInfo.extra) {
        Object.keys(errorInfo.extra).forEach(key => {
          scope.setExtra(key, errorInfo.extra[key]);
        });
      }
      Sentry.captureException(error);
    });
  }, []);

  const captureMessage = useCallback((message, level = 'info', context = {}) => {
    Sentry.withScope((scope) => {
      if (context.tags) {
        Object.keys(context.tags).forEach(key => {
          scope.setTag(key, context.tags[key]);
        });
      }
      if (context.extra) {
        Object.keys(context.extra).forEach(key => {
          scope.setExtra(key, context.extra[key]);
        });
      }
      Sentry.captureMessage(message, level);
    });
  }, []);

  const setUser = useCallback((user) => {
    Sentry.setUser(user);
  }, []);

  const clearUser = useCallback(() => {
    Sentry.setUser(null);
  }, []);

  const addBreadcrumb = useCallback((breadcrumb) => {
    Sentry.addBreadcrumb(breadcrumb);
  }, []);

  return {
    captureException,
    captureMessage,
    setUser,
    clearUser,
    addBreadcrumb,
  };
};

export default useSentry;

// components/UserProfile.jsx
import React from 'react';
import { useSentry } from '../hooks/useSentry';

function UserProfile({ user }) {
  const { captureException, setUser, addBreadcrumb } = useSentry();
  
  React.useEffect(() => {
    if (user) {
      setUser({
        id: user.id,
        email: user.email,
        username: user.username
      });
      
      addBreadcrumb({
        message: 'User profile loaded',
        category: 'user',
        level: 'info'
      });
    }
  }, [user, setUser, addBreadcrumb]);
  
  const handleProfileUpdate = (field) => {
    try {
      // Profile update logic here
      addBreadcrumb({
        message: `Profile field ${field} updated`,
        category: 'user',
        level: 'info'
      });
    } catch (error) {
      captureException(error, {
        componentName: 'UserProfile',
        tags: {
          action: 'profile_update',
          field
        }
      });
    }
  };
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
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

// Example 4: Performance monitoring with Sentry
/*
// utils/performanceMonitoring.js
import * as Sentry from '@sentry/react';

export const startTransaction = (name, op = 'navigation') => {
  return Sentry.startTransaction({
    name,
    op,
  });
};

export const setTransactionName = (name) => {
  const transaction = Sentry.getCurrentHub().getScope().getTransaction();
  if (transaction) {
    transaction.setName(name);
  }
};

export const setTransactionTag = (key, value) => {
  const transaction = Sentry.getCurrentHub().getScope().getTransaction();
  if (transaction) {
    transaction.setTag(key, value);
  }
};

export const finishTransaction = (transaction, status = 'ok') => {
  if (transaction) {
    transaction.setStatus(status);
    transaction.finish();
  }
};

// hooks/usePerformanceTracking.js
import { useEffect, useRef } from 'react';
import { startTransaction, finishTransaction } from '../utils/performanceMonitoring';

export const usePerformanceTracking = (componentName) => {
  const transactionRef = useRef(null);
  
  useEffect(() => {
    transactionRef.current = startTransaction(`Component: ${componentName}`, 'ui');
    
    return () => {
      if (transactionRef.current) {
        finishTransaction(transactionRef.current);
      }
    };
  }, [componentName]);
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

// Example 5: API error tracking
/*
// utils/apiErrorTracking.js
import * as Sentry from '@sentry/react';

export const trackApiError = (apiName, error, requestInfo = {}) => {
  Sentry.withScope((scope) => {
    scope.setTag('api', apiName);
    scope.setTag('status_code', error.status || 'unknown');
    scope.setExtra('request_url', requestInfo.url);
    scope.setExtra('request_method', requestInfo.method);
    scope.setExtra('request_data', requestInfo.data);
    scope.setExtra('response_data', error.response?.data);
    
    Sentry.captureException(error, {
      fingerprint: [`{{ default }}`, `api:${apiName}`]
    });
  });
};

// hooks/useApi.js
import { useState, useEffect } from 'react';
import { trackApiError } from '../utils/apiErrorTracking';

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

// components/DataLoader.jsx
import React from 'react';
import { useApi } from '../hooks/useApi';

function DataLoader({ apiUrl }) {
  const { data, loading, error } = useApi(apiUrl);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h2>Data Loaded</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default DataLoader;
*/

// Example 6: User feedback integration
/*
// components/FeedbackWidget.jsx
import React, { useState } from 'react';
import * as Sentry from '@sentry/react';

function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [eventId, setEventId] = useState(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userFeedback = {
      event_id: eventId,
      email,
      comments: feedback,
    };
    
    Sentry.captureUserFeedback(userFeedback);
    
    setIsOpen(false);
    setFeedback('');
    setEmail('');
    setEventId(null);
  };
  
  const handleReportIssue = () => {
    // Get the last event ID from Sentry
    const lastEventId = Sentry.lastEventId();
    setEventId(lastEventId);
    setIsOpen(true);
  };
  
  return (
    <div>
      <button 
        onClick={handleReportIssue}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          padding: '10px 15px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Report Issue
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
          <h3>Report an Issue</h3>
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
              <label>Issue Description:</label>
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

// Example 7: Release tracking
/*
// utils/releaseTracking.js
import * as Sentry from '@sentry/react';

export const setRelease = (version) => {
  Sentry.getCurrentHub().getClient().setOptions({
    release: version
  });
};

export const setEnvironment = (environment) => {
  Sentry.getCurrentHub().getClient().setOptions({
    environment
  });
};

export const addReleaseTag = (key, value) => {
  Sentry.getCurrentHub().configureScope((scope) => {
    scope.setTag(key, value);
  });
};

// App.js
import React, { useEffect } from 'react';
import { initSentry, setRelease, setEnvironment } from './utils/sentry';

function App() {
  useEffect(() => {
    initSentry();
    
    // Set release and environment
    setRelease(process.env.REACT_APP_VERSION || '1.0.0');
    setEnvironment(process.env.NODE_ENV || 'development');
    
    // Add release-specific tags
    addReleaseTag('build_date', new Date().toISOString());
    addReleaseTag('git_commit', process.env.REACT_APP_GIT_COMMIT || 'unknown');
  }, []);

  return (
    <div>
      <h1>App with Release Tracking</h1>
    </div>
  );
}

export default App;
*/

// Example 8: Testing with Sentry
/*
// __tests__/ErrorBoundary.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import * as Sentry from '@sentry/react';
import ErrorBoundary from '../ErrorBoundary';

// Mock Sentry
jest.mock('@sentry/react', () => ({
  captureException: jest.fn(),
  captureUserFeedback: jest.fn(),
}));

test('ErrorBoundary captures and displays error', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  expect(Sentry.captureException).toHaveBeenCalled();
});

test('ErrorBoundary captures user feedback', () => {
  const error = new Error('Test error');
  const errorInfo = { componentStack: 'Test stack' };
  
  const boundary = new ErrorBoundary();
  boundary.componentDidCatch(error, errorInfo);
  
  const feedbackButton = screen.getByText(/report feedback/i);
  feedbackButton.click();
  
  expect(Sentry.captureUserFeedback).toHaveBeenCalledWith(
    expect.objectContaining({
      event_id: expect.any(String),
      email: 'user@example.com',
      comments: 'This error occurred when I clicked the submit button.',
    })
  );
});
*/

export const sentryExamples = {
  description: "Examples of using Sentry for error tracking and performance monitoring in React applications",
  installation: {
    core: "npm install @sentry/react --save",
    tracing: "npm install @sentry/tracing --save"
  },
  features: [
    "Error tracking",
    "Performance monitoring",
    "Release tracking",
    "User feedback",
    "Breadcrumbs",
    "Context and tags",
    "Error boundaries",
    "Transaction tracing"
  ],
  configuration: [
    "DSN initialization",
    "Environment settings",
    "Release version",
    "Sample rates",
    "Before send hooks",
    "Integrations"
  ],
  integrations: [
    "React Error Boundary",
    "Browser tracing",
    "Performance monitoring",
    "User feedback",
    "API error tracking",
    "Custom hooks"
  ],
  bestPractices: [
    "Initialize early in app lifecycle",
    "Use error boundaries for React components",
    "Set user context for better debugging",
    "Add meaningful tags and context",
    "Track performance for critical paths",
    "Collect user feedback for errors"
  ]
};