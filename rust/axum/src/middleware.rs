use axum::{
    extract::Request,
    http::{StatusCode, HeaderMap},
    middleware::Next,
    response::Response,
};
use std::time::Instant;
use tracing::{info, warn, error};
use uuid::Uuid;

// Request logging middleware
pub async fn request_logging_middleware(
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let start = Instant::now();
    let method = request.method().clone();
    let uri = request.uri().clone();
    let request_id = Uuid::new_v4();
    
    // Log the incoming request
    info!(
        "Request {} {} - ID: {}",
        method,
        uri,
        request_id
    );
    
    // Process the request
    let response = next.run(request).await;
    
    // Log the response
    let duration = start.elapsed();
    let status = response.status();
    
    info!(
        "Response {} {} - ID: {} - Status: {} - Duration: {:?}",
        method,
        uri,
        request_id,
        status,
        duration
    );
    
    Ok(response)
}

// Authentication middleware
pub async fn auth_middleware(
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let headers = request.headers();
    
    // Check for Authorization header
    match headers.get("authorization") {
        Some(auth_header) => {
            match auth_header.to_str() {
                Ok(auth_str) => {
                    if auth_str.starts_with("Bearer ") {
                        let token = &auth_str[7..];
                        
                        // Validate token (in a real app, you'd validate against a database)
                        if validate_token(token) {
                            info!("Valid token provided");
                            Ok(next.run(request).await)
                        } else {
                            warn!("Invalid token provided");
                            Err(StatusCode::UNAUTHORIZED)
                        }
                    } else {
                        warn!("Invalid authorization format");
                        Err(StatusCode::UNAUTHORIZED)
                    }
                },
                Err(_) => {
                    warn!("Invalid authorization header");
                    Err(StatusCode::UNAUTHORIZED)
                }
            }
        },
        None => {
            warn!("Missing authorization header");
            Err(StatusCode::UNAUTHORIZED)
        }
    }
}

// Rate limiting middleware
pub async fn rate_limit_middleware(
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let headers = request.headers();
    
    // Get client IP
    let client_ip = headers
        .get("x-forwarded-for")
        .or_else(|| headers.get("x-real-ip"))
        .and_then(|h| h.to_str().ok())
        .unwrap_or("127.0.0.1");
    
    // Check rate limit (in a real app, you'd check against a database)
    if check_rate_limit(client_ip) {
        info!("Rate limit check passed for IP: {}", client_ip);
        let mut response = next.run(request).await;
        
        // Add rate limit headers
        response.headers_mut().insert(
            "X-RateLimit-Remaining",
            "99".parse().unwrap(),
        );
        response.headers_mut().insert(
            "X-RateLimit-Reset",
            (chrono::Utc::now() + chrono::Duration::hours(1))
                .timestamp()
                .to_string()
                .parse()
                .unwrap(),
        );
        
        Ok(response)
    } else {
        warn!("Rate limit exceeded for IP: {}", client_ip);
        Err(StatusCode::TOO_MANY_REQUESTS)
    }
}

// CORS middleware
pub async fn cors_middleware(
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let mut response = next.run(request).await;
    
    // Add CORS headers
    let headers = response.headers_mut();
    headers.insert("Access-Control-Allow-Origin", "*".parse().unwrap());
    headers.insert("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS".parse().unwrap());
    headers.insert("Access-Control-Allow-Headers", "Content-Type, Authorization".parse().unwrap());
    headers.insert("Access-Control-Max-Age", "86400".parse().unwrap());
    
    Ok(response)
}

// Compression middleware
pub async fn compression_middleware(
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let headers = request.headers();
    
    // Check if client accepts gzip encoding
    let accepts_gzip = headers
        .get("accept-encoding")
        .and_then(|h| h.to_str().ok())
        .map(|s| s.contains("gzip"))
        .unwrap_or(false);
    
    if accepts_gzip {
        info!("Client accepts gzip encoding");
        // In a real implementation, you would compress the response
        // For this example, we'll just note that compression could be applied
    }
    
    Ok(next.run(request).await)
}

// Security headers middleware
pub async fn security_headers_middleware(
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let mut response = next.run(request).await;
    
    // Add security headers
    let headers = response.headers_mut();
    headers.insert("X-Content-Type-Options", "nosniff".parse().unwrap());
    headers.insert("X-Frame-Options", "DENY".parse().unwrap());
    headers.insert("X-XSS-Protection", "1; mode=block".parse().unwrap());
    headers.insert("Strict-Transport-Security", "max-age=31536000; includeSubDomains".parse().unwrap());
    headers.insert("Content-Security-Policy", "default-src 'self'".parse().unwrap());
    
    Ok(response)
}

// Custom header middleware
pub async fn custom_headers_middleware(
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let mut response = next.run(request).await;
    
    // Add custom headers
    let headers = response.headers_mut();
    headers.insert("X-Powered-By", "Axum".parse().unwrap());
    headers.insert("X-Server-Version", "1.0.0".parse().unwrap());
    headers.insert("X-Request-ID", Uuid::new_v4().to_string().parse().unwrap());
    
    Ok(response)
}

// Error handling middleware
pub async fn error_handling_middleware(
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let result = next.run(request).await;
    
    // Check if response indicates an error
    if result.status().is_server_error() {
        error!("Server error occurred: {}", result.status());
    } else if result.status().is_client_error() {
        warn!("Client error occurred: {}", result.status());
    }
    
    Ok(result)
}

// Helper functions
fn validate_token(token: &str) -> bool {
    // In a real application, you would:
    // 1. Check if the token exists in your database
    // 2. Verify the token signature (if it's a JWT)
    // 3. Check if the token has expired
    // 4. Check if the user is still active
    
    // For this example, we'll just check if it's not empty
    !token.is_empty()
}

fn check_rate_limit(ip: &str) -> bool {
    // In a real application, you would:
    // 1. Check how many requests this IP has made in the time window
    // 2. Compare against the rate limit
    // 3. Store the request count in a database or cache
    
    // For this example, we'll just return true
    info!("Rate limit check for IP: {}", ip);
    true
}

// Middleware to add request context
pub async fn request_context_middleware(
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let start_time = Instant::now();
    let request_id = Uuid::new_v4();
    
    // In a real application, you might store this context in a database
    info!("Processing request {} - ID: {}", request.uri(), request_id);
    
    let response = next.run(request).await;
    let duration = start_time.elapsed();
    
    info!("Completed request {} - ID: {} - Duration: {:?}", request_id, request_id, duration);
    
    Ok(response)
}

// Middleware to handle OPTIONS requests for CORS
pub async fn options_handler() -> StatusCode {
    StatusCode::OK
}

// Example of a middleware that modifies the request
pub async fn request_modifier_middleware(
    mut request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    // Add a custom header to the request
    request.headers_mut().insert(
        "X-Custom-Request-Header",
        "modified-by-middleware".parse().unwrap(),
    );
    
    info!("Request modified by middleware");
    
    Ok(next.run(request).await)
}

// Example of a middleware that can short-circuit the request
pub async fn maintenance_middleware(
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    // In a real application, you might check a configuration flag
    let in_maintenance_mode = false;
    
    if in_maintenance_mode {
        warn!("Application is in maintenance mode");
        return Err(StatusCode::SERVICE_UNAVAILABLE);
    }
    
    Ok(next.run(request).await)
}