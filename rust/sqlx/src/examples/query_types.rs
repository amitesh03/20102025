use crate::models::{User, Post, NewUser, NewPost};
use sqlx::{PgPool, postgres::PgRow, FromRow, Row};
use uuid::Uuid;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

pub async fn run() -> anyhow::Result<()> {
    println!("=== Query Types Examples ===");
    println!();
    
    // Get database URL from environment or use default
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:password@localhost/sqlx_examples".to_string());
    
    let pool = PgPool::connect(&database_url).await?;
    
    // Run examples
    scalar_queries(&pool).await?;
    single_row_queries(&pool).await?;
    multiple_row_queries(&pool).await?;
    custom_struct_queries(&pool).await?;
    tuple_queries(&pool).await?;
    json_queries(&pool).await?;
    array_queries(&pool).await?;
    dynamic_queries(&pool).await?;
    
    pool.close().await;
    println!();
    Ok(())
}

async fn scalar_queries(pool: &PgPool) -> anyhow::Result<()> {
    println!("1. Scalar Queries");
    println!("------------------");
    
    // Query scalar value (single value)
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users")
        .fetch_one(pool)
        .await?;
    
    println!("Total users: {}", count);
    
    // Query nullable scalar
    let max_id: Option<i32> = sqlx::query_scalar("SELECT MAX(id) FROM users")
        .fetch_one(pool)
        .await?;
    
    println!("Max user ID: {:?}", max_id);
    
    // Query scalar with parameters
    let user_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM users WHERE email LIKE $1"
    )
    .bind("%@example.com")
    .fetch_one(pool)
    .await?;
    
    println!("Users with @example.com email: {}", user_count);
    
    // Query scalar with different types
    let user_name: String = sqlx::query_scalar(
        "SELECT username FROM users WHERE id = $1"
    )
    .bind(Uuid::new_v4()) // This will return NULL
    .fetch_optional(pool)
    .await?
    .unwrap_or_else(|| "Not found".to_string());
    
    println!("User name: {}", user_name);
    
    // Query boolean scalar
    let has_posts: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM posts WHERE is_published = $1)"
    )
    .bind(true)
    .fetch_one(pool)
    .await?;
    
    println!("Has published posts: {}", has_posts);
    
    println!();
    Ok(())
}

async fn single_row_queries(pool: &PgPool) -> anyhow::Result<()> {
    println!("2. Single Row Queries");
    println!("---------------------");
    
    // Query single row into existing struct
    let user: Option<User> = sqlx::query_as(
        "SELECT * FROM users WHERE username = $1"
    )
    .bind("admin")
    .fetch_optional(pool)
    .await?;
    
    match user {
        Some(u) => println!("Found user: {} ({})", u.username, u.email),
        None => println!("User not found"),
    }
    
    // Query single row into tuple
    let (username, email): (String, String) = sqlx::query_as(
        "SELECT username, email FROM users WHERE id = $1"
    )
    .bind(Uuid::new_v4())
    .fetch_optional(pool)
    .await?
    .unwrap_or_else(|| ("Unknown".to_string(), "unknown@example.com".to_string()));
    
    println!("User tuple: {} ({})", username, email);
    
    // Query single row with custom mapping
    let row: PgRow = sqlx::query(
        "SELECT id, username, email, created_at FROM users WHERE username = $1"
    )
    .bind("admin")
    .fetch_optional(pool)
    .await?
    .unwrap(); // This will panic if user not found
    
    let id: Uuid = row.get("id");
    let username: String = row.get("username");
    let email: String = row.get("email");
    let created_at: DateTime<Utc> = row.get("created_at");
    
    println!("Custom mapping: {} ({}) created at {}", username, email, created_at);
    
    println!();
    Ok(())
}

async fn multiple_row_queries(pool: &PgPool) -> anyhow::Result<()> {
    println!("3. Multiple Row Queries");
    println!("-----------------------");
    
    // Query multiple rows into Vec
    let users: Vec<User> = sqlx::query_as("SELECT * FROM users ORDER BY created_at DESC LIMIT 5")
        .fetch_all(pool)
        .await?;
    
    println!("Recent users:");
    for user in users {
        println!("  - {} ({})", user.username, user.email);
    }
    
    // Stream multiple rows
    println!("Streaming users:");
    let mut stream = sqlx::query_as::<_, User>("SELECT * FROM users ORDER BY username")
        .fetch(pool);
    
    let mut count = 0;
    while let Some(user) = stream.try_next().await? {
        if count < 3 {
            println!("  - {} ({})", user.username, user.email);
        }
        count += 1;
    }
    
    println!("Total users streamed: {}", count);
    
    // Query multiple rows into tuples
    let user_posts: Vec<(String, String)> = sqlx::query_as(
        "SELECT u.username, p.title FROM users u JOIN posts p ON u.id = p.author_id LIMIT 5"
    )
    .fetch_all(pool)
    .await?;
    
    println!("User posts:");
    for (username, title) in user_posts {
        println!("  - {} wrote: {}", username, title);
    }
    
    println!();
    Ok(())
}

async fn custom_struct_queries(pool: &PgPool) -> anyhow::Result<()> {
    println!("4. Custom Struct Queries");
    println!("------------------------");
    
    // Define custom query result structs
    #[derive(Debug, FromRow)]
    struct UserPostCount {
        username: String,
        post_count: i64,
    }
    
    #[derive(Debug, FromRow)]
    struct PostSummary {
        id: Uuid,
        title: String,
        author_name: String,
        comment_count: i64,
    }
    
    #[derive(Debug, FromRow)]
    struct UserStats {
        user_id: Uuid,
        username: String,
        total_posts: i64,
        total_comments: i64,
        last_activity: Option<DateTime<Utc>>,
    }
    
    // Query into custom struct with column mapping
    let user_post_counts: Vec<UserPostCount> = sqlx::query_as(
        r#"
        SELECT u.username, COUNT(p.id) as post_count
        FROM users u
        LEFT JOIN posts p ON u.id = p.author_id
        GROUP BY u.username
        ORDER BY post_count DESC
        "#
    )
    .fetch_all(pool)
    .await?;
    
    println!("User post counts:");
    for upc in user_post_counts {
        println!("  - {}: {} posts", upc.username, upc.post_count);
    }
    
    // Query with joins into custom struct
    let post_summaries: Vec<PostSummary> = sqlx::query_as(
        r#"
        SELECT p.id, p.title, u.username as author_name, COUNT(c.id) as comment_count
        FROM posts p
        JOIN users u ON p.author_id = u.id
        LEFT JOIN comments c ON p.id = c.post_id
        WHERE p.is_published = true
        GROUP BY p.id, p.title, u.username
        ORDER BY p.created_at DESC
        LIMIT 5
        "#
    )
    .fetch_all(pool)
    .await?;
    
    println!("Post summaries:");
    for ps in post_summaries {
        println!("  - {} by {} ({} comments)", ps.title, ps.author_name, ps.comment_count);
    }
    
    // Complex query with subqueries
    let user_stats: Vec<UserStats> = sqlx::query_as(
        r#"
        SELECT 
            u.id as user_id,
            u.username,
            (SELECT COUNT(*) FROM posts WHERE author_id = u.id) as total_posts,
            (SELECT COUNT(*) FROM comments WHERE user_id = u.id) as total_comments,
            GREATEST(
                (SELECT MAX(created_at) FROM posts WHERE author_id = u.id),
                (SELECT MAX(created_at) FROM comments WHERE user_id = u.id)
            ) as last_activity
        FROM users u
        ORDER BY last_activity DESC NULLS LAST
        LIMIT 5
        "#
    )
    .fetch_all(pool)
    .await?;
    
    println!("User statistics:");
    for stats in user_stats {
        println!("  - {}: {} posts, {} comments, last activity: {:?}", 
                stats.username, 
                stats.total_posts, 
                stats.total_comments, 
                stats.last_activity);
    }
    
    println!();
    Ok(())
}

async fn tuple_queries(pool: &PgPool) -> anyhow::Result<()> {
    println!("5. Tuple Queries");
    println!("-----------------");
    
    // Query into tuples of different types
    let user_details: Vec<(Uuid, String, String, DateTime<Utc>)> = sqlx::query_as(
        "SELECT id, username, email, created_at FROM users ORDER BY created_at DESC LIMIT 3"
    )
    .fetch_all(pool)
    .await?;
    
    println!("User details as tuples:");
    for (id, username, email, created_at) in user_details {
        println!("  - {} ({}): {} created at {}", username, id, email, created_at);
    }
    
    // Query into nested tuples
    let post_stats: Vec<((String, String), (i64, i64))> = sqlx::query_as(
        r#"
        SELECT 
            (u.username, u.email) as user_info,
            (COUNT(p.id), COUNT(c.id)) as post_comment_counts
        FROM users u
        LEFT JOIN posts p ON u.id = p.author_id
        LEFT JOIN comments c ON p.id = c.post_id
        GROUP BY u.username, u.email
        ORDER BY COUNT(p.id) DESC
        LIMIT 3
        "#
    )
    .fetch_all(pool)
    .await?;
    
    println!("Post statistics as nested tuples:");
    for ((username, email), (post_count, comment_count)) in post_stats {
        println!("  - {} ({}): {} posts, {} comments", username, email, post_count, comment_count);
    }
    
    // Query with computed values
    let user_metrics: Vec<(String, f64, i64)> = sqlx::query_as(
        r#"
        SELECT 
            u.username,
            COALESCE(AVG(LENGTH(p.content)), 0) as avg_post_length,
            COUNT(p.id) as post_count
        FROM users u
        LEFT JOIN posts p ON u.id = p.author_id
        WHERE p.is_published = true
        GROUP BY u.username
        HAVING COUNT(p.id) > 0
        ORDER BY avg_post_length DESC
        "#
    )
    .fetch_all(pool)
    .await?;
    
    println!("User metrics:");
    for (username, avg_length, post_count) in user_metrics {
        println!("  - {}: {:.1} avg chars, {} posts", username, avg_length, post_count);
    }
    
    println!();
    Ok(())
}

async fn json_queries(pool: &PgPool) -> anyhow::Result<()> {
    println!("6. JSON Queries");
    println!("----------------");
    
    // Define structs for JSON serialization
    #[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
    struct UserProfile {
        id: Uuid,
        username: String,
        metadata: serde_json::Value,
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct UserMetadata {
        bio: Option<String>,
        interests: Vec<String>,
        settings: UserSettings,
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct UserSettings {
        theme: String,
        notifications: bool,
        privacy: String,
    }
    
    // Create a table with JSON column
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS user_profiles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            username VARCHAR(50) NOT NULL UNIQUE,
            metadata JSONB NOT NULL DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(pool)
    .await?;
    
    // Insert sample data with JSON
    let metadata = UserMetadata {
        bio: Some("Software developer interested in Rust".to_string()),
        interests: vec!["Rust".to_string(), "Databases".to_string(), "Web Development".to_string()],
        settings: UserSettings {
            theme: "dark".to_string(),
            notifications: true,
            privacy: "public".to_string(),
        },
    };
    
    let metadata_json = serde_json::to_value(metadata)?;
    
    sqlx::query(r#"
        INSERT INTO user_profiles (username, metadata)
        VALUES ($1, $2)
        ON CONFLICT (username) DO UPDATE SET
        metadata = EXCLUDED.metadata
    "#)
    .bind("json_user")
    .bind(&metadata_json)
    .execute(pool)
    .await?;
    
    // Query JSON data
    let profiles: Vec<UserProfile> = sqlx::query_as(
        "SELECT id, username, metadata FROM user_profiles"
    )
    .fetch_all(pool)
    .await?;
    
    println!("User profiles with JSON metadata:");
    for profile in profiles {
        println!("  - {}: {}", profile.username, profile.metadata);
        
        // Parse and access JSON fields
        if let Ok(metadata) = serde_json::from_value::<UserMetadata>(profile.metadata) {
            println!("    Bio: {:?}", metadata.bio);
            println!("    Interests: {:?}", metadata.interests);
            println!("    Theme: {}", metadata.settings.theme);
        }
    }
    
    // Query specific JSON fields
    let themes: Vec<(String, String)> = sqlx::query_as(
        "SELECT username, metadata->>'settings'->>'theme' as theme FROM user_profiles"
    )
    .fetch_all(pool)
    .await?;
    
    println!("User themes:");
    for (username, theme) in themes {
        println!("  - {}: {}", username, theme);
    }
    
    // Query with JSON filtering
    let dark_theme_users: Vec<String> = sqlx::query_scalar(
        "SELECT username FROM user_profiles WHERE metadata->>'settings'->>'theme' = $1"
    )
    .bind("dark")
    .fetch_all(pool)
    .await?;
    
    println!("Dark theme users: {:?}", dark_theme_users);
    
    println!();
    Ok(())
}

async fn array_queries(pool: &PgPool) -> anyhow::Result<()> {
    println!("7. Array Queries");
    println!("-----------------");
    
    // Create a table with array columns
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS articles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR(255) NOT NULL,
            tags TEXT[] NOT NULL,
            categories TEXT[],
            author_ids UUID[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(pool)
    .await?;
    
    // Insert sample data with arrays
    sqlx::query(r#"
        INSERT INTO articles (title, tags, categories, author_ids)
        VALUES 
            ($1, $2, $3, $4),
            ($5, $6, $7, $8)
    "#)
    .bind("Introduction to Rust")
    .bind(&["rust", "programming", "tutorial"])
    .bind(&["technology", "education"])
    .bind(&[Uuid::new_v4(), Uuid::new_v4()])
    .bind("Advanced SQL Techniques")
    .bind(&["sql", "database", "advanced"])
    .bind(&["technology", "database"])
    .bind(&[Uuid::new_v4()])
    .execute(pool)
    .await?;
    
    // Query array data
    #[derive(Debug, FromRow)]
    struct Article {
        id: Uuid,
        title: String,
        tags: Vec<String>,
        categories: Option<Vec<String>>,
    }
    
    let articles: Vec<Article> = sqlx::query_as(
        "SELECT id, title, tags, categories FROM articles"
    )
    .fetch_all(pool)
    .await?;
    
    println!("Articles with tags:");
    for article in articles {
        println!("  - {}: {:?}", article.title, article.tags);
        if let Some(categories) = article.categories {
            println!("    Categories: {:?}", categories);
        }
    }
    
    // Query array elements
    let rust_tags: Vec<String> = sqlx::query_scalar(
        "SELECT unnest(tags) FROM articles WHERE $1 = ANY(tags)"
    )
    .bind("rust")
    .fetch_all(pool)
    .await?;
    
    println!("Rust-related tags: {:?}", rust_tags);
    
    // Query with array containment
    let tech_articles: Vec<String> = sqlx::query_scalar(
        "SELECT title FROM articles WHERE $1 = ANY(categories)"
    )
    .bind("technology")
    .fetch_all(pool)
    .await?;
    
    println!("Technology articles: {:?}", tech_articles);
    
    // Query array aggregation
    let all_tags: Vec<String> = sqlx::query_scalar(
        "SELECT DISTINCT unnest(tags) FROM articles ORDER BY unnest"
    )
    .fetch_all(pool)
    .await?;
    
    println!("All unique tags: {:?}", all_tags);
    
    println!();
    Ok(())
}

async fn dynamic_queries(pool: &PgPool) -> anyhow::Result<()> {
    println!("8. Dynamic Queries");
    println!("-------------------");
    
    // Build dynamic queries based on conditions
    let mut query = String::from("SELECT id, username, email FROM users WHERE 1=1");
    let mut bind_values: Vec<Box<dyn sqlx::Encode<'_, sqlx::Postgres> + sqlx::Type<sqlx::Postgres> + Send>> = Vec::new();
    
    // Conditionally add filters
    let include_email_filter = true;
    let include_username_filter = true;
    
    if include_email_filter {
        query.push_str(" AND email LIKE $1");
        bind_values.push(Box::new("%@example.com"));
    }
    
    if include_username_filter {
        let param_num = if include_email_filter { 2 } else { 1 };
        query.push_str(&format!(" AND username LIKE ${}", param_num));
        bind_values.push(Box::new("admin%"));
    }
    
    query.push_str(" ORDER BY username LIMIT 5");
    
    println!("Dynamic query: {}", query);
    
    // Execute the dynamic query (simplified for this example)
    let users: Vec<(Uuid, String, String)> = if include_email_filter && include_username_filter {
        sqlx::query_as(&query)
            .bind("%@example.com")
            .bind("admin%")
            .fetch_all(pool)
            .await?
    } else if include_email_filter {
        sqlx::query_as(&query)
            .bind("%@example.com")
            .fetch_all(pool)
            .await?
    } else if include_username_filter {
        sqlx::query_as(&query)
            .bind("admin%")
            .fetch_all(pool)
            .await?
    } else {
        sqlx::query_as(&query)
            .fetch_all(pool)
            .await?
    };
    
    println!("Dynamic query results:");
    for (id, username, email) in users {
        println!("  - {} ({}): {}", username, id, email);
    }
    
    // Dynamic column selection
    let columns = vec!["id", "username", "email"];
    let select_clause = columns.join(", ");
    let dynamic_query = format!("SELECT {} FROM users LIMIT 3", select_clause);
    
    println!("Dynamic column query: {}", dynamic_query);
    
    let rows: Vec<PgRow> = sqlx::query(&dynamic_query)
        .fetch_all(pool)
        .await?;
    
    println!("Dynamic column results:");
    for row in rows {
        let id: Uuid = row.get("id");
        let username: String = row.get("username");
        let email: String = row.get("email");
        println!("  - {} ({}): {}", username, id, email);
    }
    
    // Dynamic sorting
    let sort_column = "created_at";
    let sort_direction = "DESC";
    let sort_query = format!(
        "SELECT username, created_at FROM users ORDER BY {} {} LIMIT 3",
        sort_column, sort_direction
    );
    
    println!("Dynamic sort query: {}", sort_query);
    
    let sorted_users: Vec<(String, DateTime<Utc>)> = sqlx::query_as(&sort_query)
        .fetch_all(pool)
        .await?;
    
    println!("Sorted users:");
    for (username, created_at) in sorted_users {
        println!("  - {} created at {}", username, created_at);
    }
    
    println!();
    Ok(())
}