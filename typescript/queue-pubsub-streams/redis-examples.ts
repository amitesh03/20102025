// Redis TypeScript Examples - Advanced In-Memory Data Structure Store
// This file demonstrates comprehensive TypeScript usage with Redis

import { createClient, RedisClientType, RedisModules, RedisFunctions, RedisScripts } from 'redis';

// ===== BASIC TYPES =====

// Redis configuration
interface RedisConfig {
  host?: string;
  port?: number;
  password?: string;
  database?: number;
  url?: string;
  socket?: {
    path?: string;
    reconnectStrategy?: (retries: number) => number | Error;
    connectTimeout?: number;
    lazyConnect?: boolean;
    keepAlive?: number;
    noDelay?: boolean;
    family?: 4 | 6;
  };
  commandTimeout?: number;
  retryDelayOnFailover?: number;
  enableReadyCheck?: boolean;
  maxRetriesPerRequest?: number;
  readonly?: boolean;
  name?: string;
  disableOfflineQueue?: boolean;
}

// Message interface
interface RedisMessage {
  id: string;
  channel: string;
  pattern?: string;
  payload: any;
  timestamp: number;
  headers?: Record<string, any>;
}

// Stream message
interface StreamMessage {
  id: string;
  fields: Record<string, string>;
  timestamp?: number;
}

// Stream options
interface StreamOptions {
  maxlen?: string | number;
  approx?: boolean;
  nomkstream?: boolean;
  minid?: string;
  limit?: number;
}

// Consumer group options
interface ConsumerGroupOptions {
  key: string;
  group: string;
  id?: string;
  options?: {
    block?: number;
    count?: number;
    noAck?: boolean;
    stream?: string;
  };
}

// Lock options
interface LockOptions {
  key: string;
  ttl?: number;
  retryDelay?: number;
  maxRetries?: number;
  identifier?: string;
}

// Cache options
interface CacheOptions {
  key: string;
  value: any;
  ttl?: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

// ===== REDIS MANAGER =====

class RedisManager {
  private client: RedisClientType<RedisModules, RedisFunctions, RedisScripts> | null = null;
  private config: RedisConfig;
  private subscribers: Map<string, (message: RedisMessage) => void> = new Map();
  private streamConsumers: Map<string, any> = new Map();
  private isConnected: boolean = false;

  constructor(config: RedisConfig = {}) {
    this.config = {
      host: config.host || 'localhost',
      port: config.port || 6379,
      password: config.password,
      database: config.database || 0,
      url: config.url,
      socket: {
        reconnectStrategy: (retries: number) => {
          if (retries > 10) {
            return new Error('Max reconnection attempts reached');
          }
          return Math.min(retries * 50, 500);
        },
        connectTimeout: 10000,
        lazyConnect: true,
        keepAlive: 30000,
        noDelay: true,
        family: 4,
        ...config.socket,
      },
      commandTimeout: 5000,
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
      readonly: false,
      name: 'redis-manager',
      disableOfflineQueue: false,
      ...config,
    };
  }

  // ===== CONNECTION MANAGEMENT =====

  // Connect to Redis
  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      this.client = createClient(this.config);

      // Set up event handlers
      this.client.on('error', this.handleError.bind(this));
      this.client.on('connect', this.handleConnect.bind(this));
      this.client.on('ready', this.handleReady.bind(this));
      this.client.on('end', this.handleEnd.bind(this));
      this.client.on('reconnecting', this.handleReconnecting.bind(this));

      await this.client.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  // Disconnect from Redis
  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
      console.log('Disconnected from Redis');
    }
  }

  // Handle connection error
  private handleError(error: Error): void {
    console.error('Redis connection error:', error);
    this.isConnected = false;
  }

  // Handle connection
  private handleConnect(): void {
    console.log('Redis connecting...');
  }

  // Handle ready
  private handleReady(): void {
    console.log('Redis ready');
    this.isConnected = true;
  }

  // Handle end
  private handleEnd(): void {
    console.log('Redis connection ended');
    this.isConnected = false;
  }

  // Handle reconnecting
  private handleReconnecting(): void {
    console.log('Redis reconnecting...');
  }

  // ===== BASIC OPERATIONS =====

  // Set key-value
  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const serializedValue = JSON.stringify(value);
    
    if (ttl) {
      await this.client.setEx(key, ttl, serializedValue);
    } else {
      await this.client.set(key, serializedValue);
    }
  }

  // Get value
  async get(key: string): Promise<any> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  // Delete key
  async del(key: string): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.del(key);
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const result = await this.client.exists(key);
    return result === 1;
  }

  // Set TTL
  async expire(key: string, ttl: number): Promise<boolean> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const result = await this.client.expire(key, ttl);
    return result === 1;
  }

  // Get TTL
  async ttl(key: string): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.ttl(key);
  }

  // Increment
  async incr(key: string): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.incr(key);
  }

  // Increment by value
  async incrBy(key: string, value: number): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.incrBy(key, value);
  }

  // Decrement
  async decr(key: string): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.decr(key);
  }

  // Decrement by value
  async decrBy(key: string, value: number): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.decrBy(key, value);
  }

  // ===== HASH OPERATIONS =====

  // Set hash field
  async hSet(key: string, field: string, value: any): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.hSet(key, field, JSON.stringify(value));
  }

  // Get hash field
  async hGet(key: string, field: string): Promise<any> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const value = await this.client.hGet(key, field);
    return value ? JSON.parse(value) : null;
  }

  // Get all hash fields
  async hGetAll(key: string): Promise<Record<string, any>> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const hash = await this.client.hGetAll(key);
    const result: Record<string, any> = {};
    
    for (const [field, value] of Object.entries(hash)) {
      result[field] = JSON.parse(value);
    }
    
    return result;
  }

  // Delete hash field
  async hDel(key: string, field: string): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.hDel(key, field);
  }

  // Check if hash field exists
  async hExists(key: string, field: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.hExists(key, field);
  }

  // Get hash length
  async hLen(key: string): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.hLen(key);
  }

  // ===== LIST OPERATIONS =====

  // Push to list (left)
  async lPush(key: string, value: any): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.lPush(key, JSON.stringify(value));
  }

  // Push to list (right)
  async rPush(key: string, value: any): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.rPush(key, JSON.stringify(value));
  }

  // Pop from list (left)
  async lPop(key: string): Promise<any> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const value = await this.client.lPop(key);
    return value ? JSON.parse(value) : null;
  }

  // Pop from list (right)
  async rPop(key: string): Promise<any> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const value = await this.client.rPop(key);
    return value ? JSON.parse(value) : null;
  }

  // Get list length
  async lLen(key: string): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.lLen(key);
  }

  // Get list range
  async lRange(key: string, start: number, stop: number): Promise<any[]> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const values = await this.client.lRange(key, start, stop);
    return values.map(value => JSON.parse(value));
  }

  // ===== SET OPERATIONS =====

  // Add to set
  async sAdd(key: string, member: any): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.sAdd(key, JSON.stringify(member));
  }

  // Remove from set
  async sRem(key: string, member: any): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.sRem(key, JSON.stringify(member));
  }

  // Get all set members
  async sMembers(key: string): Promise<any[]> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const members = await this.client.sMembers(key);
    return members.map(member => JSON.parse(member));
  }

  // Check if member exists in set
  async sIsMember(key: string, member: any): Promise<boolean> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.sIsMember(key, JSON.stringify(member));
  }

  // Get set size
  async sCard(key: string): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.sCard(key);
  }

  // ===== PUB/SUB OPERATIONS =====

  // Publish message
  async publish(channel: string, message: any): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const redisMessage: RedisMessage = {
      id: this.generateId(),
      channel,
      payload: message,
      timestamp: Date.now(),
    };

    return await this.client.publish(channel, JSON.stringify(redisMessage));
  }

  // Subscribe to channel
  async subscribe(channel: string, callback: (message: RedisMessage) => void): Promise<void> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const subscriber = this.client.duplicate();
    await subscriber.connect();

    await subscriber.subscribe(channel, (message) => {
      try {
        const redisMessage: RedisMessage = JSON.parse(message);
        callback(redisMessage);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    this.subscribers.set(channel, callback);
    console.log(`Subscribed to channel: ${channel}`);
  }

  // Unsubscribe from channel
  async unsubscribe(channel: string): Promise<void> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    this.subscribers.delete(channel);
    console.log(`Unsubscribed from channel: ${channel}`);
  }

  // ===== STREAM OPERATIONS =====

  // Add to stream
  async xAdd(key: string, fields: Record<string, string>, options?: StreamOptions): Promise<string> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.xAdd(key, options || {}, fields);
  }

  // Read from stream
  async xRead(key: string, id: string = '$', count?: number): Promise<StreamMessage[]> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const streams = await this.client.xRead(
      [{ key, id }],
      { COUNT: count }
    );

    return streams.map(stream => ({
      id: stream.id,
      fields: stream.message.fields,
      timestamp: this.extractTimestampFromId(stream.id),
    }));
  }

  // Create consumer group
  async xGroupCreate(key: string, group: string, id: string = '$', mkStream: boolean = false): Promise<string> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.xGroupCreate(key, group, id, {
      MKSTREAM: mkStream,
    });
  }

  // Read from consumer group
  async xReadGroup(options: ConsumerGroupOptions): Promise<StreamMessage[]> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const streams = await this.client.xReadGroup(
      options.group,
      options.id || 'consumer-1',
      [{ key: options.key, id: '>' }],
      options.options
    );

    return streams.map(stream => ({
      id: stream.id,
      fields: stream.message.fields,
      timestamp: this.extractTimestampFromId(stream.id),
    }));
  }

  // Acknowledge message
  async xAck(key: string, group: string, id: string): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.xAck(key, group, id);
  }

  // Get stream info
  async xInfoStream(key: string): Promise<any> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    return await this.client.xInfoStream(key);
  }

  // ===== LOCK OPERATIONS =====

  // Acquire lock
  async acquireLock(options: LockOptions): Promise<boolean> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const identifier = options.identifier || this.generateId();
    const ttl = options.ttl || 30000; // 30 seconds default

    const result = await this.client.set(
      `lock:${options.key}`,
      identifier,
      {
        PX: ttl,
        NX: true,
      }
    );

    return result === 'OK';
  }

  // Release lock
  async releaseLock(key: string, identifier: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    const result = await this.client.eval(script, {
      keys: [`lock:${key}`],
      arguments: [identifier],
    });

    return result === 1;
  }

  // ===== CACHE OPERATIONS =====

  // Set cache with tags
  async setCache(options: CacheOptions): Promise<void> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const cacheKey = `cache:${options.key}`;
    const cacheValue = {
      value: options.value,
      timestamp: Date.now(),
      tags: options.tags || [],
      metadata: options.metadata || {},
    };

    await this.set(cacheKey, cacheValue, options.ttl);

    // Update tag sets
    if (options.tags) {
      for (const tag of options.tags) {
        await this.client.sAdd(`tag:${tag}`, cacheKey);
      }
    }
  }

  // Get cache
  async getCache(key: string): Promise<any> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    const cacheKey = `cache:${key}`;
    const cacheValue = await this.get(cacheKey);
    
    return cacheValue ? cacheValue.value : null;
  }

  // Invalidate cache by tags
  async invalidateCacheByTags(tags: string[]): Promise<number> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    let invalidatedCount = 0;

    for (const tag of tags) {
      const cacheKeys = await this.sMembers(`tag:${tag}`);
      
      for (const cacheKey of cacheKeys) {
        await this.del(cacheKey);
        invalidatedCount++;
      }
      
      await this.del(`tag:${tag}`);
    }

    return invalidatedCount;
  }

  // ===== UTILITY METHODS =====

  // Generate ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Extract timestamp from stream ID
  private extractTimestampFromId(id: string): number {
    const timestamp = id.split('-')[0];
    return parseInt(timestamp, 10);
  }

  // Get connection status
  getConnectionStatus(): {
    connected: boolean;
    subscribersCount: number;
    streamConsumersCount: number;
  } {
    return {
      connected: this.isConnected,
      subscribersCount: this.subscribers.size,
      streamConsumersCount: this.streamConsumers.size,
    };
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.client) {
        return false;
      }

      await this.client.ping();
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Get statistics
  async getStatistics(): Promise<{
    info: any;
    memory: any;
    stats: any;
    connectionStatus: any;
  }> {
    if (!this.client) {
      throw new Error('Not connected to Redis');
    }

    try {
      const [info, memory, stats] = await Promise.all([
        this.client.info(),
        this.client.info('memory'),
        this.client.info('stats'),
      ]);

      return {
        info: this.parseInfo(info),
        memory: this.parseInfo(memory),
        stats: this.parseInfo(stats),
        connectionStatus: this.getConnectionStatus(),
      };
    } catch (error) {
      console.error('Failed to get statistics:', error);
      throw error;
    }
  }

  // Parse Redis info output
  private parseInfo(info: string): Record<string, any> {
    const lines = info.split('\r\n');
    const result: Record<string, any> = {};

    for (const line of lines) {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split(':');
        if (key && value) {
          result[key] = isNaN(Number(value)) ? value : Number(value);
        }
      }
    }

    return result;
  }
}

// ===== REDIS SERVICE =====

class RedisService {
  private manager: RedisManager;

  constructor(config: RedisConfig = {}) {
    this.manager = new RedisManager(config);
  }

  // Initialize service
  async initialize(): Promise<void> {
    await this.manager.connect();
  }

  // Shutdown service
  async shutdown(): Promise<void> {
    await this.manager.disconnect();
  }

  // Basic operations
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.manager.set(key, value, ttl);
  }

  async get(key: string): Promise<any> {
    return await this.manager.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.manager.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return await this.manager.exists(key);
  }

  // Hash operations
  async hSet(key: string, field: string, value: any): Promise<number> {
    return await this.manager.hSet(key, field, value);
  }

  async hGet(key: string, field: string): Promise<any> {
    return await this.manager.hGet(key, field);
  }

  async hGetAll(key: string): Promise<Record<string, any>> {
    return await this.manager.hGetAll(key);
  }

  // List operations
  async lPush(key: string, value: any): Promise<number> {
    return await this.manager.lPush(key, value);
  }

  async rPop(key: string): Promise<any> {
    return await this.manager.rPop(key);
  }

  // Set operations
  async sAdd(key: string, member: any): Promise<number> {
    return await this.manager.sAdd(key, member);
  }

  async sMembers(key: string): Promise<any[]> {
    return await this.manager.sMembers(key);
  }

  // Pub/Sub operations
  async publish(channel: string, message: any): Promise<number> {
    return await this.manager.publish(channel, message);
  }

  async subscribe(channel: string, callback: (message: RedisMessage) => void): Promise<void> {
    await this.manager.subscribe(channel, callback);
  }

  // Stream operations
  async xAdd(key: string, fields: Record<string, string>, options?: StreamOptions): Promise<string> {
    return await this.manager.xAdd(key, fields, options);
  }

  async xRead(key: string, id?: string, count?: number): Promise<StreamMessage[]> {
    return await this.manager.xRead(key, id, count);
  }

  // Lock operations
  async acquireLock(key: string, ttl?: number): Promise<{ acquired: boolean; identifier: string }> {
    const identifier = this.manager['generateId']();
    const acquired = await this.manager.acquireLock({ key, ttl, identifier });
    return { acquired, identifier };
  }

  async releaseLock(key: string, identifier: string): Promise<boolean> {
    return await this.manager.releaseLock(key, identifier);
  }

  // Cache operations
  async setCache(key: string, value: any, ttl?: number, tags?: string[]): Promise<void> {
    await this.manager.setCache({ key, value, ttl, tags });
  }

  async getCache(key: string): Promise<any> {
    return await this.manager.getCache(key);
  }

  async invalidateCacheByTags(tags: string[]): Promise<number> {
    return await this.manager.invalidateCacheByTags(tags);
  }

  // Utility methods
  getConnectionStatus() {
    return this.manager.getConnectionStatus();
  }

  async healthCheck(): Promise<boolean> {
    return await this.manager.healthCheck();
  }

  async getStatistics() {
    return await this.manager.getStatistics();
  }
}

// ===== EXERCISES =====

/*
EXERCISE 1: Create a Redis distributed cache system that:
- Implements cache warming strategies
- Provides cache invalidation patterns
- Supports cache hierarchies
- Implements cache analytics and monitoring
- Is fully typed

EXERCISE 2: Build a Redis message queue system that:
- Implements reliable message delivery
- Supports message priorities
- Provides dead letter queues
- Implements message retry mechanisms
- Is fully typed

EXERCISE 3: Create a Redis real-time analytics system that:
- Implements time-series data storage
- Provides real-time aggregations
- Supports data retention policies
- Implements analytics dashboards
- Is fully typed

EXERCISE 4: Build a Redis session management system that:
- Implements distributed session storage
- Supports session clustering
- Provides session analytics
- Implements session security features
- Is fully typed

EXERCISE 5: Create a Redis rate limiting system that:
- Implements multiple rate limiting algorithms
- Supports distributed rate limiting
- Provides rate limiting analytics
- Implements dynamic rule management
- Is fully typed
*/

// Export classes and interfaces
export { RedisManager, RedisService };

// Export types
export type {
  RedisConfig,
  RedisMessage,
  StreamMessage,
  StreamOptions,
  ConsumerGroupOptions,
  LockOptions,
  CacheOptions,
};