use crate::models::{User, Post, NewUser, NewPost};
use sqlx::{PgPool, postgres::PgPoolOptions, Row, FromRow};
use uuid::Uuid;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc, Duration};
use std::collections::HashMap;

pub async fn run() -> anyhow::Result<()> {
    println!("=== Real World Examples ===");
    println!();
    
    // Get database URL from environment or use default
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:password@localhost/sqlx_examples".to_string());
    
    let pool = PgPool::connect(&database_url).await?;
    
    // Run examples
    blog_system(&pool).await?;
    user_management(&pool).await?;
    analytics_system(&pool).await?;
    notification_system(&pool).await?;
    file_storage(&pool).await?;
    shopping_cart(&pool).await?;
    
    pool.close().await;
    println!();
    Ok(())
}

async fn blog_system(pool: &PgPool) -> anyhow::Result<()> {
    println!("1. Blog System");
    println!("---------------");
    
    // Create tables for blog system
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS blog_posts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            content TEXT NOT NULL,
            excerpt TEXT,
            author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            status VARCHAR(20) NOT NULL DEFAULT 'draft',
            published_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(pool)
    .await?;
    
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS blog_tags (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(50) NOT NULL UNIQUE,
            color VARCHAR(7) DEFAULT '#000000',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(pool)
    .await?;
    
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS blog_post_tags (
            post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
            tag_id UUID NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
            PRIMARY KEY (post_id, tag_id)
        )
    "#)
    .execute(pool)
    .await?;
    
    // Define models
    #[derive(Debug, FromRow, Serialize)]
    struct BlogPost {
        id: Uuid,
        title: String,
        slug: String,
        content: String,
        excerpt: Option<String>,
        author_id: Uuid,
        status: String,
        published_at: Option<DateTime<Utc>>,
        created_at: DateTime<Utc>,
        updated_at: DateTime<Utc>,
        author_name: Option<String>,
        tags: Option<Vec<String>>,
    }
    
    #[derive(Debug, FromRow)]
    struct BlogTag {
        id: Uuid,
        name: String,
        color: String,
    }
    
    // Create some tags
    let rust_tag_id = Uuid::new_v4();
    let database_tag_id = Uuid::new_v4();
    
    sqlx::query(r#"
        INSERT INTO blog_tags (id, name, color) VALUES 
        ($1, $2, $3),
        ($4, $5, $6)
        ON CONFLICT (name) DO NOTHING
    "#)
    .bind(rust_tag_id)
    .bind("Rust")
    .bind("#ce422b")
    .bind(database_tag_id)
    .bind("Database")
    .bind("#336791")
    .execute(pool)
    .await?;
    
    // Create a blog post with tags
    let post_id = Uuid::new_v4();
    let author_id = sqlx::query_scalar::<_, Uuid>("SELECT id FROM users LIMIT 1")
        .fetch_optional(pool)
        .await?
        .unwrap_or_else(Uuid::new_v4);
    
    let mut tx = pool.begin().await?;
    
    // Insert post
    sqlx::query(r#"
        INSERT INTO blog_posts (id, title, slug, content, excerpt, author_id, status, published_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    "#)
    .bind(post_id)
    .bind("Getting Started with SQLx in Rust")
    .bind("getting-started-with-sqlx")
    .bind("SQLx is a powerful async SQL toolkit for Rust...")
    .bind("Learn how to use SQLx for database operations in Rust")
    .bind(author_id)
    .bind("published")
    .bind(Utc::now())
    .execute(&mut tx)
    .await?;
    
    // Associate tags with post
    sqlx::query(r#"
        INSERT INTO blog_post_tags (post_id, tag_id) VALUES 
        ($1, $2),
        ($1, $3)
    "#)
    .bind(post_id)
    .bind(rust_tag_id)
    .bind(database_tag_id)
    .execute(&mut tx)
    .await?;
    
    tx.commit().await?;
    
    // Query blog posts with author and tags
    let posts: Vec<BlogPost> = sqlx::query_as(r#"
        SELECT 
            bp.*,
            u.username as author_name,
            COALESCE(
                ARRAY_AGG(bt.name) FILTER (WHERE bt.name IS NOT NULL),
                ARRAY[]::text[]
            ) as tags
        FROM blog_posts bp
        LEFT JOIN users u ON bp.author_id = u.id
        LEFT JOIN blog_post_tags bpt ON bp.id = bpt.post_id
        LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
        WHERE bp.status = 'published'
        GROUP BY bp.id, u.username
        ORDER BY bp.published_at DESC
        LIMIT 5
    "#)
    .fetch_all(pool)
    .await?;
    
    println!("Published blog posts:");
    for post in posts {
        println!("  - {} by {}", post.title, post.author_name.unwrap_or_else(|| "Unknown".to_string()));
        println!("    Tags: {:?}", post.tags.unwrap_or_default());
        println!("    Published: {:?}", post.published_at);
    }
    
    // Search posts by tag
    let rust_posts: Vec<BlogPost> = sqlx::query_as(r#"
        SELECT 
            bp.*,
            u.username as author_name,
            COALESCE(
                ARRAY_AGG(bt.name) FILTER (WHERE bt.name IS NOT NULL),
                ARRAY[]::text[]
            ) as tags
        FROM blog_posts bp
        LEFT JOIN users u ON bp.author_id = u.id
        LEFT JOIN blog_post_tags bpt ON bp.id = bpt.post_id
        LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
        WHERE bp.status = 'published' AND bt.name = $1
        GROUP BY bp.id, u.username
        ORDER BY bp.published_at DESC
    "#)
    .bind("Rust")
    .fetch_all(pool)
    .await?;
    
    println!("Rust-related posts:");
    for post in rust_posts {
        println!("  - {}", post.title);
    }
    
    println!();
    Ok(())
}

async fn user_management(pool: &PgPool) -> anyhow::Result<()> {
    println!("2. User Management System");
    println!("--------------------------");
    
    // Create extended user tables
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS user_profiles (
            user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            bio TEXT,
            avatar_url VARCHAR(500),
            date_of_birth DATE,
            location VARCHAR(100),
            website VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(pool)
    .await?;
    
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS user_roles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(50) NOT NULL UNIQUE,
            description TEXT,
            permissions JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(pool)
    .await?;
    
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS user_role_assignments (
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            role_id UUID NOT NULL REFERENCES user_roles(id) ON DELETE CASCADE,
            assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            assigned_by UUID REFERENCES users(id),
            PRIMARY KEY (user_id, role_id)
        )
    "#)
    .execute(pool)
    .await?;
    
    // Define models
    #[derive(Debug, FromRow, Serialize)]
    struct UserProfile {
        user_id: Uuid,
        first_name: Option<String>,
        last_name: Option<String>,
        bio: Option<String>,
        avatar_url: Option<String>,
        date_of_birth: Option<chrono::NaiveDate>,
        location: Option<String>,
        website: Option<String>,
        created_at: DateTime<Utc>,
        updated_at: DateTime<Utc>,
        username: Option<String>,
        email: Option<String>,
        roles: Option<Vec<String>>,
    }
    
    #[derive(Debug, FromRow)]
    struct UserRole {
        id: Uuid,
        name: String,
        description: Option<String>,
        permissions: serde_json::Value,
    }
    
    // Create roles
    let admin_role_id = Uuid::new_v4();
    let user_role_id = Uuid::new_v4();
    
    sqlx::query(r#"
        INSERT INTO user_roles (id, name, description, permissions) VALUES 
        ($1, $2, $3, $4),
        ($5, $6, $7, $8)
        ON CONFLICT (name) DO NOTHING
    "#)
    .bind(admin_role_id)
    .bind("admin")
    .bind("System administrator with full access")
    .bind(serde_json::json!({"users": ["read", "write", "delete"], "posts": ["read", "write", "delete"]}))
    .bind(user_role_id)
    .bind("user")
    .bind("Regular user with limited access")
    .bind(serde_json::json!({"users": ["read"], "posts": ["read", "write"]}))
    .execute(pool)
    .await?;
    
    // Create a test user with profile
    let user_id = Uuid::new_v4();
    
    let mut tx = pool.begin().await?;
    
    // Insert user
    sqlx::query(r#"
        INSERT INTO users (id, username, email, password_hash) VALUES 
        ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING
    "#)
    .bind(user_id)
    .bind("profile_user")
    .bind("profile@example.com")
    .bind("password123")
    .execute(&mut tx)
    .await?;
    
    // Insert user profile
    sqlx::query(r#"
        INSERT INTO user_profiles (user_id, first_name, last_name, bio, location, website) VALUES 
        ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        bio = EXCLUDED.bio,
        location = EXCLUDED.location,
        website = EXCLUDED.website,
        updated_at = NOW()
    "#)
    .bind(user_id)
    .bind("John")
    .bind("Doe")
    .bind("Software developer passionate about Rust and databases")
    .bind("San Francisco, CA")
    .bind("https://johndoe.dev")
    .execute(&mut tx)
    .await?;
    
    // Assign role to user
    sqlx::query(r#"
        INSERT INTO user_role_assignments (user_id, role_id) VALUES 
        ($1, $2)
        ON CONFLICT (user_id, role_id) DO NOTHING
    "#)
    .bind(user_id)
    .bind(user_role_id)
    .execute(&mut tx)
    .await?;
    
    tx.commit().await?;
    
    // Query user with profile and roles
    let user_profiles: Vec<UserProfile> = sqlx::query_as(r#"
        SELECT 
            up.*,
            u.username,
            u.email,
            COALESCE(
                ARRAY_AGG(ur.name) FILTER (WHERE ur.name IS NOT NULL),
                ARRAY[]::text[]
            ) as roles
        FROM user_profiles up
        JOIN users u ON up.user_id = u.id
        LEFT JOIN user_role_assignments ura ON up.user_id = ura.user_id
        LEFT JOIN user_roles ur ON ura.role_id = ur.id
        WHERE up.user_id = $1
        GROUP BY up.user_id, u.username, u.email
    "#)
    .bind(user_id)
    .fetch_all(pool)
    .await?;
    
    println!("User profiles:");
    for profile in user_profiles {
        println!("  - {} {} ({})", 
                profile.first_name.unwrap_or_default(), 
                profile.last_name.unwrap_or_default(),
                profile.username.unwrap_or_default());
        println!("    Email: {}", profile.email.unwrap_or_default());
        println!("    Bio: {}", profile.bio.unwrap_or_default());
        println!("    Location: {}", profile.location.unwrap_or_default());
        println!("    Website: {}", profile.website.unwrap_or_default());
        println!("    Roles: {:?}", profile.roles.unwrap_or_default());
    }
    
    // Check user permissions
    let user_permissions: Vec<serde_json::Value> = sqlx::query_scalar(r#"
        SELECT ur.permissions
        FROM user_role_assignments ura
        JOIN user_roles ur ON ura.role_id = ur.id
        WHERE ura.user_id = $1
    "#)
    .bind(user_id)
    .fetch_all(pool)
    .await?;
    
    println!("User permissions:");
    for permissions in user_permissions {
        println!("  {:?}", permissions);
    }
    
    println!();
    Ok(())
}

async fn analytics_system(pool: &PgPool) -> anyhow::Result<()> {
    println!("3. Analytics System");
    println!("--------------------");
    
    // Create analytics tables
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS page_views (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE SET NULL,
            page_url VARCHAR(500) NOT NULL,
            referrer VARCHAR(500),
            user_agent TEXT,
            ip_address INET,
            session_id VARCHAR(255),
            viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(pool)
    .await?;
    
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS events (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE SET NULL,
            event_type VARCHAR(100) NOT NULL,
            event_data JSONB DEFAULT '{}',
            page_url VARCHAR(500),
            session_id VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(pool)
    .await?;
    
    // Define models
    #[derive(Debug, FromRow)]
    struct PageView {
        id: Uuid,
        user_id: Option<Uuid>,
        page_url: String,
        referrer: Option<String>,
        user_agent: Option<String>,
        ip_address: Option<String>,
        session_id: Option<String>,
        viewed_at: DateTime<Utc>,
    }
    
    #[derive(Debug, FromRow)]
    struct Event {
        id: Uuid,
        user_id: Option<Uuid>,
        event_type: String,
        event_data: serde_json::Value,
        page_url: Option<String>,
        session_id: Option<String>,
        created_at: DateTime<Utc>,
    }
    
    #[derive(Debug, FromRow)]
    struct PageStats {
        page_url: String,
        view_count: i64,
        unique_users: i64,
        avg_time_on_page: Option<f64>,
    }
    
    // Generate sample data
    let sample_user = sqlx::query_scalar::<_, Uuid>("SELECT id FROM users LIMIT 1")
        .fetch_optional(pool)
        .await?;
    
    let session_id = Uuid::new_v4().to_string();
    
    // Insert page views
    for i in 0..10 {
        sqlx::query(r#"
            INSERT INTO page_views (user_id, page_url, referrer, session_id) VALUES 
            ($1, $2, $3, $4)
        "#)
        .bind(sample_user)
        .bind(format!("/page/{}", i))
        .bind(if i > 0 { Some(format!("/page/{}", i - 1)) } else { None })
        .bind(&session_id)
        .execute(pool)
        .await?;
    }
    
    // Insert events
    sqlx::query(r#"
        INSERT INTO events (user_id, event_type, event_data, page_url, session_id) VALUES 
        ($1, $2, $3, $4, $5),
        ($1, $6, $7, $8, $5)
    "#)
    .bind(sample_user)
    .bind("button_click")
    .bind(serde_json::json!({"button_id": "signup", "text": "Sign Up"}))
    .bind("/page/1")
    .bind(&session_id)
    .bind("form_submit")
    .bind(serde_json::json!({"form_id": "contact", "fields": ["name", "email", "message"]}))
    .bind("/page/2")
    .execute(pool)
    .await?;
    
    // Analytics queries
    
    // Page view statistics
    let page_stats: Vec<PageStats> = sqlx::query_as(r#"
        SELECT 
            page_url,
            COUNT(*) as view_count,
            COUNT(DISTINCT user_id) as unique_users,
            NULL as avg_time_on_page
        FROM page_views
        GROUP BY page_url
        ORDER BY view_count DESC
        LIMIT 5
    "#)
    .fetch_all(pool)
    .await?;
    
    println!("Page view statistics:");
    for stat in page_stats {
        println!("  - {}: {} views, {} unique users", 
                stat.page_url, stat.view_count, stat.unique_users);
    }
    
    // Event type distribution
    let event_stats: Vec<(String, i64)> = sqlx::query_as(r#"
        SELECT event_type, COUNT(*) as count
        FROM events
        GROUP BY event_type
        ORDER BY count DESC
    "#)
    .fetch_all(pool)
    .await?;
    
    println!("Event type distribution:");
    for (event_type, count) in event_stats {
        println!("  - {}: {}", event_type, count);
    }
    
    // Daily activity
    let daily_stats: Vec<(chrono::NaiveDate, i64)> = sqlx::query_as(r#"
        SELECT DATE(viewed_at) as date, COUNT(*) as views
        FROM page_views
        WHERE viewed_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(viewed_at)
        ORDER BY date DESC
    "#)
    .fetch_all(pool)
    .await?;
    
    println!("Daily activity (last 7 days):");
    for (date, views) in daily_stats {
        println!("  - {}: {} views", date, views);
    }
    
    // User engagement metrics
    let engagement_metrics: Vec<(String, f64)> = sqlx::query_as(r#"
        SELECT 
            metric,
            value
        FROM (
            SELECT 
                'avg_pages_per_session' as metric,
                AVG(page_count) as value
            FROM (
                SELECT session_id, COUNT(*) as page_count
                FROM page_views
                WHERE session_id IS NOT NULL
                GROUP BY session_id
            ) session_stats
            UNION ALL
            SELECT 
                'bounce_rate' as metric,
                (COUNT(*) FILTER (WHERE page_count = 1)::float / COUNT(*)) * 100 as value
            FROM (
                SELECT session_id, COUNT(*) as page_count
                FROM page_views
                WHERE session_id IS NOT NULL
                GROUP BY session_id
            ) session_stats
        ) metrics
    "#)
    .fetch_all(pool)
    .await?;
    
    println!("User engagement metrics:");
    for (metric, value) in engagement_metrics {
        println!("  - {}: {:.2}", metric, value);
    }
    
    println!();
    Ok(())
}

async fn notification_system(pool: &PgPool) -> anyhow::Result<()> {
    println!("4. Notification System");
    println!("-----------------------");
    
    // Create notification tables
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS notifications (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            type VARCHAR(50) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            data JSONB DEFAULT '{}',
            read_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(pool)
    .await?;
    
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS notification_preferences (
            user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            email_notifications BOOLEAN DEFAULT true,
            push_notifications BOOLEAN DEFAULT true,
            in_app_notifications BOOLEAN DEFAULT true,
            preferences JSONB DEFAULT '{}',
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(pool)
    .await?;
    
    // Define models
    #[derive(Debug, FromRow, Serialize)]
    struct Notification {
        id: Uuid,
        user_id: Uuid,
        type_: String,
        title: String,
        content: Option<String>,
        data: serde_json::Value,
        read_at: Option<DateTime<Utc>>,
        created_at: DateTime<Utc>,
    }
    
    #[derive(Debug, FromRow)]
    struct NotificationPreference {
        user_id: Uuid,
        email_notifications: bool,
        push_notifications: bool,
        in_app_notifications: bool,
        preferences: serde_json::Value,
        updated_at: DateTime<Utc>,
    }
    
    // Create sample notifications
    let sample_user = sqlx::query_scalar::<_, Uuid>("SELECT id FROM users LIMIT 1")
        .fetch_optional(pool)
        .await?;
    
    if let Some(user_id) = sample_user {
        // Set notification preferences
        sqlx::query(r#"
            INSERT INTO notification_preferences (user_id, email_notifications, push_notifications, preferences) VALUES 
            ($1, $2, $3, $4)
            ON CONFLICT (user_id) DO UPDATE SET
            email_notifications = EXCLUDED.email_notifications,
            push_notifications = EXCLUDED.push_notifications,
            preferences = EXCLUDED.preferences,
            updated_at = NOW()
        "#)
        .bind(user_id)
        .bind(true)
        .bind(false)
        .bind(serde_json::json!({"new_post": true, "comments": false, "mentions": true}))
        .execute(pool)
        .await?;
        
        // Create notifications
        sqlx::query(r#"
            INSERT INTO notifications (user_id, type, title, content, data) VALUES 
            ($1, $2, $3, $4, $5),
            ($1, $6, $7, $8, $9),
            ($1, $10, $11, $12, $13)
        "#)
        .bind(user_id)
        .bind("new_post")
        .bind("New post published")
        .bind("Your post 'Getting Started with SQLx' has been published successfully")
        .bind(serde_json::json!({"post_id": Uuid::new_v4(), "post_title": "Getting Started with SQLx"}))
        .bind("comment")
        .bind("New comment on your post")
        .bind("John Doe commented on your post")
        .bind(serde_json::json!({"post_id": Uuid::new_v4(), "comment_id": Uuid::new_v4(), "commenter": "John Doe"}))
        .bind("system")
        .bind("System maintenance")
        .bind("The system will be under maintenance from 2AM to 4AM UTC tomorrow")
        .bind(serde_json::json!({"maintenance_start": "2023-12-01T02:00:00Z", "maintenance_end": "2023-12-01T04:00:00Z"}))
        .execute(pool)
        .await?;
        
        // Mark one notification as read
        sqlx::query("UPDATE notifications SET read_at = NOW() WHERE user_id = $1 AND type = $2")
            .bind(user_id)
            .bind("comment")
            .execute(pool)
            .await?;
        
        // Query notifications
        let notifications: Vec<Notification> = sqlx::query_as(r#"
            SELECT * FROM notifications 
            WHERE user_id = $1 
            ORDER BY created_at DESC
        "#)
        .bind(user_id)
        .fetch_all(pool)
        .await?;
        
        println!("User notifications:");
        for notification in notifications {
            let status = if notification.read_at.is_some() { "Read" } else { "Unread" };
            println!("  - [{}] {}: {}", status, notification.title, notification.content.unwrap_or_default());
            println!("    Type: {}, Created: {}", notification.type_, notification.created_at);
        }
        
        // Query notification preferences
        let preferences: Option<NotificationPreference> = sqlx::query_as(
            "SELECT * FROM notification_preferences WHERE user_id = $1"
        )
        .bind(user_id)
        .fetch_optional(pool)
        .await?;
        
        if let Some(pref) = preferences {
            println!("Notification preferences:");
            println!("  - Email: {}", pref.email_notifications);
            println!("  - Push: {}", pref.push_notifications);
            println!("  - In-app: {}", pref.in_app_notifications);
            println!("  - Custom: {}", pref.preferences);
        }
        
        // Notification statistics
        let notification_stats: Vec<(String, i64)> = sqlx::query_as(r#"
            SELECT 
                type,
                COUNT(*) as count
            FROM notifications
            WHERE user_id = $1
            GROUP BY type
            ORDER BY count DESC
        "#)
        .bind(user_id)
        .fetch_all(pool)
        .await?;
        
        println!("Notification statistics:");
        for (type_, count) in notification_stats {
            println!("  - {}: {}", type_, count);
        }
        
        let unread_count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read_at IS NULL"
        )
        .bind(user_id)
        .fetch_one(pool)
        .await?;
        
        println!("Unread notifications: {}", unread_count);
    }
    
    println!();
    Ok(())
}

async fn file_storage(pool: &PgPool) -> anyhow::Result<()> {
    println!("5. File Storage System");
    println!("-----------------------");
    
    // Create file storage tables
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS files (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE SET NULL,
            filename VARCHAR(255) NOT NULL,
            original_filename VARCHAR(255) NOT NULL,
            mime_type VARCHAR(100) NOT NULL,
            size_bytes BIGINT NOT NULL,
            storage_path VARCHAR(500) NOT NULL,
            hash VARCHAR(64),
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(pool)
    .await?;
    
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS file_shares (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
            share_token VARCHAR(255) NOT NULL UNIQUE,
            expires_at TIMESTAMP WITH TIME ZONE,
            download_limit INTEGER,
            download_count INTEGER DEFAULT 0,
            password_hash VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(pool)
    .await?;
    
    // Define models
    #[derive(Debug, FromRow, Serialize)]
    struct File {
        id: Uuid,
        user_id: Option<Uuid>,
        filename: String,
        original_filename: String,
        mime_type: String,
        size_bytes: i64,
        storage_path: String,
        hash: Option<String>,
        metadata: serde_json::Value,
        created_at: DateTime<Utc>,
        username: Option<String>,
    }
    
    #[derive(Debug, FromRow)]
    struct FileShare {
        id: Uuid,
        file_id: Uuid,
        share_token: String,
        expires_at: Option<DateTime<Utc>>,
        download_limit: Option<i32>,
        download_count: i32,
        password_hash: Option<String>,
        created_at: DateTime<Utc>,
        filename: String,
    }
    
    // Create sample files
    let sample_user = sqlx::query_scalar::<_, Uuid>("SELECT id FROM users LIMIT 1")
        .fetch_optional(pool)
        .await?;
    
    if let Some(user_id) = sample_user {
        let file1_id = Uuid::new_v4();
        let file2_id = Uuid::new_v4();
        
        // Insert files
        sqlx::query(r#"
            INSERT INTO files (id, user_id, filename, original_filename, mime_type, size_bytes, storage_path, hash, metadata) VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9),
            ($10, $2, $11, $12, $13, $14, $15, $16, $17)
        "#)
        .bind(file1_id)
        .bind(user_id)
        .bind("document_20231201_abc123.pdf")
        .bind("Annual Report 2023.pdf")
        .bind("application/pdf")
        .bind(1024000) // 1MB
        .bind("/storage/2023/12/01/document_20231201_abc123.pdf")
        .bind("sha256:abc123...")
        .bind(serde_json::json!({"title": "Annual Report 2023", "department": "Finance"}))
        .bind(file2_id)
        .bind(user_id)
        .bind("image_20231201_def456.jpg")
        .bind("Vacation Photo.jpg")
        .bind("image/jpeg")
        .bind(2048000) // 2MB
        .bind("/storage/2023/12/01/image_20231201_def456.jpg")
        .bind("sha256:def456...")
        .bind(serde_json::json!({"location": "Paris", "date": "2023-11-15"}))
        .execute(pool)
        .await?;
        
        // Create a file share
        let share_token = Uuid::new_v4().to_string();
        sqlx::query(r#"
            INSERT INTO file_shares (file_id, share_token, expires_at, download_limit) VALUES 
            ($1, $2, $3, $4)
        "#)
        .bind(file1_id)
        .bind(&share_token)
        .bind(Utc::now() + Duration::days(7)) // Expires in 7 days
        .bind(10) // 10 downloads limit
        .execute(pool)
        .await?;
        
        // Query files with user info
        let files: Vec<File> = sqlx::query_as(r#"
            SELECT 
                f.*,
                u.username
            FROM files f
            LEFT JOIN users u ON f.user_id = u.id
            WHERE f.user_id = $1
            ORDER BY f.created_at DESC
        "#)
        .bind(user_id)
        .fetch_all(pool)
        .await?;
        
        println!("User files:");
        for file in files {
            println!("  - {} ({})", file.original_filename, file.mime_type);
            println!("    Size: {:.2} MB, Path: {}", file.size_bytes as f64 / 1024.0 / 1024.0, file.storage_path);
            println!("    Uploaded by: {}, Created: {}", 
                    file.username.unwrap_or_else(|| "Unknown".to_string()), 
                    file.created_at);
            println!("    Metadata: {}", file.metadata);
        }
        
        // Query file shares
        let file_shares: Vec<FileShare> = sqlx::query_as(r#"
            SELECT 
                fs.*,
                f.original_filename as filename
            FROM file_shares fs
            JOIN files f ON fs.file_id = f.id
            WHERE f.user_id = $1
            ORDER BY fs.created_at DESC
        "#)
        .bind(user_id)
        .fetch_all(pool)
        .await?;
        
        println!("File shares:");
        for share in file_shares {
            println!("  - {} (Token: {})", share.filename, share.share_token);
            println!("    Downloads: {}/{}, Expires: {:?}", 
                    share.download_count, 
                    share.download_limit.unwrap_or(0), 
                    share.expires_at);
        }
        
        // Storage statistics
        let storage_stats: Vec<(String, i64, f64)> = sqlx::query_as(r#"
            SELECT 
                mime_type,
                COUNT(*) as file_count,
                SUM(size_bytes) / 1024.0 / 1024.0 as total_size_mb
            FROM files
            WHERE user_id = $1
            GROUP BY mime_type
            ORDER BY total_size_mb DESC
        "#)
        .bind(user_id)
        .fetch_all(pool)
        .await?;
        
        println!("Storage statistics:");
        for (mime_type, count, size_mb) in storage_stats {
            println!("  - {}: {} files, {:.2} MB", mime_type, count, size_mb);
        }
    }
    
    println!();
    Ok(())
}

async fn shopping_cart(pool: &PgPool) -> anyhow::Result<()> {
    println!("6. Shopping Cart System");
    println!("------------------------");
    
    // Create shopping cart tables
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            inventory_count INTEGER NOT NULL DEFAULT 0,
            sku VARCHAR(100) UNIQUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(pool)
    .await?;
    
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS shopping_carts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            session_id VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id),
            UNIQUE(session_id)
        )
    "#)
    .execute(pool)
    .await?;
    
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS cart_items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            cart_id UUID NOT NULL REFERENCES shopping_carts(id) ON DELETE CASCADE,
            product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
            quantity INTEGER NOT NULL CHECK (quantity > 0),
            price_at_add DECIMAL(10, 2) NOT NULL,
            added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(cart_id, product_id)
        )
    "#)
    .execute(pool)
    .await?;
    
    // Define models
    #[derive(Debug, FromRow, Serialize)]
    struct Product {
        id: Uuid,
        name: String,
        description: Option<String>,
        price: rust_decimal::Decimal,
        inventory_count: i32,
        sku: Option<String>,
        created_at: DateTime<Utc>,
        updated_at: DateTime<Utc>,
    }
    
    #[derive(Debug, FromRow, Serialize)]
    struct CartItem {
        id: Uuid,
        cart_id: Uuid,
        product_id: Uuid,
        quantity: i32,
        price_at_add: rust_decimal::Decimal,
        added_at: DateTime<Utc>,
        product_name: String,
        product_sku: Option<String>,
        current_price: rust_decimal::Decimal,
        in_stock: bool,
    }
    
    #[derive(Debug, FromRow)]
    struct CartSummary {
        cart_id: Uuid,
        total_items: i64,
        total_amount: rust_decimal::Decimal,
        updated_at: DateTime<Utc>,
    }
    
    // Create sample products
    let product1_id = Uuid::new_v4();
    let product2_id = Uuid::new_v4();
    let product3_id = Uuid::new_v4();
    
    sqlx::query(r#"
        INSERT INTO products (id, name, description, price, inventory_count, sku) VALUES 
        ($1, $2, $3, $4, $5, $6),
        ($7, $8, $9, $10, $11, $12),
        ($13, $14, $15, $16, $17, $18)
        ON CONFLICT (sku) DO NOTHING
    "#)
    .bind(product1_id)
    .bind("Rust Programming Book")
    .bind("Comprehensive guide to Rust programming")
    .bind("29.99")
    .bind(100)
    .bind("RUST-BOOK-001")
    .bind(product2_id)
    .bind("SQLx T-Shirt")
    .bind("Comfortable cotton t-shirt with SQLx logo")
    .bind("19.99")
    .bind(50)
    .bind("SQLX-TSHIRT-001")
    .bind(product3_id)
    .bind("Database Mug")
    .bind("Ceramic mug with database schema print")
    .bind("14.99")
    .bind(25)
    .bind("DB-MUG-001")
    .execute(pool)
    .await?;
    
    // Create a shopping cart for a user
    let sample_user = sqlx::query_scalar::<_, Uuid>("SELECT id FROM users LIMIT 1")
        .fetch_optional(pool)
        .await?;
    
    if let Some(user_id) = sample_user {
        let cart_id = Uuid::new_v4();
        
        // Create cart
        sqlx::query(r#"
            INSERT INTO shopping_carts (id, user_id) VALUES 
            ($1, $2)
            ON CONFLICT (user_id) DO UPDATE SET
            updated_at = NOW()
            RETURNING id
        "#)
        .bind(cart_id)
        .bind(user_id)
        .fetch_one(pool)
        .await?;
        
        // Add items to cart
        sqlx::query(r#"
            INSERT INTO cart_items (cart_id, product_id, quantity, price_at_add) VALUES 
            ($1, $2, $3, $4),
            ($1, $5, $6, $7)
            ON CONFLICT (cart_id, product_id) DO UPDATE SET
            quantity = cart_items.quantity + EXCLUDED.quantity,
            added_at = NOW()
        "#)
        .bind(cart_id)
        .bind(product1_id)
        .bind(2) // 2 books
        .bind("29.99")
        .bind(product2_id)
        .bind(1) // 1 t-shirt
        .bind("19.99")
        .execute(pool)
        .await?;
        
        // Query cart with product details
        let cart_items: Vec<CartItem> = sqlx::query_as(r#"
            SELECT 
                ci.*,
                p.name as product_name,
                p.sku as product_sku,
                p.price as current_price,
                p.inventory_count > 0 as in_stock
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = $1
            ORDER BY ci.added_at DESC
        "#)
        .bind(cart_id)
        .fetch_all(pool)
        .await?;
        
        println!("Shopping cart items:");
        for item in cart_items {
            println!("  - {} ({})", item.product_name, item.product_sku.unwrap_or_default());
            println!("    Quantity: {}, Price: ${} each", item.quantity, item.price_at_add);
            println!("    Subtotal: ${}, In stock: {}", 
                    item.price_at_add * rust_decimal::Decimal::from(item.quantity),
                    item.in_stock);
            
            // Check if price has changed
            if item.price_at_add != item.current_price {
                println!("    NOTE: Price has changed since added to cart (now ${})", item.current_price);
            }
        }
        
        // Cart summary
        let cart_summary: Option<CartSummary> = sqlx::query_as(r#"
            SELECT 
                sc.id as cart_id,
                SUM(ci.quantity) as total_items,
                SUM(ci.quantity * ci.price_at_add) as total_amount,
                sc.updated_at
            FROM shopping_carts sc
            LEFT JOIN cart_items ci ON sc.id = ci.cart_id
            WHERE sc.id = $1
            GROUP BY sc.id, sc.updated_at
        "#)
        .bind(cart_id)
        .fetch_optional(pool)
        .await?;
        
        if let Some(summary) = cart_summary {
            println!("Cart summary:");
            println!("  Total items: {}", summary.total_items);
            println!("  Total amount: ${}", summary.total_amount);
            println!("  Last updated: {}", summary.updated_at);
        }
        
        // Inventory check
        let inventory_issues: Vec<(String, i32, i32)> = sqlx::query_as(r#"
            SELECT 
                p.name,
                ci.quantity,
                p.inventory_count
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = $1 AND ci.quantity > p.inventory_count
        "#)
        .bind(cart_id)
        .fetch_all(pool)
        .await?;
        
        if !inventory_issues.is_empty() {
            println!("Inventory issues:");
            for (product_name, requested, available) in inventory_issues {
                println!("  - {}: {} requested, {} available", product_name, requested, available);
            }
        } else {
            println!("All items in stock!");
        }
    }
    
    println!();
    Ok(())
}