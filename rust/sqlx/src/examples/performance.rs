use crate::models::{User, Post, NewUser, NewPost};
use sqlx::{PgPool, postgres::PgPoolOptions, Row};
use uuid::Uuid;
use std::time::{Duration, Instant};
use tokio::task::JoinSet;

pub async fn run() -> anyhow::Result<()> {
    println!("=== Performance Examples ===");
    println!();
    
    // Get database URL from environment or use default
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:password@localhost/sqlx_examples".to_string());
    
    let pool = PgPool::connect(&database_url).await?;
    
    // Run examples
    query_performance(&pool).await?;
    batch_operations(&pool).await?;
    connection_pool_performance(&database_url).await?;
    prepared_statements(&pool).await?;
    indexing_strategies(&pool).await?;
    query_optimization(&pool).await?;
    async_performance(&pool).await?;
    
    pool.close().await;
    println!();
    Ok(())
}

async fn query_performance(pool: &PgPool) -> anyhow::Result<()> {
    println!("1. Query Performance");
    println!("---------------------");
    
    // Example 1: Simple query vs. parameterized query
    println!("Example 1: Simple query vs. parameterized query");
    
    // Direct query (not recommended for production)
    let start = Instant::now();
    let _users: Vec<User> = sqlx::query_as("SELECT * FROM users ORDER BY created_at DESC LIMIT 10")
        .fetch_all(pool)
        .await?;
    let direct_time = start.elapsed();
    
    // Parameterized query
    let start = Instant::now();
    let _users: Vec<User> = sqlx::query_as("SELECT * FROM users ORDER BY created_at DESC LIMIT $1")
        .bind(10i32)
        .fetch_all(pool)
        .await?;
    let param_time = start.elapsed();
    
    println!("  Direct query time: {:?}", direct_time);
    println!("  Parameterized query time: {:?}", param_time);
    
    // Example 2: Fetch all vs. stream
    println!("Example 2: Fetch all vs. stream");
    
    // Fetch all
    let start = Instant::now();
    let _users: Vec<User> = sqlx::query_as("SELECT * FROM users")
        .fetch_all(pool)
        .await?;
    let fetch_all_time = start.elapsed();
    
    // Stream
    let start = Instant::now();
    let mut stream = sqlx::query_as::<_, User>("SELECT * FROM users")
        .fetch(pool);
    let mut count = 0;
    while let Some(_user) = stream.try_next().await? {
        count += 1;
    }
    let stream_time = start.elapsed();
    
    println!("  Fetch all time: {:?} ({} users)", fetch_all_time, count);
    println!("  Stream time: {:?}", stream_time);
    
    // Example 3: Select specific columns vs. SELECT *
    println!("Example 3: Select specific columns vs. SELECT *");
    
    // SELECT *
    let start = Instant::now();
    let _users: Vec<User> = sqlx::query_as("SELECT * FROM users LIMIT 100")
        .fetch_all(pool)
        .await?;
    let select_all_time = start.elapsed();
    
    // Select specific columns
    #[derive(Debug, sqlx::FromRow)]
    struct UserSummary {
        id: Uuid,
        username: String,
        email: String,
    }
    
    let start = Instant::now();
    let _users: Vec<UserSummary> = sqlx::query_as("SELECT id, username, email FROM users LIMIT 100")
        .fetch_all(pool)
        .await?;
    let select_specific_time = start.elapsed();
    
    println!("  SELECT * time: {:?}", select_all_time);
    println!("  SELECT specific columns time: {:?}", select_specific_time);
    
    println!();
    Ok(())
}

async fn batch_operations(pool: &PgPool) -> anyhow::Result<()> {
    println!("2. Batch Operations");
    println!("--------------------");
    
    // Example 1: Individual inserts vs. batch insert
    println!("Example 1: Individual inserts vs. batch insert");
    
    // Individual inserts
    let start = Instant::now();
    for i in 0..10 {
        let user_id = Uuid::new_v4();
        let username = format!("batch_user_{}", i);
        let email = format!("batch{}@example.com", i);
        
        sqlx::query(
            "INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4)"
        )
        .bind(user_id)
        .bind(&username)
        .bind(&email)
        .bind("password123")
        .execute(pool)
        .await?;
    }
    let individual_time = start.elapsed();
    
    // Batch insert
    let start = Instant::now();
    let mut tx = pool.begin().await?;
    
    for i in 10..20 {
        let user_id = Uuid::new_v4();
        let username = format!("batch_user_{}", i);
        let email = format!("batch{}@example.com", i);
        
        sqlx::query(
            "INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4)"
        )
        .bind(user_id)
        .bind(&username)
        .bind(&email)
        .bind("password123")
        .execute(&mut tx)
        .await?;
    }
    
    tx.commit().await?;
    let batch_time = start.elapsed();
    
    println!("  Individual inserts time: {:?}", individual_time);
    println!("  Batch insert time: {:?}", batch_time);
    
    // Example 2: COPY command for bulk inserts
    println!("Example 2: COPY command for bulk inserts");
    
    // Create a temporary table for testing
    sqlx::query(
        "CREATE TEMPORARY TABLE temp_users (id UUID, username VARCHAR(50), email VARCHAR(100))"
    )
    .execute(pool)
    .await?;
    
    // Generate test data
    let mut users_data = Vec::new();
    for i in 0..100 {
        let user_id = Uuid::new_v4();
        let username = format!("copy_user_{}", i);
        let email = format!("copy{}@example.com", i);
        users_data.push((user_id, username, email));
    }
    
    // Insert using individual queries
    let start = Instant::now();
    for (id, username, email) in &users_data {
        sqlx::query("INSERT INTO temp_users (id, username, email) VALUES ($1, $2, $3)")
            .bind(id)
            .bind(username)
            .bind(email)
            .execute(pool)
            .await?;
    }
    let individual_insert_time = start.elapsed();
    
    // Clear the table
    sqlx::query("DELETE FROM temp_users").execute(pool).await?;
    
    // Simulate COPY (simplified for this example)
    let start = Instant::now();
    let mut tx = pool.begin().await?;
    
    // Use UNNEST for batch insert (PostgreSQL specific)
    let ids: Vec<Uuid> = users_data.iter().map(|(id, _, _)| *id).collect();
    let usernames: Vec<String> = users_data.iter().map(|(_, username, _)| username.clone()).collect();
    let emails: Vec<String> = users_data.iter().map(|(_, _, email)| email.clone()).collect();
    
    sqlx::query(
        "INSERT INTO temp_users (id, username, email) SELECT * FROM UNNEST($1::uuid[], $2::text[], $3::text[])"
    )
    .bind(&ids)
    .bind(&usernames)
    .bind(&emails)
    .execute(&mut tx)
    .await?;
    
    tx.commit().await?;
    let copy_time = start.elapsed();
    
    println!("  Individual insert time (100 records): {:?}", individual_insert_time);
    println!("  Batch insert time (100 records): {:?}", copy_time);
    
    // Verify results
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM temp_users")
        .fetch_one(pool)
        .await?;
    println!("  Records inserted: {}", count);
    
    println!();
    Ok(())
}

async fn connection_pool_performance(database_url: &str) -> anyhow::Result<()> {
    println!("3. Connection Pool Performance");
    println!("-------------------------------");
    
    // Test different pool sizes
    let pool_sizes = vec![1, 5, 10, 20];
    let concurrent_queries = 50;
    
    for pool_size in pool_sizes {
        println!("Testing pool size: {}", pool_size);
        
        let pool = PgPoolOptions::new()
            .max_connections(pool_size)
            .connect(database_url)
            .await?;
        
        // Run concurrent queries
        let start = Instant::now();
        let mut tasks = JoinSet::new();
        
        for i in 0..concurrent_queries {
            let pool = pool.clone();
            tasks.spawn(async move {
                let _result: i64 = sqlx::query_scalar("SELECT $1")
                    .bind(i)
                    .fetch_one(&pool)
                    .await.unwrap();
            });
        }
        
        while let Some(_) = tasks.join_next().await {}
        
        let total_time = start.elapsed();
        let queries_per_second = concurrent_queries as f64 / total_time.as_secs_f64();
        
        println!("  Total time: {:?}", total_time);
        println!("  Queries per second: {:.2}", queries_per_second);
        println!("  Pool size: {}", pool.size());
        println!("  Idle connections: {}", pool.num_idle());
        
        pool.close().await;
        println!();
    }
    
    // Test pool acquisition timeout
    println!("Testing pool acquisition timeout");
    
    let pool = PgPoolOptions::new()
        .max_connections(2)
        .acquire_timeout(Duration::from_millis(100))
        .connect(database_url)
        .await?;
    
    let start = Instant::now();
    let mut tasks = JoinSet::new();
    
    // Try to acquire more connections than available
    for i in 0..10 {
        let pool = pool.clone();
        tasks.spawn(async move {
            match tokio::time::timeout(
                Duration::from_millis(200),
                pool.acquire()
            ).await {
                Ok(Ok(_conn)) => println!("  Task {} acquired connection", i),
                Ok(Err(e)) => println!("  Task {} failed: {}", i, e),
                Err(_) => println!("  Task {} timed out", i),
            }
        });
    }
    
    while let Some(_) = tasks.join_next().await {}
    
    let timeout_time = start.elapsed();
    println!("  Timeout test time: {:?}", timeout_time);
    
    pool.close().await;
    println!();
    Ok(())
}

async fn prepared_statements(pool: &PgPool) -> anyhow::Result<()> {
    println!("4. Prepared Statements");
    println!("-----------------------");
    
    // Example 1: Prepared statement vs. regular query
    println!("Example 1: Prepared statement vs. regular query");
    
    // Regular query
    let start = Instant::now();
    for i in 0..100 {
        let _result: Option<User> = sqlx::query_as("SELECT * FROM users WHERE id = $1")
            .bind(Uuid::new_v4())
            .fetch_optional(pool)
            .await?;
    }
    let regular_time = start.elapsed();
    
    // Prepared statement (SQLx automatically caches prepared statements)
    let start = Instant::now();
    for i in 0..100 {
        let _result: Option<User> = sqlx::query_as("SELECT * FROM users WHERE id = $1")
            .bind(Uuid::new_v4())
            .fetch_optional(pool)
            .await?;
    }
    let prepared_time = start.elapsed();
    
    println!("  Regular query time (100 executions): {:?}", regular_time);
    println!("  Prepared statement time (100 executions): {:?}", prepared_time);
    
    // Example 2: Complex query with prepared statement
    println!("Example 2: Complex query with prepared statement");
    
    // Complex query
    let complex_query = r#"
        SELECT u.id, u.username, COUNT(p.id) as post_count
        FROM users u
        LEFT JOIN posts p ON u.id = p.author_id
        WHERE u.created_at > $1
        GROUP BY u.id, u.username
        HAVING COUNT(p.id) >= $2
        ORDER BY post_count DESC
        LIMIT $3
    "#;
    
    let threshold_date = chrono::Utc::now() - chrono::Duration::days(30);
    
    // First execution (prepare)
    let start = Instant::now();
    let _results: Vec<(Uuid, String, i64)> = sqlx::query_as(complex_query)
        .bind(threshold_date)
        .bind(0i32)
        .bind(10i32)
        .fetch_all(pool)
        .await?;
    let first_time = start.elapsed();
    
    // Subsequent executions (already prepared)
    let start = Instant::now();
    for _ in 0..10 {
        let _results: Vec<(Uuid, String, i64)> = sqlx::query_as(complex_query)
            .bind(threshold_date)
            .bind(0i32)
            .bind(10i32)
            .fetch_all(pool)
            .await?;
    }
    let subsequent_time = start.elapsed();
    
    println!("  First execution time: {:?}", first_time);
    println!("  Subsequent executions time (10 executions): {:?}", subsequent_time);
    
    println!();
    Ok(())
}

async fn indexing_strategies(pool: &PgPool) -> anyhow::Result<()> {
    println!("5. Indexing Strategies");
    println!("-----------------------");
    
    // Create a test table for indexing
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS performance_test (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(100) NOT NULL,
            category VARCHAR(50) NOT NULL,
            value INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(pool)
    .await?;
    
    // Insert test data
    let start = Instant::now();
    let mut tx = pool.begin().await?;
    
    for i in 0..1000 {
        let category = match i % 10 {
            0 => "A",
            1 => "B",
            2 => "C",
            3 => "D",
            4 => "E",
            5 => "F",
            6 => "G",
            7 => "H",
            8 => "I",
            _ => "J",
        };
        
        sqlx::query(
            "INSERT INTO performance_test (name, category, value) VALUES ($1, $2, $3)"
        )
        .bind(format!("item_{}", i))
        .bind(category)
        .bind(i)
        .execute(&mut tx)
        .await?;
    }
    
    tx.commit().await?;
    let insert_time = start.elapsed();
    println!("  Insert time (1000 records): {:?}", insert_time);
    
    // Query without index
    let start = Instant::now();
    let _results: Vec<(String, i32)> = sqlx::query_as(
        "SELECT name, value FROM performance_test WHERE category = $1"
    )
    .bind("A")
    .fetch_all(pool)
    .await?;
    let no_index_time = start.elapsed();
    println!("  Query time without index: {:?}", no_index_time);
    
    // Create index
    let start = Instant::now();
    sqlx::query("CREATE INDEX idx_performance_test_category ON performance_test(category)")
        .execute(pool)
        .await?;
    let index_creation_time = start.elapsed();
    println!("  Index creation time: {:?}", index_creation_time);
    
    // Query with index
    let start = Instant::now();
    let _results: Vec<(String, i32)> = sqlx::query_as(
        "SELECT name, value FROM performance_test WHERE category = $1"
    )
    .bind("A")
    .fetch_all(pool)
    .await?;
    let with_index_time = start.elapsed();
    println!("  Query time with index: {:?}", with_index_time);
    
    // Composite index
    let start = Instant::now();
    sqlx::query("CREATE INDEX idx_performance_test_category_value ON performance_test(category, value)")
        .execute(pool)
        .await?;
    let composite_index_time = start.elapsed();
    println!("  Composite index creation time: {:?}", composite_index_time);
    
    // Query with composite index
    let start = Instant::now();
    let _results: Vec<(String, i32)> = sqlx::query_as(
        "SELECT name, value FROM performance_test WHERE category = $1 AND value > $2"
    )
    .bind("A")
    .bind(500)
    .fetch_all(pool)
    .await?;
    let composite_query_time = start.elapsed();
    println!("  Query time with composite index: {:?}", composite_query_time);
    
    // Explain query plan
    let explain_result: Vec<String> = sqlx::query_scalar(
        "EXPLAIN SELECT name, value FROM performance_test WHERE category = $1 AND value > $2"
    )
    .bind("A")
    .bind(500)
    .fetch_all(pool)
    .await?;
    
    println!("  Query plan:");
    for line in explain_result {
        println!("    {}", line);
    }
    
    println!();
    Ok(())
}

async fn query_optimization(pool: &PgPool) -> anyhow::Result<()> {
    println!("6. Query Optimization");
    println!("----------------------");
    
    // Example 1: N+1 query problem
    println!("Example 1: N+1 query problem");
    
    // N+1 approach (inefficient)
    let start = Instant::now();
    let users: Vec<User> = sqlx::query_as("SELECT * FROM users LIMIT 10")
        .fetch_all(pool)
        .await?;
    
    let mut total_posts = 0;
    for user in users {
        let post_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM posts WHERE author_id = $1")
            .bind(user.id)
            .fetch_one(pool)
            .await?;
        total_posts += post_count;
    }
    let n_plus_one_time = start.elapsed();
    println!("  N+1 query time: {:?}", n_plus_one_time);
    
    // Optimized approach with JOIN
    let start = Instant::now();
    let results: Vec<(Uuid, String, i64)> = sqlx::query_as(
        r#"
        SELECT u.id, u.username, COUNT(p.id) as post_count
        FROM users u
        LEFT JOIN posts p ON u.id = p.author_id
        GROUP BY u.id, u.username
        LIMIT 10
        "#
    )
    .fetch_all(pool)
    .await?;
    
    let optimized_total_posts: i64 = results.iter().map(|(_, _, count)| *count).sum();
    let optimized_time = start.elapsed();
    println!("  Optimized query time: {:?}", optimized_time);
    println!("  Total posts (N+1): {}", total_posts);
    println!("  Total posts (optimized): {}", optimized_total_posts);
    
    // Example 2: Subquery vs. JOIN
    println!("Example 2: Subquery vs. JOIN");
    
    // Subquery approach
    let start = Instant::now();
    let _results: Vec<(String, String)> = sqlx::query_as(
        r#"
        SELECT u.username, (
            SELECT p.title FROM posts p 
            WHERE p.author_id = u.id AND p.is_published = true 
            ORDER BY p.created_at DESC LIMIT 1
        ) as latest_post_title
        FROM users u
        LIMIT 10
        "#
    )
    .fetch_all(pool)
    .await?;
    let subquery_time = start.elapsed();
    
    // JOIN approach
    let start = Instant::now();
    let _results: Vec<(String, String)> = sqlx::query_as(
        r#"
        SELECT DISTINCT ON (u.id) u.username, p.title
        FROM users u
        LEFT JOIN posts p ON u.id = p.author_id AND p.is_published = true
        ORDER BY u.id, p.created_at DESC
        LIMIT 10
        "#
    )
    .fetch_all(pool)
    .await?;
    let join_time = start.elapsed();
    
    println!("  Subquery time: {:?}", subquery_time);
    println!("  JOIN time: {:?}", join_time);
    
    // Example 3: Pagination strategies
    println!("Example 3: Pagination strategies");
    
    // OFFSET/LIMIT pagination
    let start = Instant::now();
    let _page1: Vec<User> = sqlx::query_as("SELECT * FROM users ORDER BY created_at DESC LIMIT 10 OFFSET 0")
        .fetch_all(pool)
        .await?;
    let offset_time = start.elapsed();
    
    // Cursor-based pagination
    let start = Instant::now();
    let _page1: Vec<User> = sqlx::query_as(
        "SELECT * FROM users WHERE created_at < $1 ORDER BY created_at DESC LIMIT 10"
    )
    .bind(chrono::Utc::now())
    .fetch_all(pool)
    .await?;
    let cursor_time = start.elapsed();
    
    println!("  OFFSET pagination time: {:?}", offset_time);
    println!("  Cursor pagination time: {:?}", cursor_time);
    
    println!();
    Ok(())
}

async fn async_performance(pool: &PgPool) -> anyhow::Result<()> {
    println!("7. Async Performance");
    println!("---------------------");
    
    // Example 1: Sequential vs. concurrent queries
    println!("Example 1: Sequential vs. concurrent queries");
    
    // Sequential queries
    let start = Instant::now();
    let user_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users")
        .fetch_one(pool)
        .await?;
    
    let post_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM posts")
        .fetch_one(pool)
        .await?;
    
    let comment_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM comments")
        .fetch_one(pool)
        .await?;
    let sequential_time = start.elapsed();
    
    // Concurrent queries
    let start = Instant::now();
    let (user_count_c, post_count_c, comment_count_c) = tokio::try_join!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM users").fetch_one(pool),
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM posts").fetch_one(pool),
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM comments").fetch_one(pool)
    )?;
    let concurrent_time = start.elapsed();
    
    println!("  Sequential queries time: {:?}", sequential_time);
    println!("  Concurrent queries time: {:?}", concurrent_time);
    println!("  Results: {} users, {} posts, {} comments", 
             user_count, post_count, comment_count);
    println!("  Concurrent results: {} users, {} posts, {} comments", 
             user_count_c, post_count_c, comment_count_c);
    
    // Example 2: Batch processing with streams
    println!("Example 2: Batch processing with streams");
    
    // Process all users in batches
    let start = Instant::now();
    let mut user_stream = sqlx::query_as::<_, User>("SELECT * FROM users ORDER BY id")
        .fetch(pool);
    
    let mut batch_count = 0;
    let mut batch_size = 0;
    const MAX_BATCH_SIZE: usize = 10;
    
    while let Some(user) = user_stream.try_next().await? {
        batch_size += 1;
        
        if batch_size >= MAX_BATCH_SIZE {
            // Process batch
            batch_count += 1;
            batch_size = 0;
        }
    }
    
    // Process remaining items
    if batch_size > 0 {
        batch_count += 1;
    }
    
    let stream_time = start.elapsed();
    println!("  Stream processing time: {:?}", stream_time);
    println!("  Number of batches: {}", batch_count);
    
    // Example 3: Connection reuse with async
    println!("Example 3: Connection reuse with async");
    
    // Without explicit connection reuse
    let start = Instant::now();
    for i in 0..10 {
        let _result: i64 = sqlx::query_scalar("SELECT $1")
            .bind(i)
            .fetch_one(pool)
            .await?;
    }
    let no_reuse_time = start.elapsed();
    
    // With explicit connection reuse
    let start = Instant::now();
    let conn = pool.acquire().await?;
    
    for i in 0..10 {
        let _result: i64 = sqlx::query_scalar("SELECT $1")
            .bind(i)
            .fetch_one(&*conn)
            .await?;
    }
    
    drop(conn); // Return connection to pool
    let reuse_time = start.elapsed();
    
    println!("  Without connection reuse time: {:?}", no_reuse_time);
    println!("  With connection reuse time: {:?}", reuse_time);
    
    println!();
    Ok(())
}