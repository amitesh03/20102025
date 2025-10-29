use crate::models::*;
use warp::{Filter, Reply, Rejection, ReplyError};
use std::convert::Infallible;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;
use chrono::Utc;
use bytes::BufMut;
use std::collections::HashMap;

// Application state
pub type AppState = Arc<RwLock<AppData>>;

#[derive(Debug, Default)]
pub struct AppData {
    users: HashMap<Uuid, User>,
    posts: HashMap<Uuid, Post>,
    comments: HashMap<Uuid, Comment>,
    user_sessions: HashMap<String, Uuid>, // token -> user_id
}

// Helper functions
pub fn with_state(state: AppState) -> impl Filter<Extract = (AppState,), Error = Infallible> + Clone {
    warp::any().map(move || state.clone())
}

pub fn json_body<T: Send + serde::de::DeserializeOwned>() -> impl Filter<Extract = (T,), Error = warp::Rejection> + Clone {
    warp::body::json()
}

// Authentication filter
pub fn with_auth(state: AppState) -> impl Filter<Extract = (Uuid,), Error = warp::Rejection> + Clone {
    warp::header::<String>("authorization")
        .and(with_state(state))
        .and_then(|auth_header: String, state: AppState| async move {
            let token = auth_header.strip_prefix("Bearer ").unwrap_or("");
            
            if token.is_empty() {
                return Err(warp::reject::custom(AuthError::MissingToken));
            }
            
            let data = state.read().await;
            
            match data.user_sessions.get(token) {
                Some(&user_id) => Ok(user_id),
                None => Err(warp::reject::custom(AuthError::InvalidToken)),
            }
        })
}

// User filters
pub fn create_user(
    state: AppState,
) -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "users")
        .and(warp::post())
        .and(json_body::<NewUser>())
        .and(with_state(state))
        .and_then(create_user_handler)
}

pub fn get_users(
    state: AppState,
) -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "users")
        .and(warp::get())
        .and(warp::query::<QueryParams>())
        .and(with_state(state))
        .and_then(get_users_handler)
}

pub fn get_user(
    state: AppState,
) -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "users" / String)
        .and(warp::get())
        .and(with_state(state))
        .and_then(get_user_handler)
}

pub fn update_user(
    state: AppState,
) -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "users" / String)
        .and(warp::put())
        .and(json_body::<NewUser>())
        .and(with_auth(state.clone()))
        .and(with_state(state))
        .and_then(update_user_handler)
}

pub fn delete_user(
    state: AppState,
) -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "users" / String)
        .and(warp::delete())
        .and(with_auth(state.clone()))
        .and(with_state(state))
        .and_then(delete_user_handler)
}

// Post filters
pub fn create_post(
    state: AppState,
) -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "posts")
        .and(warp::post())
        .and(json_body::<NewPost>())
        .and(with_auth(state.clone()))
        .and(with_state(state))
        .and_then(create_post_handler)
}

pub fn get_posts(
    state: AppState,
) -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "posts")
        .and(warp::get())
        .and(warp::query::<QueryParams>())
        .and(with_state(state))
        .and_then(get_posts_handler)
}

pub fn get_post(
    state: AppState,
) -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "posts" / String)
        .and(warp::get())
        .and(with_state(state))
        .and_then(get_post_handler)
}

pub fn update_post(
    state: AppState,
) -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "posts" / String)
        .and(warp::put())
        .and(json_body::<NewPost>())
        .and(with_auth(state.clone()))
        .and(with_state(state))
        .and_then(update_post_handler)
}

pub fn delete_post(
    state: AppState,
) -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "posts" / String)
        .and(warp::delete())
        .and(with_auth(state.clone()))
        .and(with_state(state))
        .and_then(delete_post_handler)
}

// Comment filters
pub fn create_comment(
    state: AppState,
) -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "posts" / String / "comments")
        .and(warp::post())
        .and(json_body::<NewComment>())
        .and(with_auth(state.clone()))
        .and(with_state(state))
        .and_then(create_comment_handler)
}

pub fn get_comments(
    state: AppState,
) -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "posts" / String / "comments")
        .and(warp::get())
        .and(warp::query::<QueryParams>())
        .and(with_state(state))
        .and_then(get_comments_handler)
}

// Auth filters
pub fn login(
    state: AppState,
) -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "auth" / "login")
        .and(warp::post())
        .and(json_body::<LoginRequest>())
        .and(with_state(state))
        .and_then(login_handler)
}

pub fn logout(
    state: AppState,
) -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "auth" / "logout")
        .and(warp::post())
        .and(warp::header::optional::<String>("authorization"))
        .and(with_state(state))
        .and_then(logout_handler)
}

// Utility filters
pub fn health() -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path("health")
        .and(warp::get())
        .and_then(health_handler)
}

pub fn stats(
    state: AppState,
) -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "stats")
        .and(warp::get())
        .and(with_state(state))
        .and_then(stats_handler)
}

pub fn file_upload() -> impl Filter<Extract = (impl Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "upload")
        .and(warp::post())
        .and(warp::multipart::form())
        .and_then(file_upload_handler)
}

// CORS filter
pub fn cors() -> warp::cors::Builder {
    warp::cors()
        .allow_any_origin()
        .allow_headers(vec!["content-type", "authorization"])
        .allow_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
}

// Request logging filter
pub fn log_requests() -> impl Filter<Extract = (), Error = Infallible> + Clone {
    warp::log("warp::requests")
}

// Handlers
async fn create_user_handler(new_user: NewUser, state: AppState) -> Result<impl Reply, Rejection> {
    let user_id = Uuid::new_v4();
    let now = Utc::now();
    
    // In a real app, you would hash the password
    let password_hash = format!("hash_{}", new_user.password);
    
    let user = User {
        id: user_id,
        username: new_user.username.clone(),
        email: new_user.email,
        password_hash,
        created_at: now,
        updated_at: now,
    };
    
    let mut data = state.write().await;
    data.users.insert(user_id, user.clone());
    
    let user_response = UserResponse {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
    };
    
    let response = ApiResponse::success(user_response);
    Ok(warp::reply::json(&response))
}

async fn get_users_handler(params: QueryParams, state: AppState) -> Result<impl Reply, Rejection> {
    let page = params.page.unwrap_or(1);
    let limit = params.limit.unwrap_or(10);
    
    let data = state.read().await;
    let users: Vec<UserResponse> = data.users.values()
        .map(|user| UserResponse {
            id: user.id,
            username: user.username.clone(),
            email: user.email.clone(),
            created_at: user.created_at,
        })
        .collect();
    
    let total = users.len() as u32;
    let start = ((page - 1) * limit) as usize;
    let end = (start + limit as usize).min(users.len());
    
    let paginated_users = if start < users.len() {
        users[start..end].to_vec()
    } else {
        vec![]
    };
    
    let response = PaginatedResponse::new(paginated_users, page, limit, total);
    let api_response = ApiResponse::success(response);
    
    Ok(warp::reply::json(&api_response))
}

async fn get_user_handler(id_str: String, state: AppState) -> Result<impl Reply, Rejection> {
    let id = match Uuid::parse_str(&id_str) {
        Ok(id) => id,
        Err(_) => return Err(warp::reject::custom(ApiError::InvalidId)),
    };
    
    let data = state.read().await;
    
    match data.users.get(&id) {
        Some(user) => {
            let user_response = UserResponse {
                id: user.id,
                username: user.username.clone(),
                email: user.email.clone(),
                created_at: user.created_at,
            };
            
            let response = ApiResponse::success(user_response);
            Ok(warp::reply::json(&response))
        }
        None => Err(warp::reject::custom(ApiError::NotFound)),
    }
}

async fn update_user_handler(
    id_str: String,
    updated_user: NewUser,
    auth_user_id: Uuid,
    state: AppState,
) -> Result<impl Reply, Rejection> {
    let id = match Uuid::parse_str(&id_str) {
        Ok(id) => id,
        Err(_) => return Err(warp::reject::custom(ApiError::InvalidId)),
    };
    
    // Users can only update their own profile
    if id != auth_user_id {
        return Err(warp::reject::custom(ApiError::Forbidden));
    }
    
    let mut data = state.write().await;
    
    match data.users.get_mut(&id) {
        Some(user) => {
            user.username = updated_user.username;
            user.email = updated_user.email;
            user.password_hash = format!("hash_{}", updated_user.password);
            user.updated_at = Utc::now();
            
            let user_response = UserResponse {
                id: user.id,
                username: user.username.clone(),
                email: user.email.clone(),
                created_at: user.created_at,
            };
            
            let response = ApiResponse::success(user_response);
            Ok(warp::reply::json(&response))
        }
        None => Err(warp::reject::custom(ApiError::NotFound)),
    }
}

async fn delete_user_handler(
    id_str: String,
    auth_user_id: Uuid,
    state: AppState,
) -> Result<impl Reply, Rejection> {
    let id = match Uuid::parse_str(&id_str) {
        Ok(id) => id,
        Err(_) => return Err(warp::reject::custom(ApiError::InvalidId)),
    };
    
    // Users can only delete their own profile
    if id != auth_user_id {
        return Err(warp::reject::custom(ApiError::Forbidden));
    }
    
    let mut data = state.write().await;
    
    match data.users.remove(&id) {
        Some(_) => {
            let response = ApiResponse::<()>::success(());
            Ok(warp::reply::json(&response))
        }
        None => Err(warp::reject::custom(ApiError::NotFound)),
    }
}

async fn create_post_handler(
    new_post: NewPost,
    auth_user_id: Uuid,
    state: AppState,
) -> Result<impl Reply, Rejection> {
    let post_id = Uuid::new_v4();
    let now = Utc::now();
    
    let post = Post {
        id: post_id,
        title: new_post.title,
        content: new_post.content,
        author_id: auth_user_id,
        published: new_post.published.unwrap_or(false),
        created_at: now,
        updated_at: now,
    };
    
    let mut data = state.write().await;
    data.posts.insert(post_id, post.clone());
    
    // Get username for response
    let username = data.users.get(&auth_user_id).map(|u| u.username.clone());
    
    let post_response = PostResponse {
        id: post.id,
        title: post.title,
        content: post.content,
        author_id: post.author_id,
        author_username: username,
        published: post.published,
        created_at: post.created_at,
        updated_at: post.updated_at,
    };
    
    let response = ApiResponse::success(post_response);
    Ok(warp::reply::json(&response))
}

async fn get_posts_handler(params: QueryParams, state: AppState) -> Result<impl Reply, Rejection> {
    let page = params.page.unwrap_or(1);
    let limit = params.limit.unwrap_or(10);
    let published_only = true; // Only return published posts
    
    let data = state.read().await;
    let posts: Vec<PostResponse> = data.posts.values()
        .filter(|post| !published_only || post.published)
        .map(|post| {
            let username = data.users.get(&post.author_id).map(|u| u.username.clone());
            PostResponse {
                id: post.id,
                title: post.title.clone(),
                content: post.content.clone(),
                author_id: post.author_id,
                author_username: username,
                published: post.published,
                created_at: post.created_at,
                updated_at: post.updated_at,
            }
        })
        .collect();
    
    let total = posts.len() as u32;
    let start = ((page - 1) * limit) as usize;
    let end = (start + limit as usize).min(posts.len());
    
    let paginated_posts = if start < posts.len() {
        posts[start..end].to_vec()
    } else {
        vec![]
    };
    
    let response = PaginatedResponse::new(paginated_posts, page, limit, total);
    let api_response = ApiResponse::success(response);
    
    Ok(warp::reply::json(&api_response))
}

async fn get_post_handler(id_str: String, state: AppState) -> Result<impl Reply, Rejection> {
    let id = match Uuid::parse_str(&id_str) {
        Ok(id) => id,
        Err(_) => return Err(warp::reject::custom(ApiError::InvalidId)),
    };
    
    let data = state.read().await;
    
    match data.posts.get(&id) {
        Some(post) => {
            let username = data.users.get(&post.author_id).map(|u| u.username.clone());
            
            let post_response = PostResponse {
                id: post.id,
                title: post.title.clone(),
                content: post.content.clone(),
                author_id: post.author_id,
                author_username: username,
                published: post.published,
                created_at: post.created_at,
                updated_at: post.updated_at,
            };
            
            let response = ApiResponse::success(post_response);
            Ok(warp::reply::json(&response))
        }
        None => Err(warp::reject::custom(ApiError::NotFound)),
    }
}

async fn update_post_handler(
    id_str: String,
    updated_post: NewPost,
    auth_user_id: Uuid,
    state: AppState,
) -> Result<impl Reply, Rejection> {
    let id = match Uuid::parse_str(&id_str) {
        Ok(id) => id,
        Err(_) => return Err(warp::reject::custom(ApiError::InvalidId)),
    };
    
    let mut data = state.write().await;
    
    match data.posts.get_mut(&id) {
        Some(post) => {
            // Check if user is the author
            if post.author_id != auth_user_id {
                return Err(warp::reject::custom(ApiError::Forbidden));
            }
            
            post.title = updated_post.title;
            post.content = updated_post.content;
            post.published = updated_post.published.unwrap_or(post.published);
            post.updated_at = Utc::now();
            
            let username = data.users.get(&post.author_id).map(|u| u.username.clone());
            
            let post_response = PostResponse {
                id: post.id,
                title: post.title.clone(),
                content: post.content.clone(),
                author_id: post.author_id,
                author_username: username,
                published: post.published,
                created_at: post.created_at,
                updated_at: post.updated_at,
            };
            
            let response = ApiResponse::success(post_response);
            Ok(warp::reply::json(&response))
        }
        None => Err(warp::reject::custom(ApiError::NotFound)),
    }
}

async fn delete_post_handler(
    id_str: String,
    auth_user_id: Uuid,
    state: AppState,
) -> Result<impl Reply, Rejection> {
    let id = match Uuid::parse_str(&id_str) {
        Ok(id) => id,
        Err(_) => return Err(warp::reject::custom(ApiError::InvalidId)),
    };
    
    let mut data = state.write().await;
    
    match data.posts.get(&id) {
        Some(post) => {
            // Check if user is the author
            if post.author_id != auth_user_id {
                return Err(warp::reject::custom(ApiError::Forbidden));
            }
            
            data.posts.remove(&id);
            
            let response = ApiResponse::<()>::success(());
            Ok(warp::reply::json(&response))
        }
        None => Err(warp::reject::custom(ApiError::NotFound)),
    }
}

async fn create_comment_handler(
    id_str: String,
    new_comment: NewComment,
    auth_user_id: Uuid,
    state: AppState,
) -> Result<impl Reply, Rejection> {
    let post_id = match Uuid::parse_str(&id_str) {
        Ok(id) => id,
        Err(_) => return Err(warp::reject::custom(ApiError::InvalidId)),
    };
    
    // Check if post exists
    {
        let data = state.read().await;
        if !data.posts.contains_key(&post_id) {
            return Err(warp::reject::custom(ApiError::NotFound));
        }
    }
    
    let comment_id = Uuid::new_v4();
    let now = Utc::now();
    
    let comment = Comment {
        id: comment_id,
        content: new_comment.content,
        post_id,
        user_id: auth_user_id,
        created_at: now,
    };
    
    let mut data = state.write().await;
    data.comments.insert(comment_id, comment.clone());
    
    // Get username for response
    let username = data.users.get(&auth_user_id).map(|u| u.username.clone());
    
    let comment_response = CommentResponse {
        id: comment.id,
        content: comment.content,
        post_id: comment.post_id,
        user_id: comment.user_id,
        username,
        created_at: comment.created_at,
    };
    
    let response = ApiResponse::success(comment_response);
    Ok(warp::reply::json(&response))
}

async fn get_comments_handler(
    id_str: String,
    params: QueryParams,
    state: AppState,
) -> Result<impl Reply, Rejection> {
    let post_id = match Uuid::parse_str(&id_str) {
        Ok(id) => id,
        Err(_) => return Err(warp::reject::custom(ApiError::InvalidId)),
    };
    
    // Check if post exists
    {
        let data = state.read().await;
        if !data.posts.contains_key(&post_id) {
            return Err(warp::reject::custom(ApiError::NotFound));
        }
    }
    
    let page = params.page.unwrap_or(1);
    let limit = params.limit.unwrap_or(10);
    
    let data = state.read().await;
    let comments: Vec<CommentResponse> = data.comments.values()
        .filter(|comment| comment.post_id == post_id)
        .map(|comment| {
            let username = data.users.get(&comment.user_id).map(|u| u.username.clone());
            CommentResponse {
                id: comment.id,
                content: comment.content.clone(),
                post_id: comment.post_id,
                user_id: comment.user_id,
                username,
                created_at: comment.created_at,
            }
        })
        .collect();
    
    let total = comments.len() as u32;
    let start = ((page - 1) * limit) as usize;
    let end = (start + limit as usize).min(comments.len());
    
    let paginated_comments = if start < comments.len() {
        comments[start..end].to_vec()
    } else {
        vec![]
    };
    
    let response = PaginatedResponse::new(paginated_comments, page, limit, total);
    let api_response = ApiResponse::success(response);
    
    Ok(warp::reply::json(&api_response))
}

async fn login_handler(login_req: LoginRequest, state: AppState) -> Result<impl Reply, Rejection> {
    let data = state.read().await;
    
    // Find user by username (in a real app, you would verify password)
    let user = data.users.values()
        .find(|u| u.username == login_req.username);
    
    match user {
        Some(user) => {
            // Generate a simple token (in a real app, use JWT)
            let token = format!("token_{}", Uuid::new_v4());
            
            // Store session
            drop(data);
            let mut data = state.write().await;
            data.user_sessions.insert(token.clone(), user.id);
            
            let user_response = UserResponse {
                id: user.id,
                username: user.username.clone(),
                email: user.email.clone(),
                created_at: user.created_at,
            };
            
            let login_response = LoginResponse {
                token,
                user: user_response,
            };
            
            let response = ApiResponse::success(login_response);
            Ok(warp::reply::json(&response))
        }
        None => Err(warp::reject::custom(AuthError::InvalidCredentials)),
    }
}

async fn logout_handler(
    auth_header: Option<String>,
    state: AppState,
) -> Result<impl Reply, Rejection> {
    if let Some(auth_header) = auth_header {
        let token = auth_header.strip_prefix("Bearer ").unwrap_or("");
        
        if !token.is_empty() {
            let mut data = state.write().await;
            data.user_sessions.remove(token);
        }
    }
    
    let response = ApiResponse::<()>::success(());
    Ok(warp::reply::json(&response))
}

async fn health_handler() -> Result<impl Reply, Rejection> {
    let health = HealthCheck::new();
    Ok(warp::reply::json(&health))
}

async fn stats_handler(state: AppState) -> Result<impl Reply, Rejection> {
    let data = state.read().await;
    
    let stats = Stats::new(
        data.users.len() as u64,
        data.posts.len() as u64,
        data.comments.len() as u64,
        0, // uptime would be calculated in a real app
    );
    
    let response = ApiResponse::success(stats);
    Ok(warp::reply::json(&response))
}

async fn file_upload_handler(form: warp::multipart::FormData) -> Result<impl Reply, Rejection> {
    use futures_util::TryStreamExt;
    
    let mut parts = form;
    
    while let Some(part) = parts.try_next().await.map_err(|e| {
        warp::reject::custom(ApiError::UploadError(format!("Failed to read multipart: {}", e)))
    })? {
        if part.name() == "file" {
            let filename = part.filename().unwrap_or("unknown").to_string();
            let content_type = part.content_type().unwrap_or("application/octet-stream").to_string();
            
            let mut size = 0;
            let data = part
                .try_fold(Vec::new(), |mut vec, chunk| async move {
                    vec.extend_from_slice(&chunk);
                    size += chunk.len();
                    Ok(vec)
                })
                .await
                .map_err(|e| {
                    warp::reject::custom(ApiError::UploadError(format!("Failed to read file: {}", e)))
                })?;
            
            let upload_response = FileUploadResponse {
                filename: filename.clone(),
                size,
                content_type,
                url: format!("/uploads/{}", filename),
                uploaded_at: Utc::now(),
            };
            
            let response = ApiResponse::success(upload_response);
            return Ok(warp::reply::json(&response));
        }
    }
    
    Err(warp::reject::custom(ApiError::UploadError("No file found".to_string())))
}

// Custom error types
#[derive(Debug)]
pub enum ApiError {
    InvalidId,
    NotFound,
    Forbidden,
    UploadError(String),
}

#[derive(Debug)]
pub enum AuthError {
    MissingToken,
    InvalidToken,
    InvalidCredentials,
}

// Custom rejection handlers
pub async fn handle_rejection(err: Rejection) -> Result<impl Reply, Infallible> {
    let code;
    let message;
    
    if err.is_not_found() {
        code = warp::http::StatusCode::NOT_FOUND;
        message = "NOT_FOUND";
    } else if let Some(_) = err.find::<warp::filters::body::BodyDeserializeError>() {
        code = warp::http::StatusCode::BAD_REQUEST;
        message = "BAD_REQUEST";
    } else if let Some(_) = err.find::<warp::cors::CorsError>() {
        code = warp::http::StatusCode::BAD_REQUEST;
        message = "CORS_ERROR";
    } else if let Some(_) = err.find::<AuthError>() {
        code = warp::http::StatusCode::UNAUTHORIZED;
        message = "UNAUTHORIZED";
    } else if let Some(api_error) = err.find::<ApiError>() {
        match api_error {
            ApiError::InvalidId => {
                code = warp::http::StatusCode::BAD_REQUEST;
                message = "INVALID_ID";
            }
            ApiError::NotFound => {
                code = warp::http::StatusCode::NOT_FOUND;
                message = "NOT_FOUND";
            }
            ApiError::Forbidden => {
                code = warp::http::StatusCode::FORBIDDEN;
                message = "FORBIDDEN";
            }
            ApiError::UploadError(msg) => {
                code = warp::http::StatusCode::INTERNAL_SERVER_ERROR;
                message = msg;
            }
        }
    } else {
        code = warp::http::StatusCode::INTERNAL_SERVER_ERROR;
        message = "INTERNAL_SERVER_ERROR";
    }
    
    let error_response = ErrorMessage::new(code.to_string(), message.to_string());
    let json = warp::reply::json(&error_response);
    
    Ok(warp::reply::with_status(json, code))
}

// Implement warp::reject::Reject for our custom errors
impl warp::reject::Reject for ApiError {}
impl warp::reject::Reject for AuthError {}