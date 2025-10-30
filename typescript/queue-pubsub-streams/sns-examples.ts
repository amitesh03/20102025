// SNS TypeScript Examples - Advanced Simple Notification Service Implementation
// This file demonstrates comprehensive TypeScript usage with AWS SNS

import {
  SNSClient,
  PublishCommand,
  CreateTopicCommand,
  DeleteTopicCommand,
  ListTopicsCommand,
  SubscribeCommand,
  UnsubscribeCommand,
  ListSubscriptionsCommand,
  ConfirmSubscriptionCommand,
  SetSubscriptionAttributesCommand,
  GetTopicAttributesCommand,
  SetTopicAttributesCommand,
  AddPermissionCommand,
  RemovePermissionCommand,
  PlatformApplication,
  CreatePlatformEndpointCommand,
  DeleteEndpointCommand,
  ListEndpointsByPlatformApplicationCommand,
} from '@aws-sdk/client-sns';

// ===== BASIC TYPES =====

// SNS configuration
interface SNSConfig {
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
interface SNSMessage {
  subject?: string;
  message: string;
  messageStructure?: 'json';
  messageAttributes?: Record<string, any>;
  targetArn?: string;
  topicArn?: string;
  phoneNumber?: string;
  groupId?: string;
  deduplicationId?: string;
  timestamp?: number;
  metadata?: Record<string, any>;
}

// Topic configuration
interface TopicConfig {
  name: string;
  attributes?: Record<string, string>;
  tags?: Record<string, string>;
  fifoTopic?: boolean;
  contentBasedDeduplication?: boolean;
  displayName?: string;
  deliveryPolicy?: any;
}

// Subscription configuration
interface SubscriptionConfig {
  topicArn: string;
  protocol: 'http' | 'https' | 'email' | 'email-json' | 'sms' | 'sqs' | 'application' | 'lambda';
  endpoint: string;
  attributes?: Record<string, string>;
  returnSubscriptionArn?: boolean;
}

// Platform endpoint configuration
interface PlatformEndpointConfig {
  platformApplicationArn: string;
  token: string;
  customUserData?: string;
  attributes?: Record<string, string>;
}

// ===== SNS MANAGER =====

class SNSManager {
  private client: SNSClient;
  private config: SNSConfig;
  private topics: Map<string, string> = new Map(); // name -> ARN
  private subscriptions: Map<string, any> = new Map();

  constructor(config: SNSConfig) {
    this.config = config;
    this.client = new SNSClient({
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

  // ===== TOPIC MANAGEMENT =====

  // Create topic
  async createTopic(config: TopicConfig): Promise<string> {
    try {
      const attributes: Record<string, string> = {
        ...config.attributes,
      };

      // Set FIFO topic configuration
      if (config.fifoTopic) {
        attributes.FifoTopic = 'true';
        attributes.ContentBasedDeduplication = (config.contentBasedDeduplication || false).toString();
      }

      // Set display name
      if (config.displayName) {
        attributes.DisplayName = config.displayName;
      }

      // Set delivery policy
      if (config.deliveryPolicy) {
        attributes.DeliveryPolicy = JSON.stringify(config.deliveryPolicy);
      }

      const command = new CreateTopicCommand({
        Name: config.name,
        Attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
        Tags: Object.entries(config.tags || {}).map(([key, value]) => ({
          Key: key,
          Value: value,
        })),
      });

      const response = await this.client.send(command);
      const topicArn = response.TopicArn!;
      
      this.topics.set(config.name, topicArn);
      console.log(`Topic created: ${config.name} (${topicArn})`);
      
      return topicArn;
    } catch (error) {
      console.error('Failed to create topic:', error);
      throw error;
    }
  }

  // Delete topic
  async deleteTopic(topicArn: string): Promise<void> {
    try {
      const command = new DeleteTopicCommand({
        TopicArn: topicArn,
      });

      await this.client.send(command);
      
      // Remove from cache
      for (const [name, arn] of this.topics.entries()) {
        if (arn === topicArn) {
          this.topics.delete(name);
          break;
        }
      }
      
      console.log(`Topic deleted: ${topicArn}`);
    } catch (error) {
      console.error('Failed to delete topic:', error);
      throw error;
    }
  }

  // List topics
  async listTopics(): Promise<Array<{ name: string; arn: string }>> {
    try {
      const command = new ListTopicsCommand({});
      const response = await this.client.send(command);
      
      const topics = response.Topics || [];
      return topics.map(topic => ({
        name: topic.TopicArn?.split(':').pop() || '',
        arn: topic.TopicArn!,
      }));
    } catch (error) {
      console.error('Failed to list topics:', error);
      throw error;
    }
  }

  // Get topic attributes
  async getTopicAttributes(topicArn: string): Promise<Record<string, string>> {
    try {
      const command = new GetTopicAttributesCommand({
        TopicArn: topicArn,
      });

      const response = await this.client.send(command);
      return response.Attributes || {};
    } catch (error) {
      console.error('Failed to get topic attributes:', error);
      throw error;
    }
  }

  // Set topic attributes
  async setTopicAttributes(topicArn: string, attributeName: string, attributeValue: string): Promise<void> {
    try {
      const command = new SetTopicAttributesCommand({
        TopicArn: topicArn,
        AttributeName: attributeName,
        AttributeValue: attributeValue,
      });

      await this.client.send(command);
      console.log(`Topic attribute set: ${attributeName} = ${attributeValue}`);
    } catch (error) {
      console.error('Failed to set topic attribute:', error);
      throw error;
    }
  }

  // ===== SUBSCRIPTION MANAGEMENT =====

  // Subscribe to topic
  async subscribe(config: SubscriptionConfig): Promise<string> {
    try {
      const command = new SubscribeCommand({
        TopicArn: config.topicArn,
        Protocol: config.protocol,
        Endpoint: config.endpoint,
        Attributes: config.attributes,
        ReturnSubscriptionArn: config.returnSubscriptionArn,
      });

      const response = await this.client.send(command);
      const subscriptionArn = response.SubscriptionArn!;
      
      console.log(`Subscription created: ${subscriptionArn}`);
      return subscriptionArn;
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw error;
    }
  }

  // Unsubscribe from topic
  async unsubscribe(subscriptionArn: string): Promise<void> {
    try {
      const command = new UnsubscribeCommand({
        SubscriptionArn: subscriptionArn,
      });

      await this.client.send(command);
      console.log(`Subscription deleted: ${subscriptionArn}`);
    } catch (error) {
      console.error('Failed to delete subscription:', error);
      throw error;
    }
  }

  // List subscriptions
  async listSubscriptions(topicArn?: string): Promise<Array<{
    subscriptionArn: string;
    topicArn: string;
    protocol: string;
    endpoint: string;
    owner: string;
  }>> {
    try {
      const command = new ListSubscriptionsCommand({});
      const response = await this.client.send(command);
      
      let subscriptions = response.Subscriptions || [];
      
      // Filter by topic if specified
      if (topicArn) {
        subscriptions = subscriptions.filter(sub => sub.TopicArn === topicArn);
      }
      
      return subscriptions.map(sub => ({
        subscriptionArn: sub.SubscriptionArn!,
        topicArn: sub.TopicArn!,
        protocol: sub.Protocol!,
        endpoint: sub.Endpoint!,
        owner: sub.Owner!,
      }));
    } catch (error) {
      console.error('Failed to list subscriptions:', error);
      throw error;
    }
  }

  // Confirm subscription
  async confirmSubscription(topicArn: string, token: string, authenticateOnUnsubscribe?: string): Promise<string> {
    try {
      const command = new ConfirmSubscriptionCommand({
        TopicArn: topicArn,
        Token: token,
        AuthenticateOnUnsubscribe: authenticateOnUnsubscribe,
      });

      const response = await this.client.send(command);
      const subscriptionArn = response.SubscriptionArn!;
      
      console.log(`Subscription confirmed: ${subscriptionArn}`);
      return subscriptionArn;
    } catch (error) {
      console.error('Failed to confirm subscription:', error);
      throw error;
    }
  }

  // Set subscription attributes
  async setSubscriptionAttributes(
    subscriptionArn: string,
    attributeName: string,
    attributeValue: string
  ): Promise<void> {
    try {
      const command = new SetSubscriptionAttributesCommand({
        SubscriptionArn: subscriptionArn,
        AttributeName: attributeName,
        AttributeValue: attributeValue,
      });

      await this.client.send(command);
      console.log(`Subscription attribute set: ${attributeName} = ${attributeValue}`);
    } catch (error) {
      console.error('Failed to set subscription attribute:', error);
      throw error;
    }
  }

  // ===== PUBLISHING =====

  // Publish message
  async publish(message: SNSMessage): Promise<string> {
    try {
      const command = new PublishCommand({
        TopicArn: message.topicArn,
        TargetArn: message.targetArn,
        PhoneNumber: message.phoneNumber,
        Subject: message.subject,
        Message: message.message,
        MessageStructure: message.messageStructure,
        MessageAttributes: this.buildMessageAttributes(message.messageAttributes),
        MessageGroupId: message.groupId,
        MessageDeduplicationId: message.deduplicationId,
      });

      const response = await this.client.send(command);
      const messageId = response.MessageId!;
      
      console.log(`Message published: ${messageId}`);
      return messageId;
    } catch (error) {
      console.error('Failed to publish message:', error);
      throw error;
    }
  }

  // Publish batch messages
  async publishBatch(messages: SNSMessage[]): Promise<string[]> {
    const messageIds: string[] = [];
    
    for (const message of messages) {
      try {
        const messageId = await this.publish(message);
        messageIds.push(messageId);
      } catch (error) {
        console.error('Failed to publish batch message:', error);
        // Continue with other messages
      }
    }
    
    console.log(`Batch of ${messageIds.length} messages published`);
    return messageIds;
  }

  // ===== PLATFORM ENDPOINTS =====

  // Create platform application
  async createPlatformApplication(config: {
    name: string;
    platform: 'GCM' | 'APNS' | 'APNS_SANDBOX' | 'ADM' | 'Baidu';
    attributes: Record<string, string>;
  }): Promise<string> {
    try {
      const { CreatePlatformApplicationCommand } = await import('@aws-sdk/client-sns');
      const command = new CreatePlatformApplicationCommand({
        Name: config.name,
        Platform: config.platform,
        Attributes: config.attributes,
      });

      const response = await this.client.send(command);
      const platformApplicationArn = response.PlatformApplicationArn!;
      
      console.log(`Platform application created: ${platformApplicationArn}`);
      return platformApplicationArn;
    } catch (error) {
      console.error('Failed to create platform application:', error);
      throw error;
    }
  }

  // Create platform endpoint
  async createPlatformEndpoint(config: PlatformEndpointConfig): Promise<string> {
    try {
      const command = new CreatePlatformEndpointCommand({
        PlatformApplicationArn: config.platformApplicationArn,
        Token: config.token,
        CustomUserData: config.customUserData,
        Attributes: config.attributes,
      });

      const response = await this.client.send(command);
      const endpointArn = response.EndpointArn!;
      
      console.log(`Platform endpoint created: ${endpointArn}`);
      return endpointArn;
    } catch (error) {
      console.error('Failed to create platform endpoint:', error);
      throw error;
    }
  }

  // Delete endpoint
  async deleteEndpoint(endpointArn: string): Promise<void> {
    try {
      const command = new DeleteEndpointCommand({
        EndpointArn: endpointArn,
      });

      await this.client.send(command);
      console.log(`Endpoint deleted: ${endpointArn}`);
    } catch (error) {
      console.error('Failed to delete endpoint:', error);
      throw error;
    }
  }

  // List endpoints by platform application
  async listEndpointsByPlatformApplication(platformApplicationArn: string): Promise<Array<{
    arn: string;
    token: string;
    attributes: Record<string, string>;
  }>> {
    try {
      const command = new ListEndpointsByPlatformApplicationCommand({
        PlatformApplicationArn: platformApplicationArn,
      });

      const response = await this.client.send(command);
      
      return (response.Endpoints || []).map(endpoint => ({
        arn: endpoint.EndpointArn!,
        token: endpoint.Token!,
        attributes: endpoint.Attributes || {},
      }));
    } catch (error) {
      console.error('Failed to list endpoints:', error);
      throw error;
    }
  }

  // ===== PERMISSION MANAGEMENT =====

  // Add permission
  async addPermission(topicArn: string, label: string, permissions: Array<{
    accountId: string;
    actionName: string;
  }>): Promise<void> {
    try {
      const command = new AddPermissionCommand({
        TopicArn: topicArn,
        Label: label,
        AWSAccountId: permissions.map(p => p.accountId),
        ActionName: permissions.map(p => p.actionName),
      });

      await this.client.send(command);
      console.log(`Permission added: ${label}`);
    } catch (error) {
      console.error('Failed to add permission:', error);
      throw error;
    }
  }

  // Remove permission
  async removePermission(topicArn: string, label: string): Promise<void> {
    try {
      const command = new RemovePermissionCommand({
        TopicArn: topicArn,
        Label: label,
      });

      await this.client.send(command);
      console.log(`Permission removed: ${label}`);
    } catch (error) {
      console.error('Failed to remove permission:', error);
      throw error;
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

  // Create message
  createMessage(message: string, options: Partial<SNSMessage> = {}): SNSMessage {
    return {
      message,
      timestamp: Date.now(),
      ...options,
    };
  }

  // Create JSON message for multiple platforms
  createJsonMessage(platforms: Record<string, any>, defaultMessage?: string): SNSMessage {
    const messageObject: Record<string, any> = {
      default: defaultMessage || 'This message is intended for mobile devices.',
      ...platforms,
    };

    return {
      message: JSON.stringify(messageObject),
      messageStructure: 'json',
      timestamp: Date.now(),
    };
  }

  // Get topic ARN by name
  getTopicArn(name: string): string | undefined {
    return this.topics.get(name);
  }

  // Cache topic ARN
  cacheTopicArn(name: string, arn: string): void {
    this.topics.set(name, arn);
  }

  // Get connection status
  getConnectionStatus(): {
    topicsCount: number;
    subscriptionsCount: number;
  } {
    return {
      topicsCount: this.topics.size,
      subscriptionsCount: this.subscriptions.size,
    };
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      // Try to list topics as a health check
      await this.listTopics();
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Get statistics
  async getStatistics(): Promise<{
    topics: Array<{ name: string; arn: string }>;
    subscriptions: Array<{
      subscriptionArn: string;
      topicArn: string;
      protocol: string;
      endpoint: string;
    }>;
    connectionStatus: any;
  }> {
    try {
      const [topics, subscriptions] = await Promise.all([
        this.listTopics(),
        this.listSubscriptions(),
      ]);

      return {
        topics,
        subscriptions,
        connectionStatus: this.getConnectionStatus(),
      };
    } catch (error) {
      console.error('Failed to get statistics:', error);
      throw error;
    }
  }
}

// ===== SNS SERVICE =====

class SNSService {
  private manager: SNSManager;

  constructor(config: SNSConfig) {
    this.manager = new SNSManager(config);
  }

  // Initialize service
  async initialize(): Promise<void> {
    // SNS doesn't require explicit initialization
    console.log('SNS service initialized');
  }

  // Shutdown service
  async shutdown(): Promise<void> {
    // SNS doesn't require explicit shutdown
    console.log('SNS service shutdown');
  }

  // Topic management
  async createTopic(config: TopicConfig): Promise<string> {
    return await this.manager.createTopic(config);
  }

  async deleteTopic(topicArn: string): Promise<void> {
    await this.manager.deleteTopic(topicArn);
  }

  async listTopics(): Promise<Array<{ name: string; arn: string }>> {
    return await this.manager.listTopics();
  }

  // Subscription management
  async subscribe(config: SubscriptionConfig): Promise<string> {
    return await this.manager.subscribe(config);
  }

  async unsubscribe(subscriptionArn: string): Promise<void> {
    await this.manager.unsubscribe(subscriptionArn);
  }

  async listSubscriptions(topicArn?: string): Promise<Array<{
    subscriptionArn: string;
    topicArn: string;
    protocol: string;
    endpoint: string;
    owner: string;
  }>> {
    return await this.manager.listSubscriptions(topicArn);
  }

  // Publishing
  async publish(message: SNSMessage): Promise<string> {
    return await this.manager.publish(message);
  }

  async publishBatch(messages: SNSMessage[]): Promise<string[]> {
    return await this.manager.publishBatch(messages);
  }

  // Platform endpoints
  async createPlatformApplication(config: {
    name: string;
    platform: 'GCM' | 'APNS' | 'APNS_SANDBOX' | 'ADM' | 'Baidu';
    attributes: Record<string, string>;
  }): Promise<string> {
    return await this.manager.createPlatformApplication(config);
  }

  async createPlatformEndpoint(config: PlatformEndpointConfig): Promise<string> {
    return await this.manager.createPlatformEndpoint(config);
  }

  // Utility methods
  createMessage(message: string, options?: Partial<SNSMessage>): SNSMessage {
    return this.manager.createMessage(message, options);
  }

  createJsonMessage(platforms: Record<string, any>, defaultMessage?: string): SNSMessage {
    return this.manager.createJsonMessage(platforms, defaultMessage);
  }

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
EXERCISE 1: Create an SNS message filtering system that:
- Implements subscription filtering policies
- Supports dynamic filter rule management
- Provides filter analytics and monitoring
- Handles filter evaluation performance
- Is fully typed

EXERCISE 2: Build an SNS fan-out pattern system that:
- Implements message broadcasting to multiple topics
- Supports conditional message routing
- Provides message transformation capabilities
- Handles fan-out failures gracefully
- Is fully typed

EXERCISE 3: Create an SNS mobile push notification system that:
- Supports multiple mobile platforms (iOS, Android)
- Implements device token management
- Provides push notification analytics
- Handles push notification failures
- Is fully typed

EXERCISE 4: Build an SNS monitoring dashboard that:
- Displays real-time topic statistics
- Shows message delivery metrics
- Provides subscription performance data
- Supports alerting for delivery issues
- Is fully typed

EXERCISE 5: Create an SNS multi-region system that:
- Supports cross-region topic replication
- Provides region failover capabilities
- Handles region-specific configurations
- Supports multi-region monitoring
- Is fully typed
*/

// Export classes and interfaces
export { SNSManager, SNSService };

// Export types
export type {
  SNSConfig,
  SNSMessage,
  TopicConfig,
  SubscriptionConfig,
  PlatformEndpointConfig,
};