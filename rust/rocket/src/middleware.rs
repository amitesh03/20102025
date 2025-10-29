use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::{Header, Status};
use rocket::request::{FromRequest, Outcome};
use rocket::{Data, Request, Response, State};
use std::io::Write;
use std::sync::{Arc, Mutex};
use uuid::Uuid;

// CORS middleware
pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new("Access-Control-Allow-Methods", "POST, GET, PATCH, OPTIONS"));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
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

    async fn on_request(&self, request: &mut Request<'_>, _data: &mut Data<'_>) {
        println!("{} {} {}", request.method(), request.uri(), request.remote());
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
        println!("{} {} {}", response.status(), request.method(), request.uri());
    }
}

// Authentication middleware
pub struct ApiKey(String);

#[rocket::async_trait]
impl<'r> FromRequest<'r> for ApiKey {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        match request.headers().get_one("x-api-key") {
            Some(key) if key == "secret-api-key" => {
                Outcome::Success(ApiKey(key.to_string()))
            }
            _ => Outcome::Failure((Status::Unauthorized, ())),
        }
    }
}

// User authentication
pub struct UserAuth {
    pub user_id: Uuid,
    pub username: String,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for UserAuth {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        // In a real app, you would validate a JWT token or session cookie
        // For this example, we'll just check for a user-id header
        match request.headers().get_one("x-user-id") {
            Some(user_id_str) => {
                match Uuid::parse_str(user_id_str) {
                    Ok(user_id) => {
                        // In a real app, you would fetch the user from the database
                        let username = format!("user-{}", user_id);
                        Outcome::Success(UserAuth { user_id, username })
                    }
                    Err(_) => Outcome::Failure((Status::BadRequest, ())),
                }
            }
            None => Outcome::Failure((Status::Unauthorized, ())),
        }
    }
}

// Rate limiting middleware
pub struct RateLimiter {
    requests: Arc<Mutex<std::collections::HashMap<String, (u32, std::time::Instant)>>>,
    max_requests: u32,
    window_duration: std::time::Duration,
}

impl RateLimiter {
    pub fn new(max_requests: u32, window_seconds: u64) -> Self {
        Self {
            requests: Arc::new(Mutex::new(std::collections::HashMap::new())),
            max_requests,
            window_duration: std::time::Duration::from_secs(window_seconds),
        }
    }

    pub fn is_allowed(&self, key: &str) -> bool {
        let mut requests = self.requests.lock().unwrap();
        let now = std::time::Instant::now();

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

    async fn on_request(&self, request: &mut Request<'_>, _data: &mut Data<'_>) {
        let client_ip = request.remote().map(|addr| addr.to_string()).unwrap_or_else(|| "unknown".to_string());
        
        if !self.is_allowed(&client_ip) {
            // Set a custom header to indicate rate limiting
            request.add_header(Header::new("x-rate-limit-exceeded", "true"));
        }
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
    }
}

// Request timing middleware
pub struct RequestTimer {
    start_times: Arc<Mutex<std::collections::HashMap<String, std::time::Instant>>>,
}

impl RequestTimer {
    pub fn new() -> Self {
        Self {
            start_times: Arc::new(Mutex::new(std::collections::HashMap::new())),
        }
    }

    pub fn start(&self, id: &str) {
        let mut start_times = self.start_times.lock().unwrap();
        start_times.insert(id.to_string(), std::time::Instant::now());
    }

    pub fn end(&self, id: &str) -> Option<std::time::Duration> {
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

    async fn on_request(&self, request: &mut Request<'_>, _data: &mut Data<'_>) {
        let id = format!("{}-{}", request.method(), request.uri());
        self.start(&id);
    }

    async fn on_response<'r>(&self, request: &'r Request<'_>, response: &mut Response<'r>) {
        let id = format!("{}-{}", request.method(), request.uri());
        if let Some(duration) = self.end(&id) {
            println!("Request took {}ms", duration.as_millis());
            response.set_header(Header::new("x-response-time", format!("{}ms", duration.as_millis())));
        }
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

    async fn on_request(&self, request: &mut Request<'_>, data: &mut Data<'_>) {
        if let Some(content_length) = request.headers().get_one("content-length") {
            if let Ok(size) = content_length.parse::<u64>() {
                if size > self.max_size {
                    // Set a custom header to indicate the request is too large
                    request.add_header(Header::new("x-request-too-large", "true"));
                }
            }
        }
    }
}

// Custom middleware to add a unique request ID
pub struct RequestId;

#[rocket::async_trait]
impl Fairing for RequestId {
    fn info(&self) -> Info {
        Info {
            name: "Request ID",
            kind: Kind::Request,
        }
    }

    async fn on_request(&self, request: &mut Request<'_>, _data: &mut Data<'_>) {
        let request_id = Uuid::new_v4().to_string();
        request.add_header(Header::new("x-request-id", request_id));
    }
}