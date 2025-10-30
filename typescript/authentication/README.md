# Authentication with TypeScript

This folder contains comprehensive TypeScript examples for implementing authentication systems in modern web applications. Each example demonstrates best practices, advanced patterns, and production-ready implementations.

## 📁 Folder Structure

```
authentication/
├── README.md                    # This file - comprehensive documentation
├── jwt-examples.ts             # JWT authentication implementation
├── oauth-examples.ts            # OAuth 2.0 implementation
├── session-examples.ts         # Session management implementation
├── nextauth-examples.ts        # NextAuth.js integration
└── betterauth-examples.ts      # BetterAuth integration
```

## 🔐 Authentication Libraries Covered

### 1. JWT (JSON Web Tokens)
- **File**: `jwt-examples.ts`
- **Features**: Token creation, verification, refresh, role-based access control
- **Use Case**: Stateless authentication for APIs and microservices

### 2. OAuth 2.0
- **File**: `oauth-examples.ts`
- **Features**: Authorization Code Flow, Client Credentials, multiple providers
- **Use Case**: Third-party authentication with Google, GitHub, Facebook, etc.

### 3. Session Management
- **File**: `session-examples.ts`
- **Features**: Memory and Redis stores, session security, multi-device support
- **Use Case**: Traditional server-side session management

### 4. NextAuth.js
- **File**: `nextauth-examples.ts`
- **Features**: Complete Next.js authentication solution
- **Use Case**: Full-stack Next.js applications

### 5. BetterAuth
- **File**: `betterauth-examples.ts`
- **Features**: Modern authentication library with advanced features
- **Use Case**: Modern web applications requiring flexible authentication

## 🚀 Quick Start

### Installation

```bash
# Install core dependencies
npm install jsonwebtoken bcryptjs express

# Install OAuth dependencies
npm install passport passport-google-oauth20 passport-github2

# Install session dependencies
npm install express-session connect-redis redis

# Install NextAuth.js
npm install next-auth @next-auth/prisma-adapter

# Install BetterAuth
npm install better-auth @better-auth/prisma-adapter

# Install TypeScript types
npm install -D @types/jsonwebtoken @types/bcryptjs @types/express @types/passport
```

### Basic JWT Example

```typescript
import { JWTManager } from './jwt-examples';

const jwtManager = new JWTManager({
  secret: 'your-secret-key',
  algorithm: 'HS256',
  expiresIn: '1h',
});

// Create token
const token = await jwtManager.createToken({
  userId: 'user123',
  email: 'user@example.com',
  role: 'user',
});

// Verify token
const payload = await jwtManager.verifyToken(token);
```

### Basic OAuth Example

```typescript
import { OAuthManager } from './oauth-examples';

const oauthManager = new OAuthManager({
  providers: [
    {
      name: 'google',
      clientId: 'your-google-client-id',
      clientSecret: 'your-google-client-secret',
      scope: ['profile', 'email'],
    },
  ],
});

// Get authorization URL
const authUrl = oauthManager.getAuthorizationUrl('google', 'http://localhost:3000/callback');

// Exchange code for tokens
const tokens = await oauthManager.exchangeCodeForTokens('google', 'authorization_code');
```

## 📚 Detailed Examples

### JWT Authentication

The JWT implementation includes:

- **Token Creation**: Secure token generation with custom claims
- **Token Verification**: Robust token validation with error handling
- **Token Refresh**: Automatic token refresh mechanism
- **Role-Based Access Control**: Permission-based authorization
- **Token Blacklisting**: Secure logout and token revocation
- **Multi-Tenant Support**: Tenant isolation with JWT claims

```typescript
// Advanced JWT usage
const jwtManager = new JWTManager({
  secret: process.env.JWT_SECRET!,
  algorithm: 'HS256',
  expiresIn: '1h',
  issuer: 'your-app',
  audience: 'your-users',
});

// Create token with custom claims
const token = await jwtManager.createToken({
  userId: 'user123',
  email: 'user@example.com',
  role: 'admin',
  permissions: ['read', 'write', 'delete'],
  tenantId: 'tenant123',
});

// Verify token with custom validation
const payload = await jwtManager.verifyToken(token, {
  issuer: 'your-app',
  audience: 'your-users',
});
```

### OAuth 2.0 Implementation

The OAuth implementation includes:

- **Multiple Providers**: Google, GitHub, Facebook, and more
- **Authorization Code Flow**: Secure authorization with PKCE
- **Client Credentials Flow**: Service-to-service authentication
- **Token Management**: Automatic token refresh and storage
- **State Management**: CSRF protection with state parameters
- **User Information**: Profile data retrieval and normalization

```typescript
// Advanced OAuth usage
const oauthManager = new OAuthManager({
  providers: [
    {
      name: 'google',
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: ['profile', 'email', 'openid'],
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    },
  ],
  storage: new RedisStorage(redisClient),
});

// Handle OAuth callback
const { user, tokens } = await oauthManager.handleCallback('google', code, state);
```

### Session Management

The session implementation includes:

- **Multiple Stores**: Memory, Redis, and database storage
- **Session Security**: Rotation, validation, and hijacking detection
- **Multi-Device Support**: Concurrent sessions across devices
- **Session Analytics**: Usage tracking and monitoring
- **Cleanup Mechanisms**: Automatic session expiration and cleanup

```typescript
// Advanced session usage
const sessionManager = new SessionManager({
  store: new RedisStore(redisClient),
  secret: process.env.SESSION_SECRET!,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  },
});

// Create session with custom data
const sessionId = await sessionManager.createSession({
  userId: 'user123',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  deviceFingerprint: 'device123',
});
```

### NextAuth.js Integration

The NextAuth.js implementation includes:

- **Complete Setup**: Database adapter, providers, and callbacks
- **Multiple Providers**: OAuth, email, and credentials authentication
- **Session Management**: JWT and database session strategies
- **Security Features**: CSRF protection, rate limiting, and more
- **Event Handling**: Authentication event tracking and logging

```typescript
// NextAuth.js configuration
const authManager = new NextAuthManager({
  databaseUrl: process.env.DATABASE_URL,
  providers: [
    {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  ],
});

const authOptions = authManager.getAuthOptions();
export default NextAuth(authOptions);
```

### BetterAuth Integration

The BetterAuth implementation includes:

- **Modern Architecture**: Type-safe authentication with Zod validation
- **Advanced Features**: WebAuthn, multi-factor authentication
- **Flexible Configuration**: Customizable providers and callbacks
- **Security Best Practices**: Built-in security features and protections
- **Developer Experience**: Excellent TypeScript support and documentation

```typescript
// BetterAuth configuration
const authManager = new BetterAuthManager({
  databaseUrl: process.env.DATABASE_URL,
  providers: [
    {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  ],
  config: {
    security: {
      rateLimit: {
        enabled: true,
        windowMs: 15 * 60 * 1000,
        max: 100,
      },
    },
  },
});

const auth = authManager.getAuth();
```

## 🔒 Security Best Practices

### JWT Security
- Use strong signing keys and algorithms (HS256, RS256)
- Implement token expiration and refresh mechanisms
- Validate issuer, audience, and other claims
- Use HTTPS for all token transmissions
- Store tokens securely (httpOnly cookies, secure storage)

### OAuth Security
- Always use HTTPS for OAuth flows
- Implement PKCE for mobile and native apps
- Validate state parameters to prevent CSRF
- Use secure redirect URIs
- Implement proper scope management

### Session Security
- Use secure, httpOnly cookies
- Implement session rotation
- Validate session data on each request
- Implement proper session expiration
- Use secure session storage

### General Security
- Implement rate limiting for authentication attempts
- Use strong password policies
- Implement multi-factor authentication
- Log authentication events for monitoring
- Regularly rotate secrets and keys

## 🧪 Testing

### Unit Testing

```typescript
import { JWTManager } from './jwt-examples';

describe('JWT Manager', () => {
  let jwtManager: JWTManager;

  beforeEach(() => {
    jwtManager = new JWTManager({
      secret: 'test-secret',
      algorithm: 'HS256',
      expiresIn: '1h',
    });
  });

  test('should create and verify token', async () => {
    const payload = { userId: 'user123', email: 'user@example.com' };
    const token = await jwtManager.createToken(payload);
    const verified = await jwtManager.verifyToken(token);
    
    expect(verified.userId).toBe(payload.userId);
    expect(verified.email).toBe(payload.email);
  });
});
```

### Integration Testing

```typescript
import request from 'supertest';
import app from './app';

describe('Authentication API', () => {
  test('should authenticate user with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'user@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('user@example.com');
  });
});
```

## 📊 Monitoring and Analytics

### Authentication Events

```typescript
// Track authentication events
const authAnalytics = new AuthAnalytics();

authAnalytics.on('user_login', (event) => {
  console.log(`User ${event.userId} logged in from ${event.ipAddress}`);
});

authAnalytics.on('failed_login', (event) => {
  console.log(`Failed login attempt for ${event.email} from ${event.ipAddress}`);
});
```

### Performance Monitoring

```typescript
// Monitor authentication performance
const authMetrics = new AuthMetrics();

authMetrics.trackLoginTime(async () => {
  await authService.login(email, password);
});

authMetrics.trackTokenVerificationTime(async () => {
  await authService.verifyToken(token);
});
```

## 🚀 Production Deployment

### Environment Variables

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h
JWT_ISSUER=your-app
JWT_AUDIENCE=your-users

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Session Configuration
SESSION_SECRET=your-session-secret
REDIS_URL=redis://localhost:6379

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
```

### Docker Configuration

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

## 🛠️ Advanced Patterns

### Multi-Tenant Authentication

```typescript
class MultiTenantAuthManager {
  private tenants: Map<string, AuthManager> = new Map();

  async getTenantAuthManager(tenantId: string): Promise<AuthManager> {
    if (!this.tenants.has(tenantId)) {
      const authManager = new AuthManager({
        databaseUrl: `postgresql://user:pass@localhost/${tenantId}_db`,
        jwtSecret: `${tenantId}-jwt-secret`,
      });
      
      this.tenants.set(tenantId, authManager);
    }
    
    return this.tenants.get(tenantId)!;
  }
}
```

### Microservice Authentication

```typescript
class MicroserviceAuth {
  private authService: AuthService;
  private tokenCache: TokenCache;

  async validateServiceToken(token: string): Promise<boolean> {
    // Check cache first
    const cached = await this.tokenCache.get(token);
    if (cached) return cached.valid;

    // Validate with auth service
    const valid = await this.authService.validateToken(token);
    
    // Cache result
    await this.tokenCache.set(token, { valid }, 300);
    
    return valid;
  }
}
```

## 📚 Additional Resources

### Documentation
- [JWT RFC 7519](https://tools.ietf.org/html/rfc7519)
- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [BetterAuth Documentation](https://better-auth.com/)

### Security Guidelines
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://auth0.com/blog/json-web-token-best-practices/)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

### Libraries and Tools
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [passport.js](http://www.passportjs.org/)
- [express-session](https://www.npmjs.com/package/express-session)
- [connect-redis](https://www.npmjs.com/package/connect-redis)

## 🤝 Contributing

When contributing to this authentication examples folder:

1. Follow TypeScript best practices and conventions
2. Include comprehensive type definitions
3. Add proper error handling and validation
4. Include security considerations
5. Add tests for new functionality
6. Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: These examples are for educational purposes. Always review and adapt security implementations for your specific use case and requirements.