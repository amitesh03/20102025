use actix_web::{dev, middleware, Error, HttpRequest, Result, web};
use actix_cors::Cors;
use std::time::Instant;

// Configure middleware
pub fn configure_middleware(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/middleware")
            .wrap(middleware::Logger::default())
            .wrap(middleware::Compress::default())
            .wrap(middleware::NormalizePath::default())
            .wrap(custom_headers_middleware())
            .service(middleware_test)
            .service(request_timing)
    );
}

// Custom middleware for adding headers
fn custom_headers_middleware() -> impl dev::Transform<
    dev::ServiceRequest,
    Response = dev::ServiceResponse,
    Error = Error,
    InitError = (),
> {
    middleware::DefaultHeaders::new()
        .add("X-Custom-Header", "Actix-Web-Learning")
        .add("X-Server-Version", "1.0.0")
}

// CORS configuration
pub fn configure_cors() -> Cors {
    Cors::default()
        .allow_any_origin()
        .allow_any_method()
        .allow_any_header()
        .expose_any_header()
        .max_age(3600)
}

// Timing middleware
pub struct TimingMiddleware;

impl<S, B> dev::Transform<S, dev::ServiceRequest> for TimingMiddleware
where
    S: dev::Service<dev::ServiceRequest, Response = dev::ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = dev::ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = TimingMiddlewareService<S>;
    type Future = Result<Self::Transform, Self::InitError>;

    fn new_transform(&self, service: S) -> Self::Future {
        Ok(TimingMiddlewareService { service })
    }
}

pub struct TimingMiddlewareService<S> {
    service: S,
}

impl<S, B> dev::Service<dev::ServiceRequest> for TimingMiddlewareService<S>
where
    S: dev::Service<dev::ServiceRequest, Response = dev::ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = dev::ServiceResponse<B>;
    type Error = Error;
    type Future = futures::future::BoxFuture<'static, Result<Self::Response, Self::Error>>;

    dev::forward_ready!(service);

    fn call(&self, req: dev::ServiceRequest) -> Self::Future {
        let start = Instant::now();
        
        let fut = self.service.call(req);
        
        Box::pin(async move {
            let res = fut.await?;
            let duration = start.elapsed();
            
            println!("Request took: {:?}", duration);
            
            Ok(res)
        })
    }
}

// Authentication middleware
pub struct AuthMiddleware;

impl<S, B> dev::Transform<S, dev::ServiceRequest> for AuthMiddleware
where
    S: dev::Service<dev::ServiceRequest, Response = dev::ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = dev::ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = AuthMiddlewareService<S>;
    type Future = Result<Self::Transform, Self::InitError>;

    fn new_transform(&self, service: S) -> Self::Future {
        Ok(AuthMiddlewareService { service })
    }
}

pub struct AuthMiddlewareService<S> {
    service: S,
}

impl<S, B> dev::Service<dev::ServiceRequest> for AuthMiddlewareService<S>
where
    S: dev::Service<dev::ServiceRequest, Response = dev::ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = dev::ServiceResponse<B>;
    type Error = Error;
    type Future = futures::future::BoxFuture<'static, Result<Self::Response, Self::Error>>;

    dev::forward_ready!(service);

    fn call(&self, req: dev::ServiceRequest) -> Self::Future {
        // Check for Authorization header
        if let Some(auth_header) = req.headers().get("Authorization") {
            if let Ok(auth_str) = auth_header.to_str() {
                if auth_str.starts_with("Bearer ") {
                    // In a real app, validate the token here
                    println!("Validating token: {}", &auth_str[7..]);
                    
                    let fut = self.service.call(req);
                    return Box::pin(async move {
                        let res = fut.await?;
                        Ok(res)
                    });
                }
            }
        }
        
        // Return unauthorized if no valid token
        Box::pin(async move {
            Err(ErrorUnauthorized("Missing or invalid authorization token"))
        })
    }
}

// Middleware test endpoints
use actix_web::{get, web, HttpResponse, Responder};

#[get("/test")]
async fn middleware_test(req: HttpRequest) -> impl Responder {
    let headers: Vec<_> = req.headers().iter().map(|(k, v)| (k.as_str(), v.to_str().unwrap_or(""))).collect();
    
    HttpResponse::Ok().json(serde_json::json!({
        "message": "Middleware test endpoint",
        "headers": headers,
        "method": req.method().as_str(),
        "path": req.path()
    }))
}

#[get("/timing")]
async fn request_timing(req: HttpRequest) -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "message": "Request timing test",
        "note": "Check console for timing information"
    }))
}

#[get("/protected")]
async fn protected_route() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "message": "This is a protected route",
        "access": "granted"
    }))
}

#[get("/public")]
async fn public_route() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "message": "This is a public route",
        "access": "no authentication required"
    }))
}

// Custom error for unauthorized access
use actix_web::error::ErrorUnauthorized;