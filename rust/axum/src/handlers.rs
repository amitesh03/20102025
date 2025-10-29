use axum::{
    extract::{Path, Query, State},
    http::{StatusCode, header},
    response::{Html, IntoResponse, Json, Response},
    Form,
};
use std::sync::Arc;
use uuid::Uuid;
use tracing::{info, error, warn};

use crate::models::*;
use crate::extractors::*;

// User management handlers
pub async fn get_users(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let users = state.users.lock().unwrap();
    let user_responses: Vec<UserResponse> = users.iter().cloned().map(UserResponse::from).collect();
    
    Json(ApiResponse::success(user_responses))
}

pub async fn create_user(
    State(state): State<Arc<AppState>>,
    Json(user_request): Json<CreateUserRequest>,
) -> Result<impl IntoResponse, AppError> {
    let mut users = state.users.lock().unwrap();
    
    // Check if username already exists
    if users.iter().any(|u| u.username == user_request.username) {
        return Err(AppError::BadRequest("Username already exists".to_string()));
    }
    
    // Check if email already exists
    if users.iter().any(|u| u.email == user_request.email) {
        return Err(AppError::BadRequest("Email already exists".to_string()));
    }
    
    let new_user = User::new(user_request.username.clone(), user_request.email.clone());
    users.push(new_user.clone());
    
    info!("Created user: {}", new_user.username);
    
    Ok((
        StatusCode::CREATED,
        Json(ApiResponse::success(UserResponse::from(new_user)))
    ))
}

pub async fn get_user(
    State(state): State<Arc<AppState>>,
    Path(user_id): Path<Uuid>,
) -> Result<impl IntoResponse, AppError> {
    let users = state.users.lock().unwrap();
    
    match users.iter().find(|u| u.id == user_id) {
        Some(user) => Ok(Json(ApiResponse::success(UserResponse::from(user.clone())))),
        None => Err(AppError::NotFound("User not found".to_string())),
    }
}

pub async fn update_user(
    State(state): State<Arc<AppState>>,
    Path(user_id): Path<Uuid>,
    Json(update_request): Json<UpdateUserRequest>,
) -> Result<impl IntoResponse, AppError> {
    let mut users = state.users.lock().unwrap();
    
    match users.iter_mut().find(|u| u.id == user_id) {
        Some(user) => {
            if let Some(username) = &update_request.username {
                user.username = username.clone();
            }
            if let Some(email) = &update_request.email {
                user.email = email.clone();
            }
            user.updated_at = chrono::Utc::now();
            
            info!("Updated user: {}", user.username);
            
            Ok(Json(ApiResponse::success(UserResponse::from(user.clone()))))
        },
        None => Err(AppError::NotFound("User not found".to_string())),
    }
}

pub async fn delete_user(
    State(state): State<Arc<AppState>>,
    Path(user_id): Path<Uuid>,
) -> Result<impl IntoResponse, AppError> {
    let mut users = state.users.lock().unwrap();
    
    match users.iter().position(|u| u.id == user_id) {
        Some(pos) => {
            users.remove(pos);
            info!("Deleted user with ID: {}", user_id);
            Ok(Json(ApiResponse::success(())))
        },
        None => Err(AppError::NotFound("User not found".to_string())),
    }
}

// Counter handlers
pub async fn get_counter(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let counter = *state.counter.lock().unwrap();
    Json(serde_json::json!({
        "counter": counter
    }))
}

pub async fn increment_counter(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let mut counter = state.counter.lock().unwrap();
    *counter += 1;
    Json(serde_json::json!({
        "counter": *counter
    }))
}

// Form handlers
pub async fn form_page() -> Html<String> {
    let html = r#"
    <!DOCTYPE html>
    <html>
    <head>
        <title>Axum Form Example</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            form { max-width: 500px; }
            div { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; }
            input, textarea { width: 100%; padding: 8px; }
            button { background-color: #007bff; color: white; padding: 10px 15px; border: none; cursor: pointer; }
        </style>
    </head>
    <body>
        <h1>Axum Form Example</h1>
        <form method="post" action="/form/submit">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div>
                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="4" required></textarea>
            </div>
            <button type="submit">Submit</button>
        </form>
    </body>
    </html>
    "#.to_string();
    
    Html(html)
}

pub async fn form_submit(
    State(state): State<Arc<AppState>>,
    Form(form_data): Form<FormData>,
) -> impl IntoResponse {
    info!("Received form submission: {:?}", form_data);
    
    // Store the message
    let mut messages = state.messages.lock().unwrap();
    let message = ChatMessage {
        id: Uuid::new_v4(),
        username: form_data.name.clone(),
        message: form_data.message.clone(),
        timestamp: chrono::Utc::now(),
    };
    messages.push(message);
    
    Json(ApiResponse::success(serde_json::json!({
        "message": "Form submitted successfully",
        "data": {
            "name": form_data.name,
            "email": form_data.email,
            "message": form_data.message
        }
    })))
}

// Cookie handlers
pub async fn set_cookies() -> impl IntoResponse {
    let mut response = Json(ApiResponse::success("Cookies set successfully")).into_response();
    
    let user_cookie = header::SetCookie::new("user_id", "12345")
        .http_only(true)
        .secure(false)
        .path("/");
    
    let session_cookie = header::SetCookie::new("session_token", "abcdef123456")
        .http_only(true)
        .secure(false)
        .path("/");
    
    response.headers_mut().insert(header::SET_COOKIE, user_cookie.to_string().parse().unwrap());
    response.headers_mut().insert(header::SET_COOKIE, session_cookie.to_string().parse().unwrap());
    
    response
}

pub async fn get_cookies(headers: axum::http::HeaderMap) -> impl IntoResponse {
    let mut cookies = std::collections::HashMap::new();
    
    if let Some(user_id) = headers.get(header::COOKIE) {
        if let Ok(cookie_str) = user_id.to_str() {
            for cookie in cookie_str.split(';') {
                let parts: Vec<&str> = cookie.trim().split('=').collect();
                if parts.len() == 2 {
                    cookies.insert(parts[0].to_string(), parts[1].to_string());
                }
            }
        }
    }
    
    Json(ApiResponse::success(cookies))
}

// Middleware handlers
pub async fn middleware_trace() -> impl IntoResponse {
    Json(ApiResponse::success("This endpoint uses trace middleware"))
}

pub async fn middleware_auth(AuthUser { user_id, username }: AuthUser) -> impl IntoResponse {
    Json(ApiResponse::success(serde_json::json!({
        "message": "This is a protected endpoint",
        "user_id": user_id,
        "username": username
    })))
}

// WebSocket handler placeholder
pub async fn websocket_handler() -> impl IntoResponse {
    Json(ApiResponse::success("WebSocket endpoint - see websocket.rs for implementation"))
}