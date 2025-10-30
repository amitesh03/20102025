# Node.js TypeScript Examples

This folder contains comprehensive examples of using TypeScript with Node.js, demonstrating modern patterns, best practices, and advanced techniques.

## 📚 What's Included

### 1. File System Operations
- Type-safe file operations
- Directory traversal and manipulation
- Stream processing
- File watching
- Atomic operations

### 2. HTTP Server Development
- Type-safe request/response handling
- Routing and middleware
- Error handling
- Performance monitoring

### 3. Stream Processing
- Transform streams
- Pipeline operations
- Backpressure handling
- Custom stream implementations

### 4. Cryptographic Operations
- Password hashing
- Token generation
- HMAC operations
- Secure random generation

### 5. Worker Threads
- CPU-intensive task management
- Inter-thread communication
- Pool management
- Performance optimization

### 6. CLI Development
- Command parsing
- Option handling
- Help system
- Interactive interfaces

## 📁 File Structure

```
node-types/
├── README.md              # This documentation
├── examples.ts            # Comprehensive Node.js TypeScript examples
└── exercises/             # Practice exercises (coming soon)
    ├── file-system/
    ├── http-server/
    ├── streams/
    ├── crypto/
    ├── workers/
    └── cli/
```

## 🛠️ Installation

```bash
npm install -D @types/node
```

## 📖 Core Concepts

### 1. File System with TypeScript

```typescript
import { promises as fs } from 'fs';
import { join, basename } from 'path';

interface FileMetadata {
  name: string;
  path: string;
  size: number;
  created: Date;
  modified: Date;
  isDirectory: boolean;
}

async function getFileStats(filePath: string): Promise<FileMetadata> {
  const stats = await fs.stat(filePath);
  
  return {
    name: basename(filePath),
    path: filePath,
    size: stats.size,
    created: stats.birthtime,
    modified: stats.mtime,
    isDirectory: stats.isDirectory(),
  };
}
```

### 2. HTTP Server with TypeScript

```typescript
import { createServer, IncomingMessage, ServerResponse } from 'http';

interface RequestHandler {
  (req: IncomingMessage, res: ServerResponse): void | Promise<void>;
}

class SimpleServer {
  private server = createServer(this.handleRequest.bind(this));
  
  constructor(private port: number = 3000) {}
  
  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      // Route handling logic
      if (req.url === '/api/data') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Hello, TypeScript!' }));
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    } catch (error) {
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  }
  
  start(): void {
    this.server.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
```

### 3. Stream Processing

```typescript
import { Transform, pipeline } from 'stream';
import { createReadStream, createWriteStream } from 'fs';

class UppercaseTransform extends Transform {
  _transform(chunk: Buffer, encoding: BufferEncoding, callback: Function): void {
    const transformed = chunk.toString().toUpperCase();
    callback(null, transformed);
  }
}

async function processFile(inputPath: string, outputPath: string): Promise<void> {
  const readStream = createReadStream(inputPath);
  const uppercaseTransform = new UppercaseTransform();
  const writeStream = createWriteStream(outputPath);
  
  return new Promise((resolve, reject) => {
    pipeline(
      readStream,
      uppercaseTransform,
      writeStream,
      (error) => {
        if (error) reject(error);
        else resolve();
      }
    );
  });
}
```

### 4. Cryptographic Operations

```typescript
import { createHash, randomBytes, pbkdf2 } from 'crypto';

interface PasswordHash {
  hash: string;
  salt: string;
}

async function hashPassword(password: string): Promise<PasswordHash> {
  const salt = randomBytes(32).toString('hex');
  
  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      else resolve({
        hash: derivedKey.toString('hex'),
        salt,
      });
    });
  });
}

function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}
```

## 🎯 Advanced Patterns

### 1. Type-Safe File Manager

```typescript
class FileManager {
  constructor(private basePath: string) {}
  
  async readFile(filePath: string): Promise<string> {
    const fullPath = this.resolvePath(filePath);
    return await fs.readFile(fullPath, 'utf8');
  }
  
  async writeFile(filePath: string, content: string): Promise<void> {
    const fullPath = this.resolvePath(filePath);
    await fs.mkdir(dirname(fullPath), { recursive: true });
    return await fs.writeFile(fullPath, content, 'utf8');
  }
  
  private resolvePath(filePath: string): string {
    return join(this.basePath, filePath);
  }
}
```

### 2. Enhanced HTTP Server

```typescript
interface Route {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  handler: RequestHandler;
}

class AdvancedServer {
  private routes: Route[] = [];
  
  addRoute(route: Route): void {
    this.routes.push(route);
  }
  
  findRoute(method: string, path: string): Route | undefined {
    return this.routes.find(route => 
      route.method === method && route.path === path
    );
  }
  
  async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const route = this.findRoute(req.method || 'GET', req.url || '/');
    
    if (route) {
      await route.handler(req, res);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  }
}
```

### 3. Stream Pipeline

```typescript
import { pipeline, Transform } from 'stream';

class BatchProcessor extends Transform {
  private batch: any[] = [];
  
  constructor(private batchSize: number) {
    super({ objectMode: true });
  }
  
  _transform(chunk: any, encoding: string, callback: Function): void {
    this.batch.push(chunk);
    
    if (this.batch.length >= this.batchSize) {
      this.push(this.batch);
      this.batch = [];
    }
    
    callback();
  }
  
  _flush(callback: Function): void {
    if (this.batch.length > 0) {
      this.push(this.batch);
    }
    callback();
  }
}
```

### 4. Worker Thread Management

```typescript
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

class WorkerPool {
  private workers: Worker[] = [];
  private taskQueue: any[] = [];
  
  constructor(private workerScript: string, private poolSize: number) {
    if (isMainThread) {
      for (let i = 0; i < this.poolSize; i++) {
        this.workers.push(new Worker(workerScript));
      }
    }
  }
  
  async executeTask(taskData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const worker = this.getAvailableWorker();
      
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.postMessage(taskData);
    });
  }
  
  private getAvailableWorker(): Worker {
    return this.workers.find(worker => !worker.isBusy()) || this.workers[0];
  }
}
```

## 🔧 Utility Functions

### 1. Path Utilities

```typescript
import { join, dirname, extname, basename } from 'path';

class PathUtils {
  static getFileExtension(filePath: string): string {
    return extname(filePath).toLowerCase();
  }
  
  static getFileName(filePath: string): string {
    return basename(filePath, extname(filePath));
  }
  
  static getDirectoryPath(filePath: string): string {
    return dirname(filePath);
  }
  
  static normalizePath(filePath: string): string {
    return join(...filePath.split(/[/\\]/));
  }
}
```

### 2. Error Handling

```typescript
interface AppError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

class ErrorHandler {
  static createError(message: string, code: string, statusCode?: number): AppError {
    const error = new Error(message) as AppError;
    error.code = code;
    error.statusCode = statusCode;
    return error;
  }
  
  static isAppError(error: any): error is AppError {
    return error && error.code !== undefined;
  }
}
```

### 3. Performance Monitoring

```typescript
import { performance } from 'perf_hooks';

class PerformanceMonitor {
  private measurements: Map<string, number> = new Map();
  
  startTimer(label: string): void {
    this.measurements.set(label, performance.now());
  }
  
  endTimer(label: string): number {
    const startTime = this.measurements.get(label);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    this.measurements.delete(label);
    
    console.log(`${label}: ${duration.toFixed(2)}ms`);
    return duration;
  }
  
  measureFunction<T>(label: string, fn: () => T): T {
    this.startTimer(label);
    try {
      const result = fn();
      this.endTimer(label);
      return result;
    } catch (error) {
      this.endTimer(label);
      throw error;
    }
  }
}
```

## 🧪 Testing with TypeScript

### 1. File System Testing

```typescript
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

describe('FileManager', () => {
  const testDir = join(tmpdir(), 'test-file-manager');
  
  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });
  
  afterEach(async () => {
    await fs.rmdir(testDir, { recursive: true });
  });
  
  it('should write and read file correctly', async () => {
    const fileManager = new FileManager(testDir);
    const testContent = 'Hello, TypeScript!';
    const filePath = 'test.txt';
    
    await fileManager.writeFile(filePath, testContent);
    const content = await fileManager.readFile(filePath);
    
    expect(content).toBe(testContent);
  });
});
```

### 2. HTTP Server Testing

```typescript
import request from 'supertest';
import { SimpleServer } from '../server';

describe('HTTP Server', () => {
  let server: SimpleServer;
  
  beforeAll(() => {
    server = new SimpleServer(0); // Use random port for testing
    server.start();
  });
  
  afterAll(() => {
    // Cleanup
  });
  
  it('should respond to GET request', async () => {
    const response = await request(server.getServer())
      .get('/api/data')
      .expect(200);
    
    expect(response.body.message).toBe('Hello, TypeScript!');
  });
});
```

### 3. Stream Testing

```typescript
import { Readable, Writable } from 'stream';

describe('Stream Processing', () => {
  it('should transform data correctly', (done) => {
    const chunks: string[] = [];
    const transform = new UppercaseTransform();
    
    transform.on('data', (chunk) => {
      chunks.push(chunk.toString());
    });
    
    transform.on('end', () => {
      expect(chunks).toEqual(['HELLO', 'WORLD']);
      done();
    });
    
    transform.write('hello');
    transform.write('world');
    transform.end();
  });
});
```

## 📋 Best Practices

### 1. Type Safety
- Always define interfaces for data structures
- Use generic types for reusable code
- Avoid `any` type when possible
- Use discriminated unions for complex states

### 2. Error Handling
- Implement proper error boundaries
- Use custom error types
- Provide meaningful error messages
- Log errors appropriately

### 3. Performance
- Use streams for large data processing
- Implement proper resource cleanup
- Use worker threads for CPU-intensive tasks
- Monitor performance metrics

### 4. Security
- Validate all input data
- Use secure cryptographic functions
- Implement proper access controls
- Handle sensitive data carefully

## 🚀 Advanced Topics

### 1. Cluster Management
- Process clustering
- Load balancing
- Inter-process communication
- Graceful shutdown

### 2. Database Integration
- Type-safe database operations
- Connection pooling
- Transaction management
- Query builders

### 3. Caching Strategies
- In-memory caching
- Distributed caching
- Cache invalidation
- Performance optimization

### 4. Monitoring and Logging
- Structured logging
- Performance metrics
- Error tracking
- Health checks

## 🔗 Integration Examples

### 1. Express.js Integration

```typescript
import express from 'express';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

// Type-safe middleware
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// Type-safe routes
app.get('/api/users', async (req, res) => {
  const users = await getUsersFromDatabase();
  res.json({ success: true, data: users });
});
```

### 2. Database Integration

```typescript
import { Pool } from 'pg';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

class PostgreSQLClient {
  constructor(private config: DatabaseConfig) {}
  
  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    const pool = new Pool(this.config);
    const result = await pool.query(sql, params);
    await pool.end();
    return result.rows;
  }
}
```

### 3. Redis Integration

```typescript
import Redis from 'ioredis';

class CacheClient {
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
}
```

## 📚 Additional Resources

### Official Documentation
- [Node.js Documentation](https://nodejs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js TypeScript Support](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node)

### Community Resources
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [TypeScript Node.js Examples](https://github.com/microsoft/TypeScript-Node-Starter)
- [Awesome Node.js](https://github.com/sindresorhus/awesome-nodejs)

### Tools and Libraries
- [ts-node](https://github.com/TypeStrong/ts-node) - TypeScript execution
- [nodemon](https://nodemon.io/) - Development auto-restart
- [PM2](https://pm2.keymetrics.io/) - Process management
- [Winston](https://github.com/winstonjs/winston) - Logging

## 🤝 Contributing

When contributing to this examples repository:

1. Follow Node.js and TypeScript best practices
2. Include comprehensive type definitions
3. Add JSDoc comments for complex functions
4. Provide usage examples
5. Ensure all examples are testable

## 📄 License

This project is for educational purposes and follows MIT license.