// Passport.js Examples with Detailed Comments
// This file demonstrates various Passport.js concepts with comprehensive explanations
// Note: These examples show the client-side React code that would interact with Passport.js backends

import React, { useState, useEffect } from 'react';

// ===== EXAMPLE 1: LOCAL AUTHENTICATION =====
/**
 * Local authentication demonstrating core Passport.js concepts
 * Shows how to authenticate users with username and password
 */

function LocalAuthentication() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '' });

  // Simulate Passport.js local authentication
  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // This would make a POST request to Passport.js protected route
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Important for cookies
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUser(result.user);
        // Store session/token (handled by Passport.js)
        localStorage.setItem('token', result.token);
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include' 
      });
      setUser(null);
      localStorage.removeItem('token');
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // This would validate token with Passport.js
          const response = await fetch('/api/auth/verify', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          const result = await response.json();
          if (result.valid) {
            setUser(result.user);
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
      }
    };
    
    checkAuthStatus();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Passport.js Local Authentication</h3>
      
      {user ? (
        <div style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
          <h4>Welcome, {user.name}!</h4>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>ID:</strong> {user.id}</p>
          <button onClick={logout} style={{ padding: '10px 20px' }}>
            Logout
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <form onSubmit={login} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>Login</h4>
            
            {error && (
              <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee' }}>
                {error}
              </div>
            )}
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
              <input 
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px' 
                }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
              <input 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px' 
                }}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px' 
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            <p><strong>Passport.js Features:</strong></p>
            <ul style={{ textAlign: 'left' }}>
              <li>Local strategy for username/password</li>
              <li>Session management</li>
              <li>Serialization/deserialization</li>
              <li>Middleware integration</li>
              <li>Custom field mapping</li>
              <li>Password hashing utilities</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 2: OAUTH AUTHENTICATION =====
/**
 * OAuth authentication demonstrating Passport.js OAuth strategies
 * Shows how to authenticate with third-party providers
 */

function OAuthAuthentication() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate OAuth providers
  const oauthProviders = [
    { name: 'Google', icon: '🔍', color: '#4285f4' },
    { name: 'GitHub', icon: '🐙', color: '#333' },
    { name: 'Facebook', icon: '📘', color: '#1877f2' },
    { name: 'Twitter', icon: '🐦', color: '#1da1f2' },
  ];

  // Simulate OAuth login flow
  const initiateOAuth = async (provider) => {
    setLoading(true);
    setError(null);
    
    try {
      // This would redirect to Passport.js OAuth route
      const response = await fetch(`/api/auth/${provider.toLowerCase()}`, {
        method: 'GET',
      });
      
      const result = await response.json();
      
      if (result.authUrl) {
        // In real implementation, redirect to OAuth provider
        window.location.href = result.authUrl;
      } else {
        setError('OAuth initialization failed');
      }
    } catch (err) {
      setError('OAuth error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const provider = urlParams.get('provider');
      
      if (code && provider) {
        try {
          setLoading(true);
          
          // This would send code to Passport.js callback handler
          const response = await fetch(`/api/auth/${provider}/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, state }),
          });
          
          const result = await response.json();
          
          if (result.success) {
            setUser(result.user);
            localStorage.setItem('token', result.token);
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            setError('Authentication failed');
          }
        } catch (err) {
          setError('Callback error: ' + err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    
    handleOAuthCallback();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Passport.js OAuth Authentication</h3>
      
      {user ? (
        <div style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
          <h4>Welcome, {user.name}!</h4>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Provider:</strong> {user.provider}</p>
          <p><strong>ID:</strong> {user.id}</p>
          <button onClick={() => setUser(null)} style={{ padding: '10px 20px' }}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '30px' }}>
            <h4>Choose OAuth Provider</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {oauthProviders.map(provider => (
                <button
                  key={provider.name}
                  onClick={() => initiateOAuth(provider.name)}
                  disabled={loading}
                  style={{
                    padding: '15px',
                    border: '2px solid ' + provider.color,
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{provider.icon}</span>
                  <span>Login with {provider.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {error && (
            <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee' }}>
              {error}
            </div>
          )}
          
          {loading && (
            <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
              <p>Connecting to OAuth provider...</p>
            </div>
          )}
          
          <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
            <p><strong>Passport.js OAuth Features:</strong></p>
            <ul style={{ textAlign: 'left' }}>
              <li>Multiple strategy support (Google, GitHub, Facebook, etc.)</li>
              <li>OAuth 1.0/2.0 flow handling</li>
              <li>Callback URL management</li>
              <li>Token exchange and refresh</li>
              <li>Profile information retrieval</li>
              <li>Scope management</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 3: PROTECTED ROUTES =====
/**
 * Protected routes demonstrating Passport.js route protection
 * Shows how to access protected resources with authentication
 */

function ProtectedRoutes() {
  const [user, setUser] = useState(null);
  const [protectedData, setProtectedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // This would validate token with Passport.js
          const response = await fetch('/api/auth/verify', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          const result = await response.json();
          if (result.valid) {
            setUser(result.user);
          } else {
            setUser(null);
            localStorage.removeItem('token');
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
      }
    };
    
    checkAuth();
  }, []);

  // Access protected resource
  const accessProtectedResource = async (resource) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }
      
      // This would access a Passport.js protected route
      const response = await fetch(`/api/protected/${resource}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      setProtectedData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Passport.js Protected Routes</h3>
      
      {user ? (
        <div>
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
            <h4>Authenticated User</h4>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h4>Access Protected Resources</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <button 
                onClick={() => accessProtectedResource('profile')}
                disabled={loading}
                style={{ padding: '10px' }}
              >
                Get Profile
              </button>
              <button 
                onClick={() => accessProtectedResource('admin')}
                disabled={loading}
                style={{ padding: '10px' }}
              >
                Admin Panel
              </button>
              <button 
                onClick={() => accessProtectedResource('settings')}
                disabled={loading}
                style={{ padding: '10px' }}
              >
                User Settings
              </button>
            </div>
          </div>
          
          {protectedData && (
            <div style={{ 
              marginTop: '20px', 
              padding: '20px', 
              border: '2px solid #007bff', 
              borderRadius: '8px',
              textAlign: 'left',
              backgroundColor: '#f8f9fa'
            }}>
              <h4>Protected Resource Data</h4>
              <pre style={{ 
                backgroundColor: '#f1f3f4', 
                padding: '15px', 
                borderRadius: '5px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {JSON.stringify(protectedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
          <h4>Access Denied</h4>
          <p>Please log in to access protected resources.</p>
          <p>This route is protected by Passport.js authentication middleware.</p>
        </div>
      )}
      
      {error && (
        <div style={{ color: 'red', marginTop: '20px', padding: '10px', backgroundColor: '#ffebee' }}>
          Error: {error}
        </div>
      )}
      
      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <p><strong>Passport.js Route Protection:</strong></p>
        <ul style={{ textAlign: 'left' }}>
          <li>Middleware-based route protection</li>
          <li>Role-based access control</li>
          <li>Custom authentication strategies</li>
          <li>Session management</li>
          <li>Token validation</li>
          <li>Route-level permissions</li>
        </ul>
      </div>
    </div>
  );
}

// ===== EXAMPLE 4: MULTI-STRATEGY AUTHENTICATION =====
/**
 * Multi-strategy authentication demonstrating multiple Passport.js strategies
 * Shows how to handle different authentication methods
 */

function MultiStrategyAuthentication() {
  const [user, setUser] = useState(null);
  const [activeStrategy, setActiveStrategy] = useState('local');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Authentication strategies
  const strategies = [
    { id: 'local', name: 'Local Login', icon: '👤', description: 'Username and password' },
    { id: 'google', name: 'Google OAuth', icon: '🔍', description: 'Google account authentication' },
    { id: 'github', name: 'GitHub OAuth', icon: '🐙', description: 'GitHub account authentication' },
    { id: 'jwt', name: 'JWT Token', icon: '🔑', description: 'JSON Web Token authentication' },
  ];

  // Handle authentication with different strategies
  const authenticate = async (strategy, credentials = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      let endpoint;
      let headers = {};
      
      switch (strategy) {
        case 'local':
          endpoint = '/api/auth/local';
          headers['Content-Type'] = 'application/json';
          break;
        case 'google':
          endpoint = '/api/auth/google';
          break;
        case 'github':
          endpoint = '/api/auth/github';
          break;
        case 'jwt':
          endpoint = '/api/auth/jwt';
          headers['Authorization'] = `Bearer ${credentials.token}`;
          break;
        default:
          throw new Error('Unknown strategy');
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: Object.keys(credentials).length > 0 ? JSON.stringify(credentials) : undefined,
        credentials: strategy === 'local' ? 'include' : 'omit',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('token', result.token);
        localStorage.setItem('strategy', strategy);
      } else {
        setError(result.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Authentication error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Multi-Strategy Authentication</h3>
      
      {user ? (
        <div style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
          <h4>Welcome, {user.name}!</h4>
          <p><strong>Strategy:</strong> {localStorage.getItem('strategy')}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <button onClick={() => setUser(null)} style={{ padding: '10px 20px' }}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          {/* Strategy Selection */}
          <div style={{ marginBottom: '30px' }}>
            <h4>Select Authentication Strategy</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              {strategies.map(strategy => (
                <button
                  key={strategy.id}
                  onClick={() => setActiveStrategy(strategy.id)}
                  style={{
                    padding: '15px',
                    border: activeStrategy === strategy.id ? '2px solid #007bff' : '2px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: activeStrategy === strategy.id ? '#007bff' : 'white',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>{strategy.icon}</span>
                  <div>
                    <strong>{strategy.name}</strong>
                    <br />
                    <small>{strategy.description}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Authentication Forms */}
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            {activeStrategy === 'local' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                authenticate('local', {
                  username: formData.get('username'),
                  password: formData.get('password'),
                });
              }}>
                <h4>Local Login</h4>
                <div style={{ marginBottom: '15px' }}>
                  <input name="username" placeholder="Username" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <input name="password" type="password" placeholder="Password" required style={{ width: '100%', padding: '10px' }} />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px' }}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            )}
            
            {activeStrategy === 'jwt' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                authenticate('jwt', {
                  token: formData.get('token'),
                });
              }}>
                <h4>JWT Authentication</h4>
                <div style={{ marginBottom: '15px' }}>
                  <input name="token" placeholder="JWT Token" required style={{ width: '100%', padding: '10px' }} />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px' }}>
                  {loading ? 'Authenticating...' : 'Authenticate'}
                </button>
              </form>
            )}
            
            {['google', 'github'].includes(activeStrategy) && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <button 
                  onClick={() => authenticate(activeStrategy)}
                  disabled={loading}
                  style={{ padding: '15px 30px' }}
                >
                  Authenticate with {strategies.find(s => s.id === activeStrategy)?.name}
                </button>
                <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                  This will redirect to {strategies.find(s => s.id === activeStrategy)?.name} for authentication
                </p>
              </div>
            )}
          </div>
          
          {error && (
            <div style={{ color: 'red', marginTop: '20px', padding: '10px', backgroundColor: '#ffebee' }}>
              {error}
            </div>
          )}
        </div>
      )}
      
      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <p><strong>Passport.js Multi-Strategy Features:</strong></p>
        <ul style={{ textAlign: 'left' }}>
          <li>Multiple authentication strategies</li>
          <li>Strategy-specific configuration</li>
          <li>Unified authentication interface</li>
          <li>Custom strategy creation</li>
          <li>Session and token management</li>
          <li>Middleware integration</li>
        </ul>
      </div>
    </div>
  );
}

// ===== MAIN APP COMPONENT =====
/**
 * Main component that demonstrates all Passport.js examples
 */
function PassportExamples() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Passport.js Examples</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '30px' }}>
        <LocalAuthentication />
        <OAuthAuthentication />
        <ProtectedRoutes />
        <MultiStrategyAuthentication />
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '30px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '10px' 
      }}>
        <h3>Passport.js Benefits</h3>
        <ul>
          <li><strong>Authentication Middleware:</strong> Clean, modular authentication system</li>
          <li><strong>Strategy Pattern:</strong> Pluggable authentication strategies</li>
          <li><strong>Session Management:</strong> Built-in session support</li>
          <li><strong>OAuth Support:</strong> Extensive OAuth provider support</li>
          <li><strong>Flexibility:</strong> Custom strategy creation</li>
          <li><strong>Express Integration:</strong> Seamless Express.js integration</li>
          <li><strong>Security:</strong> Secure authentication handling</li>
          <li><strong>Serialization:</strong> User session/deserialization</li>
          <li><strong>Ecosystem:</strong> Rich ecosystem of strategies</li>
        </ul>
        
        <h4>Key Concepts Demonstrated:</h4>
        <ul>
          <li><strong>Local Strategy:</strong> Username/password authentication</li>
          <li><strong>OAuth Strategies:</strong> Third-party authentication</li>
          <li><strong>Protected Routes:</strong> Authentication middleware</li>
          <li><strong>Multi-Strategy:</strong> Multiple auth methods</li>
          <li><strong>Session Management:</strong> User session handling</li>
          <li><strong>Token Authentication:</strong> JWT and token validation</li>
          <li><strong>Custom Strategies:</strong> Extensible authentication system</li>
        </ul>
        
        <h4>Installation:</h4>
        <pre style={{ backgroundColor: '#f1f3f4', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
{`npm install passport passport-local
# or
yarn add passport passport-local`}
        </pre>
      </div>
    </div>
  );
}

export default PassportExamples;