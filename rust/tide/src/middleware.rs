use crate::handlers::AppState;
use tide::{Middleware, Next, Request, Response, Result, StatusCode};
use std::time::Instant;
use async_std::sync::Arc;
use log::info;

// Logging middleware
pub struct Logger;

#[async_trait::async_trait]
impl<State: Clone + Send + Sync + 'static> Middleware<State> for Logger {
    async fn handle(&self, req: Request<State>, next: Next<'_, State>) -> Result {
        let start = Instant::now();
        let method = req.method().to_string();
        let path = req.url().path().to_string();
        
        let response = next.run(req).await;
        
        let duration = start.elapsed();
        let status = response.status();
        
        info!("{} {} {} {:?}", method, path, status.as_u16(), duration);
        
        Ok(response)
    }
}

// CORS middleware
pub struct Cors {
    origins: Vec<String>,
    methods: Vec<String>,
    headers: Vec<String>,
}

impl Cors {
    pub fn new() -> Self {
        Self {
            origins: vec!["*".to_string()],
            methods: vec!["GET".to_string(), "POST".to_string(), "PUT".to_string(), "DELETE".to_string()],
            headers: vec!["Content-Type".to_string(), "Authorization".to_string()],
        }
    }
    
    pub fn origins(mut self, origins: Vec<&str>) -> Self {
        self.origins = origins.into_iter().map(|s| s.to_string()).collect();
        self
    }
    
    pub fn methods(mut self, methods: Vec<&str>) -> Self {
        self.methods = methods.into_iter().map(|s| s.to_string()).collect();
        self
    }
    
    pub fn headers(mut self, headers: Vec<&str>) -> Self {
        self.headers = headers.into_iter().map(|s| s.to_string()).collect();
        self
    }
}

impl Default for Cors {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait::async_trait]
impl<State: Clone + Send + Sync + 'static> Middleware<State> for Cors {
    async fn handle(&self, req: Request<State>, next: Next<'_, State>) -> Result {
        let origin = req.header("Origin").unwrap_or("*");
        
        // Check if origin is allowed
        let allowed_origin = if self.origins.contains(&"*".to_string()) {
            Some(origin)
        } else {
            self.origins.iter().find(|o| o == &origin).cloned()
        };
        
        let mut response = next.run(req).await;
        
        if let Some(origin) = allowed_origin {
            response.insert_header("Access-Control-Allow-Origin", origin);
        }
        
        response.insert_header("Access-Control-Allow-Methods", self.methods.join(", "));
        response.insert_header("Access-Control-Allow-Headers", self.headers.join(", "));
        response.insert_header("Access-Control-Allow-Credentials", "true");
        
        Ok(response)
    }
}

// Authentication middleware
pub struct Auth;

#[async_trait::async_trait]
impl Middleware<AppState> for Auth {
    async fn handle(&self, req: Request<AppState>, next: Next<'_, AppState>) -> Result {
        // Skip auth for certain paths
        let path = req.url().path();
        if path == "/api/auth/login" || path == "/api/users" && req.method() == tide::Method::Post {
            return Ok(next.run(req).await);
        }
        
        // Get Authorization header
        let auth_header = req.header("Authorization").unwrap_or_default();
        let token = auth_header.strip_prefix("Bearer ").unwrap_or("");
        
        if token.is_empty() {
            let mut response = Response::new(StatusCode::Unauthorized);
            response.set_body(tide::Body::from_json(&serde_json::json!({
                "success": false,
                "data": null,
                "message": "Missing or invalid authorization token"
            }))?);
            return Ok(response);
        }
        
        // Validate token
        let app_state = req.state().clone();
        let data = app_state.lock().await;
        
        if !data.user_sessions.contains_key(token) {
            drop(data);
            let mut response = Response::new(StatusCode::Unauthorized);
            response.set_body(tide::Body::from_json(&serde_json::json!({
                "success": false,
                "data": null,
                "message": "Invalid or expired token"
            }))?);
            return Ok(response);
        }
        
        // Add user_id to request extensions
        let user_id = data.user_sessions.get(token).copied().unwrap();
        drop(data);
        
        let mut req = req;
        req.set_ext(user_id);
        
        Ok(next.run(req).await)
    }
}

// Rate limiting middleware
pub struct RateLimiter {
    requests: std::sync::Arc<async_std::sync::Mutex<std::collections::HashMap<String, (u32, Instant)>>>,
    max_requests: u32,
    window: std::time::Duration,
}

impl RateLimiter {
    pub fn new(max_requests: u32, window: std::time::Duration) -> Self {
        Self {
            requests: std::sync::Arc::new(async_std::sync::Mutex::new(std::collections::HashMap::new())),
            max_requests,
            window,
        }
    }
    
    fn get_client_id(req: &Request<AppState>) -> String {
        // Try to get user ID from request extensions
        if let Ok(user_id) = req.ext::<uuid::Uuid>() {
            return format!("user:{}", user_id);
        }
        
        // Fall back to IP address
        req.remote().addr().to_string()
    }
}

#[async_trait::async_trait]
impl Middleware<AppState> for RateLimiter {
    async fn handle(&self, req: Request<AppState>, next: Next<'_, AppState>) -> Result {
        let client_id = Self::get_client_id(&req);
        let now = Instant::now();
        
        // Clean up old entries
        {
            let mut requests = self.requests.lock().await;
            requests.retain(|_, (_, timestamp)| now.duration_since(*timestamp) < self.window);
            
            // Check current request count
            let entry = requests.entry(client_id.clone()).or_insert((0, now));
            
            if now.duration_since(entry.1) >= self.window {
                // Reset counter
                entry.0 = 1;
                entry.1 = now;
            } else {
                entry.0 += 1;
                
                if entry.0 > self.max_requests {
                    let mut response = Response::new(StatusCode::TooManyRequests);
                    response.set_body(tide::Body::from_json(&serde_json::json!({
                        "success": false,
                        "data": null,
                        "message": "Rate limit exceeded"
                    }))?);
                    return Ok(response);
                }
            }
        }
        
        Ok(next.run(req).await)
    }
}

// Request size limiting middleware
pub struct SizeLimit {
    max_size: usize,
}

impl SizeLimit {
    pub fn new(max_size: usize) -> Self {
        Self { max_size }
    }
}

#[async_trait::async_trait]
impl<State: Clone + Send + Sync + 'static> Middleware<State> for SizeLimit {
    async fn handle(&self, req: Request<State>, next: Next<'_, State>) -> Result {
        // Check Content-Length header
        if let Some(content_length) = req.header("Content-Length") {
            if let Ok(size) = content_length.parse::<usize>() {
                if size > self.max_size {
                    let mut response = Response::new(StatusCode::PayloadTooLarge);
                    response.set_body(tide::Body::from_json(&serde_json::json!({
                        "success": false,
                        "data": null,
                        "message": "Request body too large"
                    }))?);
                    return Ok(response);
                }
            }
        }
        
        Ok(next.run(req).await)
    }
}

// Security headers middleware
pub struct SecurityHeaders;

#[async_trait::async_trait]
impl<State: Clone + Send + Sync + 'static> Middleware<State> for SecurityHeaders {
    async fn handle(&self, req: Request<State>, next: Next<'_, State>) -> Result {
        let mut response = next.run(req).await;
        
        // Add security headers
        response.insert_header("X-Content-Type-Options", "nosniff");
        response.insert_header("X-Frame-Options", "DENY");
        response.insert_header("X-XSS-Protection", "1; mode=block");
        response.insert_header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        response.insert_header("Content-Security-Policy", "default-src 'self'");
        
        Ok(response)
    }
}

// Health check middleware
pub struct HealthCheck {
    path: String,
}

impl HealthCheck {
    pub fn new(path: &str) -> Self {
        Self {
            path: path.to_string(),
        }
    }
}

#[async_trait::async_trait]
impl<State: Clone + Send + Sync + 'static> Middleware<State> for HealthCheck {
    async fn handle(&self, req: Request<State>, next: Next<'_, State>) -> Result {
        if req.url().path() == self.path {
            let mut response = Response::new(StatusCode::Ok);
            response.set_body(tide::Body::from_json(&serde_json::json!({
                "status": "healthy",
                "timestamp": chrono::Utc::now().to_rfc3339()
            }))?);
            return Ok(response);
        }
        
        Ok(next.run(req).await)
    }
}

// Custom middleware example: Request ID
pub struct RequestId;

#[async_trait::async_trait]
impl<State: Clone + Send + Sync + 'static> Middleware<State> for RequestId {
    async fn handle(&self, mut req: Request<State>, next: Next<'_, State>) -> Result {
        let request_id = uuid::Uuid::new_v4().to_string();
        req.set_ext(request_id.clone());
        
        let mut response = next.run(req).await;
        response.insert_header("X-Request-ID", request_id);
        
        Ok(response)
    }
}

// Custom middleware example: API versioning
pub struct ApiVersion {
    default_version: String,
    supported_versions: Vec<String>,
}

impl ApiVersion {
    pub fn new(default_version: &str, supported_versions: Vec<&str>) -> Self {
        Self {
            default_version: default_version.to_string(),
            supported_versions: supported_versions.into_iter().map(|s| s.to_string()).collect(),
        }
    }
}

#[async_trait::async_trait]
impl<State: Clone + Send + Sync + 'static> Middleware<State> for ApiVersion {
    async fn handle(&self, mut req: Request<State>, next: Next<'_, State>) -> Result {
        // Get version from header or query parameter
        let version = req.header("API-Version")
            .or_else(|| req.query("version"))
            .unwrap_or(&self.default_version)
            .to_string();
        
        // Check if version is supported
        if !self.supported_versions.contains(&version) {
            let mut response = Response::new(StatusCode::BadRequest);
            response.set_body(tide::Body::from_json(&serde_json::json!({
                "success": false,
                "data": null,
                "message": format!("Unsupported API version: {}. Supported versions: {:?}", 
                                 version, self.supported_versions)
            }))?);
            return Ok(response);
        }
        
        req.set_ext(version);
        Ok(next.run(req).await)
    }
}