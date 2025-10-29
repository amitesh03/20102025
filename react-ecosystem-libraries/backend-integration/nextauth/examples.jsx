import React, { useState } from 'react';
import { CodeBlock, InteractiveDemo, NavigationTabs } from '../../components';

const NextAuthExamples = () => {
  const [activeTab, setActiveTab] = useState('setup');

  const tabs = [
    { id: 'setup', label: 'Setup' },
    { id: 'providers', label: 'Providers' },
    { id: 'configuration', label: 'Configuration' },
    { id: 'callbacks', label: 'Callbacks' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'protection', label: 'Route Protection' },
    { id: 'customization', label: 'Customization' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'setup':
        return (
          <div>
            <h3>NextAuth.js Setup</h3>
            <p>NextAuth.js is a complete open-source authentication solution for Next.js applications:</p>
            
            <CodeBlock
              title="Install NextAuth.js"
              language="bash"
              code={`# Install NextAuth.js
npm install next-auth

# Install adapter for your database
npm install @next-auth/prisma-adapter  # For Prisma
npm install @next-auth/mongodb-adapter  # For MongoDB
npm install @auth0/next-auth0-adapter  # For Auth0`}
            />
            
            <CodeBlock
              title="Basic NextAuth.js Configuration"
              language="typescript"
              code={`// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth'
import { authOptions } from '../../../lib/auth'

export default NextAuth(authOptions)

// lib/auth.ts
import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    // Add providers here
  ],
  callbacks: {
    // Add callbacks here
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
}`}
            />
            
            <CodeBlock
              title="Environment Variables"
              language="bash"
              code={`# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# For OAuth providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# For database adapters
DATABASE_URL=your-database-url`}
            />
            
            <CodeBlock
              title="Client-side Usage"
              language="typescript"
              code={`// pages/index.tsx
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()
  const status = 'authenticated'

  return (
    <main>
      {status === 'authenticated' ? (
        <div>
          <p>Signed in as {session.user?.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      ) : (
        <div>
          <p>Not signed in</p>
          <button onClick={() => signIn('google')}>Sign in with Google</button>
        </div>
      )}
    </main>
  )
}`}
            />
          </div>
        );
        
      case 'providers':
        return (
          <div>
            <h3>Authentication Providers</h3>
            <p>NextAuth.js supports many OAuth and credential providers:</p>
            
            <CodeBlock
              title="Google Provider"
              language="typescript"
              code={`import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // ... other options
}`}
            />
            
            <CodeBlock
              title="GitHub Provider"
              language="typescript"
              code={`import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
}`}
            />
            
            <CodeBlock
              title="Email Provider"
              language="typescript"
              code={`import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'

export const authOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
}`}
            />
            
            <CodeBlock
              title="Credentials Provider"
              language="typescript"
              code={`import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Add your authentication logic here
        const user = { id: 1, email: credentials.email };
        return user;
      },
    }),
  ],
}`}
            />
            
            <CodeBlock
              title="Auth0 Provider"
              language="typescript"
              code={`import NextAuth from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'

export const authOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    }),
  ],
}`}
            />
            
            <CodeBlock
              title="Multiple Providers"
              language="typescript"
              code={`import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import EmailProvider from 'next-auth/providers/email'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
}`}
            />
          </div>
        );
        
      case 'configuration':
        return (
          <div>
            <h3>Advanced Configuration</h3>
            <p>Configure NextAuth.js with advanced options:</p>
            
            <CodeBlock
              title="Database Adapter"
              language="typescript"
              code={`import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  // ... other options
}

// MongoDB adapter
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI)

export const authOptions = {
  adapter: MongoDBAdapter(client),
  // ... other options
}`}
            />
            
            <CodeBlock
              title="Custom Pages"
              language="typescript"
              code={`export const authOptions = {
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },
  // ... other options
}`}
            />
            
            <CodeBlock
              title="Session Configuration"
              language="typescript"
              code={`export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 1000, // 30 days
    updateAge: 24 * 60 * 1000, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 1000, // 30 days
    encrypt: true,
  },
}`}
            />
            
            <CodeBlock
              title="Event Configuration"
              language="typescript"
              code={`export const authOptions = {
  events: {
    signIn: ({ user, account, profile, isNewUser }) => {
      console.log('User signed in:', user);
    },
    signOut: ({ session, token }) => {
      console.log('User signed out');
    },
    createUser: async ({ user }) => {
      console.log('New user created:', user);
    },
  },
}`}
            />
          </div>
        );
        
      case 'callbacks':
        return (
          <div>
            <h3>Callbacks</h3>
            <p>Callbacks allow you to control the flow of authentication:</p>
            
            <CodeBlock
              title="JWT Callback"
              language="typescript"
              code={`export const authOptions = {
  callbacks: {
    async jwt({ token, user }) {
      // Add custom claims to JWT
      token.role = user.role;
      token.permissions = user.permissions;
      return token;
    },
    async session({ session, token }) {
      // Customize session object
      session.user = {
        id: token.sub,
        name: token.name,
        email: token.email,
        role: token.role,
        permissions: token.permissions,
      };
      return session;
    },
  },
}`}
            />
            
            <CodeBlock
              title="Redirect Callbacks"
              language="typescript"
              code={`export const authOptions = {
    callbacks: {
      async signIn({ user, account, profile }) {
        // Redirect based on user role
        if (user.role === 'admin') {
          return Promise.resolve('/admin/dashboard');
        }
        return Promise.resolve('/dashboard');
      },
      async redirect({ url, baseUrl }) {
        // Allow relative URLs
        if (url.startsWith('/')) {
          return Promise.resolve(url);
        }
        return Promise.resolve(baseUrl + url);
      },
  },
}`}
            />
            
            <CodeBlock
              title="Authorization Callback"
              language="typescript"
              code={`export const authOptions = {
  callbacks: {
    async authorized({ req, token }) {
      // Custom authorization logic
      if (token?.role === 'admin') {
        return true; // Admin can access all pages
      }
      
      // Check if user can access specific page
      if (req.nextUrl.startsWith('/admin') && token?.role !== 'admin') {
        return false;
      }
      
      // Check if email is verified
      if (req.nextUrl.startsWith('/protected') && !token?.emailVerified) {
        return false;
      }
      
      return true;
    },
  },
}`}
            />
          </div>
        );
        
      case 'sessions':
        return (
          <div>
            <h3>Session Management</h3>
            <p>Manage user sessions with NextAuth.js:</p>
            
            <CodeBlock
              title="Get Session"
              language="typescript"
              code={`import { useSession } from 'next-auth/react'

export default function Profile() {
  const { data: session, status } = useSession()
  
  if (status === 'authenticated') {
    return (
      <div>
        <h1>Welcome, {session.user?.name}</h1>
        <p>Email: {session.user?.email}</p>
        <p>Role: {session.user?.role}</p>
      </div>
    )
  }
  
  return (
    <div>
      <h1>Not authenticated</h1>
      <p>Please sign in to view your profile</p>
    </div>
  )
}`}
            />
            
            <CodeBlock
              title="Get Session with Loading State"
              language="typescript"
              code={`import { useSession } from 'next-auth/react'

export default function Profile() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return <div>Loading...</div>
  }
  
  if (status === 'authenticated') {
    return <div>Welcome, {session.user?.name}</div>
  }
  
  return <div>Not authenticated</div>
}`}
            />
            
            <CodeBlock
              title="Update Session"
              language="typescript"
              code={`import { getSession } from 'next-auth/react'
import { useState } from 'react'

export default function Profile() {
  const [session, setSession] = useState(null)
  
  const updateSession = async () => {
    const currentSession = await getSession()
    setSession(currentSession)
  }
  
  return (
    <div>
      <button onClick={updateSession}>Update Session</button>
      {session && (
        <div>
          <p>Name: {session.user?.name}</p>
          <p>Email: {session.user?.email}</p>
        </div>
      )}
    </div>
  )
}`}
            />
          </div>
        );
        
      case 'protection':
        return (
          <div>
            <h3>Route Protection</h3>
            <p>Protect routes and API endpoints with NextAuth.js:</p>
            
            <CodeBlock
              title="Server-side Protection"
              language="typescript"
              code={`// pages/api/protected.ts
import { getSession } from 'next-auth/react'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  res.status(200).json({ data: 'Protected data' })
}`}
            />
            
            <CodeBlock
              title="Middleware Protection"
              language="typescript"
              code={`// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth(async function middleware(req) {
  // req.user is now available
  console.log('Authenticated user:', req.user)
  
  // Continue to next middleware or route handler
  return NextResponse.next()
})

// pages/api/protected.ts
import { NextApiRequest, NextApiResponse } from 'next'
import middleware from '../../../middleware'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return middleware(req, res, (error) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' })
    }
    
    // User is authenticated, continue
    return res.status(200).json({ data: 'Protected data' })
  })
}`}
            />
            
            <CodeBlock
              title="Client-side Protection"
              language="typescript"
              code={`import { useSession } from 'next-auth/react'

export default function ProtectedComponent() {
  const { data: session, status } = useSession()
  
  if (status !== 'authenticated') {
    return (
      <div>
        <p>Please sign in to view this content</p>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    )
  }
  
  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {session.user?.name}</p>
      <p>This content is only visible to authenticated users</p>
    </div>
  )
}`}
            />
            
            <CodeBlock
              title="Role-based Protection"
              language="typescript"
              code={`// Higher-order component for role-based protection
import { useSession } from 'next-auth/react'

function withRole(Component, allowedRoles) {
  return function RoleProtectedComponent(props) {
    const { data: session } = useSession()
    
    if (!session || !allowedRoles.includes(session.user?.role)) {
      return (
        <div>
          <p>Access denied. Required roles: {allowedRoles.join(', ')}</p>
        </div>
      )
    }
    
    return <Component {...props} />
  }
}

// Usage
const AdminPanel = withRole(AdminDashboard, ['admin'])
const UserPanel = withRole(UserDashboard, ['user', 'admin'])`}
            />
          </div>
        );
        
      case 'customization':
        return (
          <div>
            <h3>Customization</h3>
            <p>Customize NextAuth.js behavior and appearance:</p>
            
            <CodeBlock
              title="Custom Sign-in Page"
              language="typescript"
              code={`// pages/auth/signin.tsx
import { getProviders, signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const providers = getProviders()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      if (result.error) {
        setError(result.error)
      } else {
        // Handle successful sign in
        window.location.href = '/dashboard'
      }
    } catch (error) {
      setError('An error occurred')
    }
  }
  
  return (
    <div>
      <h1>Custom Sign In</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
      </form>
      
      {/* Provider buttons */}
      {Object.values(providers).map((provider) => (
        <button
          key={provider.id}
          onClick={() => signIn(provider.id)}
        >
          Sign in with {provider.name}
        </button>
      ))}
    </div>
  )
}`}
            />
            
            <CodeBlock
              title="Custom Error Page"
              language="typescript"
              code={`// pages/auth/error.tsx
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function Error() {
  const { data: session } = useSession()
  
  useEffect(() => {
    // Log error for debugging
    console.error('Authentication error occurred')
  }, [])
  
  return (
    <div>
      <h1>Authentication Error</h1>
      <p>There was an error with your authentication.</p>
      
      {session ? (
        <div>
          <p>Signed in as: {session.user?.email}</p>
          <a href="/dashboard">Go to Dashboard</a>
        </div>
      ) : (
        <div>
          <p>Please try signing in again.</p>
          <a href="/auth/signin">Sign In</a>
        </div>
      )}
    </div>
  )
}`}
            />
            
            <CodeBlock
              title="Custom Theme"
              language="typescript"
              code={`// pages/auth/signin.tsx
import { getProviders, signIn } from 'next-auth/react'

export default function SignIn() {
  const providers = getProviders()
  
  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Sign In
      </h1>
      
      {Object.values(providers).map((provider) => (
        <button
          key={provider.id}
          onClick={() => signIn(provider.id)}
          style={{
            display: 'block',
            width: '100%',
            padding: '0.75rem 1rem',
            margin: '0.5rem 0',
            backgroundColor: provider.style?.backgroundColor || '#ffffff',
            color: provider.style?.color || '#000000',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Sign in with {provider.name}
        </button>
      ))}
    </div>
  )
}`}
            />
          </div>
        );
        
      default:
        return <div>Select a tab to view examples</div>;
    }
  };

  return (
    <div className="examples-container">
      <h2>NextAuth.js Examples</h2>
      <p>
        NextAuth.js is a complete open-source authentication solution for Next.js applications. 
        It supports authentication with various providers including OAuth, email, and credentials, 
        with built-in session management, CSRF protection, and more.
      </p>
      
      <NavigationTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="tab-content">
        {renderContent()}
      </div>
      
      <div className="additional-resources">
        <h3>Additional Resources</h3>
        <ul>
          <li><a href="https://next-auth.js.org/" target="_blank" rel="noopener noreferrer">Official NextAuth.js Documentation</a></li>
          <li><a href="https://github.com/nextauthjs/next-auth" target="_blank" rel="noopener noreferrer">NextAuth.js GitHub Repository</a></li>
          <li><a href="https://next-auth.js.org/getting-started/introduction" target="_blank" rel="noopener noreferrer">Getting Started Guide</a></li>
        </ul>
      </div>
    </div>
  );
};

export default NextAuthExamples;