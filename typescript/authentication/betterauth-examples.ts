// BetterAuth TypeScript Examples - Advanced Authentication Implementation
// This file demonstrates comprehensive TypeScript usage with BetterAuth

import { betterAuth } from 'better-auth';
import { DatabaseAdapter } from 'better-auth/adapters';
import { PrismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// ===== BASIC TYPES =====

// Enhanced user interface
interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: 'admin' | 'user' | 'moderator';
  permissions: string[];
  tenantId?: string;
  isActive: boolean;
  emailVerified: Date | null;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  preferences: UserPreferences;
  metadata: Record<string, any>;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showEmail: boolean;
    showPhone: boolean;
  };
}

// Enhanced session interface
interface AuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  deviceFingerprint?: string;
  isActive: boolean;
  metadata: Record<string, any>;
}

// Enhanced provider configuration
interface ProviderConfig {
  id: string;
  name: string;
  type: 'oauth' | 'email' | 'credentials' | 'webauthn';
  clientId?: string;
  clientSecret?: string;
  authorization?: {
    params?: Record<string, string>;
    url: string;
  };
  token?: string;
  userinfo?: string;
  profile?: (profile: any) => Promise<User>;
  options?: Record<string, any>;
  style?: {
    logo?: string;
    bg_color?: string;
    text_color?: string;
  };
}

// Enhanced auth configuration
interface AuthConfig {
  database: {
    adapter: DatabaseAdapter;
    options?: Record<string, any>;
  };
  providers: ProviderConfig[];
  session: {
    strategy: 'jwt' | 'database';
    maxAge: number;
    updateAge: number;
    cookie: {
      name: string;
      options: {
        httpOnly: boolean;
        secure: boolean;
        sameSite: 'strict' | 'lax' | 'none';
        path: string;
        domain?: string;
      };
    };
  };
  jwt: {
    secret: string;
    algorithm: string;
    expiresIn: string;
    issuer?: string;
    audience?: string;
  };
  security: {
    rateLimit: {
      enabled: boolean;
      windowMs: number;
      max: number;
    };
    csrf: {
      enabled: boolean;
      secret: string;
    };
    password: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
  };
  callbacks: {
    signIn?: (user: User, account: any) => Promise<boolean | string>;
    signOut?: (session: AuthSession) => Promise<void>;
    session?: (session: AuthSession, user: User) => Promise<AuthSession>;
    jwt?: (token: any, user: User) => Promise<any>;
    error?: (error: any) => Promise<void>;
  };
  pages: {
    signIn?: string;
    signOut?: string;
    error?: string;
    verifyRequest?: string;
    newUser?: string;
  };
  events: {
    signIn?: (user: User, account: any) => Promise<void>;
    signOut?: (session: AuthSession) => Promise<void>;
    createUser?: (user: User) => Promise<void>;
    linkAccount?: (user: User, account: any) => Promise<void>;
  };
}

// ===== BETTER AUTH MANAGER =====

class BetterAuthManager {
  private prisma: PrismaClient;
  private providers: ProviderConfig[] = [];
  private config: AuthConfig;
  private auth: any;

  constructor(options: {
    databaseUrl?: string;
    providers?: ProviderConfig[];
    config?: Partial<AuthConfig>;
  }) {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: options.databaseUrl || process.env.DATABASE_URL!,
        },
      },
    });

    if (options.providers) {
      this.providers = options.providers;
    }

    this.config = this.createAuthConfig(options.config);
    this.initializeDefaultProviders();
    this.setupAuth();
  }

  // ===== AUTH CONFIGURATION =====

  // Create auth configuration
  private createAuthConfig(overrides?: Partial<AuthConfig>): AuthConfig {
    const defaultConfig: AuthConfig = {
      database: {
        adapter: new PrismaAdapter(this.prisma),
        options: {},
      },
      providers: [],
      session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
        cookie: {
          name: 'auth-token',
          options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          },
        },
      },
      jwt: {
        secret: process.env.JWT_SECRET!,
        algorithm: 'HS256',
        expiresIn: '30d',
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
      },
      security: {
        rateLimit: {
          enabled: true,
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 100, // limit each IP to 100 requests per windowMs
        },
        csrf: {
          enabled: true,
          secret: process.env.CSRF_SECRET!,
        },
        password: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
        },
      },
      callbacks: {},
      pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error',
        verifyRequest: '/auth/verify-request',
        newUser: '/auth/new-user',
      },
      events: {},
    };

    return { ...defaultConfig, ...overrides };
  }

  // Initialize default providers
  private initializeDefaultProviders(): void {
    // Google Provider
    this.providers.push({
      id: 'google',
      name: 'Google',
      type: 'oauth',
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
        },
        url: 'https://accounts.google.com/o/oauth2/v2/auth',
      },
      token: 'https://oauth2.googleapis.com/token',
      userinfo: 'https://www.googleapis.com/oauth2/v2/userinfo',
      profile: this.googleProfileCallback,
      style: {
        logo: 'https://developers.google.com/identity/images/g-logo.png',
        bg_color: '#4285f4',
        text_color: '#ffffff',
      },
    });

    // GitHub Provider
    this.providers.push({
      id: 'github',
      name: 'GitHub',
      type: 'oauth',
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        url: 'https://github.com/login/oauth/authorize',
      },
      token: 'https://github.com/login/oauth/access_token',
      userinfo: 'https://api.github.com/user',
      profile: this.githubProfileCallback,
      style: {
        logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        bg_color: '#24292e',
        text_color: '#ffffff',
      },
    });

    // Email Provider
    this.providers.push({
      id: 'email',
      name: 'Email',
      type: 'email',
      options: {
        sendVerificationRequest: this.sendVerificationRequest,
      },
    });

    // Credentials Provider
    this.providers.push({
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      options: {
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        authorize: this.authorizeCredentials,
      },
    });

    // WebAuthn Provider
    this.providers.push({
      id: 'webauthn',
      name: 'WebAuthn',
      type: 'webauthn',
      options: {
        rpName: process.env.WEBAUTHN_RP_NAME!,
        rpID: process.env.WEBAUTHN_RP_ID!,
        origin: process.env.WEBAUTHN_ORIGIN!,
      },
    });
  }

  // Setup Better Auth
  private setupAuth(): void {
    this.auth = betterAuth({
      database: this.config.database,
      providers: this.getBetterAuthProviders(),
      session: this.config.session,
      jwt: this.config.jwt,
      security: this.config.security,
      callbacks: this.config.callbacks,
      pages: this.config.pages,
      events: this.config.events,
    });
  }

  // Get Better Auth providers
  private getBetterAuthProviders() {
    return this.providers.map(provider => {
      switch (provider.type) {
        case 'oauth':
          return {
            id: provider.id,
            name: provider.name,
            type: 'oauth',
            version: '2.0',
            clientId: provider.clientId!,
            clientSecret: provider.clientSecret!,
            authorization: provider.authorization,
            token: provider.token!,
            userinfo: provider.userinfo!,
            profile: provider.profile!,
            style: provider.style,
            options: provider.options,
          };

        case 'email':
          return {
            id: provider.id,
            type: 'email',
            name: provider.name,
            server: process.env.NEXTAUTH_URL,
            from: process.env.EMAIL_FROM,
            maxAge: 24 * 60 * 60, // 24 hours
            options: provider.options,
          };

        case 'credentials':
          return {
            id: provider.id,
            name: provider.name,
            type: 'credentials',
            credentials: provider.options?.credentials,
            authorize: provider.options?.authorize,
            options: provider.options,
          };

        case 'webauthn':
          return {
            id: provider.id,
            name: provider.name,
            type: 'webauthn',
            options: provider.options,
          };

        default:
          throw new Error(`Unknown provider type: ${provider.type}`);
      }
    });
  }

  // ===== PROVIDER CALLBACKS =====

  // Google profile callback
  private async googleProfileCallback(profile: any): Promise<User> {
    return {
      id: profile.sub,
      email: profile.email!,
      name: profile.name || '',
      image: profile.picture,
      role: 'user',
      permissions: ['read', 'write'],
      isActive: true,
      emailVerified: profile.email_verified ? new Date() : null,
      twoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: { email: true, push: true, sms: false },
        privacy: { profileVisibility: 'public', showEmail: false, showPhone: false },
      },
      metadata: {
        provider: 'google',
        locale: profile.locale,
      },
    };
  }

  // GitHub profile callback
  private async githubProfileCallback(profile: any): Promise<User> {
    return {
      id: profile.id.toString(),
      email: profile.email!,
      name: profile.name || profile.login || '',
      image: profile.avatar_url,
      role: 'user',
      permissions: ['read', 'write'],
      isActive: true,
      emailVerified: null, // GitHub doesn't provide email verification status
      twoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: { email: true, push: true, sms: false },
        privacy: { profileVisibility: 'public', showEmail: false, showPhone: false },
      },
      metadata: {
        provider: 'github',
        login: profile.login,
        bio: profile.bio,
        location: profile.location,
      },
    };
  }

  // Send verification request
  private async sendVerificationRequest(params: {
    identifier: string;
    url: string;
    provider: any;
  }): Promise<void> {
    // Implementation depends on your email service
    console.log('Sending verification request:', params);
  }

  // Authorize credentials
  private async authorizeCredentials(credentials: {
    email: string;
    password: string;
  }): Promise<User | null> {
    // This should be replaced with actual database query
    const user = await this.findUserByEmail(credentials.email);
    
    if (!user || !user.isActive) {
      return null;
    }

    // Verify password (mock implementation)
    const isPasswordValid = await this.verifyPassword(credentials.password, user);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await this.updateUserLastLogin(user.id);

    return user;
  }

  // ===== DATABASE OPERATIONS =====

  // Find user by email
  private async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          preferences: true,
        },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role as 'admin' | 'user' | 'moderator',
        permissions: user.permissions as string[],
        tenantId: user.tenantId || undefined,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt || undefined,
        preferences: user.preferences as UserPreferences,
        metadata: user.metadata as Record<string, any>,
      };
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  // Find user by ID
  private async findUserById(id: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          preferences: true,
        },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role as 'admin' | 'user' | 'moderator',
        permissions: user.permissions as string[],
        tenantId: user.tenantId || undefined,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt || undefined,
        preferences: user.preferences as UserPreferences,
        metadata: user.metadata as Record<string, any>,
      };
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  // Update user last login
  private async updateUserLastLogin(userId: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          lastLoginAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error updating user last login:', error);
    }
  }

  // Verify password
  private async verifyPassword(password: string, user: User): Promise<boolean> {
    // This should be replaced with actual password hashing verification
    return password === 'password123'; // Mock implementation
  }

  // Create user
  private async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          preferences: true,
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        permissions: user.permissions,
        tenantId: user.tenantId,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
        preferences: user.preferences as UserPreferences,
        metadata: user.metadata as Record<string, any>,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user
  private async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
        include: {
          preferences: true,
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        permissions: user.permissions,
        tenantId: user.tenantId,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
        preferences: user.preferences as UserPreferences,
        metadata: user.metadata as Record<string, any>,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // ===== AUTH METHODS =====

  // Get Better Auth instance
  getAuth() {
    return this.auth;
  }

  // Sign in with credentials
  async signInWithCredentials(email: string, password: string): Promise<{ user: User; session: AuthSession } | null> {
    try {
      const user = await this.authorizeCredentials({ email, password });
      if (!user) {
        return null;
      }

      const session = await this.createSession(user);
      return { user, session };
    } catch (error) {
      console.error('Error signing in with credentials:', error);
      return null;
    }
  }

  // Sign in with OAuth
  async signInWithOAuth(providerId: string, code: string, state: string): Promise<{ user: User; session: AuthSession } | null> {
    try {
      // This should be replaced with actual OAuth flow
      const user = await this.findUserByEmail('user@example.com');
      if (!user) {
        return null;
      }

      const session = await this.createSession(user);
      return { user, session };
    } catch (error) {
      console.error('Error signing in with OAuth:', error);
      return null;
    }
  }

  // Create session
  private async createSession(user: User): Promise<AuthSession> {
    try {
      const session = await this.prisma.session.create({
        data: {
          userId: user.id,
          token: this.generateSessionToken(),
          expiresAt: new Date(Date.now() + this.config.session.maxAge * 1000),
          ipAddress: '127.0.0.1', // Should be extracted from request
          userAgent: 'Mozilla/5.0...', // Should be extracted from request
          deviceFingerprint: this.generateDeviceFingerprint(),
          isActive: true,
          metadata: {},
        },
      });

      return {
        id: session.id,
        userId: session.userId,
        token: session.token,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        deviceFingerprint: session.deviceFingerprint,
        isActive: session.isActive,
        metadata: session.metadata as Record<string, any>,
      };
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  // Generate session token
  private generateSessionToken(): string {
    const { randomBytes } = require('crypto');
    return randomBytes(32).toString('hex');
  }

  // Generate device fingerprint
  private generateDeviceFingerprint(): string {
    const { randomBytes } = require('crypto');
    return randomBytes(16).toString('hex');
  }

  // Validate session
  async validateSession(token: string): Promise<AuthSession | null> {
    try {
      const session = await this.prisma.session.findUnique({
        where: { token },
        include: {
          user: {
            include: {
              preferences: true,
            },
          },
        },
      });

      if (!session || !session.isActive || session.expiresAt < new Date()) {
        return null;
      }

      return {
        id: session.id,
        userId: session.userId,
        token: session.token,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        deviceFingerprint: session.deviceFingerprint,
        isActive: session.isActive,
        metadata: session.metadata as Record<string, any>,
      };
    } catch (error) {
      console.error('Error validating session:', error);
      return null;
    }
  }

  // Sign out
  async signOut(token: string): Promise<boolean> {
    try {
      await this.prisma.session.update({
        where: { token },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });

      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      return false;
    }
  }

  // Get user permissions
  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.findUserById(userId);
    return user?.permissions || [];
  }

  // Check user permission
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const user = await this.findUserById(userId);
    return user?.permissions.includes(permission) || false;
  }

  // Check user role
  async hasRole(userId: string, role: string): Promise<boolean> {
    const user = await this.findUserById(userId);
    return user?.role === role || false;
  }

  // Get user sessions
  async getUserSessions(userId: string): Promise<AuthSession[]> {
    try {
      const sessions = await this.prisma.session.findMany({
        where: {
          userId,
          isActive: true,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return sessions.map(session => ({
        id: session.id,
        userId: session.userId,
        token: session.token,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        deviceFingerprint: session.deviceFingerprint,
        isActive: session.isActive,
        metadata: session.metadata as Record<string, any>,
      }));
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  }

  // Revoke user sessions
  async revokeUserSessions(userId: string): Promise<number> {
    try {
      const result = await this.prisma.session.updateMany({
        where: {
          userId,
          isActive: true,
        },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });

      return result.count;
    } catch (error) {
      console.error('Error revoking user sessions:', error);
      return 0;
    }
  }

  // Get auth statistics
  async getAuthStatistics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    activeSessions: number;
    providers: Record<string, number>;
  }> {
    try {
      const [totalUsers, activeUsers, totalSessions, activeSessions] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({
          where: {
            isActive: true,
            lastLoginAt: {
              not: null,
            },
          },
        }),
        this.prisma.session.count(),
        this.prisma.session.count({
          where: {
            isActive: true,
            expiresAt: {
              gt: new Date(),
            },
          },
        }),
      ]);

      // Get provider statistics
      const accounts = await this.prisma.account.groupBy({
        by: ['provider'],
        _count: {
          provider: true,
        },
      });

      const providers = accounts.reduce((acc, item) => {
        acc[item.provider] = item._count.provider;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalUsers,
        activeUsers,
        totalSessions,
        activeSessions,
        providers,
      };
    } catch (error) {
      console.error('Error getting auth statistics:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalSessions: 0,
        activeSessions: 0,
        providers: {},
      };
    }
  }

  // ===== CLEANUP =====

  async cleanup(): Promise<void> {
    try {
      // Clean up expired sessions
      const result = await this.prisma.session.updateMany({
        where: {
          expiresAt: {
            lte: new Date(),
          },
        },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });

      console.log(`Cleaned up ${result.count} expired sessions`);
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
    }
  }

  // Disconnect from database
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// ===== BETTER AUTH SERVICE =====

class BetterAuthService {
  private authManager: BetterAuthManager;

  constructor(authManager: BetterAuthManager) {
    this.authManager = authManager;
  }

  // Get Better Auth instance
  getAuth() {
    return this.authManager.getAuth();
  }

  // Sign in with credentials
  async signInWithCredentials(email: string, password: string): Promise<{ user: User; session: AuthSession } | null> {
    return await this.authManager.signInWithCredentials(email, password);
  }

  // Sign in with OAuth
  async signInWithOAuth(providerId: string, code: string, state: string): Promise<{ user: User; session: AuthSession } | null> {
    return await this.authManager.signInWithOAuth(providerId, code, state);
  }

  // Validate session
  async validateSession(token: string): Promise<AuthSession | null> {
    return await this.authManager.validateSession(token);
  }

  // Sign out
  async signOut(token: string): Promise<boolean> {
    return await this.authManager.signOut(token);
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    return await this.authManager['findUserById'](userId);
  }

  // Get user permissions
  async getUserPermissions(userId: string): Promise<string[]> {
    return await this.authManager.getUserPermissions(userId);
  }

  // Check user permission
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    return await this.authManager.hasPermission(userId, permission);
  }

  // Check user role
  async hasRole(userId: string, role: string): Promise<boolean> {
    return await this.authManager.hasRole(userId, role);
  }

  // Get user sessions
  async getUserSessions(userId: string): Promise<AuthSession[]> {
    return await this.authManager.getUserSessions(userId);
  }

  // Revoke user sessions
  async revokeUserSessions(userId: string): Promise<number> {
    return await this.authManager.revokeUserSessions(userId);
  }

  // Get auth statistics
  async getAuthStatistics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    activeSessions: number;
    providers: Record<string, number>;
  }> {
    return await this.authManager.getAuthStatistics();
  }

  // Cleanup
  async cleanup(): Promise<void> {
    await this.authManager.cleanup();
  }

  // Disconnect
  async disconnect(): Promise<void> {
    await this.authManager.disconnect();
  }
}

// ===== EXERCISES =====

/*
EXERCISE 1: Create a BetterAuth middleware that:
- Validates sessions on each request
- Checks user roles and permissions
- Handles session expiration gracefully
- Provides user context to API routes
- Is fully typed

EXERCISE 2: Build a multi-tenant BetterAuth system that:
- Supports multiple tenants with separate databases
- Provides tenant isolation
- Handles tenant-specific user roles
- Supports dynamic tenant configuration
- Is fully typed

EXERCISE 3: Create a BetterAuth analytics system that:
- Tracks authentication events
- Monitors provider usage statistics
- Provides user behavior insights
- Detects anomalous authentication patterns
- Is fully typed

EXERCISE 4: Build a BetterAuth security system that:
- Implements advanced session security
- Provides CSRF protection
- Handles session hijacking detection
- Implements rate limiting for auth attempts
- Is fully typed

EXERCISE 5: Create a BetterAuth user management dashboard that:
- Displays user authentication status
- Provides session management
- Shows user permissions and roles
- Supports user impersonation for admins
- Is fully typed
*/

// Export classes and interfaces
export { BetterAuthManager, BetterAuthService };

// Export types
export type {
  User,
  UserPreferences,
  AuthSession,
  ProviderConfig,
  AuthConfig,
};