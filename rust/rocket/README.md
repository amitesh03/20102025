# Rocket Framework Examples

This directory contains comprehensive examples of using the Rocket web framework in Rust.

## Features Demonstrated

### Basic Routes
- Simple GET routes
- Routes with path parameters
- Route organization

### Request Data Handling
- Query parameters
- Path parameters
- JSON request bodies
- Form data
- Custom request guards

### Response Types
- JSON responses
- HTML templates
- File downloads
- Custom response types
- Streaming responses
- Different content types (CSV, XML, PDF, etc.)

### Error Handling
- Custom error types
- Error responses
- Validation errors
- Error recovery
- Detailed error information

### State Management
- Global state
- Session management
- Caching
- Stateful applications

### Middleware
- Request logging
- Response logging
- Rate limiting
- Security headers
- Request timing
- Custom middleware

### WebSockets
- Real-time chat
- Echo server
- WebSocket events
- Connection management

### File Upload
- File upload forms
- File storage
- File serving
- File management

## Getting Started

1. Install Rust:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. Clone this repository and navigate to the rocket directory:
```bash
cd rocket
```

3. Run the application:
```bash
cargo run
```

4. Open your browser and navigate to:
```
http://localhost:8000
```

## Project Structure

```
rocket/
├── src/
│   ├── main.rs              # Application entry point
│   ├── lib.rs               # Library initialization
│   ├── models.rs            # Data models
│   ├── handlers.rs          # API handlers
│   ├── middleware.rs        # Middleware implementations
│   └── examples/            # Example modules
│       ├── mod.rs
│       ├── basic_routes.rs
│       ├── request_data.rs
│       ├── response_types.rs
│       ├── error_handling.rs
│       ├── state_management.rs
│       ├── middleware.rs
│       ├── websockets.rs
│       └── file_upload.rs
├── static/                  # Static files
├── templates/               # Template files
├── uploads/                 # Uploaded files
├── Cargo.toml               # Dependencies
└── README.md                # This file
```

## API Endpoints

### Basic Routes
- `GET /` - Main demo page
- `GET /hello` - Hello world
- `GET /hello/<name>` - Hello with name

### Request Data
- `GET /query-params` - Query parameters example
- `GET /path-params/<id>` - Path parameters example
- `POST /json-body` - JSON body example
- `POST /form-data` - Form data example

### Response Types
- `GET /json-response` - JSON response
- `GET /template-response` - Template response
- `GET /redirect-response` - Redirect response
- `GET /file-response` - File response

### Error Handling
- `GET /error/not-found` - 404 error
- `GET /error/server-error` - 500 error
- `GET /error/custom` - Custom error

### State Management
- `GET /counter` - Get counter value
- `POST /counter/increment` - Increment counter
- `POST /session/create/<username>` - Create session
- `GET /sessions` - List active sessions

### Middleware
- `GET /logging` - Request logging example
- `GET /timing` - Request timing example
- `GET /rate-limited` - Rate limiting example
- `GET /secure` - Security headers example

### WebSockets
- `GET /websocket` - WebSocket chat demo
- `GET /websocket/echo` - WebSocket echo server

### File Upload
- `GET /upload-form` - File upload form
- `POST /upload` - Upload file endpoint
- `GET /files` - List uploaded files
- `GET /files/<filename>` - Download file

## Configuration

The application uses the following configuration:

- **Port**: 8000 (default)
- **Upload Directory**: `uploads/`
- **Template Directory**: `templates/`
- **Static Directory**: `static/`

## Dependencies

Key dependencies used in this project:

- `rocket` - Web framework
- `rocket_dyn_templates` - Template rendering
- `rocket_ws` - WebSocket support
- `serde` - Serialization/deserialization
- `tokio` - Async runtime
- `uuid` - UUID generation
- `chrono` - Date/time handling

## Learning Path

1. Start with `basic_routes.rs` to understand basic routing
2. Move to `request_data.rs` for handling incoming data
3. Explore `response_types.rs` for different response formats
4. Learn error handling with `error_handling.rs`
5. Understand state management with `state_management.rs`
6. Implement middleware with `middleware.rs`
7. Build real-time features with `websockets.rs`
8. Handle file operations with `file_upload.rs`

## Additional Resources

- [Rocket Documentation](https://rocket.rs/)
- [Rocket Guide](https://rocket.rs/guide/)
- [Rocket API Reference](https://api.rocket.rs/)
- [Rust Book](https://doc.rust-lang.org/book/)