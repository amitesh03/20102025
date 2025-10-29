// NextAuth.js Authentication Examples

// 1. NextAuth.js Configuration
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from './lib/mongodb';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Add your own logic here to find the user
        const user = { id: 1, name: 'J Smith', email: 'jsmith@example.com' };
        
        if (user) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export { authOptions };

// 2. Using NextAuth in React Components
import { useSession, signIn, signOut } from 'next-auth/react';

const LoginButton = () => {
  return (
    <button onClick={() => signIn()}>
      Sign in
    </button>
  );
};

const LogoutButton = () => {
  return (
    <button onClick={() => signOut()}>
      Sign out
    </button>
  );
};

const UserProfile = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'authenticated') {
    return (
      <div>
        <p>Signed in as {session.user.email}</p>
        <p>Name: {session.user.name}</p>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div>
      <p>Not signed in</p>
      <LoginButton />
    </div>
  );
};

// 3. Custom Sign In Page
import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const CustomSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError(result.error);
    } else {
      router.push('/');
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
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
        <button type="submit">Sign In</button>
      </form>
      <button onClick={() => signIn('google')}>
        Sign in with Google
      </button>
    </div>
  );
};

// 4. Protected API Route
import { getSession } from 'next-auth/react';

export async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Process the request
  res.status(200).json({ message: 'Success', user: session.user });
}

// 5. Middleware for Protected Routes
// Middleware for protected routes would be in a separate middleware.js file
// export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};

// 6. Custom Hook for Authentication Status
import { useSession } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isGuest: status === 'unauthenticated',
  };
};

// 7. Using the Custom Hook in a Component
import { useAuth } from '../hooks/useAuth';

const ProtectedComponent = () => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please sign in to view this content.</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>This is protected content.</p>
    </div>
  );
};

export {
  LoginButton,
  LogoutButton,
  UserProfile,
  CustomSignIn,
  ProtectedComponent,
  useAuth
};