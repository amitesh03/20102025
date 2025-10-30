// RabbitMQ TypeScript Examples - Advanced Message Queue Implementation
// This file demonstrates comprehensive TypeScript usage with RabbitMQ

import amqp, { Connection, Channel, ConsumeMessage } from 'amqplib';

// ===== BASIC TYPES =====

// Message interface
interface Message {
  id: string;
  content: any;
  headers?: Record<string, any>;
  timestamp: Date;
  priority?: number;
  correlationId?: string;
  replyTo?: string;
  expiration?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

// Queue options
interface QueueOptions {
  name: string;
  durable?: boolean;
  exclusive?: boolean;
  autoDelete?: boolean;
  arguments?: Record<string, any>;
  messageTtl?: number;
  maxLength?: number;
  deadLetterExchange?: string;
  deadLetterRoutingKey?: string;
}

// Exchange options
interface ExchangeOptions {
  name: string;
  type: 'direct' | 'topic' | 'headers' | 'fanout';
  durable?: boolean;
  autoDelete?: boolean;
  internal?: boolean;
  alternateExchange?: string;
  arguments?: Record<string, any>;
}

// Consumer options
interface ConsumerOptions {
  queue: string;
  onMessage: (message: Message, ack: () => void, nack: () => void) => Promise<void>;
  prefetch?: number;
  noAck?: boolean;
  exclusive?: boolean;
  priority?: number;
  consumerTag?: string;
  arguments?: Record<string, any>;
}

// Publisher options
interface PublisherOptions {
  exchange?: string;
  routingKey?: string;
  mandatory?: boolean;
  immediate?: boolean;
  priority?: number;
  expiration?: string;
  messageId?: string;
  timestamp?: number;
  userId?: string;
  appId?: string;
  replyTo?: string;
  correlationId?: string;
  headers?: Record<string, any>;
}

// Connection options
interface ConnectionOptions {
  hostname?: string;
  port?: number;
  username?: string;
  password?: string;
  vhost?: string;
  frameMax?: number;
  heartbeat?: number;
  locale?: string;
  timeout?: number;
  clientProperties?: Record<string, any>;
  retry?: number;
  retryDelay?: number;
}

// ===== RABBITMQ MANAGER =====

class RabbitMQManager {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private connectionOptions: ConnectionOptions;
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectDelay: number = 5000;
  private consumers: Map<string, ConsumerOptions> = new Map();
  private isShuttingDown: boolean = false;

  constructor(options: ConnectionOptions = {}) {
    this.connectionOptions = {
      hostname: options.hostname || 'localhost',
      port: options.port || 5672,
      username: options.username || 'guest',
      password: options.password || 'guest',
      vhost: options.vhost || '/',
      frameMax: options.frameMax || 0,
      heartbeat: options.heartbeat || 60,
      locale: options.locale || 'en_US',
      timeout: options.timeout || 0,
      clientProperties: options.clientProperties || {
        product: 'RabbitMQManager',
        version: '1.0.0',
        platform: 'Node.js',
      },
      retry: options.retry || 3,
      retryDelay: options.retryDelay || 1000,
    };
  }

  // ===== CONNECTION MANAGEMENT =====

  // Connect to RabbitMQ
  async connect(): Promise<void> {
    if (this.isConnecting || this.connection) {
      return;
    }

    this.isConnecting = true;

    try {
      console.log('Connecting to RabbitMQ...');
      
      this.connection = await amqp.connect(this.connectionOptions);
      this.channel = await this.connection.createChannel();
      
      // Set up error handlers
      this.connection.on('error', this.handleConnectionError.bind(this));
      this.connection.on('close', this.handleConnectionClose.bind(this));
      this.channel.on('error', this.handleChannelError.bind(this));
      this.channel.on('close', this.handleChannelClose.bind(this));
      
      // Set up QoS
      await this.channel.prefetch(10);
      
      console.log('Connected to RabbitMQ successfully');
      this.reconnectAttempts = 0;
      
      // Re-establish consumers after reconnection
      await this.reestablishConsumers();
      
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      this.isConnecting = false;
      
      if (!this.isShuttingDown && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Reconnecting in ${this.reconnectDelay}ms (attempt ${this.reconnectAttempts})`);
        setTimeout(() => this.connect(), this.reconnectDelay);
      }
      
      throw error;
    }
    
    this.isConnecting = false;
  }

  // Disconnect from RabbitMQ
  async disconnect(): Promise<void> {
    this.isShuttingDown = true;
    
    if (this.channel) {
      await this.channel.close();
      this.channel = null;
    }
    
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
    
    console.log('Disconnected from RabbitMQ');
  }

  // Handle connection error
  private handleConnectionError(error: Error): void {
    console.error('RabbitMQ connection error:', error);
    this.connection = null;
    this.channel = null;
  }

  // Handle connection close
  private handleConnectionClose(): void {
    console.log('RabbitMQ connection closed');
    this.connection = null;
    this.channel = null;
    
    if (!this.isShuttingDown && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting in ${this.reconnectDelay}ms (attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    }
  }

  // Handle channel error
  private handleChannelError(error: Error): void {
    console.error('RabbitMQ channel error:', error);
    this.channel = null;
  }

  // Handle channel close
  private handleChannelClose(): void {
    console.log('RabbitMQ channel closed');
    this.channel = null;
  }

  // Re-establish consumers after reconnection
  private async reestablishConsumers(): Promise<void> {
    for (const [tag, consumer] of this.consumers) {
      try {
        await this.consume(consumer);
        console.log(`Re-established consumer for queue: ${consumer.queue}`);
      } catch (error) {
        console.error(`Failed to re-establish consumer for queue ${consumer.queue}:`, error);
      }
    }
  }

  // ===== QUEUE MANAGEMENT =====

  // Create queue
  async createQueue(options: QueueOptions): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    await this.channel.assertQueue(options.name, {
      durable: options.durable || true,
      exclusive: options.exclusive || false,
      autoDelete: options.autoDelete || false,
      arguments: {
        'x-message-ttl': options.messageTtl,
        'x-max-length': options.maxLength,
        'x-dead-letter-exchange': options.deadLetterExchange,
        'x-dead-letter-routing-key': options.deadLetterRoutingKey,
        ...options.arguments,
      },
    });

    console.log(`Queue created: ${options.name}`);
  }

  // Delete queue
  async deleteQueue(name: string, ifUnused: boolean = false, ifEmpty: boolean = false): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    await this.channel.deleteQueue(name, { ifUnused, ifEmpty });
    console.log(`Queue deleted: ${name}`);
  }

  // Purge queue
  async purgeQueue(name: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    await this.channel.purgeQueue(name);
    console.log(`Queue purged: ${name}`);
  }

  // Get queue info
  async getQueueInfo(name: string): Promise<any> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    const info = await this.channel.checkQueue(name);
    return info;
  }

  // ===== EXCHANGE MANAGEMENT =====

  // Create exchange
  async createExchange(options: ExchangeOptions): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    await this.channel.assertExchange(options.name, options.type, {
      durable: options.durable || true,
      autoDelete: options.autoDelete || false,
      internal: options.internal || false,
      alternateExchange: options.alternateExchange,
      arguments: options.arguments,
    });

    console.log(`Exchange created: ${options.name} (${options.type})`);
  }

  // Delete exchange
  async deleteExchange(name: string, ifUnused: boolean = false): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    await this.channel.deleteExchange(name, { ifUnused });
    console.log(`Exchange deleted: ${name}`);
  }

  // Bind queue to exchange
  async bindQueue(queue: string, exchange: string, routingKey: string, args?: Record<string, any>): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    await this.channel.bindQueue(queue, exchange, routingKey, args);
    console.log(`Queue ${queue} bound to exchange ${exchange} with routing key ${routingKey}`);
  }

  // Unbind queue from exchange
  async unbindQueue(queue: string, exchange: string, routingKey: string, args?: Record<string, any>): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    await this.channel.unbindQueue(queue, exchange, routingKey, args);
    console.log(`Queue ${queue} unbound from exchange ${exchange} with routing key ${routingKey}`);
  }

  // ===== PUBLISHING =====

  // Publish message
  async publish(message: Message, options: PublisherOptions = {}): Promise<boolean> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    const publishOptions = {
      persistent: true,
      mandatory: options.mandatory || false,
      immediate: options.immediate || false,
      priority: options.priority || 0,
      expiration: options.expiration,
      messageId: options.messageId || message.id,
      timestamp: options.timestamp || Date.now(),
      userId: options.userId,
      appId: options.appId,
      replyTo: options.replyTo,
      correlationId: options.correlationId || message.correlationId,
      headers: {
        ...message.headers,
        ...options.headers,
      },
    };

    const content = Buffer.from(JSON.stringify(message));
    
    const published = this.channel.publish(
      options.exchange || '',
      options.routingKey || '',
      content,
      publishOptions
    );

    if (published) {
      console.log(`Message published to ${options.exchange || 'default'} with routing key ${options.routingKey || ''}`);
    } else {
      console.warn(`Failed to publish message to ${options.exchange || 'default'}`);
    }

    return published;
  }

  // Send to queue (direct)
  async sendToQueue(queue: string, message: Message, options: PublisherOptions = {}): Promise<boolean> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    const sendOptions = {
      persistent: true,
      mandatory: options.mandatory || false,
      immediate: options.immediate || false,
      priority: options.priority || 0,
      expiration: options.expiration,
      messageId: options.messageId || message.id,
      timestamp: options.timestamp || Date.now(),
      userId: options.userId,
      appId: options.appId,
      replyTo: options.replyTo,
      correlationId: options.correlationId || message.correlationId,
      headers: {
        ...message.headers,
        ...options.headers,
      },
    };

    const content = Buffer.from(JSON.stringify(message));
    
    const sent = this.channel.sendToQueue(queue, content, sendOptions);

    if (sent) {
      console.log(`Message sent to queue: ${queue}`);
    } else {
      console.warn(`Failed to send message to queue: ${queue}`);
    }

    return sent;
  }

  // ===== CONSUMING =====

  // Consume messages
  async consume(options: ConsumerOptions): Promise<string> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    const consumeOptions = {
      noAck: options.noAck || false,
      exclusive: options.exclusive || false,
      priority: options.priority || 0,
      consumerTag: options.consumerTag || '',
      arguments: options.arguments,
    };

    const consumerTag = await this.channel.consume(
      options.queue,
      async (msg: ConsumeMessage | null) => {
        if (!msg) {
          console.log('Consumer cancelled by server');
          return;
        }

        try {
          const message: Message = JSON.parse(msg.content.toString());
          
          const ack = () => {
            this.channel?.ack(msg);
          };

          const nack = () => {
            this.channel?.nack(msg, false, false);
          };

          await options.onMessage(message, ack, nack);
        } catch (error) {
          console.error('Error processing message:', error);
          this.channel?.nack(msg, false, false);
        }
      },
      consumeOptions
    );

    this.consumers.set(consumerTag, options);
    console.log(`Consumer started for queue: ${options.queue} with tag: ${consumerTag}`);

    return consumerTag;
  }

  // Cancel consumer
  async cancelConsumer(consumerTag: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    await this.channel.cancel(consumerTag);
    this.consumers.delete(consumerTag);
    console.log(`Consumer cancelled: ${consumerTag}`);
  }

  // ===== RPC (Remote Procedure Call) =====

  // RPC client
  async rpcCall(queue: string, message: Message, timeout: number = 30000): Promise<any> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    return new Promise((resolve, reject) => {
      const correlationId = this.generateCorrelationId();
      const replyQueue = `rpc.reply.${correlationId}`;

      // Create temporary reply queue
      this.channel.assertQueue(replyQueue, { exclusive: true, autoDelete: true });

      // Consume reply
      this.channel.consume(replyQueue, (msg) => {
        if (msg && msg.properties.correlationId === correlationId) {
          const response = JSON.parse(msg.content.toString());
          this.channel?.ack(msg);
          this.channel?.deleteQueue(replyQueue);
          resolve(response);
        }
      });

      // Set timeout
      setTimeout(() => {
        this.channel?.deleteQueue(replyQueue);
        reject(new Error('RPC call timeout'));
      }, timeout);

      // Send request
      this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message)),
        {
          correlationId,
          replyTo: replyQueue,
          replyTo: replyQueue,
        }
      );
    });
  }

  // RPC server
  async rpcServer(queue: string, handler: (message: Message) => Promise<any>): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    await this.channel.assertQueue(queue, { durable: true });

    await this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const message: Message = JSON.parse(msg.content.toString());
        const response = await handler(message);

        if (msg.properties.replyTo) {
          this.channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify(response)),
            {
              correlationId: msg.properties.correlationId,
            }
          );
        }

        this.channel.ack(msg);
      } catch (error) {
        console.error('RPC handler error:', error);
        this.channel.nack(msg, false, false);
      }
    });

    console.log(`RPC server started on queue: ${queue}`);
  }

  // ===== UTILITY METHODS =====

  // Generate correlation ID
  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate message ID
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create message
  createMessage(content: any, options: Partial<Message> = {}): Message {
    return {
      id: this.generateMessageId(),
      content,
      timestamp: new Date(),
      ...options,
    };
  }

  // Get connection status
  getConnectionStatus(): {
    connected: boolean;
    connecting: boolean;
    reconnectAttempts: number;
    consumersCount: number;
  } {
    return {
      connected: !!this.connection,
      connecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
      consumersCount: this.consumers.size,
    };
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.connection || !this.channel) {
        return false;
      }

      // Try to check a temporary queue
      const tempQueue = `health_check_${Date.now()}`;
      await this.channel.assertQueue(tempQueue, { exclusive: true, autoDelete: true });
      await this.channel.deleteQueue(tempQueue);

      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Get statistics
  async getStatistics(): Promise<{
    connection: any;
    queues: any[];
    exchanges: any[];
    consumers: string[];
  }> {
    if (!this.connection || !this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    try {
      // Get connection info
      const connectionInfo = {
        serverProperties: this.connection.serverProperties,
        localPort: this.connection.serverProperties?.localPort,
      };

      // Get queues
      const queues = [];
      // Note: This would require management plugin or additional libraries
      // For now, we'll return empty array

      // Get exchanges
      const exchanges = [];
      // Note: This would require management plugin or additional libraries
      // For now, we'll return empty array

      // Get consumers
      const consumers = Array.from(this.consumers.keys());

      return {
        connection: connectionInfo,
        queues,
        exchanges,
        consumers,
      };
    } catch (error) {
      console.error('Failed to get statistics:', error);
      throw error;
    }
  }
}

// ===== RABBITMQ SERVICE =====

class RabbitMQService {
  private manager: RabbitMQManager;

  constructor(connectionOptions?: ConnectionOptions) {
    this.manager = new RabbitMQManager(connectionOptions);
  }

  // Initialize service
  async initialize(): Promise<void> {
    await this.manager.connect();
  }

  // Shutdown service
  async shutdown(): Promise<void> {
    await this.manager.disconnect();
  }

  // Publish message
  async publish(message: Message, options: PublisherOptions = {}): Promise<boolean> {
    return await this.manager.publish(message, options);
  }

  // Send to queue
  async sendToQueue(queue: string, message: Message, options: PublisherOptions = {}): Promise<boolean> {
    return await this.manager.sendToQueue(queue, message, options);
  }

  // Consume messages
  async consume(options: ConsumerOptions): Promise<string> {
    return await this.manager.consume(options);
  }

  // Create queue
  async createQueue(options: QueueOptions): Promise<void> {
    await this.manager.createQueue(options);
  }

  // Create exchange
  async createExchange(options: ExchangeOptions): Promise<void> {
    await this.manager.createExchange(options);
  }

  // Bind queue to exchange
  async bindQueue(queue: string, exchange: string, routingKey: string, args?: Record<string, any>): Promise<void> {
    await this.manager.bindQueue(queue, exchange, routingKey, args);
  }

  // RPC call
  async rpcCall(queue: string, message: Message, timeout?: number): Promise<any> {
    return await this.manager.rpcCall(queue, message, timeout);
  }

  // RPC server
  async rpcServer(queue: string, handler: (message: Message) => Promise<any>): Promise<void> {
    await this.manager.rpcServer(queue, handler);
  }

  // Create message
  createMessage(content: any, options?: Partial<Message>): Message {
    return this.manager.createMessage(content, options);
  }

  // Get connection status
  getConnectionStatus() {
    return this.manager.getConnectionStatus();
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    return await this.manager.healthCheck();
  }

  // Get statistics
  async getStatistics() {
    return await this.manager.getStatistics();
  }
}

// ===== EXERCISES =====

/*
EXERCISE 1: Create a RabbitMQ message retry mechanism that:
- Implements exponential backoff for failed messages
- Moves messages to dead letter queues after max retries
- Tracks retry attempts in message headers
- Provides retry statistics and monitoring
- Is fully typed

EXERCISE 2: Build a RabbitMQ message batching system that:
- Batches multiple messages for efficient processing
- Supports batch size and time window configurations
- Handles partial batch failures gracefully
- Provides batch processing metrics
- Is fully typed

EXERCISE 3: Create a RabbitMQ message routing system that:
- Implements complex routing patterns with topic exchanges
- Supports dynamic routing key generation
- Provides routing rule management
- Handles routing failures and fallbacks
- Is fully typed

EXERCISE 4: Build a RabbitMQ monitoring dashboard that:
- Displays real-time queue statistics
- Shows message throughput and latency
- Provides consumer performance metrics
- Supports alerting for queue issues
- Is fully typed

EXERCISE 5: Create a RabbitMQ message transformation system that:
- Transforms messages between different formats
- Supports message enrichment and filtering
- Provides transformation pipeline management
- Handles transformation errors gracefully
- Is fully typed
*/

// Export classes and interfaces
export { RabbitMQManager, RabbitMQService };

// Export types
export type {
  Message,
  QueueOptions,
  ExchangeOptions,
  ConsumerOptions,
  PublisherOptions,
  ConnectionOptions,
};