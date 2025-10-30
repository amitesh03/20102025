// Node.js TypeScript Examples - Advanced Patterns and Best Practices
// This file demonstrates comprehensive TypeScript usage with Node.js APIs and common patterns

import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdir,
  readFile,
  writeFile,
  stat,
  unlink,
  rename,
  copyFile,
  createReadStream,
  createWriteStream,
  watch,
  watchFile,
  unwatchFile,
  promises as fsPromises,
} from 'fs';
import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import { createServer as createHttpsServer } from 'https';
import { createReadStream, ReadStream, WriteStream } from 'fs';
import { join, dirname, extname, basename, resolve, isAbsolute, relative } from 'path';
import { promisify } from 'util';
import { EventEmitter } from 'events';
import { createInterface, Interface } from 'readline';
import { createGunzip, createGzip, gunzipSync, gzipSync } from 'zlib';
import { Transform, pipeline, PassThrough } from 'stream';
import { createHash, randomBytes, pbkdf2, scrypt, timingSafeEqual } from 'crypto';
import { URL, URLSearchParams } from 'url';
import { performance } from 'perf_hooks';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { createReadStream as createFileReadStream, createWriteStream as createFileWriteStream } from 'fs';

// ===== FILE SYSTEM OPERATIONS =====

// Enhanced file metadata with comprehensive typing
interface FileMetadata {
  name: string;
  path: string;
  size: number;
  created: Date;
  modified: Date;
  accessed: Date;
  isDirectory: boolean;
  isFile: boolean;
  extension: string;
  mimeType?: string;
  encoding?: BufferEncoding;
  permissions: {
    owner: string;
    group: string;
    mode: string;
    readable: boolean;
    writable: boolean;
    executable: boolean;
  };
  checksum?: string;
}

// Enhanced directory listing options
interface DirectoryOptions {
  recursive?: boolean;
  includeHidden?: boolean;
  filter?: RegExp | ((file: string) => boolean);
  sortBy?: 'name' | 'size' | 'created' | 'modified';
  sortOrder?: 'asc' | 'desc';
  maxDepth?: number;
}

// File operation result with error handling
interface FileOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  path?: string;
  operation: string;
  timestamp: Date;
}

// Advanced file operations with type safety
class FileManager {
  private basePath: string;

  constructor(basePath: string = './') {
    this.basePath = resolve(basePath);
  }

  // Get comprehensive file metadata
  async getFileStats(filePath: string): Promise<FileOperationResult<FileMetadata>> {
    try {
      const fullPath = this.resolvePath(filePath);
      const stats = await fsPromises.stat(fullPath);
      const parsedPath = this.parsePath(fullPath);
      
      const metadata: FileMetadata = {
        name: parsedPath.name,
        path: fullPath,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        accessed: stats.atime,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
        extension: parsedPath.extension,
        mimeType: this.getMimeType(parsedPath.extension),
        permissions: this.parsePermissions(stats.mode),
      };

      // Calculate checksum for files
      if (stats.isFile()) {
        metadata.checksum = await this.calculateChecksum(fullPath);
      }

      return {
        success: true,
        data: metadata,
        operation: 'getFileStats',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        path: filePath,
        operation: 'getFileStats',
        timestamp: new Date(),
      };
    }
  }

  // Advanced directory listing with options
  async listDirectory(
    dirPath: string,
    options: DirectoryOptions = {}
  ): Promise<FileOperationResult<FileMetadata[]>> {
    try {
      const fullPath = this.resolvePath(dirPath);
      const {
        recursive = false,
        includeHidden = false,
        filter,
        sortBy = 'name',
        sortOrder = 'asc',
        maxDepth = Infinity,
      } = options;

      const items: FileMetadata[] = [];
      
      const processDirectory = async (currentPath: string, depth: number = 0): Promise<void> => {
        if (depth > maxDepth) return;

        const entries = await fsPromises.readdir(currentPath, { withFileTypes: true });
        
        for (const entry of entries) {
          const entryPath = join(currentPath, entry.name);
          
          // Skip hidden files if not included
          if (!includeHidden && entry.name.startsWith('.')) continue;
          
          // Apply filter if provided
          if (filter && !filter(entry.name)) continue;

          const stats = await fsPromises.stat(entryPath);
          const parsedPath = this.parsePath(entryPath);
          
          const metadata: FileMetadata = {
            name: entry.name,
            path: entryPath,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            accessed: stats.atime,
            isDirectory: entry.isDirectory(),
            isFile: entry.isFile(),
            extension: parsedPath.extension,
            mimeType: this.getMimeType(parsedPath.extension),
            permissions: this.parsePermissions(stats.mode),
          };

          items.push(metadata);

          // Recursively process subdirectories
          if (recursive && entry.isDirectory()) {
            await processDirectory(entryPath, depth + 1);
          }
        }
      };

      await processDirectory(fullPath);

      // Sort results
      items.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      return {
        success: true,
        data: items,
        operation: 'listDirectory',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        path: dirPath,
        operation: 'listDirectory',
        timestamp: new Date(),
      };
    }
  }

  // Safe file reading with encoding detection
  async readFile(
    filePath: string,
    options: {
      encoding?: BufferEncoding;
      fallbackEncodings?: BufferEncoding[];
    } = {}
  ): Promise<FileOperationResult<string | Buffer>> {
    try {
      const fullPath = this.resolvePath(filePath);
      const { encoding = 'utf8', fallbackEncodings = ['latin1', 'ascii'] } = options;

      // Try specified encoding first
      try {
        const content = await fsPromises.readFile(fullPath, encoding);
        return {
          success: true,
          data: content,
          operation: 'readFile',
          timestamp: new Date(),
        };
      } catch (error) {
        // Try fallback encodings
        for (const fallbackEncoding of fallbackEncodings) {
          try {
            const content = await fsPromises.readFile(fullPath, fallbackEncoding);
            return {
              success: true,
              data: content,
              operation: 'readFile',
              timestamp: new Date(),
            };
          } catch {
            continue;
          }
        }
        
        // Return as buffer if all encodings fail
        const buffer = await fsPromises.readFile(fullPath);
        return {
          success: true,
          data: buffer,
          operation: 'readFile',
          timestamp: new Date(),
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        path: filePath,
        operation: 'readFile',
        timestamp: new Date(),
      };
    }
  }

  // Atomic file writing with backup
  async writeFile(
    filePath: string,
    content: string | Buffer,
    options: {
      encoding?: BufferEncoding;
      createBackup?: boolean;
      atomic?: boolean;
    } = {}
  ): Promise<FileOperationResult<void>> {
    try {
      const fullPath = this.resolvePath(filePath);
      const { encoding = 'utf8', createBackup = true, atomic = true } = options;

      // Create backup if file exists
      if (createBackup && existsSync(fullPath)) {
        const backupPath = `${fullPath}.backup.${Date.now()}`;
        await fsPromises.copyFile(fullPath, backupPath);
      }

      if (atomic) {
        // Write to temporary file first, then rename
        const tempPath = `${fullPath}.tmp.${Date.now()}`;
        await fsPromises.writeFile(tempPath, content, encoding);
        await fsPromises.rename(tempPath, fullPath);
      } else {
        await fsPromises.writeFile(fullPath, content, encoding);
      }

      return {
        success: true,
        operation: 'writeFile',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        path: filePath,
        operation: 'writeFile',
        timestamp: new Date(),
      };
    }
  }

  // File copying with progress tracking
  async copyFile(
    sourcePath: string,
    destinationPath: string,
    options: {
      overwrite?: boolean;
      preserveTimestamps?: boolean;
      onProgress?: (bytesCopied: number, totalBytes: number) => void;
    } = {}
  ): Promise<FileOperationResult<void>> {
    try {
      const fullSourcePath = this.resolvePath(sourcePath);
      const fullDestPath = this.resolvePath(destinationPath);
      const { overwrite = false, preserveTimestamps = true, onProgress } = options;

      // Check if destination exists
      if (!overwrite && existsSync(fullDestPath)) {
        throw new Error('Destination file already exists');
      }

      // Ensure destination directory exists
      await fsPromises.mkdir(dirname(fullDestPath), { recursive: true });

      // Get source file stats
      const sourceStats = await fsPromises.stat(fullSourcePath);
      const totalBytes = sourceStats.size;

      // Create streams for copying
      const readStream = createFileReadStream(fullSourcePath);
      const writeStream = createFileWriteStream(fullDestPath);

      let bytesCopied = 0;

      readStream.on('data', (chunk: Buffer) => {
        bytesCopied += chunk.length;
        onProgress?.(bytesCopied, totalBytes);
      });

      // Copy with progress tracking
      await new Promise<void>((resolve, reject) => {
        pipeline(readStream, writeStream, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      // Preserve timestamps if requested
      if (preserveTimestamps) {
        await fsPromises.utimes(fullDestPath, sourceStats.atime, sourceStats.mtime);
      }

      return {
        success: true,
        operation: 'copyFile',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        path: `${sourcePath} -> ${destinationPath}`,
        operation: 'copyFile',
        timestamp: new Date(),
      };
    }
  }

  // Utility methods
  private resolvePath(filePath: string): string {
    return isAbsolute(filePath) ? filePath : join(this.basePath, filePath);
  }

  private parsePath(filePath: string): { name: string; extension: string } {
    const name = basename(filePath);
    const extension = extname(name);
    return {
      name,
      extension: extension.toLowerCase(),
    };
  }

  private getMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      '.txt': 'text/plain',
      '.json': 'application/json',
      '.js': 'application/javascript',
      '.ts': 'application/typescript',
      '.html': 'text/html',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.zip': 'application/zip',
    };
    return mimeTypes[extension] || 'application/octet-stream';
  }

  private parsePermissions(mode: number): FileMetadata['permissions'] {
    return {
      owner: 'user',
      group: 'group',
      mode: mode.toString(8),
      readable: (mode & 0o400) !== 0,
      writable: (mode & 0o200) !== 0,
      executable: (mode & 0o100) !== 0,
    };
  }

  private async calculateChecksum(filePath: string): Promise<string> {
    const content = await fsPromises.readFile(filePath);
    return createHash('sha256').update(content).digest('hex');
  }
}

// ===== HTTP SERVER =====

// Enhanced HTTP server with routing and middleware
interface Route {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
  path: string;
  handler: RequestHandler;
  middleware?: Middleware[];
}

interface Middleware {
  (req: EnhancedRequest, res: EnhancedResponse, next: () => void): void;
}

interface RequestHandler {
  (req: EnhancedRequest, res: EnhancedResponse): void | Promise<void>;
}

interface EnhancedRequest extends IncomingMessage {
  params?: Record<string, string>;
  query?: Record<string, string>;
  body?: any;
  startTime?: number;
  requestId?: string;
}

interface EnhancedResponse extends ServerResponse {
  json(data: any): void;
  status(code: number): EnhancedResponse;
  setHeader(name: string, value: string): EnhancedResponse;
}

class AdvancedHttpServer {
  private server: Server;
  private routes: Route[] = [];
  private middleware: Middleware[] = [];
  private port: number;

  constructor(port: number = 3000) {
    this.port = port;
    this.server = createServer(this.handleRequest.bind(this));
  }

  // Add route with middleware support
  addRoute(route: Route): void {
    this.routes.push(route);
  }

  // Add global middleware
  use(middleware: Middleware): void {
    this.middleware.push(middleware);
  }

  // Start the server
  start(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this.port, () => {
        console.log(`Server running on port ${this.port}`);
        resolve();
      });
    });
  }

  // Stop the server
  stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server.close(() => {
        console.log('Server stopped');
        resolve();
      });
    });
  }

  // Handle incoming requests
  private async handleRequest(req: EnhancedRequest, res: EnhancedResponse): Promise<void> {
    req.startTime = performance.now();
    req.requestId = this.generateRequestId();

    try {
      // Apply global middleware
      for (const middleware of this.middleware) {
        await new Promise<void>((resolve) => {
          middleware(req, res, resolve);
        });
      }

      // Find matching route
      const route = this.findRoute(req);
      
      if (route) {
        // Apply route-specific middleware
        if (route.middleware) {
          for (const middleware of route.middleware) {
            await new Promise<void>((resolve) => {
              middleware(req, res, resolve);
            });
          }
        }

        await route.handler(req, res);
      } else {
        this.send404(req, res);
      }
    } catch (error) {
      this.sendError(req, res, error);
    } finally {
      this.logRequest(req, res);
    }
  }

  // Find matching route
  private findRoute(req: EnhancedRequest): Route | undefined {
    const method = req.method as Route['method'];
    const url = req.url || '/';
    
    return this.routes.find(route => 
      route.method === method && this.matchPath(route.path, url)
    );
  }

  // Simple path matching (can be enhanced with regex)
  private matchPath(routePath: string, requestPath: string): boolean {
    // Basic exact match
    if (routePath === requestPath) return true;
    
    // Handle dynamic routes (e.g., /users/:id)
    const routeParts = routePath.split('/');
    const requestParts = requestPath.split('/');
    
    if (routeParts.length !== requestParts.length) return false;
    
    return routeParts.every((part, index) => 
      part.startsWith(':') || part === requestParts[index]
    );
  }

  // Send 404 response
  private send404(req: EnhancedRequest, res: EnhancedResponse): void {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.url} not found`,
      requestId: req.requestId,
    });
  }

  // Send error response
  private sendError(req: EnhancedRequest, res: EnhancedResponse, error: any): void {
    console.error('Request error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Unknown error',
      requestId: req.requestId,
    });
  }

  // Log request with performance metrics
  private logRequest(req: EnhancedRequest, res: EnhancedResponse): void {
    const duration = req.startTime ? performance.now() - req.startTime : 0;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration.toFixed(2)}ms - ${req.requestId}`);
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return randomBytes(16).toString('hex');
  }

  // Enhanced response methods
  private createEnhancedResponse(res: ServerResponse): EnhancedResponse {
    const enhancedRes = res as EnhancedResponse;
    
    enhancedRes.json = (data: any) => {
      enhancedRes.setHeader('Content-Type', 'application/json');
      enhancedRes.end(JSON.stringify(data));
    };
    
    return enhancedRes;
  }
}

// ===== STREAM OPERATIONS =====

// Advanced stream processing with backpressure handling
class StreamProcessor {
  // Transform stream for data processing
  static createTransform<T, R>(
    transformFn: (chunk: T) => R | Promise<R>
  ): Transform {
    return new Transform({
      objectMode: true,
      transform(chunk: T, encoding, callback) => {
        try {
          const result = transformFn(chunk);
          if (result instanceof Promise) {
            result.then(transformed => callback(null, transformed))
              .catch(error => callback(error));
          } else {
            callback(null, result);
          }
        } catch (error) {
          callback(error);
        }
      },
    });
  }

  // Filter stream for data filtering
  static createFilter<T>(
    filterFn: (chunk: T) => boolean
  ): Transform {
    return new Transform({
      objectMode: true,
      transform(chunk: T, encoding, callback) => {
        if (filterFn(chunk)) {
          callback(null, chunk);
        } else {
          callback();
        }
      },
    });
  }

  // Batch processor for accumulating data
  static createBatchProcessor<T>(
    batchSize: number,
    processFn: (batch: T[]) => void | Promise<void>
  ): Transform {
    let batch: T[] = [];
    
    return new Transform({
      objectMode: true,
      transform(chunk: T, encoding, callback) => {
        batch.push(chunk);
        
        if (batch.length >= batchSize) {
          processFn(batch).then(() => {
            batch = [];
            callback();
          }).catch(error => callback(error));
        } else {
          callback();
        }
      },
      flush(callback) {
        if (batch.length > 0) {
          processFn(batch).then(() => callback())
            .catch(error => callback(error));
        } else {
          callback();
        }
      },
    });
  }

  // Pipeline with error handling and progress tracking
  static async createPipeline(
    streams: NodeJS.ReadableStream[],
    options: {
      onProgress?: (progress: number) => void;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<void> {
    const { onProgress, onError } = options;
    let completed = 0;
    const total = streams.length;

    return new Promise((resolve, reject) => {
      const pipelineStreams = [...streams];
      
      // Add progress tracking
      pipelineStreams.forEach((stream, index) => {
        stream.on('end', () => {
          completed++;
          onProgress?.(completed / total);
        });
        
        stream.on('error', (error) => {
          onError?.(error);
          reject(error);
        });
      });

      pipeline(pipelineStreams, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

// ===== CRYPTO UTILITIES =====

// Advanced cryptographic operations
class CryptoUtils {
  // Password hashing with salt
  static async hashPassword(
    password: string,
    options: {
      algorithm?: 'pbkdf2' | 'scrypt';
      iterations?: number;
      keyLength?: number;
      salt?: Buffer;
    } = {}
  ): Promise<{ hash: string; salt: string }> {
    const {
      algorithm = 'pbkdf2',
      iterations = 100000,
      keyLength = 64,
      salt = randomBytes(32),
    } = options;

    let hash: Buffer;
    
    if (algorithm === 'pbkdf2') {
      hash = await new Promise((resolve, reject) => {
        pbkdf2(password, salt, iterations, keyLength, 'sha512', (err, derivedKey) => {
          if (err) reject(err);
          else resolve(derivedKey);
        });
      });
    } else {
      hash = await new Promise((resolve, reject) => {
        scrypt(password, salt, keyLength, (err, derivedKey) => {
          if (err) reject(err);
          else resolve(derivedKey);
        });
      });
    }

    return {
      hash: hash.toString('hex'),
      salt: salt.toString('hex'),
    };
  }

  // Verify password against hash
  static async verifyPassword(
    password: string,
    hash: string,
    salt: string,
    algorithm: 'pbkdf2' | 'scrypt' = 'pbkdf2'
  ): Promise<boolean> {
    const { hash: computedHash } = await this.hashPassword(password, {
      algorithm,
      salt: Buffer.from(salt, 'hex'),
    });

    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedHash, 'hex'));
  }

  // Generate secure random token
  static generateToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  // Create HMAC for message authentication
  static createHmac(
    message: string,
    key: string,
    algorithm: string = 'sha256'
  ): string {
    const hmac = createHmac(algorithm, key);
    hmac.update(message);
    return hmac.digest('hex');
  }

  // Verify HMAC
  static verifyHmac(
    message: string,
    key: string,
    signature: string,
    algorithm: string = 'sha256'
  ): boolean {
    const expectedSignature = this.createHmac(message, key, algorithm);
    return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
  }
}

// ===== WORKER THREADS =====

// Worker thread management
class WorkerManager {
  private workers: Map<string, Worker> = new Map();
  private taskQueue: Map<string, any> = new Map();
  private results: Map<string, any> = new Map();

  // Create worker for CPU-intensive tasks
  async createWorker<T>(
    workerScript: string,
    taskData: T,
    options: {
      timeout?: number;
      onProgress?: (progress: number) => void;
    } = {}
  ): Promise<any> {
    const taskId = this.generateTaskId();
    const { timeout = 30000, onProgress } = options;

    return new Promise((resolve, reject) => {
      const worker = new Worker(workerScript, {
        workerData: { taskId, data: taskData },
      });

      // Set timeout
      const timeoutId = setTimeout(() => {
        worker.terminate();
        reject(new Error('Worker timeout'));
      }, timeout);

      worker.on('message', (result) => {
        clearTimeout(timeoutId);
        this.results.set(taskId, result);
        resolve(result);
      });

      worker.on('error', (error) => {
        clearTimeout(timeoutId);
        reject(error);
      });

      worker.on('exit', (code) => {
        clearTimeout(timeoutId);
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });

      this.workers.set(taskId, worker);
      this.taskQueue.set(taskId, taskData);
    });
  }

  // Terminate all workers
  terminateAll(): void {
    for (const [taskId, worker] of this.workers) {
      worker.terminate();
      this.workers.delete(taskId);
      this.taskQueue.delete(taskId);
    }
  }

  // Get worker statistics
  getStats(): {
    activeWorkers: number;
    queuedTasks: number;
    completedTasks: number;
  } {
    return {
      activeWorkers: this.workers.size,
      queuedTasks: this.taskQueue.size,
      completedTasks: this.results.size,
    };
  }

  private generateTaskId(): string {
    return randomBytes(8).toString('hex');
  }
}

// ===== CLI FRAMEWORK =====

// Advanced command-line interface framework
interface Command {
  name: string;
  description: string;
  options: Record<string, {
    description: string;
    type: 'string' | 'boolean' | 'number';
    required?: boolean;
    default?: any;
  }>;
  subcommands?: Command[];
  handler: (args: Record<string, any>, options: Record<string, any>) => void | Promise<void>;
}

class CLI {
  private commands: Map<string, Command> = new Map();
  private rl: Interface;

  constructor() {
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    this.setupEventHandlers();
  }

  // Register command
  registerCommand(command: Command): void {
    this.commands.set(command.name, command);
  }

  // Start CLI
  start(): void {
    console.log('Advanced CLI Framework');
    console.log('Type "help" for available commands or "exit" to quit.');
    this.prompt();
  }

  // Execute command
  async executeCommand(input: string): Promise<void> {
    const [commandName, ...args] = input.trim().split(' ');
    
    if (commandName === 'help') {
      this.showHelp();
      return;
    }
    
    if (commandName === 'exit') {
      this.rl.close();
      return;
    }

    const command = this.commands.get(commandName);
    
    if (!command) {
      console.error(`Unknown command: ${commandName}`);
      return;
    }

    try {
      const { parsedArgs, parsedOptions } = this.parseArguments(args, command);
      await command.handler(parsedArgs, parsedOptions);
    } catch (error) {
      console.error(`Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Parse command arguments and options
  private parseArguments(args: string[], command: Command): {
    parsedArgs: Record<string, any>;
    parsedOptions: Record<string, any>;
  } {
    const parsedArgs: Record<string, any> = {};
    const parsedOptions: Record<string, any> = {};
    
    let i = 0;
    while (i < args.length) {
      const arg = args[i];
      
      if (arg.startsWith('--')) {
        const optionName = arg.slice(2);
        const option = command.options[optionName];
        
        if (option) {
          if (option.type === 'boolean') {
            parsedOptions[optionName] = true;
          } else {
            i++;
            parsedOptions[optionName] = this.convertType(args[i], option.type);
          }
        }
      } else {
        // Positional argument
        parsedArgs[Object.keys(parsedArgs).length] = arg;
      }
      
      i++;
    }

    // Apply defaults
    for (const [optionName, option] of Object.entries(command.options)) {
      if (option.default !== undefined && parsedOptions[optionName] === undefined) {
        parsedOptions[optionName] = option.default;
      }
    }

    return { parsedArgs, parsedOptions };
  }

  // Convert string to appropriate type
  private convertType(value: string, type: string): any {
    switch (type) {
      case 'number':
        return parseInt(value, 10);
      case 'boolean':
        return value.toLowerCase() === 'true';
      default:
        return value;
    }
  }

  // Show help
  private showHelp(): void {
    console.log('Available commands:');
    
    for (const [name, command] of this.commands) {
      console.log(`  ${name}: ${command.description}`);
      
      if (Object.keys(command.options).length > 0) {
        console.log('    Options:');
        for (const [optionName, option] of Object.entries(command.options)) {
          const required = option.required ? ' (required)' : '';
          const defaultValue = option.default !== undefined ? ` [default: ${option.default}]` : '';
          console.log(`      --${optionName}: ${option.description}${required}${defaultValue}`);
        }
      }
      
      if (command.subcommands && command.subcommands.length > 0) {
        console.log('    Subcommands:');
        for (const subcommand of command.subcommands) {
          console.log(`      ${subcommand.name}: ${subcommand.description}`);
        }
      }
    }
    
    console.log('  help: Show this help message');
    console.log('  exit: Exit the CLI');
  }

  // Setup event handlers
  private setupEventHandlers(): void {
    this.rl.on('line', (input) => {
      this.executeCommand(input).then(() => {
        this.prompt();
      });
    });

    this.rl.on('close', () => {
      console.log('Goodbye!');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      this.rl.close();
    });
  }

  // Show prompt
  private prompt(): void {
    this.rl.question('> ', () => {});
  }
}

// ===== EXERCISES =====

/*
EXERCISE 1: Create a file watcher that:
- Monitors a directory for changes
- Emits events for file creation, modification, and deletion
- Handles errors gracefully
- Supports recursive watching
- Is fully typed

EXERCISE 2: Create a REST API server that:
- Handles CRUD operations for a resource
- Validates request bodies
- Implements proper error handling
- Uses TypeScript generics for different resource types
- Supports middleware

EXERCISE 3: Create a database connection pool that:
- Manages multiple connections
- Provides connection acquisition and release
- Handles connection timeouts
- Supports connection health checks
- Is fully typed

EXERCISE 4: Create a streaming data processor that:
- Reads large files in chunks
- Transforms data
- Writes to multiple outputs
- Handles backpressure
- Supports progress tracking

EXERCISE 5: Create a CLI tool that:
- Parses command-line arguments
- Validates inputs
- Provides help and usage information
- Handles different commands with different options
- Supports subcommands
*/

// Export classes and utilities
export {
  FileManager,
  AdvancedHttpServer,
  StreamProcessor,
  CryptoUtils,
  WorkerManager,
  CLI,
};

// Export types
export type {
  FileMetadata,
  DirectoryOptions,
  FileOperationResult,
  Route,
  Middleware,
  RequestHandler,
  EnhancedRequest,
  EnhancedResponse,
  Command,
};