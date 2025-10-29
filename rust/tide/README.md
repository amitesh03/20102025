# Tide Web Framework Examples

This project contains comprehensive examples of using the Tide web framework in Rust. Tide is a minimal and pragmatic web server built for rapid development and reliability.

## Project Structure

```
tide/
├── Cargo.toml          # Dependencies
├── README.md           # This file
└── src/
    ├── main.rs         # Main application with routing
    ├── models.rs       # Data models
    ├── handlers.rs     # Request handlers
    └── middleware.rs   # Custom middleware
```

## Features Demonstrated

### 1. Basic Routing
- HTTP method routing (GET, POST, PUT, DELETE)
- Path parameters
- Query parameters
- Route grouping

### 2. Request/Response Handling
- JSON request/response serialization
- Path parameter extraction
- Query parameter parsing
- Custom response status codes

### 3. Middleware System
- Logging middleware
- CORS (Cross-Origin Resource Sharing)
- Authentication middleware
- Rate limiting
- Request size limiting
- Security headers
- Health check endpoints
- Request ID tracking
- API versioning
- Compression
- Caching

### 4. Authentication & Authorization
- Token-based authentication
- Session management
- Protected routes
- User authorization

### 5. Data Models
- User management
- Blog posts
- Comments
- API response formats
- Pagination

### 6. Error Handling
- Custom error types
- Error response formatting
- Status code handling
- Error middleware

## Getting Started

### Prerequisites
- Rust 1.70 or higher
- Cargo

### Running the Application

1. Clone the repository or navigate to the tide directory
2. Run the application:
   ```bash
   cargo run
   ```

3. The server will start on `http://localhost:8080`

### Environment Variables
- `PORT`: Server port (default: 8080)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (requires authentication)

### Users
- `GET /api/users` - Get all users (with pagination)
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (requires authentication)
- `DELETE /api/users/:id` - Delete user (requires authentication)

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `POST /api/posts` - Create a new post (requires authentication)
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post (requires authentication)
- `DELETE /api/posts/:id` - Delete post (requires authentication)

### Comments
- `GET /api/posts/:id/comments` - Get comments for a post
- `POST /api/posts/:id/comments` - Create a comment (requires authentication)

### Health Check
- `GET /health` - Application health status

## Usage Examples

### Creating a User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure_password"
  }'
```

### User Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secure_password"
  }'
```

### Creating a Post (with authentication)
```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first post",
    "published": true
  }'
```

### Getting Posts with Pagination
```bash
curl "http://localhost:8080/api/posts?page=1&limit=5&published=true"
```

## Middleware Configuration

### CORS Configuration
The CORS middleware is configured to allow all origins. You can customize it in `main.rs`:

```rust
app.with(Cors::new()
    .origins(vec!["https://example.com"])
    .methods(vec!["GET", "POST"])
    .headers(vec!["Content-Type", "Authorization"]));
```

### Rate Limiting
Protected routes have a rate limit of 10 requests per minute. You can adjust this in `main.rs`:

```rust
protected.with(RateLimiter::new(20, std::time::Duration::from_secs(60)));
```

### Authentication
Authentication is token-based. Include the token in the `Authorization` header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Key Concepts

### Request Handling
Tide uses async functions as request handlers. Handlers receive a `Request<State>` and return a `Result<Response>`:

```rust
pub async fn create_user(mut req: Request<AppState>) -> Result {
    let new_user: NewUser = req.body_json().await?;
    // Process the user...
    let response = ApiResponse::success(user_response);
    Ok(Response::builder(StatusCode::Created)
        .body(tide::Body::from_json(&response)?)
        .build())
}
```

### Middleware
Middleware in Tide implements the `Middleware` trait:

```rust
#[async_trait::async_trait]
impl<State: Clone + Send + Sync + 'static> Middleware<State> for MyMiddleware {
    async fn handle(&self, req: Request<State>, next: Next<'_, State>) -> Result {
        // Pre-processing
        let response = next.run(req).await;
        // Post-processing
        Ok(response)
    }
}
```

### State Management
Tide uses shared application state for managing data across requests:

```rust
let app_state = Arc::new(Mutex::new(AppData::default()));
let mut app = tide::with_state(app_state);
```

## Error Handling

The application includes comprehensive error handling with custom error types and standardized error responses:

```rust
#[derive(Debug)]
pub enum AppError {
    NotFound(String),
    BadRequest(String),
    Unauthorized(String),
    // ...
}
```

## Testing

While this example doesn't include tests, in a real application you would:

1. Add `#[cfg(test)]` modules
2. Use `tide::testing` for integration tests
3. Mock dependencies for unit tests
4. Test middleware functionality

## Production Considerations

For production deployment:

1. Use a proper database instead of in-memory storage
2. Implement secure password hashing (bcrypt, Argon2)
3. Use environment variables for configuration
4. Set up proper logging
5. Configure TLS/HTTPS
6. Set up monitoring and metrics
7. Use a reverse proxy (nginx, caddy)

## Additional Resources

- [Tide Documentation](https://docs.rs/tide/)
- [Tide GitHub Repository](https://github.com/http-rs/tide)
- [Async-std Documentation](https://docs.rs/async-std/)
- [Serde Documentation](https://docs.rs/serde/)

## Contributing

Feel free to submit issues and enhancement requests!