use crate::models::*;
use tide::{Request, Response, StatusCode, Result};
use std::collections::HashMap;
use std::sync::Arc;
use async_std::sync::Mutex;
use uuid::Uuid;
use chrono::Utc;

// In-memory storage for demonstration
pub type AppState = Arc<Mutex<AppData>>;

#[derive(Debug, Default)]
pub struct AppData {
    users: HashMap<Uuid, User>,
    posts: HashMap<Uuid, Post>,
    comments: HashMap<Uuid, Comment>,
    user_sessions: HashMap<String, Uuid>, // token -> user_id
}

// User handlers
pub async fn create_user(mut req: Request<AppState>) -> Result {
    let app_state = req.state().clone();
    let new_user: NewUser = req.body_json().await?;
    
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
    
    let mut data = app_state.lock().await;
    data.users.insert(user_id, user.clone());
    
    let user_response = UserResponse {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
    };
    
    let response = ApiResponse::success(user_response);
    Ok(Response::builder(StatusCode::Created)
        .body(tide::Body::from_json(&response)?)
        .build())
}

pub async fn get_user(req: Request<AppState>) -> Result {
    let app_state = req.state().clone();
    let user_id: Uuid = req.param("id")?.parse()?;
    
    let data = app_state.lock().await;
    
    match data.users.get(&user_id) {
        Some(user) => {
            let user_response = UserResponse {
                id: user.id,
                username: user.username.clone(),
                email: user.email.clone(),
                created_at: user.created_at,
            };
            
            let response = ApiResponse::success(user_response);
            Ok(Response::builder(StatusCode::Ok)
                .body(tide::Body::from_json(&response)?)
                .build())
        }
        None => {
            let response = ApiResponse::<UserResponse>::error("User not found".to_string());
            Ok(Response::builder(StatusCode::NotFound)
                .body(tide::Body::from_json(&response)?)
                .build())
        }
    }
}

pub async fn get_users(req: Request<AppState>) -> Result {
    let app_state = req.state().clone();
    
    // Parse query parameters
    let page: u32 = req.query("page").unwrap_or("1").parse().unwrap_or(1);
    let limit: u32 = req.query("limit").unwrap_or("10").parse().unwrap_or(10);
    
    let data = app_state.lock().await;
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
    
    Ok(Response::builder(StatusCode::Ok)
        .body(tide::Body::from_json(&api_response)?)
        .build())
}

pub async fn update_user(mut req: Request<AppState>) -> Result {
    let app_state = req.state().clone();
    let user_id: Uuid = req.param("id")?.parse()?;
    let updated_user: NewUser = req.body_json().await?;
    
    let mut data = app_state.lock().await;
    
    match data.users.get_mut(&user_id) {
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
            Ok(Response::builder(StatusCode::Ok)
                .body(tide::Body::from_json(&response)?)
                .build())
        }
        None => {
            let response = ApiResponse::<UserResponse>::error("User not found".to_string());
            Ok(Response::builder(StatusCode::NotFound)
                .body(tide::Body::from_json(&response)?)
                .build())
        }
    }
}

pub async fn delete_user(req: Request<AppState>) -> Result {
    let app_state = req.state().clone();
    let user_id: Uuid = req.param("id")?.parse()?;
    
    let mut data = app_state.lock().await;
    
    match data.users.remove(&user_id) {
        Some(_) => {
            let response = ApiResponse::<()>::success(());
            Ok(Response::builder(StatusCode::Ok)
                .body(tide::Body::from_json(&response)?)
                .build())
        }
        None => {
            let response = ApiResponse::<()>::error("User not found".to_string());
            Ok(Response::builder(StatusCode::NotFound)
                .body(tide::Body::from_json(&response)?)
                .build())
        }
    }
}

// Post handlers
pub async fn create_post(mut req: Request<AppState>) -> Result {
    let app_state = req.state().clone();
    let new_post: NewPost = req.body_json().await?;
    
    // Get user_id from auth token (simplified)
    let auth_header = req.header("Authorization").unwrap_or_default();
    let token = auth_header.strip_prefix("Bearer ").unwrap_or("");
    let user_id = {
        let data = app_state.lock().await;
        data.user_sessions.get(token).copied()
    };
    
    let user_id = match user_id {
        Some(id) => id,
        None => {
            let response = ApiResponse::<()>::error("Unauthorized".to_string());
            return Ok(Response::builder(StatusCode::Unauthorized)
                .body(tide::Body::from_json(&response)?)
                .build());
        }
    };
    
    let post_id = Uuid::new_v4();
    let now = Utc::now();
    
    let post = Post {
        id: post_id,
        title: new_post.title,
        content: new_post.content,
        author_id: user_id,
        published: new_post.published.unwrap_or(false),
        created_at: now,
        updated_at: now,
    };
    
    let mut data = app_state.lock().await;
    data.posts.insert(post_id, post.clone());
    
    // Get username for response
    let username = data.users.get(&user_id).map(|u| u.username.clone());
    
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
    Ok(Response::builder(StatusCode::Created)
        .body(tide::Body::from_json(&response)?)
        .build())
}

pub async fn get_post(req: Request<AppState>) -> Result {
    let app_state = req.state().clone();
    let post_id: Uuid = req.param("id")?.parse()?;
    
    let data = app_state.lock().await;
    
    match data.posts.get(&post_id) {
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
            Ok(Response::builder(StatusCode::Ok)
                .body(tide::Body::from_json(&response)?)
                .build())
        }
        None => {
            let response = ApiResponse::<PostResponse>::error("Post not found".to_string());
            Ok(Response::builder(StatusCode::NotFound)
                .body(tide::Body::from_json(&response)?)
                .build())
        }
    }
}

pub async fn get_posts(req: Request<AppState>) -> Result {
    let app_state = req.state().clone();
    
    // Parse query parameters
    let page: u32 = req.query("page").unwrap_or("1").parse().unwrap_or(1);
    let limit: u32 = req.query("limit").unwrap_or("10").parse().unwrap_or(10);
    let published_only: bool = req.query("published").unwrap_or("true").parse().unwrap_or(true);
    
    let data = app_state.lock().await;
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
    
    Ok(Response::builder(StatusCode::Ok)
        .body(tide::Body::from_json(&api_response)?)
        .build())
}

pub async fn update_post(mut req: Request<AppState>) -> Result {
    let app_state = req.state().clone();
    let post_id: Uuid = req.param("id")?.parse()?;
    let updated_post: NewPost = req.body_json().await?;
    
    // Get user_id from auth token
    let auth_header = req.header("Authorization").unwrap_or_default();
    let token = auth_header.strip_prefix("Bearer ").unwrap_or("");
    let user_id = {
        let data = app_state.lock().await;
        data.user_sessions.get(token).copied()
    };
    
    let user_id = match user_id {
        Some(id) => id,
        None => {
            let response = ApiResponse::<()>::error("Unauthorized".to_string());
            return Ok(Response::builder(StatusCode::Unauthorized)
                .body(tide::Body::from_json(&response)?)
                .build());
        }
    };
    
    let mut data = app_state.lock().await;
    
    match data.posts.get_mut(&post_id) {
        Some(post) => {
            // Check if user is the author
            if post.author_id != user_id {
                let response = ApiResponse::<()>::error("Forbidden".to_string());
                return Ok(Response::builder(StatusCode::Forbidden)
                    .body(tide::Body::from_json(&response)?)
                    .build());
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
            Ok(Response::builder(StatusCode::Ok)
                .body(tide::Body::from_json(&response)?)
                .build())
        }
        None => {
            let response = ApiResponse::<PostResponse>::error("Post not found".to_string());
            Ok(Response::builder(StatusCode::NotFound)
                .body(tide::Body::from_json(&response)?)
                .build())
        }
    }
}

pub async fn delete_post(req: Request<AppState>) -> Result {
    let app_state = req.state().clone();
    let post_id: Uuid = req.param("id")?.parse()?;
    
    // Get user_id from auth token
    let auth_header = req.header("Authorization").unwrap_or_default();
    let token = auth_header.strip_prefix("Bearer ").unwrap_or("");
    let user_id = {
        let data = app_state.lock().await;
        data.user_sessions.get(token).copied()
    };
    
    let user_id = match user_id {
        Some(id) => id,
        None => {
            let response = ApiResponse::<()>::error("Unauthorized".to_string());
            return Ok(Response::builder(StatusCode::Unauthorized)
                .body(tide::Body::from_json(&response)?)
                .build());
        }
    };
    
    let mut data = app_state.lock().await;
    
    match data.posts.get(&post_id) {
        Some(post) => {
            // Check if user is the author
            if post.author_id != user_id {
                let response = ApiResponse::<()>::error("Forbidden".to_string());
                return Ok(Response::builder(StatusCode::Forbidden)
                    .body(tide::Body::from_json(&response)?)
                    .build());
            }
            
            data.posts.remove(&post_id);
            
            let response = ApiResponse::<()>::success(());
            Ok(Response::builder(StatusCode::Ok)
                .body(tide::Body::from_json(&response)?)
                .build())
        }
        None => {
            let response = ApiResponse::<()>::error("Post not found".to_string());
            Ok(Response::builder(StatusCode::NotFound)
                .body(tide::Body::from_json(&response)?)
                .build())
        }
    }
}

// Comment handlers
pub async fn create_comment(mut req: Request<AppState>) -> Result {
    let app_state = req.state().clone();
    let post_id: Uuid = req.param("id")?.parse()?;
    let new_comment: NewComment = req.body_json().await?;
    
    // Check if post exists
    let post_exists = {
        let data = app_state.lock().await;
        data.posts.contains_key(&post_id)
    };
    
    if !post_exists {
        let response = ApiResponse::<()>::error("Post not found".to_string());
        return Ok(Response::builder(StatusCode::NotFound)
            .body(tide::Body::from_json(&response)?)
            .build());
    }
    
    // Get user_id from auth token
    let auth_header = req.header("Authorization").unwrap_or_default();
    let token = auth_header.strip_prefix("Bearer ").unwrap_or("");
    let user_id = {
        let data = app_state.lock().await;
        data.user_sessions.get(token).copied()
    };
    
    let user_id = match user_id {
        Some(id) => id,
        None => {
            let response = ApiResponse::<()>::error("Unauthorized".to_string());
            return Ok(Response::builder(StatusCode::Unauthorized)
                .body(tide::Body::from_json(&response)?)
                .build());
        }
    };
    
    let comment_id = Uuid::new_v4();
    let now = Utc::now();
    
    let comment = Comment {
        id: comment_id,
        content: new_comment.content,
        post_id,
        user_id,
        created_at: now,
    };
    
    let mut data = app_state.lock().await;
    data.comments.insert(comment_id, comment.clone());
    
    // Get username for response
    let username = data.users.get(&user_id).map(|u| u.username.clone());
    
    let comment_response = CommentResponse {
        id: comment.id,
        content: comment.content,
        post_id: comment.post_id,
        user_id: comment.user_id,
        username,
        created_at: comment.created_at,
    };
    
    let response = ApiResponse::success(comment_response);
    Ok(Response::builder(StatusCode::Created)
        .body(tide::Body::from_json(&response)?)
        .build())
}

pub async fn get_comments(req: Request<AppState>) -> Result {
    let app_state = req.state().clone();
    let post_id: Uuid = req.param("id")?.parse()?;
    
    // Parse query parameters
    let page: u32 = req.query("page").unwrap_or("1").parse().unwrap_or(1);
    let limit: u32 = req.query("limit").unwrap_or("10").parse().unwrap_or(10);
    
    // Check if post exists
    let post_exists = {
        let data = app_state.lock().await;
        data.posts.contains_key(&post_id)
    };
    
    if !post_exists {
        let response = ApiResponse::<()>::error("Post not found".to_string());
        return Ok(Response::builder(StatusCode::NotFound)
            .body(tide::Body::from_json(&response)?)
            .build());
    }
    
    let data = app_state.lock().await;
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
    
    Ok(Response::builder(StatusCode::Ok)
        .body(tide::Body::from_json(&api_response)?)
        .build())
}

// Auth handlers
pub async fn login(mut req: Request<AppState>) -> Result {
    let app_state = req.state().clone();
    let login_request: LoginRequest = req.body_json().await?;
    
    let data = app_state.lock().await;
    
    // Find user by username (in a real app, you would verify password)
    let user = data.users.values()
        .find(|u| u.username == login_request.username);
    
    match user {
        Some(user) => {
            // Generate a simple token (in a real app, use JWT)
            let token = format!("token_{}", Uuid::new_v4());
            
            // Store session
            drop(data);
            let mut data = app_state.lock().await;
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
            Ok(Response::builder(StatusCode::Ok)
                .body(tide::Body::from_json(&response)?)
                .build())
        }
        None => {
            let response = ApiResponse::<()>::error("Invalid credentials".to_string());
            Ok(Response::builder(StatusCode::Unauthorized)
                .body(tide::Body::from_json(&response)?)
                .build())
        }
    }
}

pub async fn logout(req: Request<AppState>) -> Result {
    let app_state = req.state().clone();
    
    // Get user_id from auth token
    let auth_header = req.header("Authorization").unwrap_or_default();
    let token = auth_header.strip_prefix("Bearer ").unwrap_or("");
    
    if !token.is_empty() {
        let mut data = app_state.lock().await;
        data.user_sessions.remove(token);
    }
    
    let response = ApiResponse::<()>::success(());
    Ok(Response::builder(StatusCode::Ok)
        .body(tide::Body::from_json(&response)?)
        .build())
}