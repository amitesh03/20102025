# Next.js Authentication Example

This example demonstrates how to implement authentication in Next.js 14 using NextAuth.js with the App Router.

## Learning Objectives

After completing this example, you'll understand:

- How to set up NextAuth.js in a Next.js application
- How to implement credential-based authentication
- How to protect routes and pages
- How to manage user sessions
- How to create custom sign-in pages
- How to handle authentication state in client components

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then update `.env.local` with your own secret:
   ```
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

For this example, you can use the following credentials to sign in:

- **Email:** user@example.com
- **Password:** password

## Key Features

### Authentication Flow

1. **Sign In**: Users can sign in using the custom sign-in page with email and password
2. **Session Management**: NextAuth.js manages session tokens and cookies
3. **Protected Routes**: The `/protected` page is only accessible to authenticated users
4. **Sign Out**: Users can sign out and end their session

### File Structure

```
app/
├── api/auth/[...nextauth]/route.ts  # NextAuth.js configuration
├── auth/signin/page.tsx             # Custom sign-in page
├── protected/page.tsx               # Protected page example
├── layout.tsx                       # Root layout with SessionProvider
└── page.tsx                         # Home page with auth status
```

## Key Concepts

### NextAuth.js Configuration

The NextAuth.js configuration is in `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth'

const handler = NextAuth({
  providers: [
    {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Validate credentials against database or external service
        if (credentials?.email === 'user@example.com' && credentials?.password === 'password') {
          return {
            id: '1',
            name: 'Demo User',
            email: 'user@example.com',
          }
        }
        return null
      }
    }
  ],
  // ... other configuration
})
```

### Session Provider

The `SessionProvider` is added to the root layout to make the session available throughout the app:

```typescript
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

### Using Authentication in Components

You can use the `useSession` hook to access the authentication state:

```typescript
'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function MyComponent() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <div>
      <p>Not signed in</p>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  )
}
```

### Protecting Routes

To protect routes, you can check the authentication status and redirect if necessary:

```typescript
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading
    
    if (!session) {
      // Redirect to home page if not authenticated
      router.push('/')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (!session) {
    return null // Will redirect
  }

  return <div>Protected content</div>
}
```

## Next Steps

- Add more authentication providers (Google, GitHub, etc.)
- Implement user registration
- Connect to a real database for user management
- Add role-based access control
- Implement email verification for new accounts
- Add password reset functionality
- Explore session callbacks for custom token handling