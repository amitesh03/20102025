use axum::{
    extract::{FromRequestParts, Request, FromRequest},
    http::{request::Parts, StatusCode, HeaderMap},
    response::IntoResponse,
    Json,
};
use async_trait::async_trait;
use std::sync::Arc;
use uuid::Uuid;
use tracing::{info, warn};

use crate::models::*;

// Path extractor example
pub async fn path_extractor(Path(params): Path<PathParams>) -> impl IntoResponse {
    Json(serde_json::json!({
        "message": "Path parameters extracted successfully",
        "name": params.name,
        "age": params.age
    }))
}

// Query extractor example
pub async fn query_extractor(Query(params): Query<QueryParams>) -> impl IntoResponse {
    Json(serde_json::json!({
        "message": "Query parameters extracted successfully",
        "params": params
    }))
}

// JSON extractor example
pub async fn json_extractor(Json(payload): Json<serde_json::Value>) -> impl IntoResponse {
    info!("Received JSON payload: {:?}", payload);
    
    Json(serde_json::json!({
        "message": "JSON body extracted successfully",
        "received_data": payload
    }))
}

// Form extractor example
pub async fn form_extractor(Form(form_data): Form<FormData>) -> impl IntoResponse {
    info!("Received form data: {:?}", form_data);
    
    Json(serde_json::json!({
        "message": "Form data extracted successfully",
        "data": {
            "name": form_data.name,
            "email": form_data.email,
            "message": form_data.message
        }
    }))
}

// Custom extractor for authentication
#[derive(Debug)]
pub struct AuthUser {
    pub user_id: Uuid,
    pub username: String,
}

#[async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        // Get the Authorization header
        let auth_header = parts
            .headers
            .get("authorization")
            .ok_or_else(|| AppError::BadRequest("Missing authorization header".to_string()))?;

        // Parse the Bearer token
        let auth_str = auth_header.to_str().map_err(|_| {
            AppError::BadRequest("Invalid authorization header".to_string())
        })?;

        if !auth_str.starts_with("Bearer ") {
            return Err(AppError::BadRequest("Invalid authorization format".to_string()));
        }

        let token = &auth_str[7..];

        // In a real application, you would validate the token here
        // For this example, we'll just check if it's not empty
        if token.is_empty() {
            return Err(AppError::BadRequest("Invalid token".to_string()));
        }

        // Mock user data - in a real app, you'd decode the JWT or look up the token
        let user_id = Uuid::new_v4(); // Mock user ID
        let username = "user_from_token".to_string(); // Mock username

        info!("Authenticated user: {} with token: {}", username, token);

        Ok(AuthUser { user_id, username })
    }
}

// Custom extractor for API key
#[derive(Debug)]
pub struct ApiKey(String);

#[async_trait]
impl<S> FromRequestParts<S> for ApiKey
where
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let api_key = parts
            .headers
            .get("x-api-key")
            .ok_or_else(|| AppError::BadRequest("Missing API key".to_string()))?;

        let api_key_str = api_key.to_str().map_err(|_| {
            AppError::BadRequest("Invalid API key format".to_string())
        })?;

        // Validate API key (in a real app, check against database)
        if api_key_str != "secret-api-key-12345" {
            warn!("Invalid API key attempted: {}", api_key_str);
            return Err(AppError::BadRequest("Invalid API key".to_string()));
        }

        info!("Valid API key used: {}", api_key_str);

        Ok(ApiKey(api_key_str.to_string()))
    }
}

// Custom extractor for rate limiting
#[derive(Debug)]
pub struct RateLimit {
    pub remaining: u32,
    pub reset_time: chrono::DateTime<chrono::Utc>,
}

#[async_trait]
impl<S> FromRequestParts<S> for RateLimit
where
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        // Get client IP
        let client_ip = parts
            .headers
            .get("x-forwarded-for")
            .or_else(|| parts.headers.get("x-real-ip"))
            .and_then(|h| h.to_str().ok())
            .unwrap_or("unknown");

        // In a real application, you would check rate limits in a database
        // For this example, we'll just return mock data
        info!("Rate limit check for IP: {}", client_ip);

        Ok(RateLimit {
            remaining: 99,
            reset_time: chrono::Utc::now() + chrono::Duration::hours(1),
        })
    }
}

// Custom extractor for request logging
#[derive(Debug)]
pub struct RequestLogger {
    pub method: String,
    pub path: String,
    pub user_agent: Option<String>,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

#[async_trait]
impl<S> FromRequestParts<S> for RequestLogger
where
    S: Send + Sync,
{
    type Rejection = StatusCode;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let method = parts.method.to_string();
        let path = parts.uri.path().to_string();
        let user_agent = parts
            .headers
            .get("user-agent")
            .and_then(|h| h.to_str().ok())
            .map(|s| s.to_string());
        let timestamp = chrono::Utc::now();

        info!(
            "Request: {} {} from {} at {}",
            method,
            path,
            user_agent.as_deref().unwrap_or("unknown"),
            timestamp
        );

        Ok(RequestLogger {
            method,
            path,
            user_agent,
            timestamp,
        })
    }
}

// Custom extractor for content validation
#[derive(Debug)]
pub struct ValidatedContent<T> {
    pub data: T,
}

#[async_trait]
impl<T, S> FromRequest<S> for ValidatedContent<T>
where
    T: serde::de::DeserializeOwned + Send + Sync + 'static,
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let Json(data) = Json::<T>::from_request(req, state).await
            .map_err(|_| AppError::BadRequest("Invalid JSON".to_string()))?;

        // Add validation logic here
        // For this example, we'll just accept any valid JSON

        Ok(ValidatedContent { data })
    }
}

// Example handler using multiple extractors
pub async fn multi_extractor_example(
    Path(path_params): Path<PathParams>,
    Query(query_params): Query<QueryParams>,
    AuthUser { user_id, username }: AuthUser,
    ApiKey(_api_key): ApiKey,
    RateLimit { remaining, reset_time }: RateLimit,
) -> impl IntoResponse {
    Json(serde_json::json!({
        "message": "Multiple extractors used successfully",
        "path_params": path_params,
        "query_params": query_params,
        "user": {
            "id": user_id,
            "username": username
        },
        "rate_limit": {
            "remaining_requests": remaining,
            "reset_time": reset_time
        }
    }))
}