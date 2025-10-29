// Supabase Authentication Examples

// 1. Supabase Client Setup
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'your-supabase-url';
const supabaseKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Sign Up with Email
const signUp = async (email, password) => {
  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
};

// 3. Sign In with Email
const signIn = async (email, password) => {
  try {
    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
};

// 4. Sign In with OAuth (Google, GitHub, etc.)
const signInWithOAuth = async (provider) => {
  try {
    const { user, error } = await supabase.auth.signIn({
      provider,
    });

    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error signing in with OAuth:', error.message);
    throw error;
  }
};

// 5. Sign Out
const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
};

// 6. Get Current User
const getCurrentUser = async () => {
  try {
    const { user, error } = await supabase.auth.user();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error.message);
    throw error;
  }
};

// 7. React Hook for Supabase Auth
import { useState, useEffect } from 'react';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
  };
};

// 8. React Component with Supabase Auth
import React, { useState } from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

const AuthComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const { user, loading, signUp, signIn, signInWithOAuth, signOut } = useSupabaseAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithOAuth('google');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div>
        <h2>Welcome, {user.email}!</h2>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <button onClick={handleGoogleSignIn}>Sign In with Google</button>
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
};

// 9. Protected Route Component
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSupabaseAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

// 10. Using Supabase with Row Level Security
const fetchUserData = async () => {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    throw error;
  }
};

// 11. Inserting Data with User Context
const insertUserData = async (userData) => {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .insert([
        { ...userData, user_id: supabase.auth.user().id }
      ]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting user data:', error.message);
    throw error;
  }
};

export {
  AuthComponent,
  ProtectedRoute,
  useSupabaseAuth,
  signUp,
  signIn,
  signInWithOAuth,
  signOut,
  getCurrentUser,
  fetchUserData,
  insertUserData
};