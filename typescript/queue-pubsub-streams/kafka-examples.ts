// Kafka TypeScript Examples - Advanced Distributed Streaming Platform
// This file demonstrates comprehensive TypeScript usage with Apache Kafka

import { Kafka, Producer, Consumer, KafkaMessage, ProducerRecord, ConsumerSubscribeTopic } from 'kafkajs';

// ===== BASIC TYPES =====

// Message interface
interface KafkaMessageData {
  key?: string | Buffer;
  value: any;
  headers?: Record<string, Buffer>;
  partition?: number;
  timestamp?: number;
  offset?: string;
}

// Producer configuration
interface ProducerConfig {
  clientId: string;
  brokers: string[];
  ssl?: boolean;
  sasl?: {
    mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512' | 'aws';
    username?: string;
    password?: string;
  };
  requestTimeout?: number;
  enforceRequestTimeout?: boolean;
  idempotent?: boolean;
  maxInFlightRequests?: number;
  messageTimeout?: number;
  metadataMaxAge?: number;
  allowAutoTopicCreation?: boolean;
  transactionTimeout?: number;
  transactionalId?: string;
  maxMessagesPerTransaction?: number;
}

// Consumer configuration
interface ConsumerConfig {
  clientId: string;
  groupId: string;
  brokers: string[];
  ssl?: boolean;
  sasl?: {
    mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512' | 'aws';
    username?: string;
    password?: string;
  };
  sessionTimeout?: number;
  rebalanceTimeout?: number;
  heartbeatInterval?: number;
  maxWaitTimeInMs?: number;
  allowAutoTopicCreation?: boolean;
  maxBytesPerPartition?: number;
  minBytes?: number;
  maxBytes?: number;
  maxPollRecords?: number;
  maxPollInterval?: number;
  readUncommitted?: boolean;
  rackId?: string;
}

// Topic configuration
interface TopicConfig {
  topic: string;
  numPartitions?: number;
  replicationFactor?: number;
  configEntries?: Array<{
    name: string;
    value: string;
  }>;
}

// Admin configuration
interface AdminConfig {
  clientId: string;
  brokers: string[];
  ssl?: boolean;
  sasl?: {
    mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512' | 'aws';
    username?: string;
    password?: string;
  };
  requestTimeout?: number;
  enforceRequestTimeout?: boolean;
  retry?: {
    initialRetryTime?: number;
    retries?: number;
  };
}

// ===== KAFKA MANAGER =====

class KafkaManager {
  private kafka: Kafka;
  private producer: Producer | null = null;
  private consumers: Map<string, Consumer> = new Map();
  private admin: any = null;
  private producerConfig: ProducerConfig;
  private consumerConfig: ConsumerConfig;
  private adminConfig: AdminConfig;

  constructor(config: {
    producer: ProducerConfig;
    consumer: ConsumerConfig;
    admin: AdminConfig;
  }) {
    this.producerConfig = config.producer;
    this.consumerConfig = config.consumer;
    this.adminConfig = config.admin;

    this.kafka = new Kafka({
      clientId: config.producer.clientId,
      brokers: config.producer.brokers,
      ssl: config.producer.ssl,
      sasl: config.producer.sasl,
      requestTimeout: config.producer.requestTimeout,
      enforceRequestTimeout: config.producer.enforceRequestTimeout,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });
  }

  // ===== PRODUCER MANAGEMENT =====

  // Initialize producer
  async initializeProducer(): Promise<void> {
    if (this.producer) {
      return;
    }

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: this.producerConfig.allowAutoTopicCreation,
      idempotent: this.producerConfig.idempotent || true,
      maxInFlightRequests: this.producerConfig.maxInFlightRequests || 1,
      messageTimeout: this.producerConfig.messageTimeout || 30000,
      metadataMaxAge: this.producerConfig.metadataMaxAge || 300000,
      transactionTimeout: this.producerConfig.transactionTimeout || 60000,
      transactionalId: this.producerConfig.transactionalId,
      maxMessagesPerTransaction: this.producerConfig.maxMessagesPerTransaction,
    });

    await this.producer.connect();
    console.log('Kafka producer connected');
  }

  // Disconnect producer
  async disconnectProducer(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
      this.producer = null;
      console.log('Kafka producer disconnected');
    }
  }

  // Send message
  async sendMessage(record: ProducerRecord): Promise<void> {
    if (!this.producer) {
      throw new Error('Producer not initialized');
    }

    try {
      await this.producer.send(record);
      console.log(`Message sent to topic ${record.topic}`);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  // Send batch messages
  async sendBatchMessages(records: ProducerRecord[]): Promise<void> {
    if (!this.producer) {
      throw new Error('Producer not initialized');
    }

    try {
      await this.producer.sendBatch(records);
      console.log(`Batch of ${records.length} messages sent`);
    } catch (error) {
      console.error('Failed to send batch messages:', error);
      throw error;
    }
  }

  // Start transaction
  async startTransaction(): Promise<void> {
    if (!this.producer) {
      throw new Error('Producer not initialized');
    }

    await this.producer.transaction();
    console.log('Transaction started');
  }

  // Commit transaction
  async commitTransaction(): Promise<void> {
    if (!this.producer) {
      throw new Error('Producer not initialized');
    }

    await this.producer.commitTransaction();
    console.log('Transaction committed');
  }

  // Abort transaction
  async abortTransaction(): Promise<void> {
    if (!this.producer) {
      throw new Error('Producer not initialized');
    }

    await this.producer.abortTransaction();
    console.log('Transaction aborted');
  }

  // Send message in transaction
  async sendInTransaction(record: ProducerRecord): Promise<void> {
    if (!this.producer) {
      throw new Error('Producer not initialized');
    }

    try {
      await this.startTransaction();
      await this.sendMessage(record);
      await this.commitTransaction();
      console.log(`Message sent in transaction to topic ${record.topic}`);
    } catch (error) {
      await this.abortTransaction();
      console.error('Failed to send message in transaction:', error);
      throw error;
    }
  }

  // ===== CONSUMER MANAGEMENT =====

  // Create consumer
  async createConsumer(consumerId: string): Promise<void> {
    if (this.consumers.has(consumerId)) {
      return;
    }

    const consumer = this.kafka.consumer({
      groupId: this.consumerConfig.groupId,
      sessionTimeout: this.consumerConfig.sessionTimeout || 30000,
      rebalanceTimeout: this.consumerConfig.rebalanceTimeout || 60000,
      heartbeatInterval: this.consumerConfig.heartbeatInterval || 3000,
      maxWaitTimeInMs: this.consumerConfig.maxWaitTimeInMs || 5000,
      allowAutoTopicCreation: this.consumerConfig.allowAutoTopicCreation,
      maxBytesPerPartition: this.consumerConfig.maxBytesPerPartition || 1048576,
      minBytes: this.consumerConfig.minBytes || 1,
      maxBytes: this.consumerConfig.maxBytes || 52428800,
      maxPollRecords: this.consumerConfig.maxPollRecords || 500,
      maxPollInterval: this.consumerConfig.maxPollInterval || 300000,
      readUncommitted: this.consumerConfig.readUncommitted || false,
      rackId: this.consumerConfig.rackId,
    });

    await consumer.connect();
    this.consumers.set(consumerId, consumer);
    console.log(`Consumer ${consumerId} connected`);
  }

  // Disconnect consumer
  async disconnectConsumer(consumerId: string): Promise<void> {
    const consumer = this.consumers.get(consumerId);
    if (consumer) {
      await consumer.disconnect();
      this.consumers.delete(consumerId);
      console.log(`Consumer ${consumerId} disconnected`);
    }
  }

  // Disconnect all consumers
  async disconnectAllConsumers(): Promise<void> {
    const disconnectPromises = Array.from(this.consumers.keys()).map(id => 
      this.disconnectConsumer(id)
    );
    await Promise.all(disconnectPromises);
  }

  // Subscribe to topic
  async subscribe(consumerId: string, topic: string | string[]): Promise<void> {
    const consumer = this.consumers.get(consumerId);
    if (!consumer) {
      throw new Error(`Consumer ${consumerId} not found`);
    }

    const topics = Array.isArray(topic) ? topic : [topic];
    const subscribeTopics: ConsumerSubscribeTopic[] = topics.map(t => ({
      topic: t,
      fromBeginning: false,
    }));

    await consumer.subscribe({ topics: subscribeTopics });
    console.log(`Consumer ${consumerId} subscribed to topics: ${topics.join(', ')}`);
  }

  // Run consumer
  async runConsumer(
    consumerId: string,
    handler: (message: KafkaMessage) => Promise<void>
  ): Promise<void> {
    const consumer = this.consumers.get(consumerId);
    if (!consumer) {
      throw new Error(`Consumer ${consumerId} not found`);
    }

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          console.log(`Received message from topic ${topic}, partition ${partition}`);
          await handler(message);
        } catch (error) {
          console.error('Error processing message:', error);
          // In a real implementation, you might want to implement retry logic
          // or send the message to a dead letter queue
        }
      },
      eachBatch: async ({ batch }) => {
        // Process batch of messages
        for (const message of batch.messages) {
          try {
            await handler(message);
          } catch (error) {
            console.error('Error processing batch message:', error);
          }
        }
      },
    });

    console.log(`Consumer ${consumerId} started`);
  }

  // Pause consumer
  async pauseConsumer(consumerId: string, topicPartitions: Array<{ topic: string; partition?: number }>): Promise<void> {
    const consumer = this.consumers.get(consumerId);
    if (!consumer) {
      throw new Error(`Consumer ${consumerId} not found`);
    }

    consumer.pause(topicPartitions);
    console.log(`Consumer ${consumerId} paused for topics: ${topicPartitions.map(tp => tp.topic).join(', ')}`);
  }

  // Resume consumer
  async resumeConsumer(consumerId: string, topicPartitions: Array<{ topic: string; partition?: number }>): Promise<void> {
    const consumer = this.consumers.get(consumerId);
    if (!consumer) {
      throw new Error(`Consumer ${consumerId} not found`);
    }

    consumer.resume(topicPartitions);
    console.log(`Consumer ${consumerId} resumed for topics: ${topicPartitions.map(tp => tp.topic).join(', ')}`);
  }

  // Seek to offset
  async seek(consumerId: string, topic: string, partition: number, offset: string): Promise<void> {
    const consumer = this.consumers.get(consumerId);
    if (!consumer) {
      throw new Error(`Consumer ${consumerId} not found`);
    }

    await consumer.seek({ topic, partition, offset });
    console.log(`Consumer ${consumerId} seeked to offset ${offset} for topic ${topic}, partition ${partition}`);
  }

  // ===== ADMIN OPERATIONS =====

  // Initialize admin
  async initializeAdmin(): Promise<void> {
    if (this.admin) {
      return;
    }

    this.admin = this.kafka.admin();
    await this.admin.connect();
    console.log('Kafka admin connected');
  }

  // Disconnect admin
  async disconnectAdmin(): Promise<void> {
    if (this.admin) {
      await this.admin.disconnect();
      this.admin = null;
      console.log('Kafka admin disconnected');
    }
  }

  // Create topic
  async createTopic(config: TopicConfig): Promise<void> {
    if (!this.admin) {
      throw new Error('Admin not initialized');
    }

    try {
      await this.admin.createTopics({
        topics: [{
          topic: config.topic,
          numPartitions: config.numPartitions || 1,
          replicationFactor: config.replicationFactor || 1,
          configEntries: config.configEntries || [],
        }],
      });

      console.log(`Topic ${config.topic} created`);
    } catch (error) {
      console.error('Failed to create topic:', error);
      throw error;
    }
  }

  // Delete topic
  async deleteTopic(topic: string): Promise<void> {
    if (!this.admin) {
      throw new Error('Admin not initialized');
    }

    try {
      await this.admin.deleteTopics({
        topics: [topic],
      });

      console.log(`Topic ${topic} deleted`);
    } catch (error) {
      console.error('Failed to delete topic:', error);
      throw error;
    }
  }

  // List topics
  async listTopics(): Promise<string[]> {
    if (!this.admin) {
      throw new Error('Admin not initialized');
    }

    try {
      const topics = await this.admin.listTopics();
      return topics;
    } catch (error) {
      console.error('Failed to list topics:', error);
      throw error;
    }
  }

  // Get topic metadata
  async getTopicMetadata(topic?: string): Promise<any> {
    if (!this.admin) {
      throw new Error('Admin not initialized');
    }

    try {
      const metadata = await this.admin.fetchTopicMetadata({
        topics: topic ? [topic] : undefined,
      });

      return metadata;
    } catch (error) {
      console.error('Failed to get topic metadata:', error);
      throw error;
    }
  }

  // Get cluster metadata
  async getClusterMetadata(): Promise<any> {
    if (!this.admin) {
      throw new Error('Admin not initialized');
    }

    try {
      const metadata = await this.admin.describeCluster();
      return metadata;
    } catch (error) {
      console.error('Failed to get cluster metadata:', error);
      throw error;
    }
  }

  // Get consumer group offsets
  async getConsumerGroupOffsets(groupId: string, topic: string): Promise<any> {
    if (!this.admin) {
      throw new Error('Admin not initialized');
    }

    try {
      const offsets = await this.admin.fetchOffsets({
        groupId,
        topic,
      });

      return offsets;
    } catch (error) {
      console.error('Failed to get consumer group offsets:', error);
      throw error;
    }
  }

  // Reset consumer group offsets
  async resetConsumerGroupOffsets(
    groupId: string,
    topic: string,
    offsets: Array<{ partition: number; offset: string }>
  ): Promise<void> {
    if (!this.admin) {
      throw new Error('Admin not initialized');
    }

    try {
      await this.admin.setOffsets({
        groupId,
        topic,
        partitions: offsets,
      });

      console.log(`Consumer group ${groupId} offsets reset for topic ${topic}`);
    } catch (error) {
      console.error('Failed to reset consumer group offsets:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  // Create message
  createMessage(value: any, key?: string, headers?: Record<string, Buffer>): KafkaMessageData {
    return {
      key,
      value,
      headers,
      timestamp: Date.now(),
    };
  }

  // Serialize message
  serializeMessage(message: KafkaMessageData): { key?: Buffer; value: Buffer; headers?: Record<string, Buffer> } {
    return {
      key: message.key ? Buffer.from(message.key) : undefined,
      value: Buffer.from(JSON.stringify(message.value)),
      headers: message.headers,
    };
  }

  // Deserialize message
  deserializeMessage(message: KafkaMessage): KafkaMessageData {
    return {
      key: message.key ? message.key.toString() : undefined,
      value: JSON.parse(message.value?.toString() || '{}'),
      headers: message.headers,
      partition: message.partition,
      timestamp: message.timestamp,
      offset: message.offset,
    };
  }

  // Get connection status
  getConnectionStatus(): {
    producerConnected: boolean;
    consumersCount: number;
    adminConnected: boolean;
  } {
    return {
      producerConnected: !!this.producer,
      consumersCount: this.consumers.size,
      adminConnected: !!this.admin,
    };
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      // Check if we can get cluster metadata
      await this.getClusterMetadata();
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Get statistics
  async getStatistics(): Promise<{
    cluster: any;
    topics: string[];
    consumers: string[];
    producerConnected: boolean;
    adminConnected: boolean;
  }> {
    try {
      const [clusterMetadata, topics] = await Promise.all([
        this.getClusterMetadata(),
        this.listTopics(),
      ]);

      const consumers = Array.from(this.consumers.keys());

      return {
        cluster: clusterMetadata,
        topics,
        consumers,
        producerConnected: !!this.producer,
        adminConnected: !!this.admin,
      };
    } catch (error) {
      console.error('Failed to get statistics:', error);
      throw error;
    }
  }

  // ===== CLEANUP =====

  async disconnect(): Promise<void> {
    await Promise.all([
      this.disconnectProducer(),
      this.disconnectAllConsumers(),
      this.disconnectAdmin(),
    ]);
  }
}

// ===== KAFKA SERVICE =====

class KafkaService {
  private manager: KafkaManager;

  constructor(config: {
    producer: ProducerConfig;
    consumer: ConsumerConfig;
    admin: AdminConfig;
  }) {
    this.manager = new KafkaManager(config);
  }

  // Initialize service
  async initialize(): Promise<void> {
    await Promise.all([
      this.manager.initializeProducer(),
      this.manager.initializeAdmin(),
    ]);
  }

  // Shutdown service
  async shutdown(): Promise<void> {
    await this.manager.disconnect();
  }

  // Publish message
  async publish(topic: string, message: KafkaMessageData, partition?: number): Promise<void> {
    const serializedMessage = this.manager.serializeMessage(message);
    
    await this.manager.sendMessage({
      topic,
      messages: [serializedMessage],
      partition,
    });
  }

  // Publish batch messages
  async publishBatch(topic: string, messages: KafkaMessageData[]): Promise<void> {
    const serializedMessages = messages.map(msg => this.manager.serializeMessage(msg));
    
    await this.manager.sendBatchMessages([{
      topic,
      messages: serializedMessages,
    }]);
  }

  // Subscribe to topic
  async subscribe(consumerId: string, topic: string | string[]): Promise<void> {
    await this.manager.createConsumer(consumerId);
    await this.manager.subscribe(consumerId, topic);
  }

  // Start consuming
  async startConsuming(
    consumerId: string,
    handler: (message: KafkaMessageData) => Promise<void>
  ): Promise<void> {
    await this.manager.runConsumer(consumerId, async (kafkaMessage) => {
      const message = this.manager.deserializeMessage(kafkaMessage);
      await handler(message);
    });
  }

  // Create topic
  async createTopic(config: TopicConfig): Promise<void> {
    await this.manager.createTopic(config);
  }

  // Delete topic
  async deleteTopic(topic: string): Promise<void> {
    await this.manager.deleteTopic(topic);
  }

  // List topics
  async listTopics(): Promise<string[]> {
    return await this.manager.listTopics();
  }

  // Get topic metadata
  async getTopicMetadata(topic?: string): Promise<any> {
    return await this.manager.getTopicMetadata(topic);
  }

  // Create message
  createMessage(value: any, key?: string, headers?: Record<string, Buffer>): KafkaMessageData {
    return this.manager.createMessage(value, key, headers);
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
EXERCISE 1: Create a Kafka message retry mechanism that:
- Implements exponential backoff for failed messages
- Moves messages to dead letter topics after max retries
- Tracks retry attempts in message headers
- Provides retry statistics and monitoring
- Is fully typed

EXERCISE 2: Build a Kafka message batching system that:
- Batches multiple messages for efficient processing
- Supports batch size and time window configurations
- Handles partial batch failures gracefully
- Provides batch processing metrics
- Is fully typed

EXERCISE 3: Create a Kafka stream processing system that:
- Implements real-time data transformation
- Supports windowed aggregations
- Provides stream joining capabilities
- Handles stream processing errors gracefully
- Is fully typed

EXERCISE 4: Build a Kafka monitoring dashboard that:
- Displays real-time topic statistics
- Shows consumer lag and throughput
- Provides producer performance metrics
- Supports alerting for cluster issues
- Is fully typed

EXERCISE 5: Create a Kafka multi-tenant system that:
- Supports tenant isolation with topics
- Provides tenant-specific consumer groups
- Handles tenant resource allocation
- Supports tenant monitoring and billing
- Is fully typed
*/

// Export classes and interfaces
export { KafkaManager, KafkaService };

// Export types
export type {
  KafkaMessageData,
  ProducerConfig,
  ConsumerConfig,
  TopicConfig,
  AdminConfig,
};