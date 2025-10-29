# Middleware in Next.js

This example demonstrates how to use middleware in Next.js applications for authentication, redirects, logging, and other request processing tasks.

## Learning Objectives

After completing this example, you'll understand:

- How to create and configure middleware in Next.js
- How to implement authentication with middleware
- How to handle redirects and rewrites
- How to add custom headers to responses
- How to implement rate limiting
- How to log requests and responses
- Best practices for middleware usage

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Middleware Basics

Middleware in Next.js allows you to run code before a request is completed. Based on the incoming request, you can rewrite, redirect, add headers, or stream a response.

### 1. Basic Middleware Structure

Create a middleware file at the root of your project or in the `src/` directory:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Your middleware logic here
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
}
```

### 2. Authentication Middleware

Protecting routes that require authentication:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin, /dashboard)
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/signup', '/forgot-password']
  
  // Check if the path is public
  const isPublicPath = publicPaths.includes(path)

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value || ''

  // Redirect logic
  if (isPublicPath && token) {
    // If user is logged in and trying to access public paths,
    // redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and trying to access protected paths,
    // redirect to login
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // Continue to the requested route if no redirects are needed
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
```

### 3. Role-Based Access Control

Implementing role-based access control with middleware:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// Function to verify JWT token
function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded
  } catch (error) {
    return null
  }
}

// Function to check if user has required role
function hasRole(userRole: string, requiredRoles: string[]) {
  return requiredRoles.includes(userRole)
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Define role-based routes
  const adminRoutes = ['/admin', '/admin/:path*']
  const moderatorRoutes = ['/moderator', '/moderator/:path*']
  const userRoutes = ['/dashboard', '/profile', '/settings']
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value || ''
  
  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }
  
  // Verify token and get user info
  const user = verifyToken(token)
  
  if (!user) {
    // Token is invalid, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.nextUrl))
    response.cookies.delete('token')
    return response
  }
  
  // Check admin routes
  if (path.startsWith('/admin') && !hasRole(user.role, ['admin'])) {
    return NextResponse.redirect(new URL('/unauthorized', request.nextUrl))
  }
  
  // Check moderator routes
  if (path.startsWith('/moderator') && !hasRole(user.role, ['admin', 'moderator'])) {
    return NextResponse.redirect(new URL('/unauthorized', request.nextUrl))
  }
  
  // Add user info to headers for use in API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', user.id)
  requestHeaders.set('x-user-role', user.role)
  
  // Continue to the requested route with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/moderator/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
  ],
}
```

### 4. Geographic and Language Redirects

Redirecting users based on their location or language preferences:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of supported locales
const locales = ['en', 'fr', 'de', 'es', 'ja']
const defaultLocale = 'en'

// Function to get the preferred locale from the request
function getLocale(request: NextRequest): string {
  // Check for locale in cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
  if (localeCookie && locales.includes(localeCookie)) {
    return localeCookie
  }
  
  // Check for locale in pathname
  const pathnameLocale = request.nextUrl.pathname.split('/')[1]
  if (pathnameLocale && locales.includes(pathnameLocale)) {
    return pathnameLocale
  }
  
  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferredLocales = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().split('-')[0])
    
    for (const locale of preferredLocales) {
      if (locales.includes(locale)) {
        return locale
      }
    }
  }
  
  // Return default locale
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
  
  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    
    // Create new URL with locale
    const newUrl = new URL(
      `/${locale}${pathname}`,
      request.url
    )
    
    // Add locale to cookie for future requests
    const response = NextResponse.redirect(newUrl)
    response.cookies.set('NEXT_LOCALE', locale)
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files
    '/((?!_next|images|favicon.ico).*)',
  ],
}
```

### 5. Rate Limiting Middleware

Implementing rate limiting to prevent abuse:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory store for rate limiting
// In production, you would use Redis or another distributed store
const rateLimitStore = new Map()

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100 // 100 requests per minute

function getClientIdentifier(request: NextRequest): string {
  // Try to get a unique identifier for the client
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
  return ip
}

function isRateLimited(identifier: string): boolean {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW
  
  // Get existing requests for this client
  let requests = rateLimitStore.get(identifier) || []
  
  // Filter out old requests outside the window
  requests = requests.filter((timestamp: number) => timestamp > windowStart)
  
  // Check if the client has exceeded the limit
  if (requests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }
  
  // Add the current request timestamp
  requests.push(now)
  
  // Update the store
  rateLimitStore.set(identifier, requests)
  
  return false
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Apply rate limiting to API routes
  if (path.startsWith('/api/')) {
    const clientIdentifier = getClientIdentifier(request)
    
    if (isRateLimited(clientIdentifier)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      )
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}
```

### 6. Logging and Analytics Middleware

Logging requests for analytics and debugging:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Function to log requests
async function logRequest(request: NextRequest, response: NextResponse) {
  const timestamp = new Date().toISOString()
  const method = request.method
  const url = request.url
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown'
  const referer = request.headers.get('referer') || 'direct'
  const statusCode = response.status
  
  // Create log entry
  const logEntry = {
    timestamp,
    method,
    url,
    userAgent,
    ip,
    referer,
    statusCode,
  }
  
  // Log to console (in production, you'd log to a file or service)
  console.log(JSON.stringify(logEntry))
  
  // In a real application, you might send this to an analytics service
  // await sendToAnalytics(logEntry)
}

export function middleware(request: NextRequest) {
  // Create a response
  const response = NextResponse.next()
  
  // Add custom headers
  response.headers.set('x-custom-header', 'middleware-value')
  
  // Log the request asynchronously (don't block the response)
  logRequest(request, response).catch(error => {
    console.error('Failed to log request:', error)
  })
  
  return response
}

export const config = {
  matcher: [
    // Match all paths except for static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### 7. A/B Testing Middleware

Implementing A/B testing by redirecting users to different versions:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// A/B test configuration
const abTests = {
  homepage: {
    enabled: true,
    variants: ['control', 'variant-a', 'variant-b'],
    trafficSplit: [50, 25, 25], // Percentage for each variant
  },
  pricing: {
    enabled: true,
    variants: ['control', 'variant-a'],
    trafficSplit: [70, 30],
  },
}

// Function to get or create a user ID for A/B testing
function getUserId(request: NextRequest): string {
  // Check if user ID exists in cookie
  const userIdCookie = request.cookies.get('ab_test_user_id')?.value
  
  if (userIdCookie) {
    return userIdCookie
  }
  
  // Generate a new user ID
  const userId = Math.random().toString(36).substring(2, 15)
  return userId
}

// Function to assign a variant based on traffic split
function assignVariant(userId: string, trafficSplit: number[]): number {
  // Use a hash of the user ID to ensure consistent assignment
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = hash % 100
  
  let cumulative = 0
  for (let i = 0; i < trafficSplit.length; i++) {
    cumulative += trafficSplit[i]
    if (random < cumulative) {
      return i
    }
  }
  
  return 0 // Default to first variant
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Check if this path has an A/B test
  let testName: string | null = null
  
  if (path === '/' || path === '/index') {
    testName = 'homepage'
  } else if (path === '/pricing') {
    testName = 'pricing'
  }
  
  if (testName && abTests[testName as keyof typeof abTests]?.enabled) {
    const test = abTests[testName as keyof typeof abTests]
    const userId = getUserId(request)
    const variantIndex = assignVariant(userId, test.trafficSplit)
    const variant = test.variants[variantIndex]
    
    // Create a new URL with the variant
    const newUrl = new URL(`/${testName}/${variant}`, request.url)
    
    // Create response and set cookies
    const response = NextResponse.rewrite(newUrl)
    response.cookies.set('ab_test_user_id', userId, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: 'lax',
    })
    response.cookies.set(`ab_test_${testName}`, variant, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: 'lax',
    })
    
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/index',
    '/pricing',
  ],
}
```

### 8. Maintenance Mode Middleware

Redirecting users to a maintenance page:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Check if maintenance mode is enabled
// In a real app, this might come from an environment variable or database
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true'

// Paths that should still be accessible during maintenance
const ALLOWED_PATHS = [
  '/admin',
  '/api/health',
  '/api/maintenance/status',
]

export function middleware(request: NextRequest) {
  // If maintenance mode is not enabled, continue normally
  if (!MAINTENANCE_MODE) {
    return NextResponse.next()
  }
  
  const path = request.nextUrl.pathname
  
  // Check if the path is allowed during maintenance
  const isAllowedPath = ALLOWED_PATHS.some(allowedPath => 
    path.startsWith(allowedPath)
  )
  
  // If path is allowed, continue normally
  if (isAllowedPath) {
    return NextResponse.next()
  }
  
  // Redirect to maintenance page
  const maintenanceUrl = new URL('/maintenance', request.url)
  return NextResponse.redirect(maintenanceUrl)
}

export const config = {
  matcher: [
    // Match all paths except for static files
    '/((?!_next/static|_next/image|favicon.ico|maintenance).*)',
  ],
}
```

## Best Practices for Middleware

1. **Keep middleware lightweight**
   - Avoid heavy computations
   - Don't access databases directly
   - Use efficient algorithms

2. **Use appropriate matchers**
   - Only run middleware on necessary paths
   - Exclude static files and API routes when not needed
   - Use specific path patterns

3. **Handle errors gracefully**
   - Always provide a fallback response
   - Don't let middleware errors crash your app

4. **Be careful with cookies**
   - Set appropriate security flags
   - Consider size limits
   - Handle cookie parsing errors

5. **Test thoroughly**
   - Test with different user agents
   - Test with various request methods
   - Test edge cases like missing headers

## Next Steps

- Explore advanced middleware patterns
- Implement custom middleware for specific use cases
- Learn about edge middleware with Vercel
- Integrate with third-party services through middleware
- Implement feature flags with middleware