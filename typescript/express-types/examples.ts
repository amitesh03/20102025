// Express TypeScript Examples - Advanced Patterns and Best Practices
// This file demonstrates comprehensive TypeScript usage with Express.js

import express, {
  Application,
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
  ErrorRequestHandler,
  json,
  urlencoded,
  static as staticMiddleware,
} from 'express';
import { Server } from 'http';
import { z } from 'zod';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// ===== BASIC TYPES =====

// Enhanced user type with comprehensive fields
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
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

// Enhanced API response types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface ErrorResponse extends ApiResponse<never> {
  success: false;
  error: string;
  details?: {
    field?: string;
    code?: string;
    message?: string;
  }[];
  stack?: string;
}

// Enhanced pagination types
interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// Enhanced request/response types
interface AuthenticatedRequest extends Request {
  user?: User;
  token?: string;
  requestId?: string;
}

interface TypedRequest<T = any> extends Request {
  body: T;
  params?: Record<string, string>;
  query?: Record<string, any>;
}

interface TypedResponse<T = any> extends Response {
  json(data: T): TypedResponse<T>;
  status(code: number): TypedResponse<T>;
}

// Database types
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  pool?: {
    min: number;
    max: number;
    idle: number;
  };
}

interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  fields: any[];
  command: string;
}

// ===== MIDDLEWARE =====

// Enhanced authentication middleware
interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const authenticate = (
  req: AuthenticatedRequest,
  res: TypedResponse<ErrorResponse>,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.requestId || 'unknown',
          version: '1.0.0',
        },
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // Mock user lookup - in real app, fetch from database
    const user: User = {
      id: decoded.userId,
      name: 'John Doe',
      email: decoded.email,
      password: '',
      role: decoded.role as User['role'],
      isActive: true,
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          profileVisibility: 'public',
          showEmail: true,
          showPhone: false,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId || 'unknown',
        version: '1.0.0',
      },
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles: User['role'][]) => {
  return (req: AuthenticatedRequest, res: TypedResponse<ErrorResponse>, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

// Enhanced validation middleware using Zod
const validate = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: TypedResponse<ErrorResponse>, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            code: err.code,
            message: err.message,
          })),
          meta: {
            timestamp: new Date().toISOString(),
            requestId: req.requestId || 'unknown',
            version: '1.0.0',
          },
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  };
};

// Enhanced error handling middleware
const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: TypedResponse<ErrorResponse>,
  next: NextFunction
): void => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    requestId: (req as AuthenticatedRequest).requestId,
    timestamp: new Date().toISOString(),
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.message,
    });
    return;
  }

  if (error.name === 'UnauthorizedError') {
    res.status(401).json({
      success: false,
      error: 'Unauthorized access',
    });
    return;
  }

  // Generic error response
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: (req as AuthenticatedRequest).requestId || 'unknown',
      version: '1.0.0',
    },
  });
};

// Request logging middleware with structured logging
const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = uuidv4();
  (req as AuthenticatedRequest).requestId = requestId;

  const start = Date.now();
  
  // Log request
  console.log('Request:', {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  // Capture response
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    
    console.log('Response:', {
      requestId,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });

    return originalSend.call(this, data);
  };

  next();
};

// Enhanced rate limiting middleware
const createRateLimit = (options: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: {
      success: false,
      error: options.message || 'Too many requests',
      retryAfter: Math.ceil(options.windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    keyGenerator: (req) => {
      return req.ip || 'unknown';
    },
  });
};

// File upload middleware with type safety
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// ===== VALIDATION SCHEMAS =====

// User validation schemas
const createUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string()
    .email('Invalid email address')
    .transform(email => email.toLowerCase()),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  role: z.enum(['admin', 'user', 'moderator']).default('user'),
});

const updateUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .optional(),
  email: z.string()
    .email('Invalid email address')
    .transform(email => email.toLowerCase())
    .optional(),
  role: z.enum(['admin', 'user', 'moderator']).optional(),
  isActive: z.boolean().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']).optional(),
    language: z.string().min(2).max(5).optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      sms: z.boolean().optional(),
    }).optional(),
    privacy: z.object({
      profileVisibility: z.enum(['public', 'friends', 'private']).optional(),
      showEmail: z.boolean().optional(),
      showPhone: z.boolean().optional(),
    }).optional(),
  }).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

const userQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  role: z.enum(['admin', 'user', 'moderator']).optional(),
  isActive: z.coerce.boolean().optional(),
});

// ===== ROUTE HANDLERS =====

// Enhanced user CRUD handlers
const getUsers = async (
  req: TypedRequest<{}, {}, {}, userQuerySchema>,
  res: TypedResponse<PaginatedResponse<User>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', role, isActive } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Mock data - in real app, fetch from database
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: '',
        role: 'user',
        isActive: true,
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: { email: true, push: true, sms: false },
          privacy: { profileVisibility: 'public', showEmail: true, showPhone: false },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: '',
        role: 'admin',
        isActive: true,
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: { email: true, push: false, sms: true },
          privacy: { profileVisibility: 'friends', showEmail: false, showPhone: true },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    // Apply filters
    let filteredUsers = mockUsers;
    
    if (search) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    if (typeof isActive === 'boolean') {
      filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
    }
    
    // Apply sorting
    filteredUsers.sort((a, b) => {
      const aValue = a[sortBy as keyof User];
      const bValue = b[sortBy as keyof User];
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    // Apply pagination
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);
    
    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as AuthenticatedRequest).requestId || 'unknown',
        version: '1.0.0',
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (
  req: TypedRequest<{}, { id: string }>,
  res: TypedResponse<ApiResponse<User>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Mock user lookup
    const user: User | undefined = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: '',
      role: 'user',
      isActive: true,
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: { email: true, push: true, sms: false },
        privacy: { profileVisibility: 'public', showEmail: true, showPhone: false },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    if (!user || user.id !== id) {
      res.status(404).json({
        success: false,
        error: 'User not found',
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req as AuthenticatedRequest).requestId || 'unknown',
          version: '1.0.0',
        },
      });
      return;
    }
    
    res.json({
      success: true,
      data: user,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as AuthenticatedRequest).requestId || 'unknown',
        version: '1.0.0',
      },
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (
  req: TypedRequest<z.infer<typeof createUserSchema>>,
  res: TypedResponse<ApiResponse<User>>,
  next: NextFunction
): Promise<void> => {
  try {
    const userData = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Mock user creation
    const newUser: User = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      isActive: true,
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: { email: true, push: true, sms: false },
        privacy: { profileVisibility: 'public', showEmail: true, showPhone: false },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Remove password from response
    const { password, ...userResponse } = newUser;
    
    res.status(201).json({
      success: true,
      data: userResponse,
      message: 'User created successfully',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as AuthenticatedRequest).requestId || 'unknown',
        version: '1.0.0',
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (
  req: TypedRequest<z.infer<typeof updateUserSchema>, { id: string }>,
  res: TypedResponse<ApiResponse<User>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Mock user update
    const updatedUser: User = {
      id,
      name: updates.name || 'John Doe',
      email: updates.email || 'john@example.com',
      password: '',
      role: updates.role || 'user',
      isActive: updates.isActive ?? true,
      preferences: updates.preferences || {
        theme: 'light',
        language: 'en',
        notifications: { email: true, push: true, sms: false },
        privacy: { profileVisibility: 'public', showEmail: true, showPhone: false },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    res.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as AuthenticatedRequest).requestId || 'unknown',
        version: '1.0.0',
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (
  req: TypedRequest<{}, { id: string }>,
  res: TypedResponse<ApiResponse<null>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Mock user deletion
    console.log(`Deleting user with ID: ${id}`);
    
    res.json({
      success: true,
      data: null,
      message: 'User deleted successfully',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as AuthenticatedRequest).requestId || 'unknown',
        version: '1.0.0',
      },
    });
  } catch (error) {
    next(error);
  }
};

// Authentication handlers
const login = async (
  req: TypedRequest<z.infer<typeof loginSchema>>,
  res: TypedResponse<ApiResponse<{ user: Omit<User, 'password'>; token: string }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, rememberMe } = req.body;
    
    // Mock user lookup and password verification
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'user',
      isActive: true,
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: { email: true, push: true, sms: false },
        privacy: { profileVisibility: 'public', showEmail: true, showPhone: false },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const isValidPassword = await bcrypt.compare(password, mockUser.password);
    
    if (!isValidPassword || mockUser.email !== email) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req as AuthenticatedRequest).requestId || 'unknown',
          version: '1.0.0',
        },
      });
      return;
    }
    
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: rememberMe ? '30d' : '24h',
      }
    );
    
    // Remove password from response
    const { password, ...userResponse } = mockUser;
    
    res.json({
      success: true,
      data: {
        user: userResponse,
        token,
      },
      message: 'Login successful',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as AuthenticatedRequest).requestId || 'unknown',
        version: '1.0.0',
      },
    });
  } catch (error) {
    next(error);
  }
};

// File upload handler
const uploadAvatar = async (
  req: AuthenticatedRequest,
  res: TypedResponse<ApiResponse<{ url: string }>>,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
      return;
    }
    
    // Mock file upload - in real app, save to cloud storage
    const fileUrl = `https://example.com/avatars/${req.file.originalname}`;
    
    res.json({
      success: true,
      data: { url: fileUrl },
      message: 'Avatar uploaded successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ===== ROUTER SETUP =====

// Create user router with comprehensive middleware
const userRouter = Router();

// Apply middleware to router
userRouter.use(requestLogger);
userRouter.use(createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
}));

// Define routes with validation and authorization
userRouter.get('/', validate(userQuerySchema), getUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', validate(createUserSchema), createUser);
userRouter.put('/:id', authenticate, authorize('admin', 'moderator'), validate(updateUserSchema), updateUser);
userRouter.delete('/:id', authenticate, authorize('admin'), deleteUser);

// Authentication routes
userRouter.post('/login', validate(loginSchema), login);
userRouter.post('/logout', authenticate, (req, res) => {
  // Mock logout - in real app, invalidate token
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

// File upload routes
userRouter.post('/avatar', authenticate, upload.single('avatar'), uploadAvatar);

// ===== APPLICATION SETUP =====

// Create Express app with comprehensive configuration
const app: Application = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/static', staticMiddleware('public'));

// Health check endpoint
app.get('/health', (req: Request, res: TypedResponse) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
    },
  });
});

// API routes
app.use('/api/users', userRouter);

// 404 handler
app.use((req: Request, res: TypedResponse<ErrorResponse>) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    meta: {
      timestamp: new Date().toISOString(),
      requestId: (req as AuthenticatedRequest).requestId || 'unknown',
      version: '1.0.0',
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

// ===== SERVER START =====

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`${signal} received, shutting down gracefully`);
  
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ===== UTILITY FUNCTIONS =====

// Type-safe async route handler wrapper
const asyncHandler = <T = any>(
  handler: (req: Request, res: Response<T>, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req: Request, res: Response<T>, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
};

// Database connection utility
class Database {
  private config: DatabaseConfig;
  private connected: boolean = false;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    console.log(`Connecting to database at ${this.config.host}:${this.config.port}`);
    // Mock connection logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.connected = true;
    console.log('Connected to database');
  }

  async disconnect(): Promise<void> {
    console.log('Disconnecting from database');
    this.connected = false;
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    
    console.log(`Executing query: ${sql}`, params);
    
    // Mock query result
    return {
      rows: [],
      rowCount: 0,
      fields: [],
      command: sql.split(' ')[0].toUpperCase(),
    };
  }

  async transaction<T>(callback: (db: Database) => Promise<T>): Promise<T> {
    console.log('Starting transaction');
    
    try {
      const result = await callback(this);
      console.log('Transaction committed');
      return result;
    } catch (error) {
      console.log('Transaction rolled back');
      throw error;
    }
  }
}

// Environment validation
const validateEnvironment = (): void => {
  const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Required environment variable ${envVar} is missing`);
    }
  }
};

// ===== EXERCISES =====

/*
EXERCISE 1: Create a comprehensive API documentation system that:
- Generates OpenAPI/Swagger documentation from TypeScript types
- Provides interactive API explorer
- Includes request/response examples
- Supports authentication documentation
- Is fully typed

EXERCISE 2: Create a caching middleware that:
- Caches GET request responses based on URL and parameters
- Supports different cache strategies (LRU, TTL)
- Handles cache invalidation
- Provides cache statistics
- Is fully typed

EXERCISE 3: Create a file upload system that:
- Handles multiple file uploads
- Validates file types and sizes
- Stores files with unique names
- Provides progress tracking
- Supports resumable uploads

EXERCISE 4: Create an authentication system that:
- Supports multiple authentication methods (JWT, OAuth, API keys)
- Handles token refresh
- Provides role-based access control
- Includes audit logging
- Is fully typed

EXERCISE 5: Create a monitoring and logging system that:
- Provides structured logging
- Tracks performance metrics
- Monitors error rates
- Sends alerts for critical issues
- Integrates with external monitoring services
*/

// Export types and functions
export {
  // Types
  User,
  UserPreferences,
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
  PaginationParams,
  AuthenticatedRequest,
  TypedRequest,
  TypedResponse,
  DatabaseConfig,
  QueryResult,
  JwtPayload,
  
  // Middleware
  authenticate,
  authorize,
  validate,
  errorHandler,
  requestLogger,
  createRateLimit,
  upload,
  
  // Route handlers
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  uploadAvatar,
  
  // Utilities
  asyncHandler,
  Database,
  validateEnvironment,
  
  // Application
  app,
  server,
};