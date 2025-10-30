// gRPC TypeScript Examples - Advanced Remote Procedure Call Implementation
// This file demonstrates comprehensive TypeScript usage with gRPC

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { Server, ServerCredentials, Client, ServiceDefinition } from '@grpc/grpc-js';
import { loadPackageDefinition } from '@grpc/proto-loader';

// ===== BASIC TYPES =====

// gRPC service configuration
interface GRPCConfig {
  protoPath: string;
  serviceName: string;
  packageName?: string;
  address: string;
  port: number;
  credentials?: ServerCredentials;
  maxReceiveMessageLength?: number;
  maxSendMessageLength?: number;
  keepaliveTimeMs?: number;
  keepaliveTimeoutMs?: number;
  keepalivePermitWithoutCalls?: boolean;
  http2?: {
    maxConcurrentStreams?: number;
    initialWindowSize?: number;
  };
}

// Service method configuration
interface ServiceMethod {
  name: string;
  requestType: any;
  responseType: any;
  requestStream: boolean;
  responseStream: boolean;
  handler: (call: any) => void;
}

// Client configuration
interface ClientConfig {
  address: string;
  credentials?: any;
  maxReceiveMessageLength?: number;
  maxSendMessageLength?: number;
  keepaliveTimeMs?: number;
  keepaliveTimeoutMs?: number;
  http2?: {
    maxConcurrentStreams?: number;
    initialWindowSize?: number;
  };
}

// Call options
interface CallOptions {
  deadline?: Date;
  host?: string;
  parent?: any;
  propagate_cancel?: boolean;
  credentials?: any;
}

// Service definition
interface ServiceDefinition {
  [methodName: string]: {
    path: string;
    requestStream: boolean;
    responseStream: boolean;
    requestSerialize: any;
    responseDeserialize: any;
    requestType: any;
    responseType: any;
  };
}

// ===== GRPC MANAGER =====

class GRPCManager {
  private server: Server | null = null;
  private clients: Map<string, Client> = new Map();
  private packageDefinition: any = null;
  private config: GRPCConfig;
  private services: Map<string, ServiceDefinition> = new Map();

  constructor(config: GRPCConfig) {
    this.config = config;
  }

  // ===== SERVER MANAGEMENT =====

  // Load proto file
  async loadProto(): Promise<any> {
    try {
      const packageDefinition = await protoLoader.load(this.config.protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        includeDirs: [__dirname],
      });

      this.packageDefinition = packageDefinition;
      console.log('Proto file loaded successfully');
      return packageDefinition;
    } catch (error) {
      console.error('Failed to load proto file:', error);
      throw error;
    }
  }

  // Start gRPC server
  async startServer(services: Array<{ name: string; implementation: any }>): Promise<void> {
    if (!this.packageDefinition) {
      await this.loadProto();
    }

    try {
      this.server = new grpc.Server();

      // Register services
      for (const service of services) {
        const serviceDefinition = this.getServiceDefinition(service.name);
        this.server.addService(serviceDefinition, service.implementation);
        console.log(`Service registered: ${service.name}`);
      }

      // Start server
      this.server.bindAsync(
        `${this.config.address}:${this.config.port}`,
        this.config.credentials || grpc.ServerCredentials.createInsecure(),
        (error: Error | null, port: number) => {
          if (error) {
            console.error('Failed to start server:', error);
            throw error;
          }

          console.log(`gRPC server started on port ${port}`);
        }
      );

      // Configure server options
      if (this.config.maxReceiveMessageLength) {
        this.server.setMaxReceiveMessageLength(this.config.maxReceiveMessageLength);
      }

      if (this.config.maxSendMessageLength) {
        this.server.setMaxSendMessageLength(this.config.maxSendMessageLength);
      }

      if (this.config.keepaliveTimeMs) {
        this.server.keepaliveTimeMs = this.config.keepaliveTimeMs;
      }

      if (this.config.keepaliveTimeoutMs) {
        this.server.keepaliveTimeoutMs = this.config.keepaliveTimeoutMs;
      }

      if (this.config.keepalivePermitWithoutCalls !== undefined) {
        this.server.keepalivePermitWithoutCalls = this.config.keepalivePermitWithoutCalls;
      }

      if (this.config.http2) {
        if (this.config.http2.maxConcurrentStreams) {
          this.server.http2MaxConcurrentStreams = this.config.http2.maxConcurrentStreams;
        }

        if (this.config.http2.initialWindowSize) {
          this.server.http2InitialWindowSize = this.config.http2.initialWindowSize;
        }
      }

    } catch (error) {
      console.error('Failed to start gRPC server:', error);
      throw error;
    }
  }

  // Stop gRPC server
  async stopServer(): Promise<void> {
    if (!this.server) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.server!.tryShutdown((error: Error | null) => {
        if (error) {
          console.error('Failed to stop server:', error);
          reject(error);
        } else {
          console.log('gRPC server stopped');
          this.server = null;
          resolve();
        }
      });
    });
  }

  // Force stop server
  forceStop(): void {
    if (this.server) {
      this.server.forceShutdown();
      this.server = null;
      console.log('gRPC server force stopped');
    }
  }

  // ===== CLIENT MANAGEMENT =====

  // Create client
  createClient(serviceName: string, config?: ClientConfig): Client {
    const clientKey = `${serviceName}_${JSON.stringify(config || {})}`;
    
    if (this.clients.has(clientKey)) {
      return this.clients.get(clientKey)!;
    }

    try {
      const serviceDefinition = this.getServiceDefinition(serviceName);
      const ClientConstructor = this.getClientConstructor(serviceName);
      
      const client = new ClientConstructor(
        config?.address || `${this.config.address}:${this.config.port}`,
        config?.credentials || grpc.credentials.createInsecure()
      );

      this.clients.set(clientKey, client);
      console.log(`gRPC client created for service: ${serviceName}`);
      
      return client;
    } catch (error) {
      console.error('Failed to create client:', error);
      throw error;
    }
  }

  // Close client
  closeClient(serviceName: string, config?: ClientConfig): void {
    const clientKey = `${serviceName}_${JSON.stringify(config || {})}`;
    const client = this.clients.get(clientKey);
    
    if (client) {
      client.close();
      this.clients.delete(clientKey);
      console.log(`gRPC client closed for service: ${serviceName}`);
    }
  }

  // Close all clients
  closeAllClients(): void {
    for (const [key, client] of this.clients.entries()) {
      client.close();
    }
    this.clients.clear();
    console.log('All gRPC clients closed');
  }

  // ===== SERVICE DEFINITIONS =====

  // Get service definition
  getServiceDefinition(serviceName: string): ServiceDefinition {
    if (this.services.has(serviceName)) {
      return this.services.get(serviceName)!;
    }

    if (!this.packageDefinition) {
      throw new Error('Proto file not loaded');
    }

    const packageName = this.config.packageName;
    const fullServiceName = packageName ? `${packageName}.${serviceName}` : serviceName;
    
    const serviceDefinition = (this.packageDefinition as any)[fullServiceName];
    if (!serviceDefinition) {
      throw new Error(`Service not found: ${serviceName}`);
    }

    this.services.set(serviceName, serviceDefinition);
    return serviceDefinition;
  }

  // Get client constructor
  getClientConstructor(serviceName: string): any {
    const packageName = this.config.packageName;
    const fullServiceName = packageName ? `${packageName}.${serviceName}` : serviceName;
    
    const clientConstructor = (this.packageDefinition as any)[fullServiceName];
    if (!clientConstructor) {
      throw new Error(`Client constructor not found: ${serviceName}`);
    }

    return clientConstructor;
  }

  // ===== UTILITY METHODS =====

  // Create unary call
  createUnaryCall<TRequest, TResponse>(
    client: Client,
    methodName: string,
    request: TRequest,
    options?: CallOptions
  ): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      const method = (client as any)[methodName];
      
      if (!method) {
        reject(new Error(`Method not found: ${methodName}`));
        return;
      }

      method.call(client, request, options || {}, (error: Error | null, response: TResponse) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  // Create server streaming call
  createServerStreamingCall<TRequest, TResponse>(
    client: Client,
    methodName: string,
    request: TRequest,
    options?: CallOptions
  ): Promise<TResponse[]> {
    return new Promise((resolve, reject) => {
      const responses: TResponse[] = [];
      const method = (client as any)[methodName];
      
      if (!method) {
        reject(new Error(`Method not found: ${methodName}`));
        return;
      }

      const call = method.call(client, request, options || {});
      
      call.on('data', (response: TResponse) => {
        responses.push(response);
      });

      call.on('end', () => {
        resolve(responses);
      });

      call.on('error', (error: Error) => {
        reject(error);
      });
    });
  }

  // Create client streaming call
  createClientStreamingCall<TRequest, TResponse>(
    client: Client,
    methodName: string,
    requests: TRequest[],
    options?: CallOptions
  ): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      const method = (client as any)[methodName];
      
      if (!method) {
        reject(new Error(`Method not found: ${methodName}`));
        return;
      }

      const call = method.call(client, options || {});
      
      // Send all requests
      for (const request of requests) {
        call.write(request);
      }
      
      call.end();

      call.on('data', (response: TResponse) => {
        resolve(response);
      });

      call.on('error', (error: Error) => {
        reject(error);
      });
    });
  }

  // Create bidirectional streaming call
  createBidirectionalStreamingCall<TRequest, TResponse>(
    client: Client,
    methodName: string,
    options?: CallOptions
  ): {
    write: (request: TRequest) => void;
    end: () => void;
    on: (event: 'data' | 'end' | 'error', handler: (data: any) => void) => void;
  } {
    const method = (client as any)[methodName];
    
    if (!method) {
      throw new Error(`Method not found: ${methodName}`);
    }

    const call = method.call(client, options || {});
    
    return {
      write: (request: TRequest) => {
        call.write(request);
      },
      end: () => {
        call.end();
      },
      on: (event: 'data' | 'end' | 'error', handler: (data: any) => void) => {
        call.on(event, handler);
      },
    };
  }

  // Get server status
  getServerStatus(): {
    running: boolean;
    address?: string;
    port?: number;
  } {
    return {
      running: !!this.server,
      address: this.config.address,
      port: this.config.port,
    };
  }

  // Get client count
  getClientCount(): number {
    return this.clients.size;
  }

  // Get loaded services
  getLoadedServices(): string[] {
    return Array.from(this.services.keys());
  }
}

// ===== GRPC SERVICE =====

class GRPCService {
  private manager: GRPCManager;
  private services: Map<string, any> = new Map();

  constructor(config: GRPCConfig) {
    this.manager = new GRPCManager(config);
  }

  // Initialize service
  async initialize(): Promise<void> {
    await this.manager.loadProto();
  }

  // Register service implementation
  registerService(name: string, implementation: any): void {
    this.services.set(name, implementation);
  }

  // Start server
  async start(): Promise<void> {
    const serviceImplementations = Array.from(this.services.entries()).map(([name, implementation]) => ({
      name,
      implementation,
    }));

    await this.manager.startServer(serviceImplementations);
  }

  // Stop server
  async stop(): Promise<void> {
    await this.manager.stopServer();
  }

  // Force stop
  forceStop(): void {
    this.manager.forceStop();
  }

  // Get manager
  getManager(): GRPCManager {
    return this.manager;
  }
}

// ===== EXAMPLE SERVICE IMPLEMENTATIONS =====

// User service implementation
class UserService {
  // Mock user data
  private users: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  }> = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      createdAt: new Date(),
    },
  ];

  // Get user by ID
  async getUser(call: any, callback: any): Promise<void> {
    const { id } = call.request;
    
    console.log(`Getting user with ID: ${id}`);
    
    const user = this.users.find(u => u.id === id);
    
    if (user) {
      callback(null, user);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: `User not found: ${id}`,
      });
    }
  }

  // Create user
  async createUser(call: any, callback: any): Promise<void> {
    const { name, email } = call.request;
    
    console.log(`Creating user: ${name}, ${email}`);
    
    const newUser = {
      id: (this.users.length + 1).toString(),
      name,
      email,
      createdAt: new Date(),
    };
    
    this.users.push(newUser);
    callback(null, newUser);
  }

  // Update user
  async updateUser(call: any, callback: any): Promise<void> {
    const { id, name, email } = call.request;
    
    console.log(`Updating user ${id}: ${name}, ${email}`);
    
    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      callback({
        code: grpc.status.NOT_FOUND,
        details: `User not found: ${id}`,
      });
      return;
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      name: name || this.users[userIndex].name,
      email: email || this.users[userIndex].email,
    };
    
    callback(null, this.users[userIndex]);
  }

  // Delete user
  async deleteUser(call: any, callback: any): Promise<void> {
    const { id } = call.request;
    
    console.log(`Deleting user with ID: ${id}`);
    
    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      callback({
        code: grpc.status.NOT_FOUND,
        details: `User not found: ${id}`,
      });
      return;
    }
    
    this.users.splice(userIndex, 1);
    
    callback(null, { success: true });
  }

  // List users (server streaming)
  async listUsers(call: any): Promise<void> {
    console.log('Listing all users');
    
    for (const user of this.users) {
      call.write(user);
    }
    
    call.end();
  }

  // Search users (client streaming)
  async searchUsers(call: any): Promise<void> {
    console.log('Searching users');
    
    call.on('data', (request: any) => {
      const { query } = request;
      console.log(`Search query: ${query}`);
      
      const results = this.users.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      
      for (const result of results) {
        call.write(result);
      }
    });

    call.on('end', () => {
      call.end();
    });
  }

  // Chat (bidirectional streaming)
  async chat(call: any): Promise<void> {
    console.log('Starting chat session');
    
    call.on('data', (message: any) => {
      console.log(`Received message: ${message.text}`);
      
      // Echo message back
      call.write({
        id: Date.now().toString(),
        text: `Echo: ${message.text}`,
        timestamp: new Date().toISOString(),
      });
    });

    call.on('end', () => {
      console.log('Chat session ended');
      call.end();
    });
  }
}

// ===== GRPC CLIENT =====

class GRPCClient {
  private manager: GRPCManager;
  private clients: Map<string, Client> = new Map();

  constructor(config: GRPCConfig) {
    this.manager = new GRPCManager(config);
  }

  // Initialize client
  async initialize(): Promise<void> {
    await this.manager.loadProto();
  }

  // Get client for service
  getClient(serviceName: string, config?: ClientConfig): Client {
    const clientKey = `${serviceName}_${JSON.stringify(config || {})}`;
    
    if (this.clients.has(clientKey)) {
      return this.clients.get(clientKey)!;
    }

    const client = this.manager.createClient(serviceName, config);
    this.clients.set(clientKey, client);
    return client;
  }

  // User service client methods
  async getUser(id: string): Promise<any> {
    const client = this.getClient('UserService');
    return await this.manager.createUnaryCall(
      client,
      'getUser',
      { id }
    );
  }

  async createUser(userData: any): Promise<any> {
    const client = this.getClient('UserService');
    return await this.manager.createUnaryCall(
      client,
      'createUser',
      userData
    );
  }

  async updateUser(id: string, userData: any): Promise<any> {
    const client = this.getClient('UserService');
    return await this.manager.createUnaryCall(
      client,
      'updateUser',
      { id, ...userData }
    );
  }

  async deleteUser(id: string): Promise<any> {
    const client = this.getClient('UserService');
    return await this.manager.createUnaryCall(
      client,
      'deleteUser',
      { id }
    );
  }

  async listUsers(): Promise<any[]> {
    const client = this.getClient('UserService');
    return await this.manager.createServerStreamingCall(
      client,
      'listUsers',
      {}
    );
  }

  async searchUsers(query: string): Promise<any[]> {
    const client = this.getClient('UserService');
    return await this.manager.createClientStreamingCall(
      client,
      'searchUsers',
      [{ query }]
    );
  }

  // Chat method
  createChatSession(): {
    sendMessage: (message: string) => void;
    onMessage: (handler: (message: any) => void) => void;
    end: () => void;
  } {
    const client = this.getClient('UserService');
    return this.manager.createBidirectionalStreamingCall(client, 'chat');
  }

  // Close all clients
  closeAllClients(): void {
    this.manager.closeAllClients();
    this.clients.clear();
  }

  // Get manager
  getManager(): GRPCManager {
    return this.manager;
  }
}

// ===== EXERCISES =====

/*
EXERCISE 1: Create a gRPC plugin system that:
- Supports custom interceptors
- Provides middleware for requests/responses
- Implements service discovery
- Supports load balancing
- Is fully typed

EXERCISE 2: Build a gRPC testing framework that:
- Generates test cases from proto definitions
- Supports multiple testing frameworks
- Provides mock server generation
- Implements contract testing
- Is fully typed

EXERCISE 3: Create a gRPC monitoring system that:
- Tracks method calls and performance
- Provides usage analytics
- Monitors connection health
- Supports custom metrics collection
- Is fully typed

EXERCISE 4: Build a gRPC documentation system that:
- Generates documentation from proto files
- Supports interactive documentation
- Implements method testing
- Supports versioning
- Is fully typed

EXERCISE 5: Create a gRPC multi-service system that:
- Supports service composition
- Provides inter-service communication
- Implements service mesh patterns
- Supports distributed tracing
- Is fully typed
*/

// Export classes and interfaces
export { GRPCManager, GRPCService, GRPCClient, UserService };

// Export types
export type {
  GRPCConfig,
  ServiceMethod,
  ClientConfig,
  CallOptions,
  ServiceDefinition,
};