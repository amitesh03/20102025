# Axum Web Framework Learning Examples

This folder contains comprehensive examples for learning the Axum web framework in Rust. Axum is a modern, ergonomic web framework built on Tokio and Tower. The examples cover all the topics mentioned in the syllabus.md file.

## Getting Started

### Prerequisites
- Rust installed (via rustup.rs)
- Basic understanding of Rust syntax and concepts
- Familiarity with async/await in Rust

### Running the Examples

1. Navigate to the axum folder:
```bash
cd axum
```

2. Run the server:
```bash
cargo run
```

3. Open your browser or use a tool like curl to access the endpoints:
```
http://127.0.0.1:3000
```

## Available Endpoints

### Basic Examples
- `GET /` - Root endpoint with welcome message
- `GET /hello` - Basic hello world response
- `GET /json` - JSON response example
- `POST /echo` - Echo service (sends back the request body)

### User Management (CRUD Operations)
- `GET /users` - Get all users
- `POST /users` - Create a new user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Extractor Examples
- `GET /extractors/path/:name/:age` - Path parameter extraction
- `GET /extractors/query?param=value` - Query parameter extraction
- `POST /extractors/json` - JSON body extraction
- `POST /extractors/form` - Form data extraction

### State Management
- `GET /counter` - Get current counter value
- `POST /counter/increment` - Increment counter

### Middleware Examples
- `GET /middleware/trace` - Request tracing middleware
- `GET /middleware/auth` - Authentication middleware (requires Authorization header)

### Form Handling
- `GET /form` - HTML form page
- `POST /form/submit` - Form submission handler

### Cookie Handling
- `GET /cookies/set` - Set cookies
- `GET /cookies/get` - Get cookies from request

### Static Files
- `GET /static/*` - Serve static files from the static directory

### WebSocket Examples
- `GET /ws` - WebSocket chat server (connect with WebSocket client)

### Error Handling
- `GET /error/panic` - Panic example (for error handling demonstration)
- `GET /error/custom` - Custom error example

### Streaming
- `GET /stream` - Server-sent events stream

## Example Requests

### Create a User
```bash
curl -X POST http://127.0.0.1:3000/users \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "email": "john@example.com"}'
```

### Get All Users
```bash
curl http://127.0.0.1:3000/users
```

### Test Path Extractor
```bash
curl http://127.0.0.1:3000/extractors/path/alice/25
```

### Test Query Extractor
```bash
curl "http://127.0.0.1:3000/extractors/query?name=bob&age=30&sort=name"
```

### Test Form Submission
```bash
curl -X POST http://127.0.0.1:3000/form/submit \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=John&email=john@example.com&message=Hello Axum"
```

### Test Authentication Middleware
```bash
curl -H "Authorization: Bearer your-token-here" \
  http://127.0.0.1:3000/middleware/auth
```

### WebSocket Connection
Connect to `ws://127.0.0.1:3000/ws` using a WebSocket client and send JSON messages like:
```json
{
  "username": "YourName",
  "message": "Hello, Axum WebSocket!"
}
```

## Learning Path

1. **Start with basic examples** - Hello world, JSON responses
2. **Learn routing** - Path parameters, query parameters
3. **Understand extractors** - How Axum extracts data from requests
4. **Handle data** - Form data, JSON body, cookies
5. **Master middleware** - Custom middleware, authentication, CORS
6. **Manage state** - Shared application state
7. **Advanced features** - WebSockets, streaming
8. **Error handling** - Custom error types and responses

## Code Structure

- `src/main.rs` - Main application entry point and route configuration
- `src/models.rs` - Data models, types, and error definitions
- `src/handlers.rs` - Request handlers for various endpoints
- `src/middleware.rs` - Custom middleware implementations
- `src/extractors.rs` - Custom extractors for request data
- `src/websocket.rs` - WebSocket handling logic

## Key Axum Concepts Demonstrated

### Extractors
Axum uses extractors to get data from HTTP requests. Examples include:
- `Path<T>` - Extract path parameters
- `Query<T>` - Extract query parameters
- `Json<T>` - Extract JSON body
- `Form<T>` - Extract form data
- Custom extractors for authentication, rate limiting, etc.

### Middleware
Stackable middleware that can:
- Log requests and responses
- Handle authentication and authorization
- Add CORS headers
- Rate limit requests
- Modify requests/responses

### State Management
Shared application state using:
- `Arc<Mutex<T>>` for thread-safe shared data
- Custom state structs
- Type-safe state access

### Error Handling
- Custom error types implementing `IntoResponse`
- Graceful error responses
- Proper HTTP status codes

### WebSocket Support
- Real-time communication
- Broadcasting to multiple clients
- Connection management

## Testing the Examples

Each endpoint can be tested using:
- Web browser (for GET requests)
- curl command line tool
- Postman or similar API testing tool
- Custom client applications

## Next Steps

After running these examples:
1. Modify the code to experiment with different features
2. Build your own web application using the patterns shown
3. Explore the [Axum documentation](https://docs.rs/axum/)
4. Check out the [official examples](https://github.com/tokio-rs/axum/tree/main/examples)
5. Learn more about Tower middleware ecosystem

Happy learning with Axum! 🚀