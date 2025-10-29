use crate::models::{User, NewUser, Post, NewPost, ActivityLog, NewActivityLog};
use sqlx::{PgPool, Transaction};
use uuid::Uuid;
use chrono::Utc;

pub async fn run() -> anyhow::Result<()> {
    println!("=== Transaction Examples ===");
    println!();
    
    // Get database URL from environment or use default
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:password@localhost/sqlx_examples".to_string());
    
    // Create connection pool
    let pool = PgPool::connect(&database_url).await?;
    
    // Run examples
    simple_transaction(&pool).await?;
    nested_transaction(&pool).await?;
    transaction_with_error(&pool).await?;
    savepoint_example(&pool).await?;
    concurrent_transactions(&pool).await?;
    transaction_with_isolation(&pool).await?;
    
    println!();
    Ok(())
}

async fn simple_transaction(pool: &PgPool) -> anyhow::Result<()> {
    println!("1. Simple Transaction");
    println!("---------------------");
    
    // Begin transaction
    let mut tx = pool.begin().await?;
    
    // Create user within transaction
    let user_id = Uuid::new_v4();
    let new_user = NewUser {
        username: "transaction_user".to_string(),
        email: "transaction@example.com".to_string(),
        password: "password123".to_string(),
    };
    
    let user: User = sqlx::query_as(r#"
        INSERT INTO users (id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    "#)
    .bind(user_id)
    .bind(&new_user.username)
    .bind(&new_user.email)
    .bind(&new_user.password)
    .fetch_one(&mut *tx)
    .await?;
    
    println!("Created user in transaction: {}", user.username);
    
    // Create post for the user
    let post_id = Uuid::new_v4();
    let new_post = NewPost {
        title: "Transaction Post".to_string(),
        content: "This post was created in a transaction".to_string(),
        author_id: user_id,
    };
    
    let post: Post = sqlx::query_as(r#"
        INSERT INTO posts (id, title, content, author_id, is_published)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    "#)
    .bind(post_id)
    .bind(&new_post.title)
    .bind(&new_post.content)
    .bind(new_post.author_id)
    .bind(true)
    .fetch_one(&mut *tx)
    .await?;
    
    println!("Created post in transaction: {}", post.title);
    
    // Log activity
    let activity_log = NewActivityLog {
        user_id: Some(user_id),
        action: "create_user_and_post".to_string(),
        resource_type: "transaction".to_string(),
        resource_id: Some(user_id),
        details: Some(serde_json::json!({
            "user_id": user_id,
            "post_id": post_id
        })),
        ip_address: Some("127.0.0.1".to_string()),
        user_agent: Some("Transaction Example".to_string()),
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
    .fetch_one(&mut *tx)
    .await?;
    
    println!("Logged activity: {}", log.action);
    
    // Commit transaction
    tx.commit().await?;
    println!("Transaction committed successfully");
    
    // Verify the data was committed
    let user_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users WHERE username = $1")
        .bind("transaction_user")
        .fetch_one(pool)
        .await?;
    
    println!("Verified: {} users with username 'transaction_user'", user_count);
    
    println!();
    Ok(())
}

async fn nested_transaction(pool: &PgPool) -> anyhow::Result<()> {
    println!("2. Nested Transaction");
    println!("----------------------");
    
    // Begin outer transaction
    let mut outer_tx = pool.begin().await?;
    
    // Create user in outer transaction
    let user_id = Uuid::new_v4();
    let user: User = sqlx::query_as(r#"
        INSERT INTO users (id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    "#)
    .bind(user_id)
    .bind("nested_user")
    .bind("nested@example.com")
    .bind("password123")
    .fetch_one(&mut *outer_tx)
    .await?;
    
    println!("Created user in outer transaction: {}", user.username);
    
    // Begin nested transaction (savepoint)
    let mut nested_tx = outer_tx.begin().await?;
    
    // Create post in nested transaction
    let post_id = Uuid::new_v4();
    let post: Post = sqlx::query_as(r#"
        INSERT INTO posts (id, title, content, author_id, is_published)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    "#)
    .bind(post_id)
    .bind("Nested Transaction Post")
    .bind("This post was created in a nested transaction")
    .bind(user_id)
    .bind(true)
    .fetch_one(&mut *nested_tx)
    .await?;
    
    println!("Created post in nested transaction: {}", post.title);
    
    // Commit nested transaction
    nested_tx.commit().await?;
    println!("Nested transaction committed");
    
    // Create another post in outer transaction
    let post2_id = Uuid::new_v4();
    let post2: Post = sqlx::query_as(r#"
        INSERT INTO posts (id, title, content, author_id, is_published)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    "#)
    .bind(post2_id)
    .bind("Outer Transaction Post")
    .bind("This post was created in the outer transaction")
    .bind(user_id)
    .bind(true)
    .fetch_one(&mut *outer_tx)
    .await?;
    
    println!("Created post in outer transaction: {}", post2.title);
    
    // Commit outer transaction
    outer_tx.commit().await?;
    println!("Outer transaction committed");
    
    // Verify both posts exist
    let post_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM posts WHERE author_id = $1")
        .bind(user_id)
        .fetch_one(pool)
        .await?;
    
    println!("Verified: {} posts for nested_user", post_count);
    
    println!();
    Ok(())
}

async fn transaction_with_error(pool: &PgPool) -> anyhow::Result<()> {
    println!("3. Transaction with Error");
    println!("----------------------------");
    
    // Begin transaction
    let mut tx = pool.begin().await?;
    
    // Create user
    let user_id = Uuid::new_v4();
    let user: User = sqlx::query_as(r#"
        INSERT INTO users (id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    "#)
    .bind(user_id)
    .bind("error_user")
    .bind("error@example.com")
    .bind("password123")
    .fetch_one(&mut *tx)
    .await?;
    
    println!("Created user: {}", user.username);
    
    // Try to create post with invalid data (this will fail)
    let result = sqlx::query_as::<_, Post>(r#"
        INSERT INTO posts (id, title, content, author_id, is_published)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    "#)
    .bind(Uuid::new_v4())
    .bind("") // Empty title will violate NOT NULL constraint
    .bind("Content")
    .bind(user_id)
    .bind(true)
    .fetch_one(&mut *tx)
    .await;
    
    match result {
        Ok(_) => println!("Unexpected success"),
        Err(e) => {
            println!("Expected error: {}", e);
            // Rollback transaction
            tx.rollback().await?;
            println!("Transaction rolled back");
        }
    }
    
    // Verify user was not created due to rollback
    let user_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users WHERE username = $1")
        .bind("error_user")
        .fetch_one(pool)
        .await?;
    
    println!("Verified: {} users with username 'error_user' (should be 0)", user_count);
    
    println!();
    Ok(())
}

async fn savepoint_example(pool: &PgPool) -> anyhow::Result<()> {
    println!("4. Savepoint Example");
    println!("---------------------");
    
    // Begin transaction
    let mut tx = pool.begin().await?;
    
    // Create user
    let user_id = Uuid::new_v4();
    let user: User = sqlx::query_as(r#"
        INSERT INTO users (id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    "#)
    .bind(user_id)
    .bind("savepoint_user")
    .bind("savepoint@example.com")
    .bind("password123")
    .fetch_one(&mut *tx)
    .await?;
    
    println!("Created user: {}", user.username);
    
    // Create savepoint
    tx.savepoint("sp1").await?;
    println!("Created savepoint 'sp1'");
    
    // Create post
    let post_id = Uuid::new_v4();
    let post: Post = sqlx::query_as(r#"
        INSERT INTO posts (id, title, content, author_id, is_published)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    "#)
    .bind(post_id)
    .bind("Savepoint Post")
    .bind("This post was created after savepoint")
    .bind(user_id)
    .bind(true)
    .fetch_one(&mut *tx)
    .await?;
    
    println!("Created post after savepoint: {}", post.title);
    
    // Create another savepoint
    tx.savepoint("sp2").await?;
    println!("Created savepoint 'sp2'");
    
    // Try to create invalid post (this will fail)
    let result = sqlx::query_as::<_, Post>(r#"
        INSERT INTO posts (id, title, content, author_id, is_published)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    "#)
    .bind(Uuid::new_v4())
    .bind("")
    .bind("Content")
    .bind(user_id)
    .bind(true)
    .fetch_one(&mut *tx)
    .await;
    
    match result {
        Ok(_) => println!("Unexpected success"),
        Err(e) => {
            println!("Expected error: {}", e);
            // Rollback to savepoint sp1
            tx.rollback_to_savepoint("sp1").await?;
            println!("Rolled back to savepoint 'sp1'");
        }
    }
    
    // Create another valid post
    let post3_id = Uuid::new_v4();
    let post3: Post = sqlx::query_as(r#"
        INSERT INTO posts (id, title, content, author_id, is_published)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    "#)
    .bind(post3_id)
    .bind("Post After Rollback")
    .bind("This post was created after rollback to savepoint")
    .bind(user_id)
    .bind(true)
    .fetch_one(&mut *tx)
    .await?;
    
    println!("Created post after rollback: {}", post3.title);
    
    // Commit transaction
    tx.commit().await?;
    println!("Transaction committed");
    
    // Verify only one post exists (the one created before rollback)
    let post_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM posts WHERE author_id = $1")
        .bind(user_id)
        .fetch_one(pool)
        .await?;
    
    println!("Verified: {} posts for savepoint_user (should be 1)", post_count);
    
    println!();
    Ok(())
}

async fn concurrent_transactions(pool: &PgPool) -> anyhow::Result<()> {
    println!("5. Concurrent Transactions");
    println!("---------------------------");
    
    // Create user first
    let user_id = Uuid::new_v4();
    let user: User = sqlx::query_as(r#"
        INSERT INTO users (id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    "#)
    .bind(user_id)
    .bind("concurrent_user")
    .bind("concurrent@example.com")
    .bind("password123")
    .fetch_one(pool)
    .await?;
    
    println!("Created user: {}", user.username);
    
    // Spawn multiple concurrent transactions
    let mut handles = vec![];
    
    for i in 1..=5 {
        let pool = pool.clone();
        let user_id = user_id;
        
        let handle = tokio::spawn(async move {
            // Begin transaction
            let mut tx = pool.begin().await.unwrap();
            
            // Create post
            let post: Post = sqlx::query_as(r#"
                INSERT INTO posts (id, title, content, author_id, is_published)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            "#)
            .bind(Uuid::new_v4())
            .bind(format!("Concurrent Post {}", i))
            .bind(format!("This is concurrent post {}", i))
            .bind(user_id)
            .bind(true)
            .fetch_one(&mut *tx)
            .await.unwrap();
            
            // Simulate some work
            tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
            
            // Log activity
            let _log: ActivityLog = sqlx::query_as(r#"
                INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            "#)
            .bind(Some(user_id))
            .bind("create_post_concurrent")
            .bind("post")
            .bind(Some(post.id))
            .bind(Some(serde_json::json!({
                "post_title": post.title,
                "transaction_id": i
            })))
            .fetch_one(&mut *tx)
            .await.unwrap();
            
            // Commit transaction
            tx.commit().await.unwrap();
            
            post.title
        });
        
        handles.push(handle);
    }
    
    // Wait for all transactions to complete
    for handle in handles {
        let title = handle.await?;
        println!("Completed transaction for: {}", title);
    }
    
    // Verify all posts were created
    let post_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM posts WHERE author_id = $1")
        .bind(user_id)
        .fetch_one(pool)
        .await?;
    
    println!("Verified: {} posts for concurrent_user", post_count);
    
    println!();
    Ok(())
}

async fn transaction_with_isolation(pool: &PgPool) -> anyhow::Result<()> {
    println!("6. Transaction with Isolation Level");
    println!("-----------------------------------");
    
    // Create user first
    let user_id = Uuid::new_v4();
    sqlx::query(r#"
        INSERT INTO users (id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
    "#)
    .bind(user_id)
    .bind("isolation_user")
    .bind("isolation@example.com")
    .bind("password123")
    .execute(pool)
    .await?;
    
    println!("Created user: isolation_user");
    
    // Begin transaction with SERIALIZABLE isolation level
    let mut tx = pool.begin().await?;
    sqlx::query("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE")
        .execute(&mut *tx)
        .await?;
    
    println!("Started transaction with SERIALIZABLE isolation level");
    
    // Read user data
    let user: User = sqlx::query_as("SELECT * FROM users WHERE id = $1")
        .bind(user_id)
        .fetch_one(&mut *tx)
        .await?;
    
    println!("Read user: {}", user.username);
    
    // Simulate some work
    tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
    
    // Update user
    let updated_user: User = sqlx::query_as(r#"
        UPDATE users 
        SET username = $1, updated_at = $2
        WHERE id = $3
        RETURNING *
    "#)
    .bind("isolation_user_updated")
    .bind(Utc::now())
    .bind(user_id)
    .fetch_one(&mut *tx)
    .await?;
    
    println!("Updated user: {}", updated_user.username);
    
    // Commit transaction
    tx.commit().await?;
    println!("Transaction with isolation level committed");
    
    // Verify the update
    let final_user: User = sqlx::query_as("SELECT * FROM users WHERE id = $1")
        .bind(user_id)
        .fetch_one(pool)
        .await?;
    
    println!("Final user: {}", final_user.username);
    
    println!();
    Ok(())
}

// Example of transaction with retry logic
pub async fn transaction_with_retry(pool: &PgPool) -> anyhow::Result<()> {
    println!("7. Transaction with Retry");
    println!("--------------------------");
    
    let mut retry_count = 0;
    let max_retries = 3;
    
    while retry_count < max_retries {
        match pool.begin().await {
            Ok(mut tx) => {
                // Try to perform the transaction
                let result = try_transaction_operation(&mut tx).await;
                
                match result {
                    Ok(_) => {
                        tx.commit().await?;
                        println!("Transaction succeeded on attempt {}", retry_count + 1);
                        return Ok(());
                    }
                    Err(e) => {
                        if e.to_string().contains("could not serialize access") {
                            retry_count += 1;
                            println!("Serialization conflict, retrying... (attempt {})", retry_count + 1);
                            tx.rollback().await?;
                            tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
                        } else {
                            return Err(e);
                        }
                    }
                }
            }
            Err(e) => return Err(e.into()),
        }
    }
    
    Err(anyhow::anyhow!("Transaction failed after {} retries", max_retries))
}

async fn try_transaction_operation(tx: &mut Transaction<'_, sqlx::Postgres>) -> anyhow::Result<()> {
    // This is a placeholder for a transaction operation that might fail
    // due to serialization conflicts
    
    // Create user
    let user_id = Uuid::new_v4();
    let _user: User = sqlx::query_as(r#"
        INSERT INTO users (id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    "#)
    .bind(user_id)
    .bind("retry_user")
    .bind("retry@example.com")
    .bind("password123")
    .fetch_one(&mut *tx)
    .await?;
    
    // Simulate potential conflict
    tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;
    
    // Create post
    let _post: Post = sqlx::query_as(r#"
        INSERT INTO posts (id, title, content, author_id, is_published)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    "#)
    .bind(Uuid::new_v4())
    .bind("Retry Transaction Post")
    .bind("This post was created in a retry transaction")
    .bind(user_id)
    .bind(true)
    .fetch_one(&mut *tx)
    .await?;
    
    Ok(())
}