use crate::models::{User, NewUser, UpdateUser, Post, NewPost, Comment, NewComment, ActivityLog, NewActivityLog};
use sqlx::{PgPool, Row};
use uuid::Uuid;
use chrono::Utc;

pub async fn run() -> anyhow::Result<()> {
    println!("=== Basic Queries Examples ===");
    println!();
    
    // Get database URL from environment or use default
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:password@localhost/sqlx_examples".to_string());
    
    // Create connection pool
    let pool = PgPool::connect(&database_url).await?;
    
    // Run examples
    create_tables(&pool).await?;
    insert_examples(&pool).await?;
    select_examples(&pool).await?;
    update_examples(&pool).await?;
    delete_examples(&pool).await?;
    join_examples(&pool).await?;
    aggregate_examples(&pool).await?;
    
    println!();
    Ok(())
}

async fn create_tables(pool: &PgPool) -> anyhow::Result<()> {
    println!("1. Creating Tables");
    println!("------------------");
    
    // Create users table
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            last_login TIMESTAMP WITH TIME ZONE,
            is_active BOOLEAN NOT NULL DEFAULT true
        )
    "#).execute(pool).await?;
    
    // Create posts table
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS posts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            published_at TIMESTAMP WITH TIME ZONE,
            is_published BOOLEAN NOT NULL DEFAULT false,
            view_count BIGINT NOT NULL DEFAULT 0
        )
    "#).execute(pool).await?;
    
    // Create comments table
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS comments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            content TEXT NOT NULL,
            author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            is_approved BOOLEAN NOT NULL DEFAULT false
        )
    "#).execute(pool).await?;
    
    // Create activity_logs table
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS activity_logs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE SET NULL,
            action VARCHAR(255) NOT NULL,
            resource_type VARCHAR(255) NOT NULL,
            resource_id UUID,
            details JSONB,
            ip_address INET,
            user_agent TEXT,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        )
    "#).execute(pool).await?;
    
    // Create indexes
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)").execute(pool).await?;
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id)").execute(pool).await?;
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at)").execute(pool).await?;
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id)").execute(pool).await?;
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id)").execute(pool).await?;
    
    println!("Tables created successfully");
    println!();
    
    Ok(())
}

async fn insert_examples(pool: &PgPool) -> anyhow::Result<()> {
    println!("2. Insert Examples");
    println!("------------------");
    
    // Insert users
    let user1_id = Uuid::new_v4();
    let user2_id = Uuid::new_v4();
    
    let new_user1 = NewUser {
        username: "john_doe".to_string(),
        email: "john@example.com".to_string(),
        password: "password123".to_string(),
    };
    
    let new_user2 = NewUser {
        username: "jane_smith".to_string(),
        email: "jane@example.com".to_string(),
        password: "password456".to_string(),
    };
    
    // Using query_as with bind parameters
    let user1: User = sqlx::query_as(r#"
        INSERT INTO users (id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    "#)
    .bind(user1_id)
    .bind(&new_user1.username)
    .bind(&new_user1.email)
    .bind(&new_user1.password)
    .fetch_one(pool)
    .await?;
    
    println!("Inserted user: {} ({})", user1.username, user1.email);
    
    // Using execute for simple insert
    let result = sqlx::query(r#"
        INSERT INTO users (id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
    "#)
    .bind(user2_id)
    .bind(&new_user2.username)
    .bind(&new_user2.email)
    .bind(&new_user2.password)
    .execute(pool)
    .await?;
    
    println!("Inserted user: {} ({})", new_user2.username, new_user2.email);
    println!("Rows affected: {}", result.rows_affected());
    
    // Insert posts
    let post1_id = Uuid::new_v4();
    let post2_id = Uuid::new_v4();
    
    let new_post1 = NewPost {
        title: "Getting Started with Rust".to_string(),
        content: "Rust is a systems programming language that runs blazingly fast...".to_string(),
        author_id: user1_id,
    };
    
    let post2: Post = sqlx::query_as(r#"
        INSERT INTO posts (id, title, content, author_id, is_published, published_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    "#)
    .bind(post1_id)
    .bind(&new_post1.title)
    .bind(&new_post1.content)
    .bind(new_post1.author_id)
    .bind(true)
    .bind(Utc::now())
    .fetch_one(pool)
    .await?;
    
    println!("Inserted post: {}", post2.title);
    
    // Insert comments
    let comment_id = Uuid::new_v4();
    let new_comment = NewComment {
        content: "Great article! Thanks for sharing.".to_string(),
        author_id: user2_id,
        post_id: post1_id,
    };
    
    let comment: Comment = sqlx::query_as(r#"
        INSERT INTO comments (id, content, author_id, post_id, is_approved)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    "#)
    .bind(comment_id)
    .bind(&new_comment.content)
    .bind(new_comment.author_id)
    .bind(new_comment.post_id)
    .bind(true)
    .fetch_one(pool)
    .await?;
    
    println!("Inserted comment: {}", comment.content);
    
    // Insert activity log
    let activity_log = NewActivityLog {
        user_id: Some(user1_id),
        action: "create_post".to_string(),
        resource_type: "post".to_string(),
        resource_id: Some(post1_id),
        details: Some(serde_json::json!({
            "title": new_post1.title,
            "published": true
        })),
        ip_address: Some("192.168.1.100".to_string()),
        user_agent: Some("Mozilla/5.0 (Windows NT 10.0; Win64; x64)".to_string()),
    };
    
    let log: ActivityLog = sqlx::query_as(r#"
        INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    "#)
    .bind(activity_log.user_id)
    .bind(&activity_log.action)
    .bind(&activity_log.resource_type)
    .bind(activity_log.resource_id)
    .bind(&activity_log.details)
    .bind(&activity_log.ip_address)
    .bind(&activity_log.user_agent)
    .fetch_one(pool)
    .await?;
    
    println!("Inserted activity log: {} {}", log.action, log.resource_type);
    
    println!();
    Ok(())
}

async fn select_examples(pool: &PgPool) -> anyhow::Result<()> {
    println!("3. Select Examples");
    println!("-----------------");
    
    // Select all users
    let users: Vec<User> = sqlx::query_as("SELECT * FROM users")
        .fetch_all(pool)
        .await?;
    
    println!("Found {} users:", users.len());
    for user in &users {
        println!("  - {} ({})", user.username, user.email);
    }
    
    // Select user by ID
    if let Some(first_user) = users.first() {
        let user: User = sqlx::query_as("SELECT * FROM users WHERE id = $1")
            .bind(first_user.id)
            .fetch_one(pool)
            .await?;
        
        println!("Selected user by ID: {}", user.username);
    }
    
    // Select with WHERE clause
    let active_users: Vec<User> = sqlx::query_as("SELECT * FROM users WHERE is_active = $1")
        .bind(true)
        .fetch_all(pool)
        .await?;
    
    println!("Found {} active users", active_users.len());
    
    // Select with LIKE
    let users_with_john: Vec<User> = sqlx::query_as("SELECT * FROM users WHERE username LIKE $1")
        .bind("%john%")
        .fetch_all(pool)
        .await?;
    
    println!("Found {} users with 'john' in username", users_with_john.len());
    
    // Select posts with user join
    let posts_with_authors: Vec<(Post, User)> = sqlx::query_as(r#"
        SELECT p.*, u.*
        FROM posts p
        JOIN users u ON p.author_id = u.id
        WHERE p.is_published = $1
        ORDER BY p.created_at DESC
    "#)
    .bind(true)
    .fetch_all(pool)
    .await?;
    
    println!("Found {} published posts:", posts_with_authors.len());
    for (post, author) in posts_with_authors {
        println!("  - '{}' by {}", post.title, author.username);
    }
    
    // Select single value
    let user_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users")
        .fetch_one(pool)
        .await?;
    
    println!("Total user count: {}", user_count);
    
    // Select with optional value
    let last_login: Option<chrono::DateTime<chrono::Utc>> = sqlx::query_scalar(
        "SELECT last_login FROM users WHERE username = $1"
    )
    .bind("john_doe")
    .fetch_optional(pool)
    .await?;
    
    if let Some(login_time) = last_login {
        println!("Last login for john_doe: {}", login_time);
    } else {
        println!("No login recorded for john_doe");
    }
    
    println!();
    Ok(())
}

async fn update_examples(pool: &PgPool) -> anyhow::Result<()> {
    println!("4. Update Examples");
    println!("------------------");
    
    // Update user
    let update_user = UpdateUser {
        username: Some("john_doe_updated".to_string()),
        email: None,
        password: None,
        is_active: None,
    };
    
    let result = sqlx::query(r#"
        UPDATE users 
        SET username = $1, updated_at = $2
        WHERE username = $3
    "#)
    .bind(&update_user.username.unwrap())
    .bind(Utc::now())
    .bind("john_doe_updated") // This won't match, so no rows will be updated
    .execute(pool)
    .await?;
    
    println!("Updated {} rows", result.rows_affected());
    
    // Update with correct username
    let result = sqlx::query(r#"
        UPDATE users 
        SET username = $1, updated_at = $2
        WHERE username = $3
    "#)
    .bind(&update_user.username.unwrap())
    .bind(Utc::now())
    .bind("john_doe")
    .execute(pool)
    .await?;
    
    println!("Updated {} rows", result.rows_affected());
    
    // Update post view count
    let result = sqlx::query("UPDATE posts SET view_count = view_count + 1")
        .execute(pool)
        .await?;
    
    println!("Incremented view count for {} posts", result.rows_affected());
    
    // Update returning updated row
    let updated_user: User = sqlx::query_as(r#"
        UPDATE users 
        SET last_login = $1, updated_at = $2
        WHERE username = $3
        RETURNING *
    "#)
    .bind(Utc::now())
    .bind(Utc::now())
    .bind("jane_smith")
    .fetch_one(pool)
    .await?;
    
    println!("Updated last login for: {}", updated_user.username);
    
    println!();
    Ok(())
}

async fn delete_examples(pool: &PgPool) -> anyhow::Result<()> {
    println!("5. Delete Examples");
    println!("------------------");
    
    // Delete comment
    let result = sqlx::query("DELETE FROM comments WHERE content LIKE $1")
        .bind("%Great article%")
        .execute(pool)
        .await?;
    
    println!("Deleted {} comments", result.rows_affected());
    
    // Delete user (this will cascade to their posts and comments)
    let result = sqlx::query("DELETE FROM users WHERE username = $1")
        .bind("john_doe_updated")
        .execute(pool)
        .await?;
    
    println!("Deleted {} users", result.rows_affected());
    
    // Delete with returning
    let deleted_posts: Vec<Post> = sqlx::query_as(r#"
        DELETE FROM posts 
        WHERE is_published = $1 
        RETURNING *
    "#)
    .bind(false)
    .fetch_all(pool)
    .await?;
    
    println!("Deleted {} unpublished posts", deleted_posts.len());
    
    println!();
    Ok(())
}

async fn join_examples(pool: &PgPool) -> anyhow::Result<()> {
    println!("6. Join Examples");
    println!("----------------");
    
    // Inner join
    let posts_with_authors: Vec<(Post, User)> = sqlx::query_as(r#"
        SELECT p.*, u.*
        FROM posts p
        INNER JOIN users u ON p.author_id = u.id
        ORDER BY p.created_at DESC
    "#)
    .fetch_all(pool)
    .await?;
    
    println!("Found {} posts with authors:", posts_with_authors.len());
    for (post, author) in &posts_with_authors {
        println!("  - '{}' by {}", post.title, author.username);
    }
    
    // Left join
    let users_with_post_count: Vec<(User, Option<i64>)> = sqlx::query_as(r#"
        SELECT u.*, COUNT(p.id) as post_count
        FROM users u
        LEFT JOIN posts p ON u.id = p.author_id
        GROUP BY u.id
        ORDER BY u.username
    "#)
    .fetch_all(pool)
    .await?;
    
    println!("Users with post counts:");
    for (user, post_count) in users_with_post_count {
        println!("  - {}: {} posts", user.username, post_count.unwrap_or(0));
    }
    
    // Multiple joins
    let comments_with_details: Vec<(Comment, User, Post)> = sqlx::query_as(r#"
        SELECT c.*, u.*, p.*
        FROM comments c
        INNER JOIN users u ON c.author_id = u.id
        INNER JOIN posts p ON c.post_id = p.id
        WHERE c.is_approved = $1
        ORDER BY c.created_at DESC
    "#)
    .bind(true)
    .fetch_all(pool)
    .await?;
    
    println!("Found {} approved comments:", comments_with_details.len());
    for (comment, user, post) in &comments_with_details {
        println!("  - '{}' on '{}' by {}", 
                 comment.content.chars().take(50).collect::<String>(),
                 post.title,
                 user.username);
    }
    
    println!();
    Ok(())
}

async fn aggregate_examples(pool: &PgPool) -> anyhow::Result<()> {
    println!("7. Aggregate Examples");
    println!("---------------------");
    
    // Count
    let user_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users")
        .fetch_one(pool)
        .await?;
    
    let post_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM posts")
        .fetch_one(pool)
        .await?;
    
    let comment_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM comments")
        .fetch_one(pool)
        .await?;
    
    println!("Counts: {} users, {} posts, {} comments", user_count, post_count, comment_count);
    
    // Group by with count
    let posts_by_user: Vec<(String, i64)> = sqlx::query_as(r#"
        SELECT u.username, COUNT(p.id) as post_count
        FROM users u
        LEFT JOIN posts p ON u.id = p.author_id
        GROUP BY u.id, u.username
        ORDER BY post_count DESC
    "#)
    .fetch_all(pool)
    .await?;
    
    println!("Posts by user:");
    for (username, count) in posts_by_user {
        println!("  - {}: {} posts", username, count);
    }
    
    // Average, max, min
    let stats: Vec<(String, f64, i64, i64)> = sqlx::query_as(r#"
        SELECT 
            'view_stats' as stat_type,
            AVG(view_count) as avg_views,
            MAX(view_count) as max_views,
            MIN(view_count) as min_views
        FROM posts
        WHERE view_count > 0
    "#)
    .fetch_all(pool)
    .await?;
    
    if let Some((stat_type, avg, max, min)) = stats.first() {
        println!("View statistics: avg={:.1}, max={}, min={}", avg, max, min);
    }
    
    // Date aggregation
    let posts_by_date: Vec<(chrono::NaiveDate, i64)> = sqlx::query_as(r#"
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM posts
        GROUP BY DATE(created_at)
        ORDER BY date DESC
    "#)
    .fetch_all(pool)
    .await?;
    
    println!("Posts by date:");
    for (date, count) in posts_by_date {
        println!("  - {}: {} posts", date, count);
    }
    
    println!();
    Ok(())
}