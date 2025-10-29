use actix_web::{get, post, put, delete, web, HttpResponse, Result, Responder};
use uuid::Uuid;
use std::sync::Mutex;

use crate::models::{User, CreateUserRequest, UpdateUserRequest, UserResponse, ApiResponse, ErrorResponse};
use crate::AppState;

// Configure user routes
pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(get_users)
      .service(create_user)
      .service(get_user_by_id)
      .service(update_user)
      .service(delete_user);
}

// Get all users
#[get("")]
async fn get_users(data: web::Data<AppState>) -> Result<impl Responder> {
    let users = data.users.lock().unwrap();
    let user_responses: Vec<UserResponse> = users.iter().cloned().map(UserResponse::from).collect();
    Ok(HttpResponse::Ok().json(ApiResponse::success(user_responses)))
}

// Create a new user
#[post("")]
async fn create_user(
    data: web::Data<AppState>,
    user_request: web::Json<CreateUserRequest>,
) -> Result<impl Responder> {
    let mut users = data.users.lock().unwrap();
    
    // Check if username already exists
    if users.iter().any(|u| u.username == user_request.username) {
        return Ok(HttpResponse::BadRequest().json(
            ErrorResponse::new("Username already exists".to_string())
        ));
    }
    
    // Check if email already exists
    if users.iter().any(|u| u.email == user_request.email) {
        return Ok(HttpResponse::BadRequest().json(
            ErrorResponse::new("Email already exists".to_string())
        ));
    }
    
    let new_user = User::new(user_request.username.clone(), user_request.email.clone());
    users.push(new_user.clone());
    
    Ok(HttpResponse::Created().json(ApiResponse::success(UserResponse::from(new_user))))
}

// Get user by ID
#[get("/{id}")]
async fn get_user_by_id(
    data: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<impl Responder> {
    let user_id = path.into_inner();
    let users = data.users.lock().unwrap();
    
    match users.iter().find(|u| u.id == user_id) {
        Some(user) => Ok(HttpResponse::Ok().json(ApiResponse::success(UserResponse::from(user.clone())))),
        None => Ok(HttpResponse::NotFound().json(
            ErrorResponse::new("User not found".to_string())
        )),
    }
}

// Update user
#[put("/{id}")]
async fn update_user(
    data: web::Data<AppState>,
    path: web::Path<Uuid>,
    update_request: web::Json<UpdateUserRequest>,
) -> Result<impl Responder> {
    let user_id = path.into_inner();
    let mut users = data.users.lock().unwrap();
    
    match users.iter_mut().find(|u| u.id == user_id) {
        Some(user) => {
            if let Some(username) = &update_request.username {
                user.username = username.clone();
            }
            if let Some(email) = &update_request.email {
                user.email = email.clone();
            }
            user.updated_at = chrono::Utc::now();
            
            Ok(HttpResponse::Ok().json(ApiResponse::success(UserResponse::from(user.clone()))))
        },
        None => Ok(HttpResponse::NotFound().json(
            ErrorResponse::new("User not found".to_string())
        )),
    }
}

// Delete user
#[delete("/{id}")]
async fn delete_user(
    data: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<impl Responder> {
    let user_id = path.into_inner();
    let mut users = data.users.lock().unwrap();
    
    match users.iter().position(|u| u.id == user_id) {
        Some(pos) => {
            users.remove(pos);
            Ok(HttpResponse::Ok().json(ApiResponse::success(())))
        },
        None => Ok(HttpResponse::NotFound().json(
            ErrorResponse::new("User not found".to_string())
        )),
    }
}

// Counter example for state management
#[get("/counter")]
pub async fn get_counter(data: web::Data<AppState>) -> Result<impl Responder> {
    let counter = *data.counter.lock().unwrap();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "counter": counter
    })))
}

#[post("/counter/increment")]
pub async fn increment_counter(data: web::Data<AppState>) -> Result<impl Responder> {
    let mut counter = data.counter.lock().unwrap();
    *counter += 1;
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "counter": *counter
    })))
}

// Error handling examples
#[get("/error/example")]
pub async fn error_example() -> Result<impl Responder> {
    Err(actix_web::error::ErrorInternalServerError("Internal Server Error"))
}

#[get("/error/custom")]
pub async fn custom_error_example() -> Result<impl Responder> {
    Err(actix_web::error::ErrorBadRequest("Bad Request Error"))
}