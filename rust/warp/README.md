# Warp Web Framework Examples

This project contains comprehensive examples of using the [Warp](https://github.com/seanmonstar/warp) web framework in Rust. Warp is a super-easy, composable, web server framework for warp speeds.

## Features Demonstrated

- RESTful API endpoints
- Request routing and parameter extraction
- Request/response body handling with JSON
- Query parameter parsing
- Path parameters
- Custom middleware
- Authentication and authorization
- Error handling
- CORS support
- File uploads
- Request logging
- State management
- Async/await patterns

## Project Structure

```
warp/
├── Cargo.toml          # Dependencies
├── README.md           # This file
└── src/
    ├── main.rs         # Application entry point
    ├── models.rs       # Data models and types
    └── filters.rs      # Route filters and handlers
```

## Getting Started

1. Install Rust:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. Clone this repository and navigate to the warp directory:
```bash
cd warp
```

3. Run the application:
```bash
cargo run
```

4. The server will start on `http://localhost:3030`

## API Endpoints

### Health Check
- `GET /health` - Health check endpoint

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/{id}` - Get a specific user
- `PUT /api/users/{id}` - Update a user (requires authentication)
- `DELETE /api/users/{id}` - Delete a user (requires authentication)

### Posts
- `POST /api/posts` - Create a new post (requires authentication)
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/{id}` - Get a specific post
- `PUT /api/posts/{id}` - Update a post (requires authentication)
- `DELETE /api/posts/{id}` - Delete a post (requires authentication)

### Comments
- `POST /api/posts/{id}/comments` - Create a new comment (requires authentication)
- `GET /api/posts/{id}/comments` - Get all comments for a post

### Utilities
- `GET /api/stats` - Get application statistics
- `POST /api/upload` - File upload endpoint

## Usage Examples

### Create a User
```bash
curl -X POST http://localhost:3030/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure_password"
  }'
```

### Login
```bash
curl -X POST http://localhost:3030/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secure_password"
  }'
```

### Create a Post
```bash
curl -X POST http://localhost:3030/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first post.",
    "published": true
  }'
```

### Get Posts with Pagination
```bash
curl "http://localhost:3030/api/posts?page=1&limit=5"
```

### Upload a File
```bash
curl -X POST http://localhost:3030/api/upload \
  -F "file=@/path/to/your/file.txt"
```

## Key Concepts Demonstrated

### Filters
Warp's primary building block is the `Filter` trait. Filters can be combined to create complex request handling logic. This project demonstrates:

- Path filters (`warp::path!`)
- Method filters (`warp::post()`, `warp::get()`, etc.)
- Body filters (`warp::body::json()`)
- Header filters (`warp::header()`)
- Query parameter filters (`warp::query()`)

### Composable Architecture
Warp filters are composable, meaning you can combine them to create complex routes:

```rust
let create_user = warp::path!("api" / "users")
    .and(warp::post())
    .and(json_body::<NewUser>())
    .and(with_state(state))
    .and_then(create_user_handler);
```

### State Management
The project demonstrates how to manage application state across requests using `Arc<RwLock<>>`:

```rust
pub type AppState = Arc<RwLock<AppData>>;

pub fn with_state(state: AppState) -> impl Filter<Extract = (AppState,), Error = Infallible> + Clone {
    warp::any().map(move || state.clone())
}
```

### Authentication
Custom authentication filter that validates JWT tokens:

```rust
pub fn with_auth(state: AppState) -> impl Filter<Extract = (Uuid,), Error = warp::Rejection> + Clone {
    warp::header::<String>("authorization")
        .and(with_state(state))
        .and_then(|auth_header: String, state: AppState| async move {
            // Authentication logic
        })
}
```

### Error Handling
Custom error types and rejection handlers for proper error responses:

```rust
#[derive(Debug)]
pub enum ApiError {
    InvalidId,
    NotFound,
    Forbidden,
    UploadError(String),
}

pub async fn handle_rejection(err: Rejection) -> Result<impl Reply, Infallible> {
    // Error handling logic
}
```

## Dependencies

- `warp`: Web framework
- `tokio`: Async runtime
- `serde`: Serialization/deserialization
- `serde_json`: JSON support
- `uuid`: UUID generation
- `chrono`: Date and time handling
- `bytes`: Bytes buffer
- `futures-util`: Async utilities

## Learning Resources

- [Warp Documentation](https://docs.rs/warp/)
- [Warp GitHub Repository](https://github.com/seanmonstar/warp)
- [Warp Examples](https://github.com/seanmonstar/warp/tree/master/examples)
- [Rust Async Book](https://rust-lang.github.io/async-book/)