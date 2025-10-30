# Express TypeScript Examples

This folder contains comprehensive examples of using TypeScript with Express.js, demonstrating modern patterns, best practices, and advanced techniques.

## 📚 What's Included

### 1. Type Safety
- Strongly typed request/response objects
- Generic route handlers
- Type-safe middleware
- Comprehensive error handling

### 2. Middleware Patterns
- Authentication and authorization
- Request validation with Zod
- Error handling middleware
- Rate limiting and security

### 3. API Design
- RESTful API patterns
- Pagination and filtering
- File upload handling
- Response standardization

### 4. Advanced Features
- Database integration
- Caching strategies
- Monitoring and logging
- Performance optimization

## 📁 File Structure

```
express-types/
├── README.md              # This documentation
├── examples.ts            # Comprehensive Express TypeScript examples
└── exercises/             # Practice exercises (coming soon)
    ├── middleware/
    ├── routes/
    ├── validation/
    └── advanced-patterns/
```

## 🛠️ Installation

```bash
npm install express
npm install -D @types/express @types/node

# Additional dependencies for examples
npm install cors helmet compression morgan express-rate-limit multer
npm install jsonwebtoken bcrypt zod uuid
npm install -D @types/cors @types/helmet @types/compression 
npm install -D @types/morgan @types/multer @types/jsonwebtoken 
npm install -D @types/bcrypt @types/uuid
```

## 📖 Core Concepts

### 1. Basic Express Setup with TypeScript

```typescript
import express, { Application, Request, Response } from 'express';

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, TypeScript!' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### 2. Typed Request/Response

```typescript
interface TypedRequest<T = any> extends Request {
  body: T;
  params?: Record<string, string>;
  query?: Record<string, any>;
}

interface TypedResponse<T = any> extends Response {
  json(data: T): TypedResponse<T>;
  status(code: number): TypedResponse<T>;
}

// Usage
const handler = (req: TypedRequest<{ name: string }>, res: TypedResponse) => {
  const { name } = req.body;
  res.json({ message: `Hello, ${name}!` });
};
```

### 3. Generic Route Handlers

```typescript
type AsyncRequestHandler<T = any> = (
  req: Request,
  res: Response<T>,
  next: NextFunction
) => Promise<void>;

const asyncHandler = <T = any>(handler: AsyncRequestHandler<T>): RequestHandler => {
  return (req: Request, res: Response<T>, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
};

// Usage
app.get('/users', asyncHandler(async (req, res) => {
  const users = await getUsersFromDatabase();
  res.json(users);
}));
```

## 🎯 Advanced Patterns

### 1. Authentication Middleware

```typescript
interface AuthenticatedRequest extends Request {
  user?: User;
  token?: string;
}

const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = await getUserById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 2. Validation Middleware with Zod

```typescript
import { z } from 'zod';

const validate = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
      } else {
        next(error);
      }
    }
  };
};

// Usage
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

app.post('/users', validate(userSchema), createUserHandler);
```

### 3. Error Handling

```typescript
interface ErrorResponse {
  success: false;
  error: string;
  details?: any;
  stack?: string;
}

const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  console.error('Error:', error);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};

app.use(errorHandler);
```

### 4. Type-Safe Database Integration

```typescript
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  fields: any[];
}

class Database {
  constructor(private config: DatabaseConfig) {}
  
  async connect(): Promise<void> {
    // Connection logic
  }
  
  async query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    // Query execution
    return { rows: [], rowCount: 0, fields: [] };
  }
  
  async transaction<T>(callback: (db: Database) => Promise<T>): Promise<T> {
    // Transaction logic
    return callback(this);
  }
}
```

## 🔧 Middleware Patterns

### 1. Request Logging

```typescript
const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);
  
  next();
};
```

### 2. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const createRateLimit = (options: {
  windowMs: number;
  max: number;
  message?: string;
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
  });
};

// Usage
app.use('/api/', createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));
```

### 3. CORS Configuration

```typescript
import cors from 'cors';

const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

## 📋 API Design Patterns

### 1. Standardized Response Format

```typescript
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

const sendSuccess = <T>(res: Response, data: T, message?: string): void => {
  res.json({
    success: true,
    data,
    message,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || 'unknown',
      version: '1.0.0',
    },
  });
};

const sendError = (res: Response, error: string, statusCode: number = 400): void => {
  res.status(statusCode).json({
    success: false,
    error,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || 'unknown',
      version: '1.0.0',
    },
  });
};
```

### 2. Pagination

```typescript
interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

const getPaginationParams = (query: any): PaginationParams => {
  return {
    page: parseInt(query.page) || 1,
    limit: parseInt(query.limit) || 10,
    offset: parseInt(query.offset) || 0,
    sortBy: query.sortBy || 'createdAt',
    sortOrder: query.sortOrder || 'desc',
    search: query.search,
  };
};

const paginateResults = <T>(
  results: T[],
  page: number,
  limit: number
): { data: T[]; pagination: any } => {
  const offset = (page - 1) * limit;
  const paginatedData = results.slice(offset, offset + limit);
  const total = results.length;
  const totalPages = Math.ceil(total / limit);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};
```

### 3. File Upload

```typescript
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    cb(null, allowedTypes.includes(file.mimetype));
  },
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Process file
  res.json({
    success: true,
    data: {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
});
```

## 🧪 Testing with TypeScript

### 1. Unit Testing Routes

```typescript
import request from 'supertest';
import { app } from '../app';

describe('User Routes', () => {
  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data).not.toHaveProperty('password');
    });
  });
});
```

### 2. Middleware Testing

```typescript
import { Request, Response, NextFunction } from 'express';

describe('Authentication Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  it('should pass with valid token', async () => {
    mockRequest.headers = {
      authorization: 'Bearer valid-token',
    };
    
    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should reject with missing token', async () => {
    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'No token provided',
    });
  });
});
```

## 📋 Best Practices

### 1. Type Safety
- Always define interfaces for request/response
- Use generic types for reusable handlers
- Avoid `any` type when possible
- Use discriminated unions for complex states

### 2. Error Handling
- Implement global error handler
- Use consistent error response format
- Log errors appropriately
- Provide meaningful error messages

### 3. Security
- Use helmet for security headers
- Implement rate limiting
- Validate all input data
- Use HTTPS in production

### 4. Performance
- Use compression middleware
- Implement caching strategies
- Optimize database queries
- Monitor performance metrics

## 🚀 Advanced Topics

### 1. Microservices
- Service discovery
- Inter-service communication
- Load balancing
- Circuit breakers

### 2. GraphQL Integration
- Type-safe GraphQL schemas
- Resolver patterns
- Query optimization
- Authentication

### 3. Real-time Features
- WebSocket integration
- Server-sent events
- Event-driven architecture
- Scaling strategies

### 4. Deployment
- Docker configuration
- Environment management
- Health checks
- Monitoring

## 🔗 Integration Examples

### 1. Database Integration

```typescript
import { Pool } from 'pg';

interface Database {
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  transaction<T>(callback: (db: Database) => Promise<T>): Promise<T>;
}

class PostgreSQLDatabase implements Database {
  constructor(private pool: Pool) {}
  
  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    const result = await this.pool.query(sql, params);
    return result.rows;
  }
  
  async transaction<T>(callback: (db: Database) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(this);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
```

### 2. Redis Caching

```typescript
import Redis from 'ioredis';

interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}

class RedisCache implements CacheService {
  constructor(private redis: Redis) {}
  
  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }
  
  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
  
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
  
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }
}
```

## 📚 Additional Resources

### Official Documentation
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

### Community Resources
- [Express TypeScript Guide](https://github.com/expressjs/express/blob/master/Readme.md#typescript)
- [Awesome Express](https://github.com/expressjs/awesome-express)
- [TypeScript Express Examples](https://github.com/ljlmwls/express-typescript-example)

### Tools and Libraries
- [Zod](https://zod.dev/) - Schema validation
- [Prisma](https://www.prisma.io/) - Type-safe database ORM
- [Objection.js](https://vincit.github.io/objection.js/) - TypeScript ORM
- [Fastify](https://www.fastify.io/) - Alternative to Express with better TypeScript support

## 🤝 Contributing

When contributing to this examples repository:

1. Follow Express and TypeScript best practices
2. Include comprehensive type definitions
3. Add JSDoc comments for complex types
4. Provide usage examples
5. Ensure all examples are testable

## 📄 License

This project is for educational purposes and follows MIT license.