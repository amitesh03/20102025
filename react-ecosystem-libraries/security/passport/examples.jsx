// Passport.js Authentication Examples

// 1. Basic Passport Setup
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Configure local strategy
passport.use(new LocalStrategy(
  (username, password, done) => {
    // Verify username and password
    User.findOne({ username: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

// 2. JWT Strategy
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your-secret-key'
};

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  User.findById(jwt_payload.id, (err, user) => {
    if (err) { return done(err, false); }
    if (user) { return done(null, user); }
    return done(null, false);
  });
}));

// 3. OAuth Strategy (Google)
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  // Find or create user in database
  User.findOrCreate({ googleId: profile.id }, (err, user) => {
    return done(err, user);
  });
}));

// 4. React Component with Passport Authentication
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthComponent = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    axios.get('/api/auth/current-user')
      .then(response => {
        setUser(response.data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const handleLogin = (credentials) => {
    axios.post('/api/auth/login', credentials)
      .then(response => {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // Store token
        localStorage.setItem('token', response.data.token);
      })
      .catch(error => {
        console.error('Login failed:', error);
      });
  };

  const handleLogout = () => {
    axios.post('/api/auth/logout')
      .then(() => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
  };

  if (isAuthenticated) {
    return (
      <div>
        <h2>Welcome, {user.name}!</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Login</h2>
      <LoginForm onLogin={handleLogin} />
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

export default AuthComponent;