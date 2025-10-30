// tRPC TypeScript Examples - Advanced End-to-End Type Safety
// This file demonstrates comprehensive TypeScript usage with tRPC

import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { WebSocketServer } from 'ws';
import { applyWSSHandler } from '@trpc/server/adapters/ws';

// ===== BASIC TYPES =====

// tRPC context interface
interface TRPCContext {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'user' | 'moderator';
  };
  prisma: PrismaClient;
  requestId: string;
  startTime: number;
}

// tRPC meta interface
interface TRPCMeta {
  // Add any meta information you want to track
  requestId?: string;
  userId?: string;
  operation?: string;
  duration?: number;
}

// tRPC error types
interface TRPCErrors {
  NOT_FOUND: {
    code: 'NOT_FOUND';
    message: string;
  };
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED';
    message: string;
  };
  FORBIDDEN: {
    code: 'FORBIDDEN';
    message: string;
  };
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR';
    message: string;
    field?: string;
  };
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR';
    message: string;
  };
}

// tRPC configuration
interface TRPCConfig {
  createContext?: (opts: any) => Promise<TRPCContext>;
  transformer?: any;
  errorFormatter?: (opts: any) => any;
  onError?: (opts: any) => void;
  onMeta?: (opts: any) => void;
}

// ===== TPRC MANAGER =====

class TRPCManager {
  private t: ReturnType<typeof initTRPC.create<TRPCContext, TRPCMeta>>;
  private config: TRPCConfig;
  private procedures: Map<string, any> = new Map();
  private middleware: Map<string, any> = new Map();

  constructor(config: TRPCConfig = {}) {
    this.config = config;
    this.t = initTRPC.context<TRPCContext>().meta<TRPCMeta>().create({
      transformer: config.transformer,
      errorFormatter: config.errorFormatter,
      onError: config.onError,
      onMeta: config.onMeta,
    });
  }

  // ===== MIDDLEWARE =====

  // Create authentication middleware
  createAuthMiddleware() {
    return this.t.middleware(async ({ next, ctx }) => {
      // Mock authentication - in real app, verify JWT/session
      const token = ctx.req?.headers?.authorization?.replace('Bearer ', '');
      
      if (!token) {
        throw new Error('Unauthorized');
      }

      // Mock user verification
      const user = await this.verifyToken(token);
      if (!user) {
        throw new Error('Invalid token');
      }

      ctx.user = user;
      return next({
        ctx: {
          ...ctx,
          user,
        },
      });
    });
  }

  // Create logging middleware
  createLoggingMiddleware() {
    return this.t.middleware(async ({ next, path, type, rawInput, ctx }) => {
      const start = Date.now();
      const requestId = Math.random().toString(36).substr(2, 9);
      
      console.log(`[${requestId}] ${type.toUpperCase()} ${path}`, {
        input: rawInput,
        user: ctx.user?.id,
      });

      try {
        const result = await next({
          ctx: {
            ...ctx,
            requestId,
            startTime: start,
          },
        });

        const duration = Date.now() - start;
        console.log(`[${requestId}] ${type.toUpperCase()} ${path} completed in ${duration}ms`);

        return result;
      } catch (error) {
        const duration = Date.now() - start;
        console.error(`[${requestId}] ${type.toUpperCase()} ${path} failed in ${duration}ms:`, error);
        throw error;
      }
    });
  }

  // Create rate limiting middleware
  createRateLimitMiddleware(options: {
    windowMs: number;
    max: number;
    message?: string;
  }) {
    const requests = new Map<string, { count: number; resetTime: number }>();

    return this.t.middleware(async ({ next, ctx }) => {
      const clientId = ctx.req?.headers?.['x-forwarded-for'] || 
                     ctx.req?.socket?.remoteAddress || 
                     'unknown';
      
      const now = Date.now();
      const client = requests.get(clientId);

      if (!client || now > client.resetTime) {
        requests.set(clientId, {
          count: 1,
          resetTime: now + options.windowMs,
        });
      } else {
        client.count++;
        
        if (client.count > options.max) {
          throw new Error(options.message || 'Rate limit exceeded');
        }
      }

      return next();
    });
  }

  // Create validation middleware
  createValidationMiddleware(schema: z.ZodSchema) {
    return this.t.middleware(async ({ next, rawInput }) => {
      try {
        const validated = schema.parse(rawInput);
        return next({
          rawInput: validated,
        });
      } catch (error) {
        throw new Error(`Validation error: ${error.message}`);
      }
    });
  }

  // ===== PROCEDURES =====

  // Create user procedures
  createUserProcedures() {
    return this.t.router({
      // Get user by ID
      getById: this.t.procedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
          const user = await ctx.prisma.user.findUnique({
            where: { id: input.id },
          });

          if (!user) {
            throw new Error('User not found');
          }

          return user;
        }),

      // Create user
      create: this.t.procedure
        .input(z.object({
          email: z.string().email(),
          name: z.string().min(1),
          role: z.enum(['admin', 'user', 'moderator']),
        }))
        .mutation(async ({ input, ctx }) => {
          const user = await ctx.prisma.user.create({
            data: {
              ...input,
              createdAt: new Date(),
            },
          });

          return user;
        }),

      // Update user
      update: this.t.procedure
        .input(z.object({
          id: z.string(),
          data: z.object({
            email: z.string().email().optional(),
            name: z.string().min(1).optional(),
            role: z.enum(['admin', 'user', 'moderator']).optional(),
          }),
        }))
        .use(this.createAuthMiddleware())
        .mutation(async ({ input, ctx }) => {
          const { id, data } = input;
          
          // Check if user can update this record
          if (ctx.user?.role !== 'admin' && ctx.user?.id !== id) {
            throw new Error('Forbidden');
          }

          const user = await ctx.prisma.user.update({
            where: { id },
            data: {
              ...data,
              updatedAt: new Date(),
            },
          });

          return user;
        }),

      // Delete user
      delete: this.t.procedure
        .input(z.object({ id: z.string() }))
        .use(this.createAuthMiddleware())
        .mutation(async ({ input, ctx }) => {
          const { id } = input;
          
          // Check if user can delete this record
          if (ctx.user?.role !== 'admin' && ctx.user?.id !== id) {
            throw new Error('Forbidden');
          }

          await ctx.prisma.user.delete({
            where: { id },
          });

          return { success: true };
        }),

      // List users
      list: this.t.procedure
        .input(z.object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(10),
          search: z.string().optional(),
          role: z.enum(['admin', 'user', 'moderator']).optional(),
        }))
        .query(async ({ input, ctx }) => {
          const { page, limit, search, role } = input;
          const skip = (page - 1) * limit;

          const where: any = {};
          
          if (search) {
            where.OR = [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ];
          }
          
          if (role) {
            where.role = role;
          }

          const [users, total] = await Promise.all([
            ctx.prisma.user.findMany({
              where,
              skip,
              take: limit,
              orderBy: { createdAt: 'desc' },
            }),
            ctx.prisma.user.count({ where }),
          ]);

          return {
            users,
            pagination: {
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit),
            },
          };
        }),
    });
  }

  // Create post procedures
  createPostProcedures() {
    return this.t.router({
      // Get post by ID
      getById: this.t.procedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
          const post = await ctx.prisma.post.findUnique({
            where: { id: input.id },
            include: {
              author: true,
              comments: true,
            },
          });

          if (!post) {
            throw new Error('Post not found');
          }

          return post;
        }),

      // Create post
      create: this.t.procedure
        .input(z.object({
          title: z.string().min(1).max(200),
          content: z.string().min(1),
          published: z.boolean().default(false),
        }))
        .use(this.createAuthMiddleware())
        .mutation(async ({ input, ctx }) => {
          const post = await ctx.prisma.post.create({
            data: {
              ...input,
              authorId: ctx.user!.id,
              createdAt: new Date(),
            },
            include: {
              author: true,
            },
          });

          return post;
        }),

      // Update post
      update: this.t.procedure
        .input(z.object({
          id: z.string(),
          data: z.object({
            title: z.string().min(1).max(200).optional(),
            content: z.string().min(1).optional(),
            published: z.boolean().optional(),
          }),
        }))
        .use(this.createAuthMiddleware())
        .mutation(async ({ input, ctx }) => {
          const { id, data } = input;
          
          const post = await ctx.prisma.post.findUnique({
            where: { id },
          });

          if (!post) {
            throw new Error('Post not found');
          }

          // Check if user can update this post
          if (ctx.user?.role !== 'admin' && post.authorId !== ctx.user?.id) {
            throw new Error('Forbidden');
          }

          const updatedPost = await ctx.prisma.post.update({
            where: { id },
            data: {
              ...data,
              updatedAt: new Date(),
            },
            include: {
              author: true,
            },
          });

          return updatedPost;
        }),

      // Delete post
      delete: this.t.procedure
        .input(z.object({ id: z.string() }))
        .use(this.createAuthMiddleware())
        .mutation(async ({ input, ctx }) => {
          const { id } = input;
          
          const post = await ctx.prisma.post.findUnique({
            where: { id },
          });

          if (!post) {
            throw new Error('Post not found');
          }

          // Check if user can delete this post
          if (ctx.user?.role !== 'admin' && post.authorId !== ctx.user?.id) {
            throw new Error('Forbidden');
          }

          await ctx.prisma.post.delete({
            where: { id },
          });

          return { success: true };
        }),

      // List posts
      list: this.t.procedure
        .input(z.object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(10),
          search: z.string().optional(),
          published: z.boolean().optional(),
          authorId: z.string().optional(),
        }))
        .query(async ({ input, ctx }) => {
          const { page, limit, search, published, authorId } = input;
          const skip = (page - 1) * limit;

          const where: any = {};
          
          if (search) {
            where.OR = [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ];
          }
          
          if (published !== undefined) {
            where.published = published;
          }
          
          if (authorId) {
            where.authorId = authorId;
          }

          const [posts, total] = await Promise.all([
            ctx.prisma.post.findMany({
              where,
              skip,
              take: limit,
              orderBy: { createdAt: 'desc' },
              include: {
                author: true,
                _count: {
                  select: { comments: true },
                },
              },
            }),
            ctx.prisma.post.count({ where }),
          ]);

          return {
            posts,
            pagination: {
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit),
            },
          };
        }),
    });
  }

  // Create real-time procedures
  createRealtimeProcedures() {
    return this.t.router({
      // Subscribe to posts
      onPostUpdate: this.t.procedure
        .input(z.object({ postId: z.string().optional() }))
        .subscription(({ input }) => {
          return observable<{ type: 'created' | 'updated' | 'deleted'; post: any }>((emit) => {
            // Mock real-time updates
            const interval = setInterval(() => {
              emit({
                type: 'updated',
                post: { id: input.postId, title: 'Updated Post', content: 'Updated content' },
              });
            }, 5000);

            return () => {
              clearInterval(interval);
            };
          });
        }),

      // Subscribe to user updates
      onUserUpdate: this.t.procedure
        .input(z.object({ userId: z.string() }))
        .subscription(({ input }) => {
          return observable<{ type: 'updated'; user: any }>((emit) => {
            // Mock user updates
            const interval = setInterval(() => {
              emit({
                type: 'updated',
                user: { id: input.userId, name: 'Updated Name', email: 'updated@example.com' },
              });
            }, 10000);

            return () => {
              clearInterval(interval);
            };
          });
        }),
    });
  }

  // ===== ROUTER COMPOSITION =====

  // Create main app router
  createAppRouter() {
    return this.t.router({
      users: this.createUserProcedures(),
      posts: this.createPostProcedures(),
      realtime: this.createRealtimeProcedures(),
    });
  }

  // Create admin router with middleware
  createAdminRouter() {
    return this.t.router({
      // Admin-only procedures
      getUsers: this.t.procedure
        .input(z.object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(10),
        }))
        .use(this.createAuthMiddleware())
        .use(this.t.middleware(({ next, ctx }) => {
          if (ctx.user?.role !== 'admin') {
            throw new Error('Admin access required');
          }
          return next();
        }))
        .query(async ({ input, ctx }) => {
          const { page, limit } = input;
          const skip = (page - 1) * limit;

          const [users, total] = await Promise.all([
            ctx.prisma.user.findMany({
              skip,
              take: limit,
              orderBy: { createdAt: 'desc' },
            }),
            ctx.prisma.user.count(),
          ]);

          return {
            users,
            pagination: {
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit),
            },
          };
        }),

      // System stats
      getStats: this.t.procedure
        .use(this.createAuthMiddleware())
        .use(this.t.middleware(({ next, ctx }) => {
          if (ctx.user?.role !== 'admin') {
            throw new Error('Admin access required');
          }
          return next();
        }))
        .query(async ({ ctx }) => {
          const [userCount, postCount, commentCount] = await Promise.all([
            ctx.prisma.user.count(),
            ctx.prisma.post.count(),
            ctx.prisma.comment.count(),
          ]);

          return {
            users: userCount,
            posts: postCount,
            comments: commentCount,
          };
        }),
    });
  }

  // ===== SERVER SETUP =====

  // Create HTTP server
  createHTTPServer() {
    const appRouter = this.createAppRouter();
    
    return createHTTPServer({
      router: appRouter,
      createContext: this.config.createContext || this.createDefaultContext,
    });
  }

  // Create WebSocket server
  createWebSocketServer(httpServer: any) {
    const appRouter = this.createAppRouter();
    
    const wss = new WebSocketServer({ server: httpServer });
    applyWSSHandler({ wss, router: appRouter });
    
    return wss;
  }

  // ===== UTILITY METHODS =====

  // Create default context
  private async createDefaultContext(opts: any): Promise<TRPCContext> {
    const prisma = new PrismaClient();
    
    return {
      prisma,
      requestId: Math.random().toString(36).substr(2, 9),
      startTime: Date.now(),
    };
  }

  // Verify token (mock implementation)
  private async verifyToken(token: string): Promise<TRPCContext['user']> {
    // In real implementation, verify JWT with proper library
    if (token === 'valid-token') {
      return {
        id: 'user-123',
        email: 'user@example.com',
        role: 'user',
      };
    }
    
    if (token === 'admin-token') {
      return {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'admin',
      };
    }
    
    return null;
  }

  // Get router
  getRouter() {
    return this.createAppRouter();
  }

  // Get procedures
  getProcedures() {
    return Array.from(this.procedures.entries());
  }

  // Get middleware
  getMiddleware() {
    return Array.from(this.middleware.entries());
  }
}

// ===== TPRC SERVICE =====

class TRPCService {
  private manager: TRPCManager;
  private server: any;
  private wss: any;

  constructor(config: TRPCConfig = {}) {
    this.manager = new TRPCManager(config);
  }

  // Initialize service
  async initialize(port: number = 3000): Promise<void> {
    // Create HTTP server
    this.server = this.manager.createHTTPServer();
    
    // Create WebSocket server
    this.wss = this.manager.createWebSocketServer(this.server);
    
    // Start server
    this.server.listen(port);
    console.log(`tRPC server started on port ${port}`);
  }

  // Shutdown service
  async shutdown(): Promise<void> {
    if (this.wss) {
      this.wss.close();
    }
    
    if (this.server) {
      this.server.close();
    }
    
    console.log('tRPC server stopped');
  }

  // Get manager
  getManager(): TRPCManager {
    return this.manager;
  }

  // Get router
  getRouter() {
    return this.manager.getRouter();
  }
}

// ===== CLIENT EXAMPLES =====

// tRPC client setup
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

class TRPCClient {
  private client: any;

  constructor(url: string) {
    this.client = createTRPCProxyClient<any, any>({
      links: [
        httpBatchLink({
          url: `${url}/trpc`,
        }),
      ],
    });
  }

  // User operations
  async getUser(id: string) {
    return await this.client.users.getById.query({ id });
  }

  async createUser(userData: any) {
    return await this.client.users.create.mutate(userData);
  }

  async updateUser(id: string, data: any) {
    return await this.client.users.update.mutate({ id, data });
  }

  async deleteUser(id: string) {
    return await this.client.users.delete.mutate({ id });
  }

  async listUsers(params: any) {
    return await this.client.users.list.query(params);
  }

  // Post operations
  async getPost(id: string) {
    return await this.client.posts.getById.query({ id });
  }

  async createPost(postData: any) {
    return await this.client.posts.create.mutate(postData);
  }

  async updatePost(id: string, data: any) {
    return await this.client.posts.update.mutate({ id, data });
  }

  async deletePost(id: string) {
    return await this.client.posts.delete.mutate({ id });
  }

  async listPosts(params: any) {
    return await this.client.posts.list.query(params);
  }

  // Real-time subscriptions
  subscribeToPostUpdates(postId?: string) {
    return this.client.realtime.onPostUpdate.subscribe({ postId });
  }

  subscribeToUserUpdates(userId: string) {
    return this.client.realtime.onUserUpdate.subscribe({ userId });
  }
}

// ===== EXERCISES =====

/*
EXERCISE 1: Create a tRPC plugin system that:
- Supports custom middleware
- Provides procedure decorators
- Implements plugin configuration
- Supports plugin distribution
- Is fully typed

EXERCISE 2: Build a tRPC testing framework that:
- Generates test cases from procedures
- Supports multiple testing frameworks
- Provides test data generation
- Implements test reporting
- Is fully typed

EXERCISE 3: Create a tRPC monitoring system that:
- Tracks procedure calls and performance
- Provides usage analytics
- Monitors error rates
- Supports custom metrics collection
- Is fully typed

EXERCISE 4: Build a tRPC documentation system that:
- Generates documentation from procedures
- Supports interactive documentation
- Implements procedure testing
- Supports versioning
- Is fully typed

EXERCISE 5: Create a tRPC multi-tenant system that:
- Supports tenant isolation
- Provides tenant-specific procedures
- Implements tenant routing
- Supports tenant monitoring
- Is fully typed
*/

// Export classes and interfaces
export { TRPCManager, TRPCService, TRPCClient };

// Export types
export type {
  TRPCContext,
  TRPCMeta,
  TRPCErrors,
  TRPCConfig,
};