// Session Management TypeScript Examples - Advanced Session Implementation
// This file demonstrates comprehensive TypeScript usage with session management

import { Request, Response, NextFunction } from 'express';
import { createClient, RedisClientType } from 'redis';
import crypto from 'crypto';

// ===== BASIC TYPES =====

// Enhanced session interface
interface Session {
  id: string;
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  tenantId?: string;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  lastAccessedAt: Date;
  isActive: boolean;
  isPersistent: boolean;
  securityLevel: 'low' | 'medium' | 'high';
}

// Enhanced session store interface
interface SessionStore {
  create(session: Session): Promise<void>;
  get(sessionId: string): Promise<Session | null>;
  update(sessionId: string, updates: Partial<Session>): Promise<Session | null>;
  delete(sessionId: string): Promise<boolean>;
  touch(sessionId: string): Promise<boolean>;
  cleanup(): Promise<number>;
  getUserSessions(userId: string): Promise<Session[]>;
  deleteAllUserSessions(userId: string): Promise<number>;
  getAll(): Promise<Session[]>;
  getActiveCount(): Promise<number>;
}

// Enhanced session options interface
interface SessionOptions {
  name?: string;
  secret?: string;
  resave?: boolean;
  saveUninitialized?: boolean;
  rolling?: boolean;
  cookie?: {
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    maxAge?: number;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
  };
  store?: SessionStore;
  genid?: (req: Request) => string;
  unset?: 'destroy' | 'keep';
  proxy?: boolean;
}

// Enhanced session data interface
interface SessionData {
  userId?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  tenantId?: string;
  deviceId?: string;
  flash?: Record<string, any>;
  csrfToken?: string;
  loginAttempts?: number;
  lastActivity?: Date;
  preferences?: Record<string, any>;
  metadata?: Record<string, any>;
}

// Enhanced security options interface
interface SecurityOptions {
  rotationInterval?: number;
  maxAge?: number;
  inactivityTimeout?: number;
  maxSessionsPerUser?: number;
  requireDeviceFingerprint?: boolean;
  requireIPValidation?: boolean;
  encryptionEnabled?: boolean;
  encryptionKey?: string;
  csrfProtection?: boolean;
  rateLimiting?: {
    windowMs?: number;
    maxAttempts?: number;
    skipSuccessfulRequests?: boolean;
  };
}

// Enhanced session statistics interface
interface SessionStatistics {
  totalSessions: number;
  activeSessions: number;
  expiredSessions: number;
  sessionsByUser: Record<string, number>;
  sessionsByRole: Record<string, number>;
  averageSessionDuration: number;
  oldestSession?: Date;
  newestSession?: Date;
  securityEvents: SecurityEvent[];
}

interface SecurityEvent {
  type: 'login' | 'logout' | 'session_hijack' | 'suspicious_activity' | 'rate_limit';
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  details?: Record<string, any>;
}

// ===== MEMORY STORE =====

class MemorySessionStore implements SessionStore {
  private sessions: Map<string, Session> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor(private options: { cleanupInterval?: number } = {}) {
    this.cleanupInterval = setInterval(
      () => this.cleanup(),
      options.cleanupInterval || 60000 // 1 minute
    );
  }

  async create(session: Session): Promise<void> {
    this.sessions.set(session.id, session);
  }

  async get(sessionId: string): Promise<Session | null> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  async update(sessionId: string, updates: Partial<Session>): Promise<Session | null> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: new Date(),
    };

    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  async delete(sessionId: string): Promise<boolean> {
    const deleted = this.sessions.delete(sessionId);
    return deleted;
  }

  async touch(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    const updatedSession = {
      ...session,
      lastAccessedAt: new Date(),
    };

    this.sessions.set(sessionId, updatedSession);
    return true;
  }

  async cleanup(): Promise<number> {
    const now = new Date();
    let cleaned = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }

    return cleaned;
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    const sessions: Session[] = [];
    const now = new Date();

    for (const session of this.sessions.values()) {
      if (session.userId === userId && session.expiresAt > now) {
        sessions.push(session);
      }
    }

    return sessions;
  }

  async deleteAllUserSessions(userId: string): Promise<number> {
    let deleted = 0;
    const now = new Date();

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === userId && session.expiresAt > now) {
        this.sessions.delete(sessionId);
        deleted++;
      }
    }

    return deleted;
  }

  async getAll(): Promise<Session[]> {
    const now = new Date();
    const sessions: Session[] = [];

    for (const session of this.sessions.values()) {
      if (session.expiresAt > now) {
        sessions.push(session);
      }
    }

    return sessions;
  }

  async getActiveCount(): Promise<number> {
    const now = new Date();
    let count = 0;

    for (const session of this.sessions.values()) {
      if (session.expiresAt > now) {
        count++;
      }
    }

    return count;
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// ===== REDIS STORE =====

class RedisSessionStore implements SessionStore {
  private client: RedisClientType;
  private keyPrefix: string;
  private cleanupInterval: NodeJS.Timeout;

  constructor(redisUrl: string, options: { keyPrefix?: string; cleanupInterval?: number } = {}) {
    this.client = createClient({ url: redisUrl });
    this.keyPrefix = options.keyPrefix || 'sess:';
    this.cleanupInterval = setInterval(
      () => this.cleanup(),
      options.cleanupInterval || 60000 // 1 minute
    );
  }

  private getKey(sessionId: string): string {
    return `${this.keyPrefix}${sessionId}`;
  }

  async create(session: Session): Promise<void> {
    const key = this.getKey(session.id);
    await this.client.setEx(
      key,
      JSON.stringify(session),
      Math.floor((session.expiresAt.getTime() - Date.now()) / 1000)
    );
  }

  async get(sessionId: string): Promise<Session | null> {
    try {
      const key = this.getKey(sessionId);
      const data = await this.client.get(key);
      
      if (!data) {
        return null;
      }

      const session = JSON.parse(data) as Session;
      
      // Check if session is expired
      if (session.expiresAt < new Date()) {
        await this.client.del(key);
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error getting session from Redis:', error);
      return null;
    }
  }

  async update(sessionId: string, updates: Partial<Session>): Promise<Session | null> {
    const session = await this.get(sessionId);
    if (!session) {
      return null;
    }

    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: new Date(),
    };

    const key = this.getKey(sessionId);
    await this.client.setEx(
      key,
      JSON.stringify(updatedSession),
      Math.floor((updatedSession.expiresAt.getTime() - Date.now()) / 1000)
    );

    return updatedSession;
  }

  async delete(sessionId: string): Promise<boolean> {
    try {
      const key = this.getKey(sessionId);
      const result = await this.client.del(key);
      return result > 0;
    } catch (error) {
      console.error('Error deleting session from Redis:', error);
      return false;
    }
  }

  async touch(sessionId: string): Promise<boolean> {
    const session = await this.get(sessionId);
    if (!session) {
      return false;
    }

    const updatedSession = {
      ...session,
      lastAccessedAt: new Date(),
    };

    const key = this.getKey(sessionId);
    await this.client.setEx(
      key,
      JSON.stringify(updatedSession),
      Math.floor((updatedSession.expiresAt.getTime() - Date.now()) / 1000)
    );

    return true;
  }

  async cleanup(): Promise<number> {
    try {
      const pattern = `${this.keyPrefix}*`;
      const keys = await this.client.keys(pattern);
      let cleaned = 0;

      for (const key of keys) {
        const ttl = await this.client.ttl(key);
        if (ttl === -1) {
          // No expiration set, check session data
          const data = await this.client.get(key);
          if (data) {
            const session = JSON.parse(data) as Session;
            if (session.expiresAt < new Date()) {
              await this.client.del(key);
              cleaned++;
            }
          }
        } else if (ttl === -2) {
          // Key doesn't exist
          cleaned++;
        }
      }

      return cleaned;
    } catch (error) {
      console.error('Error cleaning up Redis sessions:', error);
      return 0;
    }
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    try {
      const pattern = `${this.keyPrefix}*`;
      const keys = await this.client.keys(pattern);
      const sessions: Session[] = [];
      const now = new Date();

      for (const key of keys) {
        const data = await this.client.get(key);
        if (data) {
          const session = JSON.parse(data) as Session;
          if (session.userId === userId && session.expiresAt > now) {
            sessions.push(session);
          }
        }
      }

      return sessions;
    } catch (error) {
      console.error('Error getting user sessions from Redis:', error);
      return [];
    }
  }

  async deleteAllUserSessions(userId: string): Promise<number> {
    try {
      const sessions = await this.getUserSessions(userId);
      let deleted = 0;

      for (const session of sessions) {
        const key = this.getKey(session.id);
        await this.client.del(key);
        deleted++;
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting user sessions from Redis:', error);
      return 0;
    }
  }

  async getAll(): Promise<Session[]> {
    try {
      const pattern = `${this.keyPrefix}*`;
      const keys = await this.client.keys(pattern);
      const sessions: Session[] = [];
      const now = new Date();

      for (const key of keys) {
        const data = await this.client.get(key);
        if (data) {
          const session = JSON.parse(data) as Session;
          if (session.expiresAt > now) {
            sessions.push(session);
          }
        }
      }

      return sessions;
    } catch (error) {
      console.error('Error getting all sessions from Redis:', error);
      return [];
    }
  }

  async getActiveCount(): Promise<number> {
    try {
      const pattern = `${this.keyPrefix}*`;
      const keys = await this.client.keys(pattern);
      let count = 0;
      const now = new Date();

      for (const key of keys) {
        const ttl = await this.client.ttl(key);
        if (ttl > 0) {
          count++;
        }
      }

      return count;
    } catch (error) {
      console.error('Error getting active session count from Redis:', error);
      return 0;
    }
  }

  async destroy(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    await this.client.quit();
  }
}

// ===== SESSION MANAGER =====

class SessionManager {
  private store: SessionStore;
  private options: SessionOptions;
  private securityOptions: SecurityOptions;
  private securityEvents: SecurityEvent[] = [];

  constructor(
    store: SessionStore,
    options: SessionOptions = {},
    securityOptions: SecurityOptions = {}
  ) {
    this.store = store;
    this.options = {
      name: 'sessionId',
      secret: crypto.randomBytes(32).toString('hex'),
      resave: true,
      saveUninitialized: false,
      rolling: false,
      cookie: {
        path: '/',
        domain: '',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 86400000, // 24 hours
        sameSite: 'lax',
      },
      ...options,
    };

    this.securityOptions = {
      rotationInterval: 1800000, // 30 minutes
      maxAge: 86400000, // 24 hours
      inactivityTimeout: 1800000, // 30 minutes
      maxSessionsPerUser: 5,
      requireDeviceFingerprint: false,
      requireIPValidation: false,
      encryptionEnabled: false,
      csrfProtection: true,
      ...securityOptions,
    };
  }

  // ===== SESSION CREATION =====

  async createSession(data: SessionData, options?: {
    userId: string;
    email: string;
    role: string;
    permissions?: string[];
    tenantId?: string;
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
    isPersistent?: boolean;
    securityLevel?: 'low' | 'medium' | 'high';
  }): Promise<Session> {
    const sessionId = this.generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (this.securityOptions.maxAge || 86400000));

    const session: Session = {
      id: sessionId,
      userId: options?.userId || data.userId || '',
      email: options?.email || data.email || '',
      role: options?.role || data.role || 'user',
      permissions: options?.permissions || data.permissions || [],
      tenantId: options?.tenantId || data.tenantId,
      deviceId: options?.deviceId || data.deviceId,
      ipAddress: options?.ipAddress || data.ipAddress,
      userAgent: options?.userAgent || data.userAgent,
      data: this.sanitizeSessionData(data),
      createdAt: now,
      updatedAt: now,
      expiresAt,
      lastAccessedAt: now,
      isActive: true,
      isPersistent: options?.isPersistent || false,
      securityLevel: options?.securityLevel || 'medium',
    };

    // Check session limits
    await this.enforceSessionLimits(session);

    // Store session
    await this.store.create(session);

    // Log security event
    this.logSecurityEvent({
      type: 'login',
      userId: session.userId,
      sessionId: session.id,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      timestamp: now,
    });

    return session;
  }

  // ===== SESSION RETRIEVAL =====

  async getSession(sessionId: string): Promise<Session | null> {
    const session = await this.store.get(sessionId);
    
    if (!session) {
      return null;
    }

    // Validate session security
    if (!this.validateSessionSecurity(session)) {
      await this.store.delete(sessionId);
      return null;
    }

    // Update last accessed time
    await this.touchSession(sessionId);

    return session;
  }

  async updateSession(sessionId: string, updates: Partial<SessionData>): Promise<Session | null> {
    const session = await this.store.get(sessionId);
    
    if (!session) {
      return null;
    }

    const sanitizedUpdates = this.sanitizeSessionData(updates);
    const updatedSession = await this.store.update(sessionId, {
      ...sanitizedUpdates,
      updatedAt: new Date(),
    });

    return updatedSession;
  }

  async touchSession(sessionId: string): Promise<boolean> {
    return await this.store.touch(sessionId);
  }

  // ===== SESSION DELETION =====

  async deleteSession(sessionId: string): Promise<boolean> {
    const session = await this.store.get(sessionId);
    
    if (session) {
      // Log security event
      this.logSecurityEvent({
        type: 'logout',
        userId: session.userId,
        sessionId: session.id,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        timestamp: new Date(),
      });
    }

    return await this.store.delete(sessionId);
  }

  async deleteAllUserSessions(userId: string): Promise<number> {
    const sessions = await this.store.getUserSessions(userId);
    
    // Log security events
    for (const session of sessions) {
      this.logSecurityEvent({
        type: 'logout',
        userId: session.userId,
        sessionId: session.id,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        timestamp: new Date(),
        details: { reason: 'logout_all_sessions' },
      });
    }

    return await this.store.deleteAllUserSessions(userId);
  }

  // ===== SESSION VALIDATION =====

  private validateSessionSecurity(session: Session): boolean {
    // Check expiration
    if (session.expiresAt < new Date()) {
      return false;
    }

    // Check inactivity timeout
    if (this.securityOptions.inactivityTimeout) {
      const inactiveTime = Date.now() - session.lastAccessedAt.getTime();
      if (inactiveTime > this.securityOptions.inactivityTimeout) {
        return false;
      }
    }

    // Check IP validation
    if (this.securityOptions.requireIPValidation && session.ipAddress) {
      // This would require current request IP to be passed in
      // Implementation depends on how this method is called
    }

    // Check device fingerprint
    if (this.securityOptions.requireDeviceFingerprint && session.deviceId) {
      // This would require current device fingerprint to be passed in
      // Implementation depends on how this method is called
    }

    return true;
  }

  private async enforceSessionLimits(session: Session): Promise<void> {
    if (!this.securityOptions.maxSessionsPerUser || !session.userId) {
      return;
    }

    const userSessions = await this.store.getUserSessions(session.userId);
    
    if (userSessions.length >= this.securityOptions.maxSessionsPerUser) {
      // Delete oldest session
      const oldestSession = userSessions
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
      
      if (oldestSession) {
        await this.store.delete(oldestSession.id);
        
        this.logSecurityEvent({
          type: 'session_hijack',
          userId: session.userId,
          sessionId: oldestSession.id,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          timestamp: new Date(),
          details: { reason: 'max_sessions_exceeded' },
        });
      }
    }
  }

  // ===== MIDDLEWARE =====

  middleware(): (req: Request, res: Response, next: NextFunction) => void {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sessionId = this.extractSessionId(req);
        
        if (!sessionId) {
          // No session, create guest session
          req.session = null;
          return next();
        }

        const session = await this.getSession(sessionId);
        
        if (!session) {
          // Invalid or expired session
          this.clearSessionCookie(res);
          req.session = null;
          return next();
        }

        // Set session on request
        req.session = session;
        
        // Update session cookie if needed
        if (this.shouldUpdateCookie(session)) {
          this.setSessionCookie(res, sessionId, session);
        }

        next();
      } catch (error) {
        console.error('Session middleware error:', error);
        req.session = null;
        next();
      }
    };
  }

  // ===== COOKIE MANAGEMENT =====

  private extractSessionId(req: Request): string | null {
    // Try to get session ID from cookie
    if (req.cookies && req.cookies[this.options.name!]) {
      return req.cookies[this.options.name!];
    }

    // Try to get session ID from header
    if (req.headers && req.headers['x-session-id']) {
      return req.headers['x-session-id'] as string;
    }

    return null;
  }

  private setSessionCookie(res: Response, sessionId: string, session: Session): void {
    const cookieOptions = {
      ...this.options.cookie,
      maxAge: Math.max(0, session.expiresAt.getTime() - Date.now()),
    };

    res.cookie(this.options.name!, sessionId, cookieOptions);
  }

  private clearSessionCookie(res: Response): void {
    res.clearCookie(this.options.name!);
  }

  private shouldUpdateCookie(session: Session): boolean {
    // Update cookie if session is close to expiration
    const timeUntilExpiration = session.expiresAt.getTime() - Date.now();
    return timeUntilExpiration < (this.securityOptions.maxAge || 86400000) * 0.1; // 10% of max age
  }

  // ===== SECURITY FEATURES =====

  generateCSRFToken(sessionId: string): string {
    return crypto
      .createHmac('sha256', this.options.secret!)
      .update(`${sessionId}:${Date.now()}`)
      .digest('hex');
  }

  validateCSRFToken(sessionId: string, token: string): boolean {
    const expectedToken = this.generateCSRFToken(sessionId);
    return crypto.timingSafeEqual(token, expectedToken);
  }

  rotateSession(sessionId: string): Promise<Session | null> {
    return this.updateSession(sessionId, {
      id: this.generateSessionId(),
      updatedAt: new Date(),
    });
  }

  // ===== UTILITY METHODS =====

  private generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private sanitizeSessionData(data: SessionData): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined) {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  private logSecurityEvent(event: SecurityEvent): void {
    this.securityEvents.push(event);
    
    // Keep only last 1000 events
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000);
    }
    
    console.log('Security event:', event);
  }

  // ===== STATISTICS =====

  async getStatistics(): Promise<SessionStatistics> {
    const allSessions = await this.store.getAll();
    const now = new Date();
    
    const activeSessions = allSessions.filter(s => s.expiresAt > now);
    const expiredSessions = allSessions.filter(s => s.expiresAt <= now);
    
    const sessionsByUser: Record<string, number> = {};
    const sessionsByRole: Record<string, number> = {};
    let totalDuration = 0;
    let oldestSession: Date | undefined;
    let newestSession: Date | undefined;
    
    for (const session of activeSessions) {
      // Count by user
      sessionsByUser[session.userId] = (sessionsByUser[session.userId] || 0) + 1;
      
      // Count by role
      sessionsByRole[session.role] = (sessionsByRole[session.role] || 0) + 1;
      
      // Calculate duration
      const duration = now.getTime() - session.createdAt.getTime();
      totalDuration += duration;
      
      // Track oldest and newest
      if (!oldestSession || session.createdAt < oldestSession) {
        oldestSession = session.createdAt;
      }
      if (!newestSession || session.createdAt > newestSession) {
        newestSession = session.createdAt;
      }
    }
    
    return {
      totalSessions: allSessions.length,
      activeSessions: activeSessions.length,
      expiredSessions: expiredSessions.length,
      sessionsByUser,
      sessionsByRole,
      averageSessionDuration: activeSessions.length > 0 ? totalDuration / activeSessions.length : 0,
      oldestSession,
      newestSession,
      securityEvents: this.securityEvents,
    };
  }

  // ===== CLEANUP =====

  async cleanup(): Promise<number> {
    return await this.store.cleanup();
  }

  async destroy(): Promise<void> {
    if (this.store.destroy) {
      await this.store.destroy();
    }
  }
}

// ===== EXERCISES =====

/*
EXERCISE 1: Create a session middleware that:
- Validates sessions on each request
- Handles session rotation automatically
- Provides security features (CSRF, IP validation)
- Supports multiple storage backends
- Is fully typed

EXERCISE 2: Build a session analytics system that:
- Tracks session usage patterns
- Monitors session security events
- Provides user behavior insights
- Detects anomalous session activity
- Is fully typed

EXERCISE 3: Create a distributed session store that:
- Supports multiple Redis instances
- Provides session replication
- Handles failover scenarios
- Implements session locking
- Is fully typed

EXERCISE 4: Build a session security system that:
- Implements advanced session validation
- Provides session hijacking detection
- Supports device fingerprinting
- Implements rate limiting
- Is fully typed

EXERCISE 5: Create a session management dashboard that:
- Displays active sessions
- Provides session control features
- Shows security events and analytics
- Supports session termination
- Is fully typed
*/

// Export classes and interfaces
export { SessionManager, MemorySessionStore, RedisSessionStore };

// Export types
export type {
  Session,
  SessionStore,
  SessionOptions,
  SessionData,
  SecurityOptions,
  SessionStatistics,
  SecurityEvent,
};