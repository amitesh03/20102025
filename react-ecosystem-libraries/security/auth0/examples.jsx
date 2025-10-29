// Auth0 Authentication Examples

// 1. Auth0 React SDK Setup
import { Auth0Provider } from '@auth0/auth0-react';

const App = () => {
  return (
    <Auth0Provider
      domain="your-auth0-domain.auth0.com"
      clientId="your-client-id"
      redirectUri={window.location.origin}
    >
      <MyApp />
    </Auth0Provider>
  );
};

// 2. Using Auth0 in React Components
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  );
};

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

// 3. Protected Route Component
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// 4. API with Auth0
import axios from 'axios';

// Create an axios instance with auth headers
const apiClient = axios.create({
  baseURL: 'https://your-api.com',
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Function to get access token
const getAccessToken = async () => {
  const { getAccessTokenSilently } = useAuth0();
  return await getAccessTokenSilently();
};

// 5. Using the API in a component
import { useState, useEffect } from 'react';

const DataComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/api/protected-data');
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Protected Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

// 6. Server-side Auth0 middleware (Node.js/Express)
const { auth } = require('express-openid-connect');
const express = require('express');

const app = express();

app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
  })
);

// Middleware to check authentication
const requiresAuth = (req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Protected route
app.get('/profile', requiresAuth, (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

export {
  LoginButton,
  LogoutButton,
  Profile,
  ProtectedRoute,
  DataComponent
};