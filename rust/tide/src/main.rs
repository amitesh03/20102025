mod models;
mod handlers;
mod middleware;

use handlers::*;
use middleware::*;
use async_std::sync::Arc;
use std::sync::Mutex;
use tide::{Request, Response, StatusCode, Result};

#[async_std::main]
async fn main() -> Result {
    // Initialize logger
    env_logger::init();
    
    // Create shared application state
    let app_state = Arc::new(Mutex::new(handlers::AppData::default()));
    
    // Create Tide app
    let mut app = tide::with_state(app_state);
    
    // Add global middleware
    app.with(Logger);
    app.with(Cors::new());
    app.with(SecurityHeaders);
    app.with(RequestId);
    app.with(HealthCheck::new("/health"));
    app.with(SizeLimit::new(1024 * 1024)); // 1MB limit
    app.with(ApiVersion::new("v1", vec!["v1", "v2"]));
    
    // Public routes (no auth required)
    let mut public = app.at("/api");
    public.at("/auth/login").post(login);
    public.at("/users").post(create_user);
    public.at("/users").get(get_users);
    public.at("/users/:id").get(get_user);
    public.at("/posts").get(get_posts);
    public.at("/posts/:id").get(get_post);
    public.at("/posts/:id/comments").get(get_comments);
    
    // Protected routes (auth required)
    let mut protected = app.at("/api");
    protected.with(Auth);
    protected.at("/auth/logout").post(logout);
    protected.at("/users/:id").put(update_user);
    protected.at("/users/:id").delete(delete_user);
    protected.at("/posts").post(create_post);
    protected.at("/posts/:id").put(update_post);
    protected.at("/posts/:id").delete(delete_post);
    protected.at("/posts/:id/comments").post(create_comment);
    
    // Add rate limiting to protected routes
    protected.with(RateLimiter::new(10, std::time::Duration::from_secs(60)));
    
    // Start server
    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("0.0.0.0:{}", port);
    
    println!("🚀 Tide server starting on http://{}", addr);
    println!("📚 API Documentation:");
    println!("   GET  /health - Health check");
    println!("   POST /api/auth/login - Login");
    println!("   POST /api/auth/logout - Logout");
    println!("   GET  /api/users - Get all users");
    println!("   POST /api/users - Create user");
    println!("   GET  /api/users/:id - Get user by ID");
    println!("   PUT  /api/users/:id - Update user");
    println!("   DELETE /api/users/:id - Delete user");
    println!("   GET  /api/posts - Get all posts");
    println!("   POST /api/posts - Create post");
    println!("   GET  /api/posts/:id - Get post by ID");
    println!("   PUT  /api/posts/:id - Update post");
    println!("   DELETE /api/posts/:id - Delete post");
    println!("   GET  /api/posts/:id/comments - Get post comments");
    println!("   POST /api/posts/:id/comments - Create comment");
    
    app.listen(addr).await?;
    
    Ok(())
}

// Helper function to create error responses
pub fn create_error_response(status: StatusCode, message: &str) -> Result {
    let mut response = Response::new(status);
    response.set_body(tide::Body::from_json(&serde_json::json!({
        "success": false,
        "data": null,
        "message": message
    }))?);
    Ok(response)
}

// Helper function to create success responses
pub fn create_success_response<T: serde::Serialize>(data: T) -> Result {
    let mut response = Response::new(StatusCode::Ok);
    response.set_body(tide::Body::from_json(&serde_json::json!({
        "success": true,
        "data": data,
        "message": "Operation successful"
    }))?);
    Ok(response)
}

// Example of a custom error handler
#[derive(Debug)]
pub enum AppError {
    NotFound(String),
    BadRequest(String),
    Unauthorized(String),
    Forbidden(String),
    InternalError(String),
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AppError::NotFound(msg) => write!(f, "Not found: {}", msg),
            AppError::BadRequest(msg) => write!(f, "Bad request: {}", msg),
            AppError::Unauthorized(msg) => write!(f, "Unauthorized: {}", msg),
            AppError::Forbidden(msg) => write!(f, "Forbidden: {}", msg),
            AppError::InternalError(msg) => write!(f, "Internal error: {}", msg),
        }
    }
}

impl std::error::Error for AppError {}

impl From<AppError> for tide::Error {
    fn from(err: AppError) -> Self {
        let status = match err {
            AppError::NotFound(_) => StatusCode::NotFound,
            AppError::BadRequest(_) => StatusCode::BadRequest,
            AppError::Unauthorized(_) => StatusCode::Unauthorized,
            AppError::Forbidden(_) => StatusCode::Forbidden,
            AppError::InternalError(_) => StatusCode::InternalServerError,
        };
        
        tide::Error::from_str(status, err.to_string())
    }
}

// Example of a custom middleware that uses the error type
pub struct ErrorHandler;

#[async_trait::async_trait]
impl<tide::State> Middleware<tide::State> for ErrorHandler {
    async fn handle(&self, req: Request<tide::State>, next: Next<'_, tide::State>) -> Result {
        let response = next.run(req).await;
        
        // If response has an error status, customize the error response
        if response.status().is_client_error() || response.status().is_server_error() {
            let mut error_response = Response::new(response.status());
            error_response.set_body(tide::Body::from_json(&serde_json::json!({
                "success": false,
                "data": null,
                "message": match response.status() {
                    StatusCode::BadRequest => "Bad request",
                    StatusCode::Unauthorized => "Unauthorized",
                    StatusCode::Forbidden => "Forbidden",
                    StatusCode::NotFound => "Not found",
                    StatusCode::InternalServerError => "Internal server error",
                    _ => "An error occurred"
                },
                "timestamp": chrono::Utc::now().to_rfc3339()
            }))?);
            Ok(error_response)
        } else {
            Ok(response)
        }
    }
}

// Example of a WebSocket middleware (simplified)
pub struct WebSocketUpgrade;

#[async_trait::async_trait]
impl<State: Clone + Send + Sync + 'static> Middleware<State> for WebSocketUpgrade {
    async fn handle(&self, req: Request<State>, next: Next<'_, State>) -> Result {
        if req.header("Upgrade").map(|h| h.to_lowercase()) == Some("websocket".to_string()) {
            // Handle WebSocket upgrade
            let mut response = Response::new(StatusCode::SwitchingProtocols);
            response.insert_header("Upgrade", "websocket");
            response.insert_header("Connection", "Upgrade");
            response.insert_header("Sec-WebSocket-Accept", "accept-key");
            
            // In a real implementation, you would handle the WebSocket handshake
            // and create a WebSocket connection here
            
            Ok(response)
        } else {
            Ok(next.run(req).await)
        }
    }
}

// Example of a compression middleware
pub struct Compression;

#[async_trait::async_trait]
impl<State: Clone + Send + Sync + 'static> Middleware<State> for Compression {
    async fn handle(&self, req: Request<State>, next: Next<'_, State>) -> Result {
        let mut response = next.run(req).await;
        
        // Check if client accepts gzip encoding
        if let Some(accept_encoding) = req.header("Accept-Encoding") {
            if accept_encoding.contains("gzip") {
                // In a real implementation, you would compress the response body
                response.insert_header("Content-Encoding", "gzip");
            }
        }
        
        Ok(response)
    }
}

// Example of a caching middleware
pub struct Cache {
    cache: Arc<Mutex<std::collections::HashMap<String, (Vec<u8>, std::time::Instant)>>>,
    ttl: std::time::Duration,
}

impl Cache {
    pub fn new(ttl: std::time::Duration) -> Self {
        Self {
            cache: Arc::new(Mutex::new(std::collections::HashMap::new())),
            ttl,
        }
    }
    
    fn cache_key(req: &Request<impl Clone + Send + Sync + 'static>) -> String {
        format!("{}:{}", req.method(), req.url().path())
    }
}

#[async_trait::async_trait]
impl<State: Clone + Send + Sync + 'static> Middleware<State> for Cache {
    async fn handle(&self, req: Request<State>, next: Next<'_, State>) -> Result {
        let cache_key = Self::cache_key(&req);
        
        // Only cache GET requests
        if req.method() != tide::Method::Get {
            return Ok(next.run(req).await);
        }
        
        // Check cache
        {
            let cache = self.cache.lock().unwrap();
            if let Some((data, timestamp)) = cache.get(&cache_key) {
                if timestamp.elapsed() < self.ttl {
                    let mut response = Response::new(StatusCode::Ok);
                    response.set_body(tide::Body::from_bytes(data.clone()));
                    response.insert_header("X-Cache", "HIT");
                    return Ok(response);
                }
            }
        }
        
        // Not in cache, proceed with request
        let mut response = next.run(req).await;
        
        // Cache the response if successful
        if response.status().is_success() {
            if let Some(body) = response.take_body().into_bytes() {
                let mut cache = self.cache.lock().unwrap();
                cache.insert(cache_key, (body.clone(), std::time::Instant::now()));
                response.set_body(tide::Body::from_bytes(body));
                response.insert_header("X-Cache", "MISS");
            }
        }
        
        Ok(response)
    }
}