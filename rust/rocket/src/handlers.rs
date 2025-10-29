use crate::models::*;
use rocket::http::Status;
use rocket::response::status;
use rocket::serde::json::Json;
use rocket::State;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use uuid::Uuid;
use chrono::Utc;

// In-memory storage for demonstration
type UserStore = Arc<Mutex<HashMap<Uuid, User>>>;
type PostStore = Arc<Mutex<HashMap<Uuid, Post>>>;
type CommentStore = Arc<Mutex<HashMap<Uuid, Comment>>>;
type ActivityLogStore = Arc<Mutex<HashMap<Uuid, ActivityLog>>>;

// Initialize stores
pub fn init_stores() -> (UserStore, PostStore, CommentStore, ActivityLogStore) {
    (
        Arc::new(Mutex::new(HashMap::new())),
        Arc::new(Mutex::new(HashMap::new())),
        Arc::new(Mutex::new(HashMap::new())),
        Arc::new(Mutex::new(HashMap::new())),
    )
}

// Basic handler
#[get("/hello")]
pub fn hello() -> Json<ApiResponse<&'static str>> {
    Json(ApiResponse::success("Hello, Rocket!"))
}

// User handlers
#[get("/users")]
pub fn get_users(user_store: &State<UserStore>) -> Json<ApiResponse<Vec<User>>> {
    let users = user_store.lock().unwrap().values().cloned().collect();
    Json(ApiResponse::success(users))
}

#[post("/users", data = "<new_user>")]
pub fn create_user(
    user_store: &State<UserStore>,
    new_user: Json<NewUser>,
) -> Json<ApiResponse<User>> {
    let id = Uuid::new_v4();
    let now = Utc::now();
    let user = User {
        id,
        username: new_user.username.clone(),
        email: new_user.email.clone(),
        password_hash: new_user.password.clone(), // In real app, hash this
        created_at: now,
        updated_at: now,
    };

    user_store.lock().unwrap().insert(id, user.clone());
    Json(ApiResponse::success(user))
}

#[get("/users/<id>")]
pub fn get_user(
    user_store: &State<UserStore>,
    id: &str,
) -> Result<Json<ApiResponse<User>>, Status> {
    let id = Uuid::parse_str(id).map_err(|_| Status::BadRequest)?;
    let users = user_store.lock().unwrap();
    
    match users.get(&id) {
        Some(user) => Ok(Json(ApiResponse::success(user.clone()))),
        None => Err(Status::NotFound),
    }
}

#[put("/users/<id>", data = "<update_user>")]
pub fn update_user(
    user_store: &State<UserStore>,
    id: &str,
    update_user: Json<UpdateUser>,
) -> Result<Json<ApiResponse<User>>, Status> {
    let id = Uuid::parse_str(id).map_err(|_| Status::BadRequest)?;
    let mut users = user_store.lock().unwrap();
    
    match users.get_mut(&id) {
        Some(user) => {
            if let Some(username) = &update_user.username {
                user.username = username.clone();
            }
            if let Some(email) = &update_user.email {
                user.email = email.clone();
            }
            if let Some(password) = &update_user.password {
                user.password_hash = password.clone(); // In real app, hash this
            }
            user.updated_at = Utc::now();
            Ok(Json(ApiResponse::success(user.clone())))
        }
        None => Err(Status::NotFound),
    }
}

#[delete("/users/<id>")]
pub fn delete_user(
    user_store: &State<UserStore>,
    id: &str,
) -> Result<Json<ApiResponse<()>>, Status> {
    let id = Uuid::parse_str(id).map_err(|_| Status::BadRequest)?;
    let mut users = user_store.lock().unwrap();
    
    match users.remove(&id) {
        Some(_) => Ok(Json(ApiResponse::success(()))),
        None => Err(Status::NotFound),
    }
}

// Post handlers
#[get("/posts")]
pub fn get_posts(post_store: &State<PostStore>) -> Json<ApiResponse<Vec<Post>>> {
    let posts = post_store.lock().unwrap().values().cloned().collect();
    Json(ApiResponse::success(posts))
}

#[post("/posts", data = "<new_post>")]
pub fn create_post(
    post_store: &State<PostStore>,
    new_post: Json<NewPost>,
) -> Json<ApiResponse<Post>> {
    let id = Uuid::new_v4();
    let now = Utc::now();
    let post = Post {
        id,
        title: new_post.title.clone(),
        content: new_post.content.clone(),
        author_id: new_post.author_id,
        created_at: now,
        updated_at: now,
    };

    post_store.lock().unwrap().insert(id, post.clone());
    Json(ApiResponse::success(post))
}

#[get("/posts/<id>")]
pub fn get_post(
    post_store: &State<PostStore>,
    id: &str,
) -> Result<Json<ApiResponse<Post>>, Status> {
    let id = Uuid::parse_str(id).map_err(|_| Status::BadRequest)?;
    let posts = post_store.lock().unwrap();
    
    match posts.get(&id) {
        Some(post) => Ok(Json(ApiResponse::success(post.clone()))),
        None => Err(Status::NotFound),
    }
}

#[put("/posts/<id>", data = "<update_post>")]
pub fn update_post(
    post_store: &State<PostStore>,
    id: &str,
    update_post: Json<UpdatePost>,
) -> Result<Json<ApiResponse<Post>>, Status> {
    let id = Uuid::parse_str(id).map_err(|_| Status::BadRequest)?;
    let mut posts = post_store.lock().unwrap();
    
    match posts.get_mut(&id) {
        Some(post) => {
            if let Some(title) = &update_post.title {
                post.title = title.clone();
            }
            if let Some(content) = &update_post.content {
                post.content = content.clone();
            }
            post.updated_at = Utc::now();
            Ok(Json(ApiResponse::success(post.clone())))
        }
        None => Err(Status::NotFound),
    }
}

#[delete("/posts/<id>")]
pub fn delete_post(
    post_store: &State<PostStore>,
    id: &str,
) -> Result<Json<ApiResponse<()>>, Status> {
    let id = Uuid::parse_str(id).map_err(|_| Status::BadRequest)?;
    let mut posts = post_store.lock().unwrap();
    
    match posts.remove(&id) {
        Some(_) => Ok(Json(ApiResponse::success(()))),
        None => Err(Status::NotFound),
    }
}

// Comment handlers
#[get("/comments")]
pub fn get_comments(comment_store: &State<CommentStore>) -> Json<ApiResponse<Vec<Comment>>> {
    let comments = comment_store.lock().unwrap().values().cloned().collect();
    Json(ApiResponse::success(comments))
}

#[post("/comments", data = "<new_comment>")]
pub fn create_comment(
    comment_store: &State<CommentStore>,
    new_comment: Json<NewComment>,
) -> Json<ApiResponse<Comment>> {
    let id = Uuid::new_v4();
    let now = Utc::now();
    let comment = Comment {
        id,
        content: new_comment.content.clone(),
        author_id: new_comment.author_id,
        post_id: new_comment.post_id,
        created_at: now,
        updated_at: now,
    };

    comment_store.lock().unwrap().insert(id, comment.clone());
    Json(ApiResponse::success(comment))
}

#[get("/comments/<id>")]
pub fn get_comment(
    comment_store: &State<CommentStore>,
    id: &str,
) -> Result<Json<ApiResponse<Comment>>, Status> {
    let id = Uuid::parse_str(id).map_err(|_| Status::BadRequest)?;
    let comments = comment_store.lock().unwrap();
    
    match comments.get(&id) {
        Some(comment) => Ok(Json(ApiResponse::success(comment.clone()))),
        None => Err(Status::NotFound),
    }
}

#[put("/comments/<id>", data = "<update_comment>")]
pub fn update_comment(
    comment_store: &State<CommentStore>,
    id: &str,
    update_comment: Json<UpdateComment>,
) -> Result<Json<ApiResponse<Comment>>, Status> {
    let id = Uuid::parse_str(id).map_err(|_| Status::BadRequest)?;
    let mut comments = comment_store.lock().unwrap();
    
    match comments.get_mut(&id) {
        Some(comment) => {
            if let Some(content) = &update_comment.content {
                comment.content = content.clone();
            }
            comment.updated_at = Utc::now();
            Ok(Json(ApiResponse::success(comment.clone())))
        }
        None => Err(Status::NotFound),
    }
}

#[delete("/comments/<id>")]
pub fn delete_comment(
    comment_store: &State<CommentStore>,
    id: &str,
) -> Result<Json<ApiResponse<()>>, Status> {
    let id = Uuid::parse_str(id).map_err(|_| Status::BadRequest)?;
    let mut comments = comment_store.lock().unwrap();
    
    match comments.remove(&id) {
        Some(_) => Ok(Json(ApiResponse::success(()))),
        None => Err(Status::NotFound),
    }
}

// Activity log handlers
#[get("/activity-logs")]
pub fn get_activity_logs(activity_log_store: &State<ActivityLogStore>) -> Json<ApiResponse<Vec<ActivityLog>>> {
    let logs = activity_log_store.lock().unwrap().values().cloned().collect();
    Json(ApiResponse::success(logs))
}

#[post("/activity-logs", data = "<new_log>")]
pub fn create_activity_log(
    activity_log_store: &State<ActivityLogStore>,
    new_log: Json<NewActivityLog>,
) -> Json<ApiResponse<ActivityLog>> {
    let id = Uuid::new_v4();
    let now = Utc::now();
    let log = ActivityLog {
        id,
        user_id: new_log.user_id,
        action: new_log.action.clone(),
        resource_type: new_log.resource_type.clone(),
        resource_id: new_log.resource_id,
        details: new_log.details.clone(),
        created_at: now,
    };

    activity_log_store.lock().unwrap().insert(id, log.clone());
    Json(ApiResponse::success(log))
}

#[get("/activity-logs/<id>")]
pub fn get_activity_log(
    activity_log_store: &State<ActivityLogStore>,
    id: &str,
) -> Result<Json<ApiResponse<ActivityLog>>, Status> {
    let id = Uuid::parse_str(id).map_err(|_| Status::BadRequest)?;
    let logs = activity_log_store.lock().unwrap();
    
    match logs.get(&id) {
        Some(log) => Ok(Json(ApiResponse::success(log.clone()))),
        None => Err(Status::NotFound),
    }
}

#[put("/activity-logs/<id>", data = "<update_log>")]
pub fn update_activity_log(
    activity_log_store: &State<ActivityLogStore>,
    id: &str,
    update_log: Json<UpdateActivityLog>,
) -> Result<Json<ApiResponse<ActivityLog>>, Status> {
    let id = Uuid::parse_str(id).map_err(|_| Status::BadRequest)?;
    let mut logs = activity_log_store.lock().unwrap();
    
    match logs.get_mut(&id) {
        Some(log) => {
            if let Some(user_id) = &update_log.user_id {
                log.user_id = *user_id;
            }
            if let Some(action) = &update_log.action {
                log.action = action.clone();
            }
            if let Some(resource_type) = &update_log.resource_type {
                log.resource_type = resource_type.clone();
            }
            if let Some(resource_id) = &update_log.resource_id {
                log.resource_id = *resource_id;
            }
            if let Some(details) = &update_log.details {
                log.details = details.clone();
            }
            Ok(Json(ApiResponse::success(log.clone())))
        }
        None => Err(Status::NotFound),
    }
}

#[delete("/activity-logs/<id>")]
pub fn delete_activity_log(
    activity_log_store: &State<ActivityLogStore>,
    id: &str,
) -> Result<Json<ApiResponse<()>>, Status> {
    let id = Uuid::parse_str(id).map_err(|_| Status::BadRequest)?;
    let mut logs = activity_log_store.lock().unwrap();
    
    match logs.remove(&id) {
        Some(_) => Ok(Json(ApiResponse::success(()))),
        None => Err(Status::NotFound),
    }
}