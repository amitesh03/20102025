// JWT TypeScript Examples - Advanced JSON Web Token Implementation
// This file demonstrates comprehensive TypeScript usage with JWT authentication

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// ===== BASIC TYPES =====

// Enhanced JWT payload interface
interface JWTPayload {
  sub: string; // Subject (user ID)
  iat: number; // Issued at
  exp: number; // Expiration time
  iss?: string; // Issuer
  aud?: string; // Audience
  nbf?: number; // Not before
  jti?: string; // JWT ID
  typ?: string; // Token type
  azp?: string; // Authorized party
  role?: string | string[]; // User role(s)
  permissions?: string[]; // User permissions
  tenantId?: string; // Multi-tenant ID
  sessionId?: string; // Session identifier
  deviceId?: string; // Device identifier
  email?: string; // User email
  name?: string; // User name
  metadata?: Record<string, any>; // Additional metadata
}

// Enhanced token pair interface
interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
  scope?: string;
}

// Enhanced authentication result interface
interface AuthResult {
  success: boolean;
  user?: User;
  tokens?: TokenPair;
  error?: string;
  errorCode?: string;
  requiresTwoFactor?: boolean;
  twoFactorMethods?: string[];
}

// Enhanced user interface
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  tenantId?: string;
  isActive: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  passwordChangedAt: Date;
  metadata?: Record<string, any>;
}

// Enhanced JWT options interface
interface JWTOptions {
  algorithm?: jwt.Algorithm;
  expiresIn?: string | number;
  notBefore?: string | number;
  audience?: string | string[];
  issuer?: string;
  jwtid?: string;
  subject?: string;
  noTimestamp?: boolean;
  header?: jwt.JwtHeader;
  keyid?: string;
  mutatePayload?: boolean;
  allowInvalidAsymmetric?: boolean;
  encoding?: string;
  clockTimestamp?: number;
  clockTolerance?: number;
}

// Enhanced refresh token interface
interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  lastUsedAt?: Date;
}

// Enhanced blacklist entry interface
interface BlacklistEntry {
  jti: string;
  userId: string;
  reason: string;
  expiresAt: Date;
  createdAt: Date;
}

// ===== JWT MANAGER CLASS =====

class JWTManager {
  private secret: string;
  private refreshSecret: string;
  private algorithm: jwt.Algorithm;
  private accessTokenExpiry: number;
  private refreshTokenExpiry: number;
  private issuer: string;
  private audience: string;
  private refreshTokens: Map<string, RefreshToken> = new Map();
  private blacklist: Map<string, BlacklistEntry> = new Map();

  constructor(options: {
    secret: string;
    refreshSecret?: string;
    algorithm?: jwt.Algorithm;
    accessTokenExpiry?: number;
    refreshTokenExpiry?: number;
    issuer?: string;
    audience?: string;
  }) {
    this.secret = options.secret;
    this.refreshSecret = options.refreshSecret || options.secret;
    this.algorithm = options.algorithm || 'HS256';
    this.accessTokenExpiry = options.accessTokenExpiry || 3600; // 1 hour
    this.refreshTokenExpiry = options.refreshExpiry || 604800; // 7 days
    this.issuer = options.issuer || 'default-issuer';
    this.audience = options.audience || 'default-audience';
  }

  // ===== TOKEN GENERATION =====

  // Generate access token
  generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>, options?: JWTOptions): string {
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload: JWTPayload = {
      ...payload,
      iat: now,
      exp: now + this.accessTokenExpiry,
      iss: this.issuer,
      aud: this.audience,
      jti: this.generateJTI(),
      typ: 'access',
    };

    return jwt.sign(tokenPayload, this.secret, {
      algorithm: this.algorithm,
      expiresIn: options?.expiresIn || this.accessTokenExpiry,
      issuer: options?.issuer || this.issuer,
      audience: options?.audience || this.audience,
      jwtid: options?.jwtid || tokenPayload.jti,
      subject: options?.subject || payload.sub,
      noTimestamp: options?.noTimestamp,
      header: options?.header,
      keyid: options?.keyid,
      mutatePayload: options?.mutatePayload,
      allowInvalidAsymmetric: options?.allowInvalidAsymmetric,
      encoding: options?.encoding,
      clockTimestamp: options?.clockTimestamp,
      clockTolerance: options?.clockTolerance,
    });
  }

  // Generate refresh token
  generateRefreshToken(userId: string, options?: {
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
  }): string {
    const now = Math.floor(Date.now() / 1000);
    const jti = this.generateJTI();
    const payload: JWTPayload = {
      sub: userId,
      iat: now,
      exp: now + this.refreshTokenExpiry,
      iss: this.issuer,
      aud: this.audience,
      jti,
      typ: 'refresh',
      sessionId: this.generateSessionId(),
    };

    const token = jwt.sign(payload, this.refreshSecret, {
      algorithm: this.algorithm,
      expiresIn: this.refreshTokenExpiry,
      issuer: this.issuer,
      audience: this.audience,
      jwtid: jti,
      subject: userId,
    });

    // Store refresh token
    this.refreshTokens.set(jti, {
      id: jti,
      userId,
      token,
      expiresAt: new Date(now * 1000 + this.refreshTokenExpiry * 1000),
      isRevoked: false,
      deviceId: options?.deviceId,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
      createdAt: new Date(),
    });

    return token;
  }

  // Generate token pair
  generateTokenPair(user: User, options?: {
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
    scope?: string;
  }): TokenPair {
    const accessToken = this.generateAccessToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
      tenantId: user.tenantId,
      sessionId: this.generateSessionId(),
      deviceId: options?.deviceId,
      metadata: user.metadata,
    });

    const refreshToken = this.generateRefreshToken(user.id, options);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.accessTokenExpiry,
      refreshExpiresIn: this.refreshTokenExpiry,
      scope: options?.scope,
    };
  }

  // ===== TOKEN VERIFICATION =====

  // Verify access token
  async verifyAccessToken(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, this.secret, {
        algorithms: [this.algorithm],
        issuer: this.issuer,
        audience: this.audience,
        clockTolerance: 30, // 30 seconds clock skew tolerance
      }) as JWTPayload;

      // Check if token is blacklisted
      if (decoded.jti && this.isTokenBlacklisted(decoded.jti)) {
        throw new Error('Token is blacklisted');
      }

      return decoded;
    } catch (error) {
      throw this.handleJWTError(error);
    }
  }

  // Verify refresh token
  async verifyRefreshToken(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, this.refreshSecret, {
        algorithms: [this.algorithm],
        issuer: this.issuer,
        audience: this.audience,
        clockTolerance: 30,
      }) as JWTPayload;

      // Check if refresh token exists and is not revoked
      if (decoded.jti) {
        const storedToken = this.refreshTokens.get(decoded.jti);
        if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
          throw new Error('Invalid or expired refresh token');
        }
      }

      return decoded;
    } catch (error) {
      throw this.handleJWTError(error);
    }
  }

  // Decode token without verification (for debugging)
  decodeToken(token: string): { header: jwt.JwtHeader; payload: JWTPayload; signature: string } {
    return jwt.decode(token, { complete: true }) as {
      header: jwt.JwtHeader;
      payload: JWTPayload;
      signature: string;
    };
  }

  // ===== TOKEN REFRESH =====

  // Refresh access token
  async refreshAccessToken(refreshToken: string, options?: {
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<TokenPair> {
    try {
      // Verify refresh token
      const decoded = await this.verifyRefreshToken(refreshToken);
      
      // Get user from database (mock implementation)
      const user = await this.getUserById(decoded.sub);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // Revoke old refresh token
      if (decoded.jti) {
        this.revokeRefreshToken(decoded.jti, 'Token refresh');
      }

      // Generate new token pair
      return this.generateTokenPair(user, {
        deviceId: options?.deviceId,
        ipAddress: options?.ipAddress,
        userAgent: options?.userAgent,
      });
    } catch (error) {
      throw this.handleJWTError(error);
    }
  }

  // ===== TOKEN MANAGEMENT =====

  // Revoke refresh token
  revokeRefreshToken(jti: string, reason: string): void {
    const token = this.refreshTokens.get(jti);
    if (token) {
      token.isRevoked = true;
      token.lastUsedAt = new Date();
      this.refreshTokens.set(jti, token);
    }
  }

  // Revoke all user refresh tokens
  revokeAllUserRefreshTokens(userId: string, reason: string): void {
    for (const [jti, token] of this.refreshTokens.entries()) {
      if (token.userId === userId) {
        token.isRevoked = true;
        token.lastUsedAt = new Date();
        this.refreshTokens.set(jti, token);
      }
    }
  }

  // Blacklist token
  blacklistToken(jti: string, userId: string, reason: string): void {
    this.blacklist.set(jti, {
      jti,
      userId,
      reason,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date(),
    });
  }

  // Check if token is blacklisted
  isTokenBlacklisted(jti: string): boolean {
    const entry = this.blacklist.get(jti);
    if (!entry) return false;
    
    // Remove expired entries
    if (entry.expiresAt < new Date()) {
      this.blacklist.delete(jti);
      return false;
    }
    
    return true;
  }

  // Clean up expired tokens
  cleanupExpiredTokens(): void {
    const now = new Date();
    
    // Clean up expired refresh tokens
    for (const [jti, token] of this.refreshTokens.entries()) {
      if (token.expiresAt < now) {
        this.refreshTokens.delete(jti);
      }
    }
    
    // Clean up expired blacklist entries
    for (const [jti, entry] of this.blacklist.entries()) {
      if (entry.expiresAt < now) {
        this.blacklist.delete(jti);
      }
    }
  }

  // ===== MIDDLEWARE =====

  // Express.js middleware
  expressMiddleware(options?: {
    required?: boolean;
    roles?: string[];
    permissions?: string[];
  }) {
    return async (req: any, res: any, next: any) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          if (options?.required !== false) {
            return res.status(401).json({ error: 'No authorization header' });
          }
          return next();
        }

        const token = authHeader.replace('Bearer ', '');
        const payload = await this.verifyAccessToken(token);
        
        // Check role requirements
        if (options?.roles && options.roles.length > 0) {
          const userRoles = Array.isArray(payload.role) ? payload.role : [payload.role];
          if (!options.roles.some(role => userRoles.includes(role))) {
            return res.status(403).json({ error: 'Insufficient permissions' });
          }
        }
        
        // Check permission requirements
        if (options?.permissions && options.permissions.length > 0) {
          const userPermissions = payload.permissions || [];
          const hasPermission = options.permissions.every(permission =>
            userPermissions.includes(permission)
          );
          if (!hasPermission) {
            return res.status(403).json({ error: 'Insufficient permissions' });
          }
        }
        
        req.user = payload;
        next();
      } catch (error) {
        return res.status(401).json({ error: error.message });
      }
    };
  }

  // Next.js middleware
  nextjsMiddleware(options?: {
    required?: boolean;
    roles?: string[];
    permissions?: string[];
  }) {
    return async (req: any, res: any, next: any) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          if (options?.required !== false) {
            return res.status(401).json({ error: 'No authorization header' });
          }
          return next();
        }

        const token = authHeader.replace('Bearer ', '');
        const payload = await this.verifyAccessToken(token);
        
        // Check role requirements
        if (options?.roles && options.roles.length > 0) {
          const userRoles = Array.isArray(payload.role) ? payload.role : [payload.role];
          if (!options.roles.some(role => userRoles.includes(role))) {
            return res.status(403).json({ error: 'Insufficient permissions' });
          }
        }
        
        // Check permission requirements
        if (options?.permissions && options.permissions.length > 0) {
          const userPermissions = payload.permissions || [];
          const hasPermission = options.permissions.every(permission =>
            userPermissions.includes(permission)
          );
          if (!hasPermission) {
            return res.status(403).json({ error: 'Insufficient permissions' });
          }
        }
        
        req.user = payload;
        next();
      } catch (error) {
        return res.status(401).json({ error: error.message });
      }
    };
  }

  // ===== UTILITY METHODS =====

  // Generate JWT ID
  private generateJTI(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  // Generate session ID
  private generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Handle JWT errors
  private handleJWTError(error: any): Error {
    if (error.name === 'TokenExpiredError') {
      return new Error('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      return new Error('Invalid token');
    } else if (error.name === 'NotBeforeError') {
      return new Error('Token not active');
    } else {
      return new Error(`JWT error: ${error.message}`);
    }
  }

  // Mock user lookup (replace with actual database query)
  private async getUserById(userId: string): Promise<User | null> {
    // This should be replaced with actual database query
    return {
      id: userId,
      email: 'user@example.com',
      name: 'John Doe',
      role: 'user',
      permissions: ['read', 'write'],
      isActive: true,
      emailVerified: true,
      twoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      passwordChangedAt: new Date(),
    };
  }

  // Get token information
  getTokenInfo(token: string): { header: jwt.JwtHeader; payload: JWTPayload; expiresAt: Date } {
    const decoded = this.decodeToken(token);
    return {
      header: decoded.header,
      payload: decoded.payload,
      expiresAt: new Date(decoded.payload.exp * 1000),
    };
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      return decoded.payload.exp < Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  }

  // Get time until token expires
  getTimeUntilExpiry(token: string): number {
    try {
      const decoded = this.decodeToken(token);
      return Math.max(0, decoded.payload.exp - Math.floor(Date.now() / 1000));
    } catch {
      return 0;
    }
  }

  // Validate token format
  isValidTokenFormat(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3;
  }

  // Get refresh token info
  getRefreshTokenInfo(jti: string): RefreshToken | null {
    return this.refreshTokens.get(jti) || null;
  }

  // Get user's active refresh tokens
  getUserRefreshTokens(userId: string): RefreshToken[] {
    const tokens: RefreshToken[] = [];
    for (const token of this.refreshTokens.values()) {
      if (token.userId === userId && !token.isRevoked && token.expiresAt > new Date()) {
        tokens.push(token);
      }
    }
    return tokens;
  }

  // Get blacklist entry
  getBlacklistEntry(jti: string): BlacklistEntry | null {
    return this.blacklist.get(jti) || null;
  }

  // Get statistics
  getStatistics(): {
    activeRefreshTokens: number;
    revokedRefreshTokens: number;
    blacklistedTokens: number;
  } {
    let activeCount = 0;
    let revokedCount = 0;
    
    for (const token of this.refreshTokens.values()) {
      if (token.isRevoked) {
        revokedCount++;
      } else if (token.expiresAt > new Date()) {
        activeCount++;
      }
    }
    
    return {
      activeRefreshTokens: activeCount,
      revokedRefreshTokens: revokedCount,
      blacklistedTokens: this.blacklist.size,
    };
  }
}

// ===== AUTHENTICATION SERVICE =====

class AuthenticationService {
  private jwtManager: JWTManager;
  private users: Map<string, User> = new Map();

  constructor(jwtManager: JWTManager) {
    this.jwtManager = jwtManager;
    this.initializeMockUsers();
  }

  // Initialize mock users
  private initializeMockUsers(): void {
    const users: User[] = [
      {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'manage_users'],
        isActive: true,
        emailVerified: true,
        twoFactorEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordChangedAt: new Date(),
      },
      {
        id: '2',
        email: 'user@example.com',
        name: 'Regular User',
        role: 'user',
        permissions: ['read', 'write'],
        isActive: true,
        emailVerified: true,
        twoFactorEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordChangedAt: new Date(),
      },
    ];

    users.forEach(user => {
      this.users.set(user.id, user);
    });
  }

  // Authenticate user
  async authenticate(email: string, password: string, options?: {
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuthResult> {
    try {
      // Find user by email
      const user = Array.from(this.users.values()).find(u => u.email === email);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          errorCode: 'USER_NOT_FOUND',
        };
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          error: 'User account is inactive',
          errorCode: 'USER_INACTIVE',
        };
      }

      // Verify password (mock implementation)
      const isPasswordValid = await this.verifyPassword(password, user);
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid password',
          errorCode: 'INVALID_PASSWORD',
        };
      }

      // Check if two-factor authentication is required
      if (user.twoFactorEnabled) {
        return {
          success: false,
          error: 'Two-factor authentication required',
          errorCode: 'TWO_FACTOR_REQUIRED',
          requiresTwoFactor: true,
          twoFactorMethods: ['totp', 'sms'],
        };
      }

      // Generate tokens
      const tokens = this.jwtManager.generateTokenPair(user, {
        deviceId: options?.deviceId,
        ipAddress: options?.ipAddress,
        userAgent: options?.userAgent,
      });

      // Update last login
      user.lastLoginAt = new Date();
      this.users.set(user.id, user);

      return {
        success: true,
        user,
        tokens,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errorCode: 'AUTH_ERROR',
      };
    }
  }

  // Authenticate with two-factor
  async authenticateWithTwoFactor(
    email: string,
    password: string,
    twoFactorCode: string,
    options?: {
      deviceId?: string;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<AuthResult> {
    try {
      // First authenticate with password
      const authResult = await this.authenticate(email, password, options);
      if (!authResult.success && authResult.errorCode !== 'TWO_FACTOR_REQUIRED') {
        return authResult;
      }

      // Verify two-factor code
      const user = Array.from(this.users.values()).find(u => u.email === email);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          errorCode: 'USER_NOT_FOUND',
        };
      }

      const isTwoFactorValid = await this.verifyTwoFactorCode(user, twoFactorCode);
      if (!isTwoFactorValid) {
        return {
          success: false,
          error: 'Invalid two-factor code',
          errorCode: 'INVALID_TWO_FACTOR',
        };
      }

      // Generate tokens
      const tokens = this.jwtManager.generateTokenPair(user, options);

      // Update last login
      user.lastLoginAt = new Date();
      this.users.set(user.id, user);

      return {
        success: true,
        user,
        tokens,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errorCode: 'AUTH_ERROR',
      };
    }
  }

  // Refresh tokens
  async refreshTokens(refreshToken: string, options?: {
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuthResult> {
    try {
      const tokens = await this.jwtManager.refreshAccessToken(refreshToken, options);
      
      // Get user from token
      const decoded = this.jwtManager.decodeToken(tokens.accessToken);
      const user = this.users.get(decoded.payload.sub);
      
      if (!user || !user.isActive) {
        return {
          success: false,
          error: 'User not found or inactive',
          errorCode: 'USER_INACTIVE',
        };
      }

      return {
        success: true,
        user,
        tokens,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errorCode: 'REFRESH_ERROR',
      };
    }
  }

  // Logout user
  async logout(accessToken: string, refreshToken?: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Blacklist access token
      const decoded = this.jwtManager.decodeToken(accessToken);
      if (decoded.payload.jti) {
        this.jwtManager.blacklistToken(
          decoded.payload.jti,
          decoded.payload.sub,
          'Logout'
        );
      }

      // Revoke refresh token
      if (refreshToken) {
        const refreshDecoded = this.jwtManager.decodeToken(refreshToken);
        if (refreshDecoded.payload.jti) {
          this.jwtManager.revokeRefreshToken(
            refreshDecoded.payload.jti,
            'Logout'
          );
        }
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Logout from all devices
  async logoutFromAllDevices(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Revoke all user refresh tokens
      this.jwtManager.revokeAllUserRefreshTokens(userId, 'Logout from all devices');
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Mock password verification
  private async verifyPassword(password: string, user: User): Promise<boolean> {
    // This should be replaced with actual password hashing verification
    return password === 'password123'; // Mock implementation
  }

  // Mock two-factor verification
  private async verifyTwoFactorCode(user: User, code: string): Promise<boolean> {
    // This should be replaced with actual TOTP/SMS verification
    return code === '123456'; // Mock implementation
  }

  // Get user by ID
  getUserById(userId: string): User | null {
    return this.users.get(userId) || null;
  }

  // Update user
  updateUser(userId: string, updates: Partial<User>): User | null {
    const user = this.users.get(userId);
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

// ===== EXERCISES =====

/*
EXERCISE 1: Create a JWT middleware that:
- Validates tokens on each request
- Checks user roles and permissions
- Handles token expiration gracefully
- Provides user context to handlers
- Is fully typed

EXERCISE 2: Build a token refresh system that:
- Automatically refreshes expired tokens
- Handles refresh token rotation
- Provides secure token storage
- Handles concurrent refresh requests
- Is fully typed

EXERCISE 3: Create a JWT blacklist system that:
- Stores blacklisted tokens efficiently
- Automatically cleans up expired entries
- Provides distributed blacklist support
- Handles high-volume operations
- Is fully typed

EXERCISE 4: Build a multi-tenant JWT system that:
- Supports multiple tenants with separate keys
- Provides tenant isolation
- Handles tenant-specific claims
- Supports dynamic tenant configuration
- Is fully typed

EXERCISE 5: Create a JWT analytics system that:
- Tracks token usage patterns
- Monitors authentication attempts
- Provides security insights
- Detects anomalous behavior
- Is fully typed
*/

// Export classes and interfaces
export { JWTManager, AuthenticationService };

// Export types
export type {
  JWTPayload,
  TokenPair,
  AuthResult,
  User,
  JWTOptions,
  RefreshToken,
  BlacklistEntry,
};