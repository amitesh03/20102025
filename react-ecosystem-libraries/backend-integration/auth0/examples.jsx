import React, { useState, useEffect } from 'react';

// Note: These examples demonstrate Auth0 React concepts in a web-compatible format
// In a real app, you would install @auth0/auth0-react and use its actual hooks

// Example 1: Basic Authentication Setup
function BasicAuthExample() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Simulate useAuth0 hook
  const mockUseAuth0 = () => {
    const loginWithRedirect = () => {
      setLoading(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        setUser({
          name: 'John Doe',
          email: 'john.doe@example.com',
          nickname: 'johnny'
        });
        setLoading(false);
      }, 1000);
    };
    
    const logout = () => {
      setLoading(true);
      setTimeout(() => {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }, 500);
    };
    
    return {
      isAuthenticated,
      user,
      isLoading: loading,
      loginWithRedirect,
      logout
    };
  };
  
  const { isAuthenticated: auth, user: authUser, isLoading, loginWithRedirect, logout } = mockUseAuth0();
  
  return (
    <div className="auth0-example">
      <h2>Basic Authentication Setup</h2>
      <p>Demonstrates basic Auth0 authentication flow.</p>
      
      <div className="auth-demo">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : auth ? (
          <div className="authenticated">
            <h3>Welcome, {authUser?.name}!</h3>
            <p>Email: {authUser?.email}</p>
            <p>Nickname: {authUser?.nickname}</p>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <div className="unauthenticated">
            <p>Please log in to continue</p>
            <button onClick={loginWithRedirect}>Login with Auth0</button>
          </div>
        )}
      </div>
      
      <pre>{`
// Auth0 React Basic Setup:
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function AuthComponent() {
  const { 
    isAuthenticated, 
    user, 
    isLoading, 
    loginWithRedirect, 
    logout 
  } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <h3>Welcome, {user.name}!</h3>
        <p>Email: {user.email}</p>
        <button onClick={() => logout()}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>Please log in to continue</p>
      <button onClick={() => loginWithRedirect()}>
        Login with Auth0
      </button>
    </div>
  );
}

export default AuthComponent;
      `}</pre>
    </div>
  );
}

// Example 2: Protected Routes
function ProtectedRouteExample() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  // Simulate withAuthenticationRequired HOC
  const mockWithAuthenticationRequired = (Component) => {
    return () => {
      if (!isAuthenticated) {
        return (
          <div className="protected-route">
            <h3>Authentication Required</h3>
            <p>Please log in to access this content.</p>
            <button onClick={() => {
              setTimeout(() => {
                setIsAuthenticated(true);
                setUser({ name: 'John Doe' });
              }, 1000);
            }}>
              Login
            </button>
          </div>
        );
      }
      return <Component />;
    };
  };
  
  const ProtectedContent = () => (
    <div className="protected-content">
      <h3>Protected Content</h3>
      <p>This content is only visible to authenticated users.</p>
      <p>Welcome, {user?.name}!</p>
    </div>
  );
  
  const ProtectedComponent = mockWithAuthenticationRequired(ProtectedContent);
  
  return (
    <div className="auth0-example">
      <h2>Protected Routes</h2>
      <p>Demonstrates route protection with Auth0.</p>
      
      <div className="route-demo">
        <button onClick={() => setIsAuthenticated(!isAuthenticated)}>
          Toggle Authentication
        </button>
        
        <ProtectedComponent />
      </div>
      
      <pre>{`
// Auth0 React Protected Routes:
import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

const ProtectedComponent = () => {
  return (
    <div>
      <h3>Protected Content</h3>
      <p>This content is only visible to authenticated users.</p>
    </div>
  );
};

// Wrap component with authentication requirement
export default withAuthenticationRequired(ProtectedComponent, {
  // Show a message while user waits to be redirected to login page
  onRedirecting: () => <div>Redirecting you to login page...</div>,
});
      `}</pre>
    </div>
  );
}

// Example 3: Access Token Management
function AccessTokenExample() {
  const [token, setToken] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  // Simulate getAccessTokenSilently
  const mockGetAccessTokenSilently = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
    setToken(mockToken);
    
    // Simulate API call with token
    const mockPosts = [
      { id: 1, title: 'Post 1', content: 'Content of post 1' },
      { id: 2, title: 'Post 2', content: 'Content of post 2' }
    ];
    setPosts(mockPosts);
    setLoading(false);
    
    return mockToken;
  };
  
  const fetchProtectedData = async () => {
    if (!isAuthenticated) {
      alert('Please login first');
      return;
    }
    
    try {
      await mockGetAccessTokenSilently();
    } catch (error) {
      console.error('Error fetching token:', error);
      alert('Failed to fetch protected data');
    }
  };
  
  return (
    <div className="auth0-example">
      <h2>Access Token Management</h2>
      <p>Demonstrates token retrieval and API calls.</p>
      
      <div className="token-demo">
        <button onClick={fetchProtectedData} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Protected Data'}
        </button>
        
        {token && (
          <div className="token-display">
            <h4>Access Token:</h4>
            <code>{token.substring(0, 50)}...</code>
          </div>
        )}
        
        {posts.length > 0 && (
          <div className="protected-data">
            <h4>Protected Posts:</h4>
            {posts.map(post => (
              <div key={post.id} className="post-item">
                <h5>{post.title}</h5>
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <pre>{`
// Auth0 React Access Token Management:
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function ProtectedApiExample() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: 'https://api.example.com/',
            scope: 'read:posts',
          },
        });
        
        const response = await fetch('https://api.example.com/posts', {
          headers: {
            Authorization: \`Bearer \${token}\`,
          },
        });
        
        const data = await response.json();
        setPosts(data);
      } catch (e) {
        setError(e.message);
      }
    };

    if (isAuthenticated) {
      fetchPosts();
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!posts) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Protected Posts</h3>
      {posts.map(post => (
        <div key={post.id}>
          <h4>{post.title}</h4>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default ProtectedApiExample;
      `}</pre>
    </div>
  );
}

// Example 4: User Profile and Claims
function UserProfileExample() {
  const [user, setUser] = useState(null);
  const [claims, setClaims] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Simulate getIdTokenClaims
  const mockGetIdTokenClaims = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      nickname: 'johnny',
      picture: 'https://example.com/avatar.jpg'
    };
    
    const mockClaims = {
      'https://example.com/claims': {
        role: 'admin',
        permissions: ['read:posts', 'write:posts']
      },
      'https://example.com/subscription': 'premium',
      iss: 'https://your-tenant.auth0.com/',
      sub: 'auth0|1234567890'
    };
    
    setUser(mockUser);
    setClaims(mockClaims);
    setLoading(false);
  };
  
  return (
    <div className="auth0-example">
      <h2>User Profile and Claims</h2>
      <p>Demonstrates accessing user profile and ID token claims.</p>
      
      <div className="profile-demo">
        <button onClick={mockGetIdTokenClaims} disabled={loading}>
          {loading ? 'Loading...' : 'Load Profile & Claims'}
        </button>
        
        {user && (
          <div className="user-profile">
            <h3>User Profile</h3>
            <div className="profile-info">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Nickname:</strong> {user.nickname}</p>
              {user.picture && (
                <div>
                  <strong>Avatar:</strong>
                  <img src={user.picture} alt="Profile" width="50" />
                </div>
              )}
            </div>
          </div>
        )}
        
        {claims && (
          <div className="token-claims">
            <h3>ID Token Claims</h3>
            <pre>{JSON.stringify(claims, null, 2)}</pre>
            
            <div className="custom-claims">
              <h4>Custom Claims:</h4>
              <p><strong>Role:</strong> {claims['https://example.com/claims']?.role}</p>
              <p><strong>Subscription:</strong> {claims['https://example.com/subscription']}</p>
              <p><strong>Permissions:</strong> {claims['https://example.com/claims']?.permissions?.join(', ')}</p>
            </div>
          </div>
        )}
      </div>
      
      <pre>{`
// Auth0 React User Profile and Claims:
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function UserProfile() {
  const { user, getIdTokenClaims } = useAuth0();
  const [claims, setClaims] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const idTokenClaims = await getIdTokenClaims();
        setClaims(idTokenClaims);
      } catch (error) {
        console.error('Error fetching claims:', error);
      }
    };

    if (user) {
      fetchClaims();
    }
  }, [user, getIdTokenClaims]);

  if (!user) {
    return <div>Please log in to view profile</div>;
  }

  return (
    <div>
      <h3>User Profile</h3>
      <div>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Nickname:</strong> {user.nickname}</p>
        {user.picture && (
          <div>
            <strong>Avatar:</strong>
            <img src={user.picture} alt="Profile" width="50" />
          </div>
        )}
      </div>
      
      {claims && (
        <div>
          <h3>ID Token Claims</h3>
          <pre>{JSON.stringify(claims, null, 2)}</pre>
          
          <h4>Custom Claims:</h4>
          <p><strong>Role:</strong> {claims['https://example.com/claims']?.role}</p>
          <p><strong>Subscription:</strong> {claims['https://example.com/subscription']}</p>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
      `}</pre>
    </div>
  );
}

// Example 5: Organization Authentication
function OrganizationExample() {
  const [organization, setOrganization] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Simulate organization login
  const mockLoginWithOrganization = (orgId) => {
    setLoading(true);
    setTimeout(() => {
      setOrganization(orgId);
      setUser({
        name: 'John Doe',
        email: 'john.doe@example.com',
        organization: orgId
      });
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="auth0-example">
      <h2>Organization Authentication</h2>
      <p>Demonstrates organization-based authentication.</p>
      
      <div className="org-demo">
        <div className="org-selector">
          <h3>Select Organization:</h3>
          <button onClick={() => mockLoginWithOrganization('org_123')}>
            Login to Organization A
          </button>
          <button onClick={() => mockLoginWithOrganization('org_456')}>
            Login to Organization B
          </button>
        </div>
        
        {loading && <div className="loading">Logging in...</div>}
        
        {user && (
          <div className="org-user">
            <h3>Welcome to {organization}!</h3>
            <p>User: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Organization: {user.organization}</p>
          </div>
        )}
      </div>
      
      <pre>{`
// Auth0 React Organization Authentication:
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function OrganizationLogin() {
  const { loginWithRedirect, user } = useAuth0();

  const loginToOrganization = (orgId) => {
    loginWithRedirect({
      authorizationParams: {
        organization: orgId,
      },
    });
  };

  // Handle organization invitations
  useEffect(() => {
    const url = window.location.href;
    const inviteMatches = url.match(/invitation=([^&]+)/);
    const orgMatches = url.match(/organization=([^&]+)/);
    
    if (inviteMatches && orgMatches) {
      loginWithRedirect({
        authorizationParams: {
          organization: orgMatches[1],
          invitation: inviteMatches[1],
        },
      });
    }
  }, [loginWithRedirect]);

  return (
    <div>
      <h3>Login to Organization</h3>
      <button onClick={() => loginToOrganization('org_123')}>
        Login to Organization A
      </button>
      <button onClick={() => loginToOrganization('org_456')}>
        Login to Organization B
      </button>
      
      {user && (
        <div>
          <h3>Welcome to {user.organization}!</h3>
          <p>User: {user.name}</p>
        </div>
      )}
    </div>
  );
}

export default OrganizationLogin;
      `}</pre>
    </div>
  );
}

// Main component that combines all examples
export default function Auth0Examples() {
  const [activeExample, setActiveExample] = useState(0);
  
  const examples = [
    { component: BasicAuthExample, title: "Basic Authentication" },
    { component: ProtectedRouteExample, title: "Protected Routes" },
    { component: AccessTokenExample, title: "Access Token Management" },
    { component: UserProfileExample, title: "User Profile & Claims" },
    { component: OrganizationExample, title: "Organization Authentication" }
  ];
  
  const ActiveExampleComponent = examples[activeExample].component;
  
  return (
    <div className="auth0-examples">
      <h1>Auth0 React Examples</h1>
      <p>Comprehensive examples demonstrating Auth0 React SDK features and patterns.</p>
      
      <div className="example-navigation">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => setActiveExample(index)}
            className={activeExample === index ? 'active' : ''}
          >
            {example.title}
          </button>
        ))}
      </div>
      
      <div className="example-content">
        <ActiveExampleComponent />
      </div>
      
      <div className="info-section">
        <h2>About Auth0 React</h2>
        <p>
          Auth0 React SDK provides a seamless way to integrate authentication and authorization into your React single-page applications. 
          It handles the complexity of OAuth 2.0 and OpenID Connect, allowing you to focus on your application's core functionality.
        </p>
        
        <h3>Key Features:</h3>
        <ul>
          <li><strong>Easy Integration</strong>: Simple hooks and components for authentication</li>
          <li><strong>Protected Routes</strong>: HOCs for protecting components and routes</li>
          <li><strong>Token Management</strong>: Automatic token refresh and silent authentication</li>
          <li><strong>User Profile</strong>: Access to user information and ID token claims</li>
          <li><strong>Organization Support</strong>: Multi-tenant authentication with organizations</li>
          <li><strong>Security Best Practices</strong>: Built-in security features and CSRF protection</li>
        </ul>
        
        <h3>Installation:</h3>
        <pre>{`npm install @auth0/auth0-react`}</pre>
        
        <h3>Basic Usage:</h3>
        <pre>{`import React from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

function App() {
  return (
    <Auth0Provider
      domain="YOUR_AUTH0_DOMAIN"
      clientId="YOUR_AUTH0_CLIENT_ID"
      redirectUri={window.location.origin}
    >
      <MyComponent />
    </Auth0Provider>
  );
}

function MyComponent() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  if (isAuthenticated) {
    return (
      <div>
        <h3>Hello, {user.name}!</h3>
        <button onClick={() => logout()}>Logout</button>
      </div>
    );
  }

  return (
    <button onClick={() => loginWithRedirect()}>
      Login
    </button>
  );
}`}</pre>
      </div>
    </div>
  );
}