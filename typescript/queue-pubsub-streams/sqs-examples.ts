// SQS TypeScript Examples - Advanced Simple Queue Service Implementation
// This file demonstrates comprehensive TypeScript usage with AWS SQS

import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  PurgeQueueCommand,
  CreateQueueCommand,
  DeleteQueueCommand,
  GetQueueAttributesCommand,
  SetQueueAttributesCommand,
  ListQueuesCommand,
  ChangeMessageVisibilityCommand,
  Message,
  QueueAttributeName,
} from '@aws-sdk/client-sqs';

// ===== BASIC TYPES =====

// SQS configuration
interface SQSConfig {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  endpoint?: string;
  maxAttempts?: number;
  retryMode?: 'standard' | 'legacy' | 'adaptive';
  apiVersion?: string;
  logger?: (level: string, message: string) => void;
}

// Message interface
interface SQSMessage {
  id: string;
  body: any;
  attributes?: Record<string, string>;
  messageAttributes?: Record<string, any>;
  groupId?: string;
  deduplicationId?: string;
  delaySeconds?: number;
  priority?: number;
  timestamp?: number;
  metadata?: Record<string, any>;
}

// Queue configuration
interface QueueConfig {
  name: string;
  attributes?: Partial<Record<QueueAttributeName, string>>;
  tags?: Record<string, string>;
  deadLetterTargetArn?: string;
  maxReceiveCount?: number;
  messageRetentionPeriod?: number;
  visibilityTimeout?: number;
  delaySeconds?: number;
  receiveMessageWaitTimeSeconds?: number;
  maximumMessageSize?: number;
  contentBasedDeduplication?: boolean;
  fifoQueue?: boolean;
}

// Consumer options
interface ConsumerOptions {
  queueUrl: string;
  handler: (message: SQSMessage) => Promise<void>;
  maxMessages?: number;
  waitTimeSeconds?: number;
  visibilityTimeout?: number;
  attributeNames?: string[];
  messageAttributeNames?: string[];
  pollingInterval?: number;
  maxRetries?: number;
  retryDelay?: number;
  deleteOnError?: boolean;
  batchSize?: number;
}

// Producer options
interface ProducerOptions {
  queueUrl: string;
  delaySeconds?: number;
  messageDeduplicationId?: string;
  messageGroupId?: string;
  messageAttributes?: Record<string, any>;
  maxRetries?: number;
  retryDelay?: number;
  batchSize?: number;
}

// ===== SQS MANAGER =====

class SQSManager {
  private client: SQSClient;
  private config: SQSConfig;
  private consumers: Map<string, any> = new Map();
  private isShuttingDown: boolean = false;

  constructor(config: SQSConfig) {
    this.config = config;
    this.client = new SQSClient({
      region: config.region,
      credentials: config.accessKeyId && config.secretAccessKey ? {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        sessionToken: config.sessionToken,
      } : undefined,
      endpoint: config.endpoint,
      maxAttempts: config.maxAttempts || 3,
      retryMode: config.retryMode || 'standard',
      apiVersion: config.apiVersion,
      logger: config.logger,
    });
  }

  // ===== QUEUE MANAGEMENT =====

  // Create queue
  async createQueue(config: QueueConfig): Promise<string> {
    try {
      const attributes: Record<QueueAttributeName, string> = {
        VisibilityTimeout: (config.attributes?.VisibilityTimeout || 30).toString(),
        MessageRetentionPeriod: (config.attributes?.MessageRetentionPeriod || 345600).toString(),
        MaximumMessageSize: (config.attributes?.MaximumMessageSize || 262144).toString(),
        DelaySeconds: (config.attributes?.DelaySeconds || 0).toString(),
        ReceiveMessageWaitTimeSeconds: (config.attributes?.ReceiveMessageWaitTimeSeconds || 0).toString(),
        ...config.attributes,
      };

      // Set dead letter queue configuration
      if (config.deadLetterTargetArn && config.maxReceiveCount) {
        attributes.RedrivePolicy = JSON.stringify({
          deadLetterTargetArn: config.deadLetterTargetArn,
          maxReceiveCount: config.maxReceiveCount,
        });
      }

      // Set FIFO queue configuration
      if (config.fifoQueue) {
        attributes.FifoQueue = 'true';
        attributes.ContentBasedDeduplication = (config.contentBasedDeduplication || false).toString();
      }

      const command = new CreateQueueCommand({
        QueueName: config.name,
        Attributes: attributes,
        tags: config.tags,
      });

      const response = await this.client.send(command);
      console.log(`Queue created: ${config.name}`);
      return response.QueueUrl!;
    } catch (error) {
      console.error('Failed to create queue:', error);
      throw error;
    }
  }

  // Delete queue
  async deleteQueue(queueUrl: string): Promise<void> {
    try {
      const command = new DeleteQueueCommand({
        QueueUrl: queueUrl,
      });

      await this.client.send(command);
      console.log(`Queue deleted: ${queueUrl}`);
    } catch (error) {
      console.error('Failed to delete queue:', error);
      throw error;
    }
  }

  // Purge queue
  async purgeQueue(queueUrl: string): Promise<void> {
    try {
      const command = new PurgeQueueCommand({
        QueueUrl: queueUrl,
      });

      await this.client.send(command);
      console.log(`Queue purged: ${queueUrl}`);
    } catch (error) {
      console.error('Failed to purge queue:', error);
      throw error;
    }
  }

  // List queues
  async listQueues(queueNamePrefix?: string): Promise<string[]> {
    try {
      const command = new ListQueuesCommand({
        QueueNamePrefix: queueNamePrefix,
      });

      const response = await this.client.send(command);
      return response.QueueUrls || [];
    } catch (error) {
      console.error('Failed to list queues:', error);
      throw error;
    }
  }

  // Get queue attributes
  async getQueueAttributes(queueUrl: string, attributeNames: QueueAttributeName[] = []): Promise<Record<string, string>> {
    try {
      const command = new GetQueueAttributesCommand({
        QueueUrl: queueUrl,
        AttributeNames: attributeNames.length > 0 ? attributeNames : ['All'],
      });

      const response = await this.client.send(command);
      return response.Attributes || {};
    } catch (error) {
      console.error('Failed to get queue attributes:', error);
      throw error;
    }
  }

  // Set queue attributes
  async setQueueAttributes(queueUrl: string, attributes: Partial<Record<QueueAttributeName, string>>): Promise<void> {
    try {
      const command = new SetQueueAttributesCommand({
        QueueUrl: queueUrl,
        Attributes: attributes,
      });

      await this.client.send(command);
      console.log(`Queue attributes updated: ${queueUrl}`);
    } catch (error) {
      console.error('Failed to set queue attributes:', error);
      throw error;
    }
  }

  // ===== MESSAGE OPERATIONS =====

  // Send message
  async sendMessage(message: SQSMessage, options: ProducerOptions): Promise<string> {
    try {
      const command = new SendMessageCommand({
        QueueUrl: options.queueUrl,
        MessageBody: JSON.stringify(message.body),
        DelaySeconds: options.delaySeconds || message.delaySeconds,
        MessageAttributes: this.buildMessageAttributes(message.messageAttributes || options.messageAttributes),
        MessageDeduplicationId: options.messageDeduplicationId || message.deduplicationId,
        MessageGroupId: options.messageGroupId || message.groupId,
      });

      const response = await this.client.send(command);
      console.log(`Message sent to queue: ${options.queueUrl}`);
      return response.MessageId!;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  // Send batch messages
  async sendBatchMessages(messages: SQSMessage[], options: ProducerOptions): Promise<string[]> {
    try {
      const entries = messages.map((message, index) => ({
        Id: message.id || `msg_${index}_${Date.now()}`,
        MessageBody: JSON.stringify(message.body),
        DelaySeconds: options.delaySeconds || message.delaySeconds,
        MessageAttributes: this.buildMessageAttributes(message.messageAttributes || options.messageAttributes),
        MessageDeduplicationId: options.messageDeduplicationId || message.deduplicationId,
        MessageGroupId: options.messageGroupId || message.groupId,
      }));

      const command = {
        QueueUrl: options.queueUrl,
        Entries: entries,
      };

      // SQS doesn't have a direct batch send command, so we'll use SendMessageBatchCommand
      const { SendMessageBatchCommand } = await import('@aws-sdk/client-sqs');
      const batchCommand = new SendMessageBatchCommand(command);

      const response = await this.client.send(batchCommand);
      console.log(`Batch of ${messages.length} messages sent to queue: ${options.queueUrl}`);
      
      return response.Successful?.map(msg => msg.MessageId!) || [];
    } catch (error) {
      console.error('Failed to send batch messages:', error);
      throw error;
    }
  }

  // Receive messages
  async receiveMessages(options: {
    queueUrl: string;
    maxMessages?: number;
    waitTimeSeconds?: number;
    visibilityTimeout?: number;
    attributeNames?: string[];
    messageAttributeNames?: string[];
  }): Promise<SQSMessage[]> {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: options.queueUrl,
        MaxNumberOfMessages: options.maxMessages || 1,
        WaitTimeSeconds: options.waitTimeSeconds || 0,
        VisibilityTimeout: options.visibilityTimeout,
        AttributeNames: options.attributeNames || [],
        MessageAttributeNames: options.messageAttributeNames || [],
      });

      const response = await this.client.send(command);
      
      if (!response.Messages) {
        return [];
      }

      return response.Messages.map(msg => this.parseSQSMessage(msg));
    } catch (error) {
      console.error('Failed to receive messages:', error);
      throw error;
    }
  }

  // Delete message
  async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      });

      await this.client.send(command);
      console.log('Message deleted');
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  }

  // Delete batch messages
  async deleteBatchMessages(queueUrl: string, receiptHandles: string[]): Promise<void> {
    try {
      const entries = receiptHandles.map((handle, index) => ({
        Id: `msg_${index}`,
        ReceiptHandle: handle,
      }));

      const { DeleteMessageBatchCommand } = await import('@aws-sdk/client-sqs');
      const command = new DeleteMessageBatchCommand({
        QueueUrl: queueUrl,
        Entries: entries,
      });

      await this.client.send(command);
      console.log(`Batch of ${receiptHandles.length} messages deleted`);
    } catch (error) {
      console.error('Failed to delete batch messages:', error);
      throw error;
    }
  }

  // Change message visibility
  async changeMessageVisibility(queueUrl: string, receiptHandle: string, visibilityTimeout: number): Promise<void> {
    try {
      const command = new ChangeMessageVisibilityCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
        VisibilityTimeout: visibilityTimeout,
      });

      await this.client.send(command);
      console.log(`Message visibility changed to ${visibilityTimeout} seconds`);
    } catch (error) {
      console.error('Failed to change message visibility:', error);
      throw error;
    }
  }

  // ===== CONSUMER MANAGEMENT =====

  // Start consumer
  async startConsumer(consumerId: string, options: ConsumerOptions): Promise<void> {
    if (this.consumers.has(consumerId)) {
      throw new Error(`Consumer ${consumerId} already exists`);
    }

    const consumer = {
      id: consumerId,
      options,
      running: true,
      pollInterval: setInterval(async () => {
        if (!this.isShuttingDown && consumer.running) {
          await this.pollMessages(consumer);
        }
      }, options.pollingInterval || 5000),
    };

    this.consumers.set(consumerId, consumer);
    console.log(`Consumer ${consumerId} started for queue: ${options.queueUrl}`);
  }

  // Stop consumer
  async stopConsumer(consumerId: string): Promise<void> {
    const consumer = this.consumers.get(consumerId);
    if (!consumer) {
      throw new Error(`Consumer ${consumerId} not found`);
    }

    consumer.running = false;
    clearInterval(consumer.pollInterval);
    this.consumers.delete(consumerId);
    console.log(`Consumer ${consumerId} stopped`);
  }

  // Stop all consumers
  async stopAllConsumers(): Promise<void> {
    const stopPromises = Array.from(this.consumers.keys()).map(id => 
      this.stopConsumer(id)
    );
    await Promise.all(stopPromises);
  }

  // Poll messages
  private async pollMessages(consumer: any): Promise<void> {
    try {
      const messages = await this.receiveMessages({
        queueUrl: consumer.options.queueUrl,
        maxMessages: consumer.options.maxMessages || 10,
        waitTimeSeconds: consumer.options.waitTimeSeconds || 20,
        visibilityTimeout: consumer.options.visibilityTimeout,
        attributeNames: consumer.options.attributeNames,
        messageAttributeNames: consumer.options.messageAttributeNames,
      });

      for (const message of messages) {
        try {
          await consumer.options.handler(message);
          
          // Delete message after successful processing
          await this.deleteMessage(consumer.options.queueUrl, message.receiptHandle!);
        } catch (error) {
          console.error('Error processing message:', error);
          
          if (consumer.options.deleteOnError) {
            // Delete message even if processing failed
            await this.deleteMessage(consumer.options.queueUrl, message.receiptHandle!);
          }
          // Otherwise, message will become visible again after visibility timeout
        }
      }
    } catch (error) {
      console.error('Error polling messages:', error);
    }
  }

  // ===== UTILITY METHODS =====

  // Build message attributes
  private buildMessageAttributes(attributes?: Record<string, any>): Record<string, any> {
    if (!attributes) {
      return {};
    }

    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(attributes)) {
      if (typeof value === 'string') {
        result[key] = {
          DataType: 'String',
          StringValue: value,
        };
      } else if (typeof value === 'number') {
        result[key] = {
          DataType: 'Number',
          StringValue: value.toString(),
        };
      } else if (typeof value === 'boolean') {
        result[key] = {
          DataType: 'String',
          StringValue: value.toString(),
        };
      } else if (Buffer.isBuffer(value)) {
        result[key] = {
          DataType: 'Binary',
          BinaryValue: value,
        };
      } else {
        result[key] = {
          DataType: 'String',
          StringValue: JSON.stringify(value),
        };
      }
    }

    return result;
  }

  // Parse SQS message
  private parseSQSMessage(message: Message): SQSMessage {
    return {
      id: message.MessageId!,
      body: JSON.parse(message.Body || '{}'),
      attributes: message.Attributes,
      messageAttributes: message.MessageAttributes,
      receiptHandle: message.ReceiptHandle,
      md5OfBody: message.MD5OfBody,
      timestamp: message.Attributes?.SentTimestamp ? parseInt(message.Attributes.SentTimestamp) : Date.now(),
    };
  }

  // Create message
  createMessage(body: any, options: Partial<SQSMessage> = {}): SQSMessage {
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      body,
      timestamp: Date.now(),
      ...options,
    };
  }

  // Get connection status
  getConnectionStatus(): {
    consumersCount: number;
    isShuttingDown: boolean;
  } {
    return {
      consumersCount: this.consumers.size,
      isShuttingDown: this.isShuttingDown,
    };
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      // Try to list queues as a health check
      await this.listQueues();
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Get statistics
  async getStatistics(queueUrls: string[] = []): Promise<{
    queues: Array<{
      url: string;
      attributes: Record<string, string>;
    }>;
    consumers: string[];
    connectionStatus: any;
  }> {
    try {
      const queueStats = await Promise.all(
        queueUrls.map(async url => ({
          url,
          attributes: await this.getQueueAttributes(url),
        }))
      );

      const consumers = Array.from(this.consumers.keys());

      return {
        queues: queueStats,
        consumers,
        connectionStatus: this.getConnectionStatus(),
      };
    } catch (error) {
      console.error('Failed to get statistics:', error);
      throw error;
    }
  }

  // ===== CLEANUP =====

  async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    await this.stopAllConsumers();
  }
}

// ===== SQS SERVICE =====

class SQSService {
  private manager: SQSManager;

  constructor(config: SQSConfig) {
    this.manager = new SQSManager(config);
  }

  // Initialize service
  async initialize(): Promise<void> {
    // SQS doesn't require explicit initialization
    console.log('SQS service initialized');
  }

  // Shutdown service
  async shutdown(): Promise<void> {
    await this.manager.shutdown();
  }

  // Queue management
  async createQueue(config: QueueConfig): Promise<string> {
    return await this.manager.createQueue(config);
  }

  async deleteQueue(queueUrl: string): Promise<void> {
    await this.manager.deleteQueue(queueUrl);
  }

  async purgeQueue(queueUrl: string): Promise<void> {
    await this.manager.purgeQueue(queueUrl);
  }

  async listQueues(queueNamePrefix?: string): Promise<string[]> {
    return await this.manager.listQueues(queueNamePrefix);
  }

  // Message operations
  async sendMessage(message: SQSMessage, queueUrl: string, options?: Partial<ProducerOptions>): Promise<string> {
    return await this.manager.sendMessage(message, { queueUrl, ...options });
  }

  async sendBatchMessages(messages: SQSMessage[], queueUrl: string, options?: Partial<ProducerOptions>): Promise<string[]> {
    return await this.manager.sendBatchMessages(messages, { queueUrl, ...options });
  }

  async receiveMessages(queueUrl: string, options?: {
    maxMessages?: number;
    waitTimeSeconds?: number;
    visibilityTimeout?: number;
  }): Promise<SQSMessage[]> {
    return await this.manager.receiveMessages({ queueUrl, ...options });
  }

  async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    await this.manager.deleteMessage(queueUrl, receiptHandle);
  }

  // Consumer management
  async startConsumer(consumerId: string, options: ConsumerOptions): Promise<void> {
    await this.manager.startConsumer(consumerId, options);
  }

  async stopConsumer(consumerId: string): Promise<void> {
    await this.manager.stopConsumer(consumerId);
  }

  // Utility methods
  createMessage(body: any, options?: Partial<SQSMessage>): SQSMessage {
    return this.manager.createMessage(body, options);
  }

  getConnectionStatus() {
    return this.manager.getConnectionStatus();
  }

  async healthCheck(): Promise<boolean> {
    return await this.manager.healthCheck();
  }

  async getStatistics(queueUrls?: string[]) {
    return await this.manager.getStatistics(queueUrls);
  }
}

// ===== EXERCISES =====

/*
EXERCISE 1: Create an SQS message retry mechanism that:
- Implements exponential backoff for failed messages
- Moves messages to dead letter queues after max retries
- Tracks retry attempts in message attributes
- Provides retry statistics and monitoring
- Is fully typed

EXERCISE 2: Build an SQS message batching system that:
- Batches multiple messages for efficient processing
- Supports batch size and time window configurations
- Handles partial batch failures gracefully
- Provides batch processing metrics
- Is fully typed

EXERCISE 3: Create an SQS fan-out pattern system that:
- Implements message broadcasting to multiple queues
- Supports dynamic fan-out configurations
- Provides message filtering capabilities
- Handles fan-out failures gracefully
- Is fully typed

EXERCISE 4: Build an SQS monitoring dashboard that:
- Displays real-time queue statistics
- Shows message throughput and depth
- Provides consumer performance metrics
- Supports alerting for queue issues
- Is fully typed

EXERCISE 5: Create an SQS multi-region system that:
- Supports cross-region message replication
- Provides region failover capabilities
- Handles region-specific configurations
- Supports multi-region monitoring
- Is fully typed
*/

// Export classes and interfaces
export { SQSManager, SQSService };

// Export types
export type {
  SQSConfig,
  SQSMessage,
  QueueConfig,
  ConsumerOptions,
  ProducerOptions,
};