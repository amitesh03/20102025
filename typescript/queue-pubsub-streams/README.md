# Queue, Pub/Sub, and Streams with TypeScript

This folder contains comprehensive TypeScript examples for implementing message queuing, publish/subscribe patterns, and streaming data processing. Each example demonstrates best practices, advanced patterns, and production-ready implementations.

## 📁 Folder Structure

```
queue-pubsub-streams/
├── README.md                    # This file - comprehensive documentation
├── rabbitmq-examples.ts         # RabbitMQ message broker implementation
├── kafka-examples.ts            # Apache Kafka distributed streaming
├── redis-examples.ts            # Redis in-memory data structures
├── sqs-examples.ts             # AWS SQS queue service
└── sns-examples.ts             # AWS SNS notification service
```

## 🚀 Message Queue and Streaming Technologies Covered

### 1. RabbitMQ
- **File**: `rabbitmq-examples.ts`
- **Features**: Message broker, routing patterns, RPC, clustering
- **Use Case**: Complex message routing and enterprise messaging

### 2. Apache Kafka
- **File**: `kafka-examples.ts`
- **Features**: Distributed streaming, topics, partitions, consumer groups
- **Use Case**: High-throughput event streaming and log aggregation

### 3. Redis
- **File**: `redis-examples.ts`
- **Features**: In-memory data structures, pub/sub, streams, caching
- **Use Case**: Fast data access and real-time messaging

### 4. AWS SQS
- **File**: `sqs-examples.ts`
- **Features**: Managed queue service, dead letter queues, visibility timeout
- **Use Case**: Reliable message queuing in AWS ecosystem

### 5. AWS SNS
- **File**: `sns-examples.ts`
- **Features**: Pub/sub messaging, mobile push notifications, fan-out
- **Use Case**: Broadcast messaging and notifications

## 🚀 Quick Start

### Installation

```bash
# Install RabbitMQ client
npm install amqplib

# Install Kafka client
npm install kafkajs

# Install Redis client
npm install redis

# Install AWS SDK
npm install @aws-sdk/client-sqs @aws-sdk/client-sns

# Install TypeScript types
npm install -D @types/amqplib @types/node
```

### Basic RabbitMQ Example

```typescript
import { RabbitMQService } from './rabbitmq-examples';

const rabbitmq = new RabbitMQService({
  hostname: 'localhost',
  port: 5672,
  username: 'guest',
  password: 'guest',
});

await rabbitmq.initialize();

// Create queue
await rabbitmq.createQueue({
  name: 'tasks',
  durable: true,
});

// Send message
const message = rabbitmq.createMessage({ task: 'process-data', id: 123 });
await rabbitmq.sendToQueue('tasks', message);

// Consume messages
await rabbitmq.consume({
  queue: 'tasks',
  onMessage: async (message, ack, nack) => {
    console.log('Received:', message);
    ack(); // Acknowledge message
  },
});
```

### Basic Kafka Example

```typescript
import { KafkaService } from './kafka-examples';

const kafka = new KafkaService({
  producer: {
    clientId: 'my-app',
    brokers: ['localhost:9092'],
  },
  consumer: {
    clientId: 'my-app',
    groupId: 'my-group',
    brokers: ['localhost:9092'],
  },
  admin: {
    clientId: 'my-app',
    brokers: ['localhost:9092'],
  },
});

await kafka.initialize();

// Create topic
await kafka.createTopic({
  topic: 'events',
  numPartitions: 3,
  replicationFactor: 1,
});

// Publish message
const message = kafka.createMessage({ event: 'user-signup', userId: 123 });
await kafka.publish('events', message);

// Subscribe to topic
await kafka.subscribe('consumer-1', 'events');
await kafka.startConsuming('consumer-1', async (message) => {
  console.log('Received:', message);
});
```

### Basic Redis Example

```typescript
import { RedisService } from './redis-examples';

const redis = new RedisService({
  host: 'localhost',
  port: 6379,
});

await redis.initialize();

// Set value
await redis.set('user:123', { name: 'John', email: 'john@example.com' });

// Get value
const user = await redis.get('user:123');
console.log('User:', user);

// Publish message
await redis.publish('notifications', { type: 'email', userId: 123 });

// Subscribe to channel
await redis.subscribe('notifications', (message) => {
  console.log('Notification:', message);
});
```

### Basic SQS Example

```typescript
import { SQSService } from './sqs-examples';

const sqs = new SQSService({
  region: 'us-east-1',
  accessKeyId: 'your-access-key',
  secretAccessKey: 'your-secret-key',
});

await sqs.initialize();

// Create queue
const queueUrl = await sqs.createQueue({
  name: 'tasks',
  attributes: {
    VisibilityTimeout: '30',
    MessageRetentionPeriod: '1209600', // 14 days
  },
});

// Send message
const message = sqs.createMessage({ task: 'process-data', id: 123 });
await sqs.sendMessage(message, queueUrl);

// Receive messages
const messages = await sqs.receiveMessages(queueUrl, {
  maxMessages: 10,
  waitTimeSeconds: 20,
});

for (const msg of messages) {
  console.log('Received:', msg);
  await sqs.deleteMessage(queueUrl, msg.receiptHandle!);
}
```

### Basic SNS Example

```typescript
import { SNSService } from './sns-examples';

const sns = new SNSService({
  region: 'us-east-1',
  accessKeyId: 'your-access-key',
  secretAccessKey: 'your-secret-key',
});

await sns.initialize();

// Create topic
const topicArn = await sns.createTopic({
  name: 'notifications',
  displayName: 'Application Notifications',
});

// Subscribe to topic
const subscriptionArn = await sns.subscribe({
  topicArn,
  protocol: 'email',
  endpoint: 'user@example.com',
});

// Publish message
const message = sns.createMessage('Welcome to our application!', {
  subject: 'Welcome',
  topicArn,
});

await sns.publish(message);
```

## 📚 Detailed Examples

### RabbitMQ Implementation

The RabbitMQ implementation includes:

- **Connection Management**: Automatic reconnection and error handling
- **Queue Management**: Queue creation, deletion, and configuration
- **Exchange Management**: Direct, topic, fanout, and headers exchanges
- **Message Publishing**: Reliable message delivery with acknowledgments
- **Message Consumption**: Consumer management and message processing
- **RPC Pattern**: Remote procedure call implementation
- **Advanced Features**: Dead letter queues, message TTL, priority queues

```typescript
// Advanced RabbitMQ usage
const rabbitmq = new RabbitMQService({
  hostname: 'localhost',
  port: 5672,
  username: 'guest',
  password: 'guest',
});

// Create exchange
await rabbitmq.createExchange({
  name: 'events',
  type: 'topic',
  durable: true,
});

// Create queue with dead letter exchange
await rabbitmq.createQueue({
  name: 'user-events',
  durable: true,
  deadLetterExchange: 'dlx',
  deadLetterRoutingKey: 'user-events',
  messageTtl: 60000, // 1 minute
});

// Bind queue to exchange
await rabbitmq.bindQueue('user-events', 'events', 'user.*');

// RPC call
const response = await rabbitmq.rpcCall('user-service', {
  action: 'getUser',
  userId: 123,
});
```

### Kafka Implementation

The Kafka implementation includes:

- **Producer Management**: High-throughput message publishing
- **Consumer Management**: Consumer groups and load balancing
- **Topic Management**: Topic creation and configuration
- **Admin Operations**: Cluster management and monitoring
- **Transaction Support**: Atomic message publishing
- **Stream Processing**: Real-time data processing capabilities

```typescript
// Advanced Kafka usage
const kafka = new KafkaService({
  producer: {
    clientId: 'my-app',
    brokers: ['localhost:9092'],
    idempotent: true,
    maxInFlightRequests: 1,
  },
  consumer: {
    clientId: 'my-app',
    groupId: 'my-group',
    brokers: ['localhost:9092'],
    sessionTimeout: 30000,
    heartbeatInterval: 3000,
  },
  admin: {
    clientId: 'my-app',
    brokers: ['localhost:9092'],
  },
});

// Transactional publishing
await kafka.startTransaction();
await kafka.publish('events', kafka.createMessage({ event: 'user-created' }));
await kafka.publish('events', kafka.createMessage({ event: 'profile-updated' }));
await kafka.commitTransaction();

// Batch processing
await kafka.publishBatch('events', [
  kafka.createMessage({ event: 'event1' }),
  kafka.createMessage({ event: 'event2' }),
  kafka.createMessage({ event: 'event3' }),
]);
```

### Redis Implementation

The Redis implementation includes:

- **Data Structures**: Strings, hashes, lists, sets, sorted sets
- **Pub/Sub**: Real-time messaging and notifications
- **Streams**: Log-structured data processing
- **Caching**: Advanced caching with tags and invalidation
- **Locking**: Distributed locks for coordination
- **Transactions**: Atomic operations and pipelines

```typescript
// Advanced Redis usage
const redis = new RedisService({
  host: 'localhost',
  port: 6379,
});

// Distributed lock
const { acquired, identifier } = await redis.acquireLock('resource-123', 30000);
if (acquired) {
  try {
    // Critical section
    await processResource('resource-123');
  } finally {
    await redis.releaseLock('resource-123', identifier);
  }
}

// Stream processing
await redis.xAdd('events-stream', {
  event: 'user-signup',
  userId: '123',
  timestamp: Date.now().toString(),
});

const messages = await redis.xRead('events-stream', '0', 10);

// Cache with tags
await redis.setCache('user:123', userData, 3600, ['users', 'profile']);
await redis.invalidateCacheByTags(['users']);
```

### SQS Implementation

The SQS implementation includes:

- **Queue Management**: Queue creation, configuration, and monitoring
- **Message Publishing**: Reliable message delivery with attributes
- **Message Consumption**: Polling and long-polling consumers
- **Batch Operations**: Efficient batch processing
- **Dead Letter Queues**: Error handling and retry mechanisms
- **Visibility Management**: Message visibility timeout control

```typescript
// Advanced SQS usage
const sqs = new SQSService({
  region: 'us-east-1',
});

// Create queue with dead letter queue
const mainQueueUrl = await sqs.createQueue({
  name: 'tasks',
  attributes: {
    VisibilityTimeout: '30',
    MessageRetentionPeriod: '1209600',
    RedrivePolicy: JSON.stringify({
      deadLetterTargetArn: 'arn:aws:sqs:us-east-1:123456789012:tasks-dlq',
      maxReceiveCount: 3,
    }),
  },
});

// Consumer with error handling
await sqs.startConsumer('task-processor', {
  queueUrl: mainQueueUrl,
  maxMessages: 10,
  waitTimeSeconds: 20,
  handler: async (message) => {
    try {
      await processTask(message.body);
    } catch (error) {
      console.error('Task processing failed:', error);
      // Message will be retried or sent to DLQ
    }
  },
});
```

### SNS Implementation

The SNS implementation includes:

- **Topic Management**: Topic creation and configuration
- **Subscription Management**: Multiple subscription protocols
- **Message Publishing**: Multi-format message delivery
- **Platform Applications**: Mobile push notifications
- **Message Filtering**: Subscription-based filtering
- **Fan-out Pattern**: Broadcasting to multiple endpoints

```typescript
// Advanced SNS usage
const sns = new SNSService({
  region: 'us-east-1',
});

// Create FIFO topic
const topicArn = await sns.createTopic({
  name: 'orders.fifo',
  fifoTopic: true,
  contentBasedDeduplication: true,
});

// Subscribe with filter
await sns.subscribe({
  topicArn,
  protocol: 'sqs',
  endpoint: 'arn:aws:sqs:us-east-1:123456789012:order-queue',
  attributes: {
    FilterPolicy: JSON.stringify({
      orderType: ['electronics', 'books'],
    }),
  },
});

// JSON message for multiple platforms
const message = sns.createJsonMessage({
  GCM: { notification: { title: 'New Order', body: 'Your order has been placed' } },
  APNS: { aps: { alert: { title: 'New Order', body: 'Your order has been placed' } } },
  email: { text: 'Your order has been placed', html: '<h1>Your order has been placed</h1>' },
});

await sns.publish({ ...message, topicArn });
```

## 🔒 Security Best Practices

### Message Security
- Use TLS/SSL for all connections
- Implement message encryption for sensitive data
- Use IAM roles and policies for AWS services
- Validate and sanitize all message content
- Implement proper authentication and authorization

### Network Security
- Use VPC endpoints for AWS services
- Implement firewall rules for message brokers
- Use private networks where possible
- Monitor for unauthorized access attempts
- Implement rate limiting and throttling

### Data Protection
- Encrypt data at rest and in transit
- Implement proper key management
- Use message deduplication for idempotency
- Implement proper data retention policies
- Monitor for data leaks and breaches

## 🧪 Testing

### Unit Testing

```typescript
import { RabbitMQService } from './rabbitmq-examples';

describe('RabbitMQ Service', () => {
  let rabbitmq: RabbitMQService;

  beforeEach(() => {
    rabbitmq = new RabbitMQService({
      hostname: 'localhost',
      port: 5672,
      username: 'guest',
      password: 'guest',
    });
  });

  test('should create and consume message', async () => {
    await rabbitmq.initialize();
    
    const message = rabbitmq.createMessage({ test: 'data' });
    await rabbitmq.sendToQueue('test-queue', message);
    
    // Verify message was received
    const received = await new Promise((resolve) => {
      rabbitmq.consume({
        queue: 'test-queue',
        onMessage: async (msg, ack) => {
          resolve(msg);
          ack();
        },
      });
    });
    
    expect(received.content).toEqual({ test: 'data' });
  });
});
```

### Integration Testing

```typescript
import { KafkaService } from './kafka-examples';

describe('Kafka Integration', () => {
  let kafka: KafkaService;
  let topic: string;

  beforeAll(async () => {
    kafka = new KafkaService({
      producer: { clientId: 'test', brokers: ['localhost:9092'] },
      consumer: { clientId: 'test', groupId: 'test-group', brokers: ['localhost:9092'] },
      admin: { clientId: 'test', brokers: ['localhost:9092'] },
    });
    
    await kafka.initialize();
    topic = `test-topic-${Date.now()}`;
    await kafka.createTopic({ topic });
  });

  test('should publish and consume message', async () => {
    const message = kafka.createMessage({ test: 'data' });
    await kafka.publish(topic, message);

    const received = await new Promise((resolve) => {
      kafka.startConsuming('test-consumer', topic, async (msg) => {
        resolve(msg);
      });
    });

    expect(received.value).toEqual({ test: 'data' });
  });
});
```

## 📊 Monitoring and Analytics

### Message Metrics

```typescript
// Track message metrics
class MessageMetrics {
  private metrics: Map<string, any> = new Map();

  trackMessage(queue: string, operation: 'publish' | 'consume', duration: number): void {
    const key = `${queue}:${operation}`;
    const metric = this.metrics.get(key) || { count: 0, totalDuration: 0 };
    
    metric.count++;
    metric.totalDuration += duration;
    
    this.metrics.set(key, metric);
  }

  getMetrics(): any {
    const result: any = {};
    
    for (const [key, metric] of this.metrics.entries()) {
      const [queue, operation] = key.split(':');
      
      if (!result[queue]) {
        result[queue] = {};
      }
      
      result[queue][operation] = {
        count: metric.count,
        averageDuration: metric.totalDuration / metric.count,
      };
    }
    
    return result;
  }
}
```

### Health Monitoring

```typescript
// Health check for all services
class ServiceHealthMonitor {
  private services: Array<{ name: string; healthCheck: () => Promise<boolean> }> = [];

  addService(name: string, healthCheck: () => Promise<boolean>): void {
    this.services.push({ name, healthCheck });
  }

  async checkAll(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const service of this.services) {
      try {
        results[service.name] = await service.healthCheck();
      } catch (error) {
        results[service.name] = false;
      }
    }
    
    return results;
  }
}
```

## 🚀 Production Deployment

### Environment Configuration

```bash
# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=my-app
KAFKA_GROUP_ID=my-group

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### Docker Configuration

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: message-processor
spec:
  replicas: 3
  selector:
    matchLabels:
      app: message-processor
  template:
    metadata:
      labels:
        app: message-processor
    spec:
      containers:
      - name: processor
        image: message-processor:latest
        env:
        - name: KAFKA_BROKERS
          value: "kafka:9092"
        - name: REDIS_HOST
          value: "redis:6379"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## 🛠️ Advanced Patterns

### Message Routing Patterns

```typescript
// Content-based routing
class MessageRouter {
  private routes: Array<{ condition: (msg: any) => boolean; destination: string }> = [];

  addRoute(condition: (msg: any) => boolean, destination: string): void {
    this.routes.push({ condition, destination });
  }

  route(message: any): string[] {
    const destinations: string[] = [];
    
    for (const route of this.routes) {
      if (route.condition(message)) {
        destinations.push(route.destination);
      }
    }
    
    return destinations;
  }
}
```

### Event Sourcing Pattern

```typescript
// Event store implementation
class EventStore {
  private events: Map<string, any[]> = new Map();

  saveEvent(aggregateId: string, event: any): void {
    if (!this.events.has(aggregateId)) {
      this.events.set(aggregateId, []);
    }
    
    this.events.get(aggregateId)!.push({
      ...event,
      timestamp: Date.now(),
      version: this.events.get(aggregateId)!.length + 1,
    });
  }

  getEvents(aggregateId: string): any[] {
    return this.events.get(aggregateId) || [];
  }

  replayEvents(aggregateId: string, initialState: any): any {
    const events = this.getEvents(aggregateId);
    return events.reduce((state, event) => this.applyEvent(state, event), initialState);
  }

  private applyEvent(state: any, event: any): any {
    // Apply event to state based on event type
    switch (event.type) {
      case 'USER_CREATED':
        return { ...state, id: event.userId, name: event.name };
      case 'USER_UPDATED':
        return { ...state, name: event.name };
      default:
        return state;
    }
  }
}
```

### CQRS Pattern

```typescript
// Command Query Responsibility Segregation
class CQRSHandler {
  private commandHandlers: Map<string, (command: any) => Promise<any>> = new Map();
  private queryHandlers: Map<string, (query: any) => Promise<any>> = new Map();

  registerCommand(commandType: string, handler: (command: any) => Promise<any>): void {
    this.commandHandlers.set(commandType, handler);
  }

  registerQuery(queryType: string, handler: (query: any) => Promise<any>): void {
    this.queryHandlers.set(queryType, handler);
  }

  async handleCommand(command: any): Promise<any> {
    const handler = this.commandHandlers.get(command.type);
    if (!handler) {
      throw new Error(`No handler for command type: ${command.type}`);
    }
    return await handler(command);
  }

  async handleQuery(query: any): Promise<any> {
    const handler = this.queryHandlers.get(query.type);
    if (!handler) {
      throw new Error(`No handler for query type: ${query.type}`);
    }
    return await handler(query);
  }
}
```

## 📚 Additional Resources

### Documentation
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Redis Documentation](https://redis.io/documentation)
- [AWS SQS Documentation](https://docs.aws.amazon.com/sqs/)
- [AWS SNS Documentation](https://docs.aws.amazon.com/sns/)

### Best Practices
- [RabbitMQ Best Practices](https://www.rabbitmq.com/getstarted.html)
- [Kafka Best Practices](https://www.confluent.io/blog/kafka-best-practices/)
- [Redis Best Practices](https://redis.io/topics/memory-optimization)
- [AWS Messaging Best Practices](https://docs.aws.amazon.com/sns/latest/dg/sns-best-practices.html)

### Libraries and Tools
- [amqplib](https://www.npmjs.com/package/amqplib)
- [kafkajs](https://www.npmjs.com/package/kafkajs)
- [redis](https://www.npmjs.com/package/redis)
- [@aws-sdk/client-sqs](https://www.npmjs.com/package/@aws-sdk/client-sqs)
- [@aws-sdk/client-sns](https://www.npmjs.com/package/@aws-sdk/client-sns)

## 🤝 Contributing

When contributing to this queue/pub-sub/streams examples folder:

1. Follow TypeScript best practices and conventions
2. Include comprehensive type definitions
3. Add proper error handling and validation
4. Include security considerations
5. Add tests for new functionality
6. Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: These examples are for educational purposes. Always review and adapt implementations for your specific use case and requirements.