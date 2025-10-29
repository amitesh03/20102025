use warp::{Filter, Reply};
use std::sync::Arc;
use tokio::sync::RwLock;

mod models;
mod filters;

use filters::*;

#[tokio::main]
async fn main() {
    // Initialize application state
    let state = Arc::new(RwLock::new(models::AppData::default()));
    
    // Create some sample data
    init_sample_data(state.clone()).await;
    
    // Build the API routes
    let api = build_api_routes(state.clone());
    
    // Build the complete application
    let routes = api
        .with(cors())
        .with(log_requests())
        .recover(handle_rejection);
    
    println!("🚀 Warp server starting on http://localhost:3030");
    
    // Start the server
    warp::serve(routes)
        .run(([127, 0, 0, 1], 3030))
        .await;
}

fn build_api_routes(
    state: AppState,
) -> impl Filter<Extract = impl Reply, Error = warp::Rejection> + Clone {
    // Health check
    let health = health();
    
    // User routes
    let users = create_user(state.clone())
        .or(get_users(state.clone()))
        .or(get_user(state.clone()))
        .or(update_user(state.clone()))
        .or(delete_user(state.clone()));
    
    // Post routes
    let posts = create_post(state.clone())
        .or(get_posts(state.clone()))
        .or(get_post(state.clone()))
        .or(update_post(state.clone()))
        .or(delete_post(state.clone()));
    
    // Comment routes
    let comments = create_comment(state.clone())
        .or(get_comments(state.clone()));
    
    // Auth routes
    let auth = login(state.clone())
        .or(logout(state.clone()));
    
    // Utility routes
    let utilities = stats(state.clone())
        .or(file_upload());
    
    // Combine all routes
    health
        .or(users)
        .or(posts)
        .or(comments)
        .or(auth)
        .or(utilities)
}

async fn init_sample_data(state: AppState) {
    use models::*;
    use uuid::Uuid;
    use chrono::Utc;
    
    let mut data = state.write().await;
    
    // Create sample users
    let user1_id = Uuid::new_v4();
    let user2_id = Uuid::new_v4();
    
    let user1 = User {
        id: user1_id,
        username: "alice".to_string(),
        email: "alice@example.com".to_string(),
        password_hash: "hash_password1".to_string(),
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };
    
    let user2 = User {
        id: user2_id,
        username: "bob".to_string(),
        email: "bob@example.com".to_string(),
        password_hash: "hash_password2".to_string(),
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };
    
    data.users.insert(user1_id, user1);
    data.users.insert(user2_id, user2);
    
    // Create sample posts
    let post1_id = Uuid::new_v4();
    let post2_id = Uuid::new_v4();
    
    let post1 = Post {
        id: post1_id,
        title: "Getting Started with Rust".to_string(),
        content: "Rust is a systems programming language that runs blazingly fast, prevents segfaults, and guarantees thread safety.".to_string(),
        author_id: user1_id,
        published: true,
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };
    
    let post2 = Post {
        id: post2_id,
        title: "Web Development with Warp".to_string(),
        content: "Warp is a super-easy, composable, web server framework for warp speeds.".to_string(),
        author_id: user2_id,
        published: true,
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };
    
    data.posts.insert(post1_id, post1);
    data.posts.insert(post2_id, post2);
    
    // Create sample comments
    let comment1_id = Uuid::new_v4();
    let comment2_id = Uuid::new_v4();
    
    let comment1 = Comment {
        id: comment1_id,
        content: "Great introduction to Rust!".to_string(),
        post_id: post1_id,
        user_id: user2_id,
        created_at: Utc::now(),
    };
    
    let comment2 = Comment {
        id: comment2_id,
        content: "Warp is indeed very fast!".to_string(),
        post_id: post2_id,
        user_id: user1_id,
        created_at: Utc::now(),
    };
    
    data.comments.insert(comment1_id, comment1);
    data.comments.insert(comment2_id, comment2);
    
    // Create sample sessions
    data.user_sessions.insert("sample_token_1".to_string(), user1_id);
    data.user_sessions.insert("sample_token_2".to_string(), user2_id);
    
    println!("✅ Sample data initialized");
}