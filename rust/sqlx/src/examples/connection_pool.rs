use crate::models::{User, NewUser, Post, NewPost};
use sqlx::{PgPool, postgres::PgPoolOptions};
use std::time::Duration;
use uuid::Uuid;

pub async fn run() -> anyhow::Result<()> {
    println!("=== Connection Pool Examples ===");
    println!();
    
    // Get database URL from environment or use default
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:password@localhost/sqlx_examples".to_string());
    
    // Run examples
    basic_pool_setup(&database_url).await?;
    pool_configuration(&database_url).await?;
    pool_usage_patterns(&database_url).await?;
    pool_health_check(&database_url).await?;
    pool_performance(&database_url).await?;
    pool_with_timeout(&database_url).await?;
    
    println!();
    Ok(())
}

async fn basic_pool_setup(database_url: &str) -> anyhow::Result<()> {
    println!("1. Basic Pool Setup");
    println!("--------------------");
    
    // Create a basic connection pool
    let pool = PgPool::connect(database_url).await?;
    
    println!("Created basic connection pool");
    
    // Test the pool with a simple query
    let result: i64 = sqlx::query_scalar("SELECT 1")
        .fetch_one(&pool)
        .await?;
    
    println!("Test query result: {}", result);
    
    // Get pool information
    println!("Pool size: {}", pool.size());
    println!("Idle connections: {}", pool.num_idle());
    
    // Close the pool
    pool.close().await;
    println!("Pool closed");
    
    println!();
    Ok(())
}

async fn pool_configuration(database_url: &str) -> anyhow::Result<()> {
    println!("2. Pool Configuration");
    println!("----------------------");
    
    // Create a pool with custom configuration
    let pool = PgPoolOptions::new()
        .max_connections(10)
        .min_connections(2)
        .acquire_timeout(Duration::from_secs(30))
        .idle_timeout(Duration::from_secs(600))
        .max_lifetime(Duration::from_secs(1800))
        .test_before_acquire(true)
        .connect(database_url)
        .await?;
    
    println!("Created pool with custom configuration:");
    println!("  - Max connections: 10");
    println!("  - Min connections: 2");
    println!("  - Acquire timeout: 30s");
    println!("  - Idle timeout: 10m");
    println!("  - Max lifetime: 30m");
    println!("  - Test before acquire: true");
    
    // Test pool with multiple concurrent connections
    let mut handles = vec![];
    
    for i in 1..=5 {
        let pool = pool.clone();
        let handle = tokio::spawn(async move {
            let start = std::time::Instant::now();
            
            // Simulate some work
            let result: i64 = sqlx::query_scalar("SELECT $1")
                .bind(i)
                .fetch_one(&pool)
                .await.unwrap();
            
            let duration = start.elapsed();
            println!("Query {} completed in {:?}", result, duration);
            
            duration
        });
        
        handles.push(handle);
    }
    
    // Wait for all tasks to complete
    for handle in handles {
        handle.await?;
    }
    
    // Check pool status
    println!("Final pool size: {}", pool.size());
    println!("Final idle connections: {}", pool.num_idle());
    
    pool.close().await;
    println!();
    Ok(())
}

async fn pool_usage_patterns(database_url: &str) -> anyhow::Result<()> {
    println!("3. Pool Usage Patterns");
    println!("------------------------");
    
    let pool = PgPool::connect(database_url).await?;
    
    // Pattern 1: Direct pool usage
    println!("Pattern 1: Direct pool usage");
    let start = std::time::Instant::now();
    
    let user: User = sqlx::query_as(r#"
        INSERT INTO users (id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    "#)
    .bind(Uuid::new_v4())
    .bind("direct_user")
    .bind("direct@example.com")
    .bind("password123")
    .fetch_one(&pool)
    .await?;
    
    println!("  Created user: {} in {:?}", user.username, start.elapsed());
    
    // Pattern 2: Acquire connection explicitly
    println!("Pattern 2: Explicit connection acquisition");
    let start = std::time::Instant::now();
    
    let conn = pool.acquire().await?;
    let post: Post = sqlx::query_as(r#"
        INSERT INTO posts (id, title, content, author_id, is_published)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    "#)
    .bind(Uuid::new_v4())
    .bind("Explicit Connection Post")
    .bind("This post was created with an explicitly acquired connection")
    .bind(user.id)
    .bind(true)
    .fetch_one(&*conn)
    .await?;
    
    println!("  Created post: {} in {:?}", post.title, start.elapsed());
    // Connection is automatically returned to pool when dropped
    
    // Pattern 3: Connection with custom timeout
    println!("Pattern 3: Connection with custom timeout");
    let start = std::time::Instant::now();
    
    match tokio::time::timeout(Duration::from_secs(5), pool.acquire()).await {
        Ok(Ok(conn)) => {
            let result: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users")
                .fetch_one(&*conn)
                .await?;
            println!("  User count: {} in {:?}", result, start.elapsed());
        }
        Ok(Err(e)) => println!("  Error acquiring connection: {}", e),
        Err(_) => println!("  Timeout acquiring connection after 5s"),
    }
    
    // Pattern 4: Batch operations
    println!("Pattern 4: Batch operations");
    let start = std::time::Instant::now();
    
    let mut handles = vec![];
    for i in 1..=10 {
        let pool = pool.clone();
        let handle = tokio::spawn(async move {
            let user_id = Uuid::new_v4();
            let username = format!("batch_user_{}", i);
            let email = format!("batch{}@example.com", i);
            
            let _user: User = sqlx::query_as(r#"
                INSERT INTO users (id, username, email, password_hash)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            "#)
            .bind(user_id)
            .bind(&username)
            .bind(&email)
            .bind("password123")
            .fetch_one(&pool)
            .await.unwrap();
            
            username
        });
        
        handles.push(handle);
    }
    
    let mut created_users = vec![];
    for handle in handles {
        created_users.push(handle.await?);
    }
    
    println!("  Created {} users in {:?}", created_users.len(), start.elapsed());
    
    println!();
    Ok(())
}

async fn pool_health_check(database_url: &str) -> anyhow::Result<()> {
    println!("4. Pool Health Check");
    println!("---------------------");
    
    let pool = PgPool::connect(database_url).await?;
    
    // Check if pool is healthy
    let is_healthy = pool.is_closed() == false;
    println!("Pool healthy: {}", is_healthy);
    
    // Test connection health
    let start = std::time::Instant::now();
    match sqlx::query("SELECT 1").fetch_one(&pool).await {
        Ok(_) => println!("Connection health check passed in {:?}", start.elapsed()),
        Err(e) => println!("Connection health check failed: {}", e),
    }
    
    // Monitor pool metrics
    println!("Pool metrics:");
    println!("  - Total connections: {}", pool.size());
    println!("  - Idle connections: {}", pool.num_idle());
    println!("  - Active connections: {}", pool.size() - pool.num_idle());
    
    // Simulate load and monitor
    println!("Simulating load...");
    let mut handles = vec![];
    
    for _ in 0..20 {
        let pool = pool.clone();
        let handle = tokio::spawn(async move {
            let start = std::time::Instant::now();
            
            // Simulate a query that takes some time
            let _result: i64 = sqlx::query_scalar("SELECT pg_sleep(0.1), 1")
                .fetch_one(&pool)
                .await.unwrap();
            
            start.elapsed()
        });
        
        handles.push(handle);
    }
    
    let mut durations = vec![];
    for handle in handles {
        durations.push(handle.await?);
    }
    
    let avg_duration = durations.iter().sum::<Duration>() / durations.len() as u32;
    let min_duration = durations.iter().min().unwrap();
    let max_duration = durations.iter().max().unwrap();
    
    println!("Performance metrics:");
    println!("  - Average query time: {:?}", avg_duration);
    println!("  - Min query time: {:?}", min_duration);
    println!("  - Max query time: {:?}", max_duration);
    
    println!("Pool metrics after load:");
    println!("  - Total connections: {}", pool.size());
    println!("  - Idle connections: {}", pool.num_idle());
    
    pool.close().await;
    println!();
    Ok(())
}

async fn pool_performance(database_url: &str) -> anyhow::Result<()> {
    println!("5. Pool Performance");
    println!("-------------------");
    
    // Test different pool sizes
    let pool_sizes = vec![1, 5, 10, 20];
    
    for pool_size in pool_sizes {
        println!("Testing pool size: {}", pool_size);
        
        let pool = PgPoolOptions::new()
            .max_connections(pool_size)
            .connect(database_url)
            .await?;
        
        let start = std::time::Instant::now();
        let mut handles = vec![];
        
        // Run concurrent queries
        for i in 0..50 {
            let pool = pool.clone();
            let handle = tokio::spawn(async move {
                let query_start = std::time::Instant::now();
                
                let _result: i64 = sqlx::query_scalar("SELECT $1")
                    .bind(i)
                    .fetch_one(&pool)
                    .await.unwrap();
                
                query_start.elapsed()
            });
            
            handles.push(handle);
        }
        
        let mut durations = vec![];
        for handle in handles {
            durations.push(handle.await?);
        }
        
        let total_time = start.elapsed();
        let avg_query_time = durations.iter().sum::<Duration>() / durations.len() as u32;
        
        println!("  - Total time: {:?}", total_time);
        println!("  - Average query time: {:?}", avg_query_time);
        println!("  - Queries per second: {:.2}", 50.0 / total_time.as_secs_f64());
        
        pool.close().await;
        println!();
    }
    
    Ok(())
}

async fn pool_with_timeout(database_url: &str) -> anyhow::Result<()> {
    println!("6. Pool with Timeout");
    println!("----------------------");
    
    let pool = PgPoolOptions::new()
        .max_connections(2) // Small pool to trigger timeouts
        .acquire_timeout(Duration::from_secs(2))
        .connect(database_url)
        .await?;
    
    println!("Created pool with 2 max connections and 2s acquire timeout");
    
    // Test timeout behavior
    let mut handles = vec![];
    
    for i in 0..5 {
        let pool = pool.clone();
        let handle = tokio::spawn(async move {
            println!("Task {} starting", i);
            
            let start = std::time::Instant::now();
            
            match sqlx::query("SELECT pg_sleep(1), $1").bind(i).fetch_one(&pool).await {
                Ok(_) => {
                    println!("Task {} completed in {:?}", i, start.elapsed());
                    Ok(())
                }
                Err(e) => {
                    println!("Task {} failed: {}", i, e);
                    Err(e)
                }
            }
        });
        
        handles.push(handle);
    }
    
    for handle in handles {
        match handle.await {
            Ok(Ok(())) => {},
            Ok(Err(e)) => println!("Task failed: {}", e),
            Err(e) => println!("Task panicked: {}", e),
        }
    }
    
    pool.close().await;
    println!();
    Ok(())
}

// Example of connection pool monitoring
pub async fn pool_monitoring(database_url: &str) -> anyhow::Result<()> {
    println!("7. Pool Monitoring");
    println!("-------------------");
    
    let pool = PgPool::connect(database_url).await?;
    
    // Start monitoring task
    let pool_for_monitor = pool.clone();
    let monitor_handle = tokio::spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(1));
        
        for _ in 0..10 {
            interval.tick().await;
            
            let size = pool_for_monitor.size();
            let idle = pool_for_monitor.num_idle();
            let active = size - idle;
            
            println!("Pool status - Total: {}, Active: {}, Idle: {}", size, active, idle);
        }
    });
    
    // Generate some load
    let mut handles = vec![];
    for i in 0..20 {
        let pool = pool.clone();
        let handle = tokio::spawn(async move {
            // Simulate varying workloads
            let sleep_time = (i % 3) as u64;
            let _result: i64 = sqlx::query_scalar("SELECT pg_sleep($1), $2")
                .bind(sleep_time)
                .bind(i)
                .fetch_one(&pool)
                .await.unwrap();
            
            println!("Task {} completed (slept for {}s)", i, sleep_time);
        });
        
        handles.push(handle);
    }
    
    // Wait for all tasks to complete
    for handle in handles {
        handle.await?;
    }
    
    // Wait for monitoring to finish
    monitor_handle.await?;
    
    pool.close().await;
    println!();
    Ok(())
}

// Example of graceful shutdown
pub async fn graceful_shutdown(database_url: &str) -> anyhow::Result<()> {
    println!("8. Graceful Shutdown");
    println!("----------------------");
    
    let pool = PgPool::connect(database_url).await?;
    
    // Start some long-running tasks
    let mut handles = vec![];
    for i in 0..10 {
        let pool = pool.clone();
        let handle = tokio::spawn(async move {
            println!("Long task {} started", i);
            
            // Simulate long-running work
            let _result: i64 = sqlx::query_scalar("SELECT pg_sleep(2), $1")
                .bind(i)
                .fetch_one(&pool)
                .await.unwrap();
            
            println!("Long task {} completed", i);
        });
        
        handles.push(handle);
    }
    
    // Wait a bit, then initiate graceful shutdown
    tokio::time::sleep(Duration::from_secs(1)).await;
    println!("Initiating graceful shutdown...");
    
    // Close the pool (this will wait for all connections to be returned)
    pool.close().await;
    println!("Pool closed, waiting for tasks to complete...");
    
    // Wait for all tasks to complete (they should naturally fail when pool is closed)
    for handle in handles {
        match handle.await {
            Ok(_) => println!("Task completed successfully"),
            Err(e) => println!("Task failed: {}", e),
        }
    }
    
    println!("Graceful shutdown completed");
    println!();
    Ok(())
}