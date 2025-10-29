use rocket::http::Status;
use rocket::request::FromRequest;
use rocket::response::{Responder, Response};
use rocket::serde::json::Json;
use rocket::{Request, Route};
use std::io::Cursor;
use crate::models::ApiResponse;

// Custom error type
#[derive(Debug)]
pub enum AppError {
    NotFound(String),
    BadRequest(String),
    Unauthorized(String),
    Forbidden(String),
    InternalServerError(String),
    Custom(u16, String),
}

impl<'r> Responder<'r, 'static> for AppError {
    fn respond_to(self, _request: &'r Request<'_>) -> rocket::response::Result<'static> {
        let (status, message) = match self {
            AppError::NotFound(msg) => (Status::NotFound, msg),
            AppError::BadRequest(msg) => (Status::BadRequest, msg),
            AppError::Unauthorized(msg) => (Status::Unauthorized, msg),
            AppError::Forbidden(msg) => (Status::Forbidden, msg),
            AppError::InternalServerError(msg) => (Status::InternalServerError, msg),
            AppError::Custom(code, msg) => (Status::new(code), msg),
        };

        let error_response = ApiResponse::<()>::error(&message);
        let json_string = serde_json::to_string(&error_response).unwrap_or_default();

        Response::build()
            .status(status)
            .sized_body(json_string.len(), Cursor::new(json_string))
            .header(rocket::http::ContentType::JSON)
            .ok()
    }
}

// Error handlers
#[get("/error/not-found")]
pub fn not_found() -> Result<Json<ApiResponse<&'static str>>, AppError> {
    Err(AppError::NotFound("Resource not found".to_string()))
}

#[get("/error/server-error")]
pub fn server_error() -> Result<Json<ApiResponse<&'static str>>, AppError> {
    Err(AppError::InternalServerError("Internal server error occurred".to_string()))
}

#[get("/error/custom")]
pub fn custom_error() -> Result<Json<ApiResponse<&'static str>>, AppError> {
    Err(AppError::Custom(418, "I'm a teapot".to_string()))
}

#[get("/error/bad-request")]
pub fn bad_request() -> Result<Json<ApiResponse<&'static str>>, AppError> {
    Err(AppError::BadRequest("Invalid request parameters".to_string()))
}

#[get("/error/unauthorized")]
pub fn unauthorized() -> Result<Json<ApiResponse<&'static str>>, AppError> {
    Err(AppError::Unauthorized("Authentication required".to_string()))
}

#[get("/error/forbidden")]
pub fn forbidden() -> Result<Json<ApiResponse<&'static str>>, AppError> {
    Err(AppError::Forbidden("Access denied".to_string()))
}

// Error with context
#[get("/error/with-context/<error_type>")]
pub fn error_with_context(error_type: &str) -> Result<Json<ApiResponse<String>>, AppError> {
    match error_type {
        "not-found" => Err(AppError::NotFound(format!("Resource '{}' not found", error_type))),
        "bad-request" => Err(AppError::BadRequest(format!("Invalid request for '{}'", error_type))),
        "server-error" => Err(AppError::InternalServerError(format!("Server error processing '{}'", error_type))),
        _ => Err(AppError::BadRequest(format!("Unknown error type: {}", error_type))),
    }
}

// Conditional error
#[get("/error/conditional?<should_error>")]
pub fn conditional_error(should_error: bool) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    if should_error {
        Err(AppError::BadRequest("Error condition met".to_string()))
    } else {
        Ok(Json(ApiResponse::success("No error occurred")))
    }
}

// Error from validation
#[derive(serde::Deserialize)]
pub struct ValidationRequest {
    pub name: String,
    pub age: u32,
    pub email: String,
}

#[post("/error/validation", data = "<data>")]
pub fn validation_error(data: Json<ValidationRequest>) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    let req = data.into_inner();
    
    if req.name.is_empty() {
        return Err(AppError::BadRequest("Name cannot be empty".to_string()));
    }
    
    if req.age < 18 {
        return Err(AppError::BadRequest("Age must be at least 18".to_string()));
    }
    
    if !req.email.contains('@') {
        return Err(AppError::BadRequest("Invalid email format".to_string()));
    }
    
    Ok(Json(ApiResponse::success("Validation passed")))
}

// Error from external service
#[get("/error/external-service")]
pub async fn external_service_error() -> Result<Json<ApiResponse<&'static str>>, AppError> {
    // Simulate an external service call that might fail
    match simulate_external_service().await {
        Ok(response) => Ok(Json(ApiResponse::success(&response))),
        Err(error) => Err(AppError::InternalServerError(format!("External service error: {}", error))),
    }
}

async fn simulate_external_service() -> Result<String, String> {
    // Simulate a 50% chance of failure
    if rand::random::<bool>() {
        Ok("External service response".to_string())
    } else {
        Err("Service unavailable".to_string())
    }
}

// Error with recovery
#[get("/error/recovery?<attempt>")]
pub fn error_with_recovery(attempt: u32) -> Result<Json<ApiResponse<String>>, AppError> {
    if attempt < 3 {
        Err(AppError::InternalServerError(format!("Attempt {} failed, try again", attempt)))
    } else {
        Ok(Json(ApiResponse::success("Success after retries".to_string())))
    }
}

// Error logging
#[get("/error/logging")]
pub fn error_logging() -> Result<Json<ApiResponse<&'static str>>, AppError> {
    log_error("This error will be logged");
    Err(AppError::InternalServerError("An error occurred and was logged".to_string()))
}

fn log_error(message: &str) {
    eprintln!("[ERROR] {}", message);
    // In a real application, you would use a proper logging framework
}

// Error with different formats
#[get("/error/formats?<format>")]
pub fn error_formats(format: &str) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    match format {
        "json" => Err(AppError::BadRequest("JSON error".to_string())),
        "xml" => Err(AppError::BadRequest("XML error".to_string())),
        "html" => Err(AppError::BadRequest("HTML error".to_string())),
        _ => Err(AppError::BadRequest("Unknown format".to_string())),
    }
}

// Error with stack trace (in debug mode)
#[get("/error/stack-trace")]
pub fn error_with_stack_trace() -> Result<Json<ApiResponse<&'static str>>, AppError> {
    #[cfg(debug_assertions)]
    {
        let stack_trace = format!("Stack trace: {:?}", std::backtrace::Backtrace::capture());
        Err(AppError::InternalServerError(format!("Error with stack trace: {}", stack_trace)))
    }
    
    #[cfg(not(debug_assertions))]
    {
        Err(AppError::InternalServerError("Error occurred".to_string()))
    }
}

// Error with custom response
#[derive(Debug)]
pub struct DetailedError {
    pub code: u16,
    pub message: String,
    pub details: Option<String>,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

impl<'r> Responder<'r, 'static> for DetailedError {
    fn respond_to(self, _request: &'r Request<'_>) -> rocket::response::Result<'static> {
        let error_response = serde_json::json!({
            "error": {
                "code": self.code,
                "message": self.message,
                "details": self.details,
                "timestamp": self.timestamp
            }
        });
        
        let json_string = serde_json::to_string(&error_response).unwrap_or_default();
        
        Response::build()
            .status(Status::new(self.code))
            .sized_body(json_string.len(), Cursor::new(json_string))
            .header(rocket::http::ContentType::JSON)
            .ok()
    }
}

#[get("/error/detailed")]
pub fn detailed_error() -> Result<Json<ApiResponse<&'static str>>, DetailedError> {
    Err(DetailedError {
        code: 400,
        message: "Detailed error occurred".to_string(),
        details: Some("This is a detailed error with additional information".to_string()),
        timestamp: chrono::Utc::now(),
    })
}

// Error with retry information
#[derive(Debug)]
pub struct RetryableError {
    pub message: String,
    pub retry_after: u32,
    pub max_retries: u32,
}

impl<'r> Responder<'r, 'static> for RetryableError {
    fn respond_to(self, _request: &'r Request<'_>) -> rocket::response::Result<'static> {
        let error_response = serde_json::json!({
            "error": {
                "message": self.message,
                "retry_after": self.retry_after,
                "max_retries": self.max_retries,
                "retryable": true
            }
        });
        
        let json_string = serde_json::to_string(&error_response).unwrap_or_default();
        
        Response::build()
            .status(Status::ServiceUnavailable)
            .header(rocket::http::Header::new("Retry-After", self.retry_after.to_string()))
            .sized_body(json_string.len(), Cursor::new(json_string))
            .header(rocket::http::ContentType::JSON)
            .ok()
    }
}

#[get("/error/retryable")]
pub fn retryable_error() -> Result<Json<ApiResponse<&'static str>>, RetryableError> {
    Err(RetryableError {
        message: "Service temporarily unavailable".to_string(),
        retry_after: 60,
        max_retries: 3,
    })
}