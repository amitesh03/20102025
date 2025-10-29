use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::{Header, Status};
use rocket::request::{FromRequest, Outcome};
use rocket::response::content::RawHtml;
use rocket::serde::json::Json;
use rocket::{Request, Response};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use uuid::Uuid;
use crate::models::ApiResponse;

// Authentication middleware
#[get("/auth-required")]
pub fn auth_required() -> RawHtml<&'static str> {
    RawHtml(r#"
<!DOCTYPE html>
<html>
<head>
    <title>Authentication Required</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        .auth-form { padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { background-color: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background-color: #0056b3; }
        .result { margin-top: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Authentication Required</h1>
        <p>This endpoint requires authentication. Try accessing it with different authentication methods:</p>
        
        <div class="auth-form">
            <h2>Test Authentication</h2>
            <div class="form-group">
                <label for="api-key">API Key:</label>
                <input type="text" id="api-key" placeholder="Enter 'secret-api-key'">
            </div>
            <button onclick="testWithApiKey()">Test with API Key</button>
            <button onclick="testWithoutAuth()">Test without Authentication</button>
            <div id="auth-result" class="result"></div>
        </div>
        
        <h3>Instructions:</h3>
        <ul>
            <li>Use the API key "secret-api-key" to authenticate successfully</li>
            <li>Try without authentication to see the error response</li>
            <li>Check the browser's developer tools to see the HTTP headers</li>
        </ul>
    </div>
    
    <script>
        async function testWithApiKey() {
            const apiKey = document.getElementById('api-key').value;
            if (!apiKey) {
                alert('Please enter an API key');
                return;
            }
            
            try {
                const response = await fetch('/auth-required', {
                    headers: {
                        'X-API-Key': apiKey
                    }
                });
                
                const result = await response.text();
                document.getElementById('auth-result').innerHTML = `
                    <h4>Response (${response.status}):</h4>
                    <pre>${result}</pre>
                `;
            } catch (error) {
                document.getElementById('auth-result').innerHTML = `
                    <h4>Error:</h4>
                    <p>${error.message}</p>
                `;
            }
        }
        
        async function testWithoutAuth() {
            try {
                const response = await fetch('/auth-required');
                const result = await response.text();
                document.getElementById('auth-result').innerHTML = `
                    <h4>Response (${response.status}):</h4>
                    <pre>${result}</pre>
                `;
            } catch (error) {
                document.getElementById('auth-result').innerHTML = `
                    <h4>Error:</h4>
                    <p>${error.message}</p>
                `;
            }
        }
    </script>
</body>
</html>
    "#)
}

// Request logging middleware
pub struct RequestLogger;

#[rocket::async_trait]
impl Fairing for RequestLogger {
    fn info(&self) -> Info {
        Info {
            name: "Request Logger",
            kind: Kind::Request,
        }
    }

    async fn on_request(&self, request: &mut Request<'_>, _data: &mut rocket::Data<'_>) {
        println!("[REQUEST] {} {} {}", request.method(), request.uri(), request.remote());
    }
}

// Response logging middleware
pub struct ResponseLogger;

#[rocket::async_trait]
impl Fairing for ResponseLogger {
    fn info(&self) -> Info {
        Info {
            name: "Response Logger",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, request: &'r Request<'_>, response: &mut Response<'r>) {
        println!("[RESPONSE] {} {} {}", response.status(), request.method(), request.uri());
    }
}

// Request timing middleware
pub struct RequestTimer {
    start_times: Arc<Mutex<HashMap<String, Instant>>>,
}

impl RequestTimer {
    pub fn new() -> Self {
        Self {
            start_times: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn start(&self, id: &str) {
        let mut start_times = self.start_times.lock().unwrap();
        start_times.insert(id.to_string(), Instant::now());
    }

    pub fn end(&self, id: &str) -> Option<Duration> {
        let mut start_times = self.start_times.lock().unwrap();
        match start_times.remove(id) {
            Some(start) => Some(start.elapsed()),
            None => None,
        }
    }
}

#[rocket::async_trait]
impl Fairing for RequestTimer {
    fn info(&self) -> Info {
        Info {
            name: "Request Timer",
            kind: Kind::Request | Kind::Response,
        }
    }

    async fn on_request(&self, request: &mut Request<'_>, _data: &mut rocket::Data<'_>) {
        let id = format!("{}-{}", request.method(), request.uri());
        self.start(&id);
    }

    async fn on_response<'r>(&self, request: &'r Request<'_>, response: &mut Response<'r>) {
        let id = format!("{}-{}", request.method(), request.uri());
        if let Some(duration) = self.end(&id) {
            println!("[TIMING] {} {} took {}ms", request.method(), request.uri(), duration.as_millis());
            response.set_header(Header::new("X-Response-Time", format!("{}ms", duration.as_millis())));
        }
    }
}

// Rate limiting middleware
pub struct RateLimiter {
    requests: Arc<Mutex<HashMap<String, (u32, Instant)>>>,
    max_requests: u32,
    window_duration: Duration,
}

impl RateLimiter {
    pub fn new(max_requests: u32, window_seconds: u64) -> Self {
        Self {
            requests: Arc::new(Mutex::new(HashMap::new())),
            max_requests,
            window_duration: Duration::from_secs(window_seconds),
        }
    }

    pub fn is_allowed(&self, key: &str) -> bool {
        let mut requests = self.requests.lock().unwrap();
        let now = Instant::now();

        match requests.get_mut(key) {
            Some((count, last_reset)) => {
                if now.duration_since(*last_reset) >= self.window_duration {
                    *count = 1;
                    *last_reset = now;
                    true
                } else if *count < self.max_requests {
                    *count += 1;
                    true
                } else {
                    false
                }
            }
            None => {
                requests.insert(key.to_string(), (1, now));
                true
            }
        }
    }
}

#[rocket::async_trait]
impl Fairing for RateLimiter {
    fn info(&self) -> Info {
        Info {
            name: "Rate Limiter",
            kind: Kind::Request,
        }
    }

    async fn on_request(&self, request: &mut Request<'_>, _data: &mut rocket::Data<'_>) {
        let client_ip = request.remote().map(|addr| addr.to_string()).unwrap_or_else(|| "unknown".to_string());
        
        if !self.is_allowed(&client_ip) {
            println!("[RATE_LIMIT] Client {} exceeded rate limit", client_ip);
        }
    }
}

// Request ID middleware
pub struct RequestId;

#[rocket::async_trait]
impl Fairing for RequestId {
    fn info(&self) -> Info {
        Info {
            name: "Request ID",
            kind: Kind::Request,
        }
    }

    async fn on_request(&self, request: &mut Request<'_>, _data: &mut rocket::Data<'_>) {
        let request_id = Uuid::new_v4().to_string();
        request.add_header(Header::new("X-Request-ID", request_id));
        println!("[REQUEST_ID] {} assigned to {} {}", request_id, request.method(), request.uri());
    }
}

// Security headers middleware
pub struct SecurityHeaders;

#[rocket::async_trait]
impl Fairing for SecurityHeaders {
    fn info(&self) -> Info {
        Info {
            name: "Security Headers",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("X-Content-Type-Options", "nosniff"));
        response.set_header(Header::new("X-Frame-Options", "DENY"));
        response.set_header(Header::new("X-XSS-Protection", "1; mode=block"));
        response.set_header(Header::new("Strict-Transport-Security", "max-age=31536000; includeSubDomains"));
        response.set_header(Header::new("Content-Security-Policy", "default-src 'self'"));
        println!("[SECURITY] Security headers added to response");
    }
}

// Request body size limiter
pub struct RequestSizeLimiter {
    max_size: u64,
}

impl RequestSizeLimiter {
    pub fn new(max_size: u64) -> Self {
        Self { max_size }
    }
}

#[rocket::async_trait]
impl Fairing for RequestSizeLimiter {
    fn info(&self) -> Info {
        Info {
            name: "Request Size Limiter",
            kind: Kind::Request,
        }
    }

    async fn on_request(&self, request: &mut Request<'_>, _data: &mut rocket::Data<'_>) {
        if let Some(content_length) = request.headers().get_one("content-length") {
            if let Ok(size) = content_length.parse::<u64>() {
                if size > self.max_size {
                    println!("[SIZE_LIMIT] Request size {} exceeds limit {}", size, self.max_size);
                }
            }
        }
    }
}

// Custom response header middleware
pub struct CustomHeaders;

#[rocket::async_trait]
impl Fairing for CustomHeaders {
    fn info(&self) -> Info {
        Info {
            name: "Custom Headers",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("X-Powered-By", "Rocket"));
        response.set_header(Header::new("X-Server-Version", "1.0.0"));
        response.set_header(Header::new("X-Response-Time", chrono::Utc::now().to_rfc3339()));
        println!("[CUSTOM_HEADERS] Custom headers added to response for {} {}", request.method(), request.uri());
    }
}

// Middleware demo endpoint
#[get("/logging")]
pub fn logging() -> Json<ApiResponse<&'static str>> {
    // This endpoint will be processed by the logging middleware
    Json(ApiResponse::success("This request was logged by the middleware"))
}

#[get("/timing")]
pub fn timing() -> Json<ApiResponse<&'static str>> {
    // This endpoint will have its timing measured by the middleware
    Json(ApiResponse::success("This request was timed by the middleware"))
}

#[get("/rate-limited")]
pub fn rate_limited() -> Json<ApiResponse<&'static str>> {
    // This endpoint will be rate limited by the middleware
    Json(ApiResponse::success("This request was checked by the rate limiter"))
}

#[get("/secure")]
pub fn secure() -> Json<ApiResponse<&'static str>> {
    // This endpoint will have security headers added by the middleware
    Json(ApiResponse::success("This response includes security headers"))
}

#[get("/custom-headers")]
pub fn custom_headers() -> Json<ApiResponse<&'static str>> {
    // This endpoint will have custom headers added by the middleware
    Json(ApiResponse::success("This response includes custom headers"))
}

// Middleware status endpoint
#[get("/middleware-status")]
pub fn middleware_status() -> Json<ApiResponse<serde_json::Value>> {
    let status = serde_json::json!({
        "middleware": {
            "request_logger": "active",
            "response_logger": "active",
            "request_timer": "active",
            "rate_limiter": "active",
            "request_id": "active",
            "security_headers": "active",
            "size_limiter": "active",
            "custom_headers": "active"
        },
        "features": {
            "authentication": "supported",
            "rate_limiting": "supported",
            "request_timing": "supported",
            "security_headers": "supported",
            "custom_headers": "supported"
        }
    });
    
    Json(ApiResponse::success(status))
}

// Middleware test page
#[get("/middleware-demo")]
pub fn middleware_demo() -> RawHtml<&'static str> {
    RawHtml(r#"
<!DOCTYPE html>
<html>
<head>
    <title>Middleware Demo</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        .demo-section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .button { background-color: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
        .button:hover { background-color: #0056b3; }
        .result { margin-top: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 4px; white-space: pre-wrap; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Middleware Demo</h1>
        <p>This page demonstrates various middleware features in Rocket. Check the browser's developer tools and server console to see the middleware in action.</p>
        
        <div class="demo-section">
            <h2>Logging Middleware</h2>
            <button class="button" onclick="testLogging()">Test Logging</button>
            <div id="logging-result" class="result"></div>
        </div>
        
        <div class="demo-section">
            <h2>Request Timing</h2>
            <button class="button" onclick="testTiming()">Test Timing</button>
            <div id="timing-result" class="result"></div>
        </div>
        
        <div class="demo-section">
            <h2>Rate Limiting</h2>
            <button class="button" onclick="testRateLimit()">Test Rate Limiting</button>
            <div id="rate-limit-result" class="result"></div>
        </div>
        
        <div class="demo-section">
            <h2>Security Headers</h2>
            <button class="button" onclick="testSecurity()">Test Security Headers</button>
            <div id="security-result" class="result"></div>
        </div>
        
        <div class="demo-section">
            <h2>Custom Headers</h2>
            <button class="button" onclick="testCustomHeaders()">Test Custom Headers</button>
            <div id="custom-headers-result" class="result"></div>
        </div>
        
        <div class="demo-section">
            <h2>Middleware Status</h2>
            <button class="button" onclick="getMiddlewareStatus()">Get Status</button>
            <div id="status-result" class="result"></div>
        </div>
    </div>
    
    <script>
        async function testLogging() {
            const response = await fetch('/logging');
            const result = await response.json();
            document.getElementById('logging-result').textContent = JSON.stringify(result, null, 2);
        }
        
        async function testTiming() {
            const response = await fetch('/timing');
            const result = await response.json();
            const responseTime = response.headers.get('X-Response-Time');
            document.getElementById('timing-result').textContent = 
                `Response: ${JSON.stringify(result, null, 2)}\nResponse Time: ${responseTime}`;
        }
        
        async function testRateLimit() {
            const response = await fetch('/rate-limited');
            const result = await response.json();
            document.getElementById('rate-limit-result').textContent = JSON.stringify(result, null, 2);
        }
        
        async function testSecurity() {
            const response = await fetch('/secure');
            const result = await response.json();
            
            const securityHeaders = {
                'X-Content-Type-Options': response.headers.get('X-Content-Type-Options'),
                'X-Frame-Options': response.headers.get('X-Frame-Options'),
                'X-XSS-Protection': response.headers.get('X-XSS-Protection'),
                'Content-Security-Policy': response.headers.get('Content-Security-Policy'),
            };
            
            document.getElementById('security-result').textContent = 
                `Response: ${JSON.stringify(result, null, 2)}\n\nSecurity Headers: ${JSON.stringify(securityHeaders, null, 2)}`;
        }
        
        async function testCustomHeaders() {
            const response = await fetch('/custom-headers');
            const result = await response.json();
            
            const customHeaders = {
                'X-Powered-By': response.headers.get('X-Powered-By'),
                'X-Server-Version': response.headers.get('X-Server-Version'),
                'X-Response-Time': response.headers.get('X-Response-Time'),
                'X-Request-ID': response.headers.get('X-Request-ID'),
            };
            
            document.getElementById('custom-headers-result').textContent = 
                `Response: ${JSON.stringify(result, null, 2)}\n\nCustom Headers: ${JSON.stringify(customHeaders, null, 2)}`;
        }
        
        async function getMiddlewareStatus() {
            const response = await fetch('/middleware-status');
            const result = await response.json();
            document.getElementById('status-result').textContent = JSON.stringify(result, null, 2);
        }
    </script>
</body>
</html>
    "#)
}