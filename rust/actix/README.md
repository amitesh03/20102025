# Actix Web Framework Learning Examples

This folder contains comprehensive examples for learning the Actix web framework in Rust. The examples cover all the topics mentioned in the syllabus.md file.

## Getting Started

### Prerequisites
- Rust installed (via rustup.rs)
- Basic understanding of Rust syntax and concepts

### Running the Examples

1. Navigate to the actix folder:
```bash
cd actix
```

2. Run the server:
```bash
cargo run
```

3. Open your browser or use a tool like curl to access the endpoints:
```
http://127.0.0.1:8080
```

## Available Endpoints

### Basic Examples
- `GET /hello` - Basic hello world response
- `GET /json` - JSON response example
- `POST /echo` - Echo service (sends back the request body)

### User Management (CRUD Operations)
- `GET /users` - Get all users
- `POST /users` - Create a new user
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Middleware Examples
- `GET /middleware/test` - Test various middleware
- `GET /middleware/timing` - Request timing example

### Form Handling
- `GET /examples/form` - HTML form page
- `POST /examples/form/submit` - Form submission handler

### Data Extraction Examples
- `GET /examples/query?param=value` - Query parameter extraction
- `GET /examples/path/{name}/{age}` - Path parameter extraction
- `POST /examples/body/json` - JSON body extraction
- `POST /examples/body/text` - Text body extraction

### Cookie Examples
- `GET /examples/cookies/set` - Set cookies
- `GET /examples/cookies/get` - Get cookies from request

### Streaming Examples
- `GET /examples/stream` - Server-sent events stream

### WebSocket Examples
- `GET /ws/{username}` - WebSocket chat server (connect with WebSocket client)

### State Management
- `GET /counter` - Get current counter value
- `POST /counter/increment` - Increment counter

### Error Handling
- `GET /error/example` - Internal server error example
- `GET /error/custom` - Custom error example

## Example Requests

### Create a User
```bash
curl -X POST http://127.0.0.1:8080/users \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "email": "john@example.com"}'
```

### Get All Users
```bash
curl http://127.0.0.1:8080/users
```

### Test Form Submission
```bash
curl -X POST http://127.0.0.1:8080/examples/form/submit \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=John&email=john@example.com&message=Hello World"
```

### WebSocket Connection
Connect to `ws://127.0.0.1:8080/ws/your_username` using a WebSocket client.

## Learning Path

1. **Start with basic examples** - Hello world, JSON responses
2. **Learn routing** - Path parameters, query parameters
3. **Handle data** - Form data, JSON body, cookies
4. **Understand middleware** - Custom middleware, authentication
5. **Manage state** - Shared application state
6. **Advanced features** - WebSockets, streaming
7. **Error handling** - Custom error types and responses

## Code Structure

- `src/main.rs` - Main application entry point and route configuration
- `src/models.rs` - Data models and types
- `src/handlers.rs` - Request handlers for user management
- `src/middleware.rs` - Custom middleware implementations
- `src/examples.rs` - Various feature examples (WebSocket, forms, etc.)

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
3. Explore the [Actix Web documentation](https://actix.rs/docs/)
4. Check out the [official examples](https://github.com/actix/examples)

Happy learning! 🦀