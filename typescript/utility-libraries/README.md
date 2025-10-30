# TypeScript Utility Libraries

This folder contains comprehensive TypeScript examples for popular utility libraries commonly used in modern web development. Each library demonstrates best practices, advanced patterns, and production-ready implementations.

## Libraries Covered

### 1. Axios - HTTP Client
**File**: [`axios-examples.ts`](./axios-examples.ts)

Axios is a popular promise-based HTTP client for the browser and Node.js. This example demonstrates:

- **Type-safe API clients** with comprehensive error handling
- **Request/response interceptors** for authentication and logging
- **File upload/download** with progress tracking
- **Request cancellation** and retry logic
- **Caching layer** with TTL support
- **Concurrent requests** and batch operations
- **Request builder pattern** for complex configurations

Key Features:
- Generic API wrapper class
- Comprehensive error handling with typed responses
- Authentication token management
- File upload with chunking and resume capability
- Request queuing and retry with exponential backoff
- In-memory caching with configurable TTL

### 2. Lodash - Utility Library
**File**: [`lodash-examples.ts`](./lodash-examples.ts)

Lodash provides utility functions for common programming tasks. This example demonstrates:

- **Type-safe utility functions** for data manipulation
- **Functional programming patterns** with composition
- **Deep object manipulation** with type safety
- **Array operations** with custom comparators
- **String manipulation** with Unicode support
- **Performance optimizations** with memoization

Key Features:
- Custom type guards for runtime type checking
- Functional composition with pipe and compose
- Deep cloning with circular reference handling
- Custom comparators for complex data structures
- Performance monitoring and optimization

### 3. Date-fns - Date Manipulation
**File**: [`date-fns-examples.ts`](./date-fns-examples.ts)

Date-fns provides modern date manipulation utilities. This example demonstrates:

- **Type-safe date operations** with timezone support
- **Date formatting** with internationalization
- **Date arithmetic** with business day calculations
- **Date validation** and parsing
- **Recurring date patterns** and scheduling
- **Performance optimizations** for date calculations

Key Features:
- Custom date formats with locale support
- Business day calculations with holidays
- Date range operations and intersections
- Timezone-aware date manipulations
- Performance-optimized date calculations

### 4. Ramda - Functional Programming
**File**: [`ramda-examples.ts`](./ramda-examples.ts)

Ramda is a practical functional library for JavaScript. This example demonstrates:

- **Functional programming patterns** with currying
- **Immutable data operations** with type safety
- **Point-free style** programming
- **Function composition** and piping
- **Lens operations** for deep object manipulation
- **Transducers** for efficient data processing

Key Features:
- Type-safe currying and partial application
- Immutable data structures with type preservation
- Point-free function composition
- Lens-based object manipulation
- Transducer-based data processing

### 5. RxJS - Reactive Programming
**File**: [`rxjs-examples.ts`](./rxjs-examples.ts)

RxJS is a reactive programming library using Observables. This example demonstrates:

- **Observable patterns** with type safety
- **Stream processing** with operators
- **Error handling** and retry strategies
- **Subject patterns** for multicasting
- **Scheduling** and concurrency control
- **Testing utilities** for observables

Key Features:
- Type-safe observable streams
- Custom operators with proper typing
- Error handling and recovery strategies
- Subject-based communication patterns
- Performance-optimized stream processing

## Installation

To use these examples, install the required dependencies:

```bash
# Install all dependencies
npm install axios lodash date-fns ramda rxjs

# Install with TypeScript types
npm install axios lodash date-fns ramda rxjs @types/lodash @types/ramda
```

## Usage Examples

### Basic Usage

```typescript
import { apiClient, createUser } from './axios-examples';
import { deepClone, sortBy } from './lodash-examples';
import { format, addDays } from './date-fns-examples';

// API usage
const user = await createUser({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  isActive: true,
  preferences: {
    theme: 'dark',
    language: 'en',
    notifications: { email: true, push: false, sms: false },
    privacy: { profileVisibility: 'public', showEmail: false, showPhone: false }
  }
});

// Lodash usage
const clonedUser = deepClone(user);
const sortedUsers = sortBy(users, ['name', 'email']);

// Date-fns usage
const formattedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const futureDate = addDays(new Date(), 7);
```

### Advanced Patterns

```typescript
import { RequestBuilder } from './axios-examples';
import { compose, pipe } from './ramda-examples';
import { Observable, interval } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';

// Request builder pattern
const request = new RequestBuilder('https://api.example.com')
  .setMethod('POST')
  .setUrl('/users')
  .setData(userData)
  .setHeaders({ 'X-Custom': 'value' })
  .setTimeout(5000)
  .execute();

// Functional composition
const processUsers = compose(
  filter((user: User) => user.isActive),
  map((user: User) => ({ ...user, processed: true })),
  sortBy(['name'])
);

// Reactive programming
const userStream = interval(1000).pipe(
  take(10),
  map(i => getUserById(`user-${i}`)),
  filter(user => user.isActive)
);
```

## Best Practices

### 1. Type Safety
- Always use TypeScript interfaces for API responses
- Leverage generic types for reusable components
- Create custom type guards for runtime validation
- Use discriminated unions for complex state management

### 2. Error Handling
- Implement comprehensive error handling for all operations
- Use typed error responses for better debugging
- Implement retry logic with exponential backoff
- Provide meaningful error messages to users

### 3. Performance
- Use memoization for expensive operations
- Implement caching for frequently accessed data
- Optimize bundle size with tree shaking
- Use lazy loading for large datasets

### 4. Testing
- Write unit tests for all utility functions
- Mock external dependencies for isolated testing
- Test error scenarios and edge cases
- Use type assertions for test data

## Common Patterns

### API Client Pattern
```typescript
class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({ baseURL });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request/response interceptors
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.instance.get(url);
    return response.data;
  }
}
```

### Functional Composition Pattern
```typescript
const processData = pipe(
  validateData,
  transformData,
  enrichData,
  saveData
);

const result = processData(rawData);
```

### Reactive Pattern
```typescript
const dataStream = createDataStream().pipe(
  filter(data => data.isValid),
  map(data => transform(data)),
  catchError(error => handleError(error))
);
```

## Performance Considerations

### 1. Bundle Size
- Use tree shaking to eliminate unused code
- Import specific functions instead of entire libraries
- Consider lighter alternatives when possible
- Use dynamic imports for code splitting

### 2. Memory Usage
- Avoid memory leaks with proper cleanup
- Use weak references for cached data
- Implement object pooling for frequently created objects
- Monitor memory usage in production

### 3. Network Performance
- Implement request deduplication
- Use connection pooling for HTTP requests
- Cache responses appropriately
- Optimize payload sizes

## Security Considerations

### 1. Data Validation
- Validate all input data
- Sanitize user inputs
- Use type guards for runtime validation
- Implement proper error handling

### 2. Authentication
- Securely store authentication tokens
- Implement token refresh mechanisms
- Use HTTPS for all API calls
- Implement rate limiting

### 3. Data Protection
- Encrypt sensitive data
- Use secure headers
- Implement CORS properly
- Validate API responses

## Testing Strategies

### 1. Unit Testing
```typescript
describe('ApiClient', () => {
  it('should make successful GET request', async () => {
    const client = new ApiClient('https://api.test.com');
    const result = await client.get('/users');
    expect(result).toBeDefined();
  });
});
```

### 2. Integration Testing
```typescript
describe('API Integration', () => {
  it('should handle user creation flow', async () => {
    const user = await createUser(userData);
    expect(user.id).toBeDefined();
    
    const fetchedUser = await getUserById(user.id);
    expect(fetchedUser.email).toBe(userData.email);
  });
});
```

### 3. Performance Testing
```typescript
describe('Performance', () => {
  it('should handle large datasets efficiently', () => {
    const start = performance.now();
    const result = processLargeDataset(largeData);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(1000); // 1 second
  });
});
```

## Troubleshooting

### Common Issues

1. **Type Errors**: Ensure all interfaces are properly defined
2. **Import Errors**: Check that all dependencies are installed
3. **Performance Issues**: Profile and optimize bottlenecks
4. **Memory Leaks**: Implement proper cleanup patterns

### Debugging Tips

1. Use TypeScript's strict mode for better error detection
2. Enable source maps for better debugging
3. Use console logging with proper formatting
4. Implement error boundaries for graceful error handling

## Contributing

When contributing to these examples:

1. Follow TypeScript best practices
2. Add comprehensive type definitions
3. Include meaningful comments and documentation
4. Write tests for new functionality
5. Update documentation for any API changes

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Lodash Documentation](https://lodash.com/docs/)
- [Date-fns Documentation](https://date-fns.org/)
- [Ramda Documentation](https://ramdajs.com/)
- [RxJS Documentation](https://rxjs.dev/)

## License

These examples are provided for educational purposes. Please refer to individual library licenses for usage restrictions.