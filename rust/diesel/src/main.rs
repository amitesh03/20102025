use diesel::prelude::*;
use diesel::pg::PgConnection;
use dotenvy::dotenv;
use std::env;

mod models;
mod schema;
mod crud_operations;
mod relationships;
mod advanced_queries;
mod error_handling;

use models::*;
use crud_operations::*;
use relationships::*;
use advanced_queries::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();
    
    println!("🗄️  Diesel ORM Learning Examples");
    println!("================================");
    
    // Establish database connection
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    
    let mut conn = PgConnection::establish(&database_url)
        .expect("Error connecting to database");
    
    println!("✅ Connected to PostgreSQL database");
    
    // Run embedded migrations
    diesel_migrations::embed_migrations!("migrations");
    diesel_migrations::run_pending_migrations(&mut conn)?;
    println!("✅ Database migrations completed");
    
    // Run examples
    println!("\n📚 Running Diesel ORM Examples:");
    println!("================================");
    
    // Basic CRUD operations
    println!("\n1️⃣  Basic CRUD Operations:");
    basic_crud_examples(&mut conn)?;
    
    // Relationship examples
    println!("\n2️⃣  Relationship Examples:");
    relationship_examples(&mut conn)?;
    
    // Advanced query examples
    println!("\n3️⃣  Advanced Query Examples:");
    advanced_query_examples(&mut conn)?;
    
    // Error handling examples
    println!("\n4️⃣  Error Handling Examples:");
    error_handling_examples(&mut conn)?;
    
    println!("\n🎉 All examples completed successfully!");
    
    Ok(())
}

fn basic_crud_examples(conn: &mut PgConnection) -> Result<(), Box<dyn std::error::Error>> {
    use crate::schema::users;
    
    println!("   Creating users...");
    
    // Create a new user
    let new_user = NewUser {
        username: "john_doe",
        email: "john@example.com",
        full_name: Some("John Doe"),
    };
    
    let created_user = create_user(conn, &new_user)?;
    println!("   ✅ Created user: {} (ID: {})", created_user.username, created_user.id);
    
    // Create another user
    let new_user2 = NewUser {
        username: "jane_smith",
        email: "jane@example.com",
        full_name: Some("Jane Smith"),
    };
    
    let created_user2 = create_user(conn, &new_user2)?;
    println!("   ✅ Created user: {} (ID: {})", created_user2.username, created_user2.id);
    
    // Read all users
    println!("   Reading all users...");
    let all_users = get_all_users(conn)?;
    for user in &all_users {
        println!("   📄 User: {} ({})", user.username, user.email);
    }
    
    // Read user by ID
    println!("   Reading user by ID...");
    let user_by_id = get_user_by_id(conn, created_user.id)?;
    println!("   📄 Found user: {} ({})", user_by_id.username, user_by_id.email);
    
    // Update user
    println!("   Updating user...");
    let updated_user = update_user(conn, created_user.id, Some("John Updated"), Some("john.updated@example.com"))?;
    println!("   ✅ Updated user: {} ({})", updated_user.username, updated_user.email);
    
    // Delete user
    println!("   Deleting user...");
    delete_user(conn, created_user2.id)?;
    println!("   ✅ Deleted user with ID: {}", created_user2.id);
    
    // Verify deletion
    let remaining_users = get_all_users(conn)?;
    println!("   📊 Remaining users: {}", remaining_users.len());
    
    Ok(())
}

fn relationship_examples(conn: &mut PgConnection) -> Result<(), Box<dyn std::error::Error>> {
    println!("   Creating posts with relationships...");
    
    // First, ensure we have a user
    let user = match get_user_by_username(conn, "john_doe") {
        Ok(u) => u,
        Err(_) => {
            let new_user = NewUser {
                username: "john_doe",
                email: "john@example.com",
                full_name: Some("John Doe"),
            };
            create_user(conn, &new_user)?
        }
    };
    
    // Create posts for the user
    let new_post1 = NewPost {
        title: "First Post",
        content: "This is my first post content",
        user_id: user.id,
        published: true,
    };
    
    let post1 = create_post(conn, &new_post1)?;
    println!("   ✅ Created post: {} (ID: {})", post1.title, post1.id);
    
    let new_post2 = NewPost {
        title: "Second Post",
        content: "This is my second post content",
        user_id: user.id,
        published: false,
    };
    
    let post2 = create_post(conn, &new_post2)?;
    println!("   ✅ Created post: {} (ID: {})", post2.title, post2.id);
    
    // Create comments for the post
    let new_comment = NewComment {
        content: "Great post!",
        post_id: post1.id,
        user_id: user.id,
    };
    
    let comment = create_comment(conn, &new_comment)?;
    println!("   ✅ Created comment: {} (ID: {})", comment.content, comment.id);
    
    // Get user with their posts
    println!("   Getting user with posts...");
    let user_with_posts = get_user_with_posts(conn, user.id)?;
    println!("   📄 User {} has {} posts", user_with_posts.username, user_with_posts.posts.len());
    
    // Get post with comments
    println!("   Getting post with comments...");
    let post_with_comments = get_post_with_comments(conn, post1.id)?;
    println!("   📄 Post '{}' has {} comments", post_with_comments.title, post_with_comments.comments.len());
    
    // Get all posts with user info
    println!("   Getting all posts with user info...");
    let posts_with_users = get_all_posts_with_users(conn)?;
    for post_user in posts_with_users {
        println!("   📄 '{}' by {}", post_user.post.title, post_user.user.username);
    }
    
    Ok(())
}

fn advanced_query_examples(conn: &mut PgConnection) -> Result<(), Box<dyn std::error::Error>> {
    println!("   Running advanced queries...");
    
    // Count users
    let user_count = count_users(conn)?;
    println!("   📊 Total users: {}", user_count);
    
    // Count posts by user
    let post_counts = count_posts_by_user(conn)?;
    for (username, count) in post_counts {
        println!("   📊 {} has {} posts", username, count);
    }
    
    // Get published posts
    let published_posts = get_published_posts(conn)?;
    println!("   📄 Published posts: {}", published_posts.len());
    
    // Search users by username
    let search_results = search_users_by_username(conn, "john")?;
    println!("   🔍 Users matching 'john': {}", search_results.len());
    
    // Get users with pagination
    let (paginated_users, total_count) = get_users_paginated(conn, 0, 10)?;
    println!("   📄 Showing {} of {} users", paginated_users.len(), total_count);
    
    // Get recent posts
    let recent_posts = get_recent_posts(conn, 5)?;
    println!("   📄 Recent posts: {}", recent_posts.len());
    
    Ok(())
}

fn error_handling_examples(conn: &mut PgConnection) -> Result<(), Box<dyn std::error::Error>> {
    use crate::error_handling::*;
    
    println!("   Demonstrating error handling...");
    
    // Try to get a non-existent user
    match get_user_by_id_safe(conn, 9999) {
        Ok(user) => println!("   📄 Found user: {}", user.username),
        Err(e) => println!("   ❌ Expected error: {}", e),
    }
    
    // Try to create a user with duplicate email
    let duplicate_user = NewUser {
        username: "duplicate_user",
        email: "john@example.com", // This email already exists
        full_name: Some("Duplicate User"),
    };
    
    match create_user_safe(conn, &duplicate_user) {
        Ok(user) => println!("   ✅ Created user: {}", user.username),
        Err(e) => println!("   ❌ Expected error: {}", e),
    }
    
    // Try to update a non-existent user
    match update_user_safe(conn, 9999, None, None) {
        Ok(user) => println!("   ✅ Updated user: {}", user.username),
        Err(e) => println!("   ❌ Expected error: {}", e),
    }
    
    // Try to delete a non-existent user
    match delete_user_safe(conn, 9999) {
        Ok(()) => println!("   ✅ Deleted user"),
        Err(e) => println!("   ❌ Expected error: {}", e),
    }
    
    Ok(())
}