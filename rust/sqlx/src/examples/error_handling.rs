use crate::models::{User, NewUser};
use sqlx::{PgPool, postgres::PgRow, Row, Error as SqlxError};
use uuid::Uuid;
use std::fmt;

pub async fn run() -> anyhow::Result<()> {
    println!("=== Error Handling Examples ===");
    println!();
    
    // Get database URL from environment or use default
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:password@localhost/sqlx_examples".to_string());
    
    let pool = PgPool::connect(&database_url).await?;
    
    // Run examples
    basic_error_handling(&pool).await?;
    custom_error_types(&pool).await?;
    error_recovery_strategies(&pool).await?;
    transaction_error_handling(&pool).await?;
    connection_error_handling(&database_url).await?;
    validation_error_handling(&pool).await?;
    
    pool.close().await;
    println!();
    Ok(())
}

async fn basic_error_handling(pool: &PgPool) -> anyhow::Result<()> {
    println!("1. Basic Error Handling");
    println!("------------------------");
    
    // Example 1: Handling no rows found
    println!("Example 1: Handling no rows found");
    match sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
        .bind(Uuid::new_v4()) // Random UUID that doesn't exist
        .fetch_one(pool)
        .await
    {
        Ok(user) => println!("Found user: {}", user.username),
        Err(SqlxError::RowNotFound) => println!("User not found (expected)"),
        Err(e) => println!("Unexpected error: {}", e),
    }
    
    // Example 2: Handling constraint violations
    println!("Example 2: Handling constraint violations");
    
    // First, insert a user
    let user_id = Uuid::new_v4();
    let new_user = NewUser {
        id: user_id,
        username: "error_test_user".to_string(),
        email: "error_test@example.com".to_string(),
        password_hash: "password123".to_string(),
    };
    
    sqlx::query(
        "INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4)"
    )
    .bind(new_user.id)
    .bind(&new_user.username)
    .bind(&new_user.email)
    .bind(&new_user.password_hash)
    .execute(pool)
    .await?;
    
    // Try to insert the same user again (should fail due to unique constraint)
    match sqlx::query(
        "INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4)"
    )
    .bind(new_user.id)
    .bind(&new_user.username)
    .bind(&new_user.email)
    .bind(&new_user.password_hash)
    .execute(pool)
    .await
    {
        Ok(_) => println!("Unexpectedly succeeded inserting duplicate user"),
        Err(SqlxError::Database(db_error)) => {
            if db_error.is_unique_violation() {
                println!("Correctly caught unique violation: {}", db_error.message());
            } else {
                println!("Database error: {}", db_error);
            }
        }
        Err(e) => println!("Other error: {}", e),
    }
    
    // Example 3: Handling type errors
    println!("Example 3: Handling type errors");
    match sqlx::query_scalar::<_, i32>("SELECT username FROM users WHERE id = $1")
        .bind(user_id)
        .fetch_one(pool)
        .await
    {
        Ok(_) => println!("Unexpectedly succeeded with type mismatch"),
        Err(SqlxError::Decode(_)) => println!("Correctly caught decode error"),
        Err(e) => println!("Other error: {}", e),
    }
    
    // Example 4: Handling syntax errors
    println!("Example 4: Handling syntax errors");
    match sqlx::query("INVALID SQL SYNTAX").fetch_one(pool).await {
        Ok(_) => println!("Unexpectedly succeeded with invalid SQL"),
        Err(SqlxError::Database(db_error)) => {
            if db_error.is_syntax_error() {
                println!("Correctly caught syntax error: {}", db_error.message());
            } else {
                println!("Database error: {}", db_error);
            }
        }
        Err(e) => println!("Other error: {}", e),
    }
    
    println!();
    Ok(())
}

// Define custom error types
#[derive(Debug)]
enum UserError {
    NotFound(String),
    AlreadyExists(String),
    InvalidInput(String),
    DatabaseError(String),
    ConnectionError(String),
}

impl fmt::Display for UserError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            UserError::NotFound(msg) => write!(f, "User not found: {}", msg),
            UserError::AlreadyExists(msg) => write!(f, "User already exists: {}", msg),
            UserError::InvalidInput(msg) => write!(f, "Invalid input: {}", msg),
            UserError::DatabaseError(msg) => write!(f, "Database error: {}", msg),
            UserError::ConnectionError(msg) => write!(f, "Connection error: {}", msg),
        }
    }
}

impl std::error::Error for UserError {}

// Convert SQLx errors to our custom error type
impl From<SqlxError> for UserError {
    fn from(error: SqlxError) -> Self {
        match error {
            SqlxError::RowNotFound => UserError::NotFound("User not found".to_string()),
            SqlxError::Database(db_error) => {
                if db_error.is_unique_violation() {
                    UserError::AlreadyExists("User already exists".to_string())
                } else if db_error.is_foreign_key_violation() {
                    UserError::InvalidInput("Invalid foreign key".to_string())
                } else if db_error.is_check_violation() {
                    UserError::InvalidInput("Check constraint violated".to_string())
                } else {
                    UserError::DatabaseError(db_error.message().to_string())
                }
            }
            SqlxError::PoolTimedOut => UserError::ConnectionError("Connection pool timeout".to_string()),
            SqlxError::PoolClosed => UserError::ConnectionError("Connection pool closed".to_string()),
            _ => UserError::DatabaseError(error.to_string()),
        }
    }
}

async fn custom_error_types(pool: &PgPool) -> anyhow::Result<()> {
    println!("2. Custom Error Types");
    println!("---------------------");
    
    // Example 1: Custom error handling in a function
    async fn find_user_by_id(pool: &PgPool, user_id: Uuid) -> Result<User, UserError> {
        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(user_id)
            .fetch_one(pool)
            .await?;
        
        Ok(user)
    }
    
    // Test the function with a non-existent user
    match find_user_by_id(pool, Uuid::new_v4()).await {
        Ok(user) => println!("Found user: {}", user.username),
        Err(UserError::NotFound(msg)) => println!("Custom error: {}", msg),
        Err(e) => println!("Other error: {}", e),
    }
    
    // Example 2: Custom error handling for user creation
    async fn create_user(pool: &PgPool, new_user: NewUser) -> Result<User, UserError> {
        // Validate input
        if new_user.username.is_empty() {
            return Err(UserError::InvalidInput("Username cannot be empty".to_string()));
        }
        
        if !new_user.email.contains('@') {
            return Err(UserError::InvalidInput("Invalid email format".to_string()));
        }
        
        // Insert user
        sqlx::query(
            "INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4)"
        )
        .bind(new_user.id)
        .bind(&new_user.username)
        .bind(&new_user.email)
        .bind(&new_user.password_hash)
        .execute(pool)
        .await?;
        
        // Return the created user
        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(new_user.id)
            .fetch_one(pool)
            .await?;
        
        Ok(user)
    }
    
    // Test with invalid input
    let invalid_user = NewUser {
        id: Uuid::new_v4(),
        username: "".to_string(), // Empty username
        email: "invalid-email".to_string(), // Invalid email
        password_hash: "password123".to_string(),
    };
    
    match create_user(pool, invalid_user).await {
        Ok(user) => println!("Created user: {}", user.username),
        Err(UserError::InvalidInput(msg)) => println!("Validation error: {}", msg),
        Err(e) => println!("Other error: {}", e),
    }
    
    // Test with duplicate user
    let duplicate_user = NewUser {
        id: Uuid::new_v4(),
        username: "error_test_user".to_string(), // Already exists
        email: "duplicate@example.com".to_string(),
        password_hash: "password123".to_string(),
    };
    
    match create_user(pool, duplicate_user).await {
        Ok(user) => println!("Created user: {}", user.username),
        Err(UserError::AlreadyExists(msg)) => println!("Duplicate error: {}", msg),
        Err(e) => println!("Other error: {}", e),
    }
    
    println!();
    Ok(())
}

async fn error_recovery_strategies(pool: &PgPool) -> anyhow::Result<()> {
    println!("3. Error Recovery Strategies");
    println!("----------------------------");
    
    // Example 1: Retry mechanism
    async fn find_user_with_retry(pool: &PgPool, user_id: Uuid, max_retries: u32) -> Option<User> {
        let mut retries = 0;
        
        loop {
            match sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
                .bind(user_id)
                .fetch_one(pool)
                .await
            {
                Ok(user) => return Some(user),
                Err(SqlxError::RowNotFound) => return None,
                Err(SqlxError::PoolTimedOut) if retries < max_retries => {
                    retries += 1;
                    println!("Retry {} for user {}", retries, user_id);
                    tokio::time::sleep(std::time::Duration::from_millis(100)).await;
                }
                Err(_) => return None,
            }
        }
    }
    
    // Test retry mechanism
    let existing_user_id = sqlx::query_scalar::<_, Uuid>("SELECT id FROM users LIMIT 1")
        .fetch_optional(pool)
        .await?
        .unwrap_or_else(Uuid::new_v4);
    
    match find_user_with_retry(pool, existing_user_id, 3).await {
        Some(user) => println!("Found user with retry: {}", user.username),
        None => println!("User not found after retries"),
    }
    
    // Example 2: Fallback strategy
    async fn get_user_or_default(pool: &PgPool, user_id: Uuid) -> User {
        match sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(user_id)
            .fetch_one(pool)
            .await
        {
            Ok(user) => user,
            Err(SqlxError::RowNotFound) => {
                println!("User not found, returning default user");
                User {
                    id: Uuid::new_v4(),
                    username: "default_user".to_string(),
                    email: "default@example.com".to_string(),
                    password_hash: "default".to_string(),
                    created_at: chrono::Utc::now(),
                    updated_at: chrono::Utc::now(),
                }
            }
            Err(e) => {
                println!("Error fetching user: {}, returning default", e);
                User {
                    id: Uuid::new_v4(),
                    username: "error_user".to_string(),
                    email: "error@example.com".to_string(),
                    password_hash: "error".to_string(),
                    created_at: chrono::Utc::now(),
                    updated_at: chrono::Utc::now(),
                }
            }
        }
    }
    
    let fallback_user = get_user_or_default(pool, Uuid::new_v4()).await;
    println!("Fallback user: {} ({})", fallback_user.username, fallback_user.email);
    
    // Example 3: Graceful degradation
    async fn get_user_profile(pool: &PgPool, user_id: Uuid) -> Result<(User, Option<String>), UserError> {
        // Get user
        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(user_id)
            .fetch_one(pool)
            .await?;
        
        // Try to get user bio (might fail if column doesn't exist)
        let bio = match sqlx::query_scalar::<_, String>("SELECT bio FROM user_profiles WHERE user_id = $1")
            .bind(user_id)
            .fetch_optional(pool)
            .await
        {
            Ok(bio) => bio,
            Err(_) => {
                println!("Could not fetch user bio, continuing without it");
                None
            }
        };
        
        Ok((user, bio))
    }
    
    match get_user_profile(pool, existing_user_id).await {
        Ok((user, bio)) => {
            println!("User profile: {}", user.username);
            if let Some(bio) = bio {
                println!("Bio: {}", bio);
            } else {
                println!("No bio available");
            }
        }
        Err(e) => println!("Error getting user profile: {}", e),
    }
    
    println!();
    Ok(())
}

async fn transaction_error_handling(pool: &PgPool) -> anyhow::Result<()> {
    println!("4. Transaction Error Handling");
    println!("------------------------------");
    
    // Example 1: Transaction with error handling
    async fn create_user_with_posts(pool: &PgPool, new_user: NewUser) -> Result<User, UserError> {
        let mut tx = pool.begin().await?;
        
        // Create user
        sqlx::query(
            "INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4)"
        )
        .bind(new_user.id)
        .bind(&new_user.username)
        .bind(&new_user.email)
        .bind(&new_user.password_hash)
        .execute(&mut tx)
        .await?;
        
        // Create a post for the user
        sqlx::query(
            "INSERT INTO posts (id, title, content, author_id, is_published) VALUES ($1, $2, $3, $4, $5)"
        )
        .bind(Uuid::new_v4())
        .bind("Welcome Post")
        .bind("Welcome to our platform!")
        .bind(new_user.id)
        .bind(true)
        .execute(&mut tx)
        .await?;
        
        // Intentionally cause an error to test rollback
        if new_user.username == "rollback_test" {
            return Err(UserError::InvalidInput("Triggering rollback for testing".to_string()));
        }
        
        // Commit the transaction
        tx.commit().await?;
        
        // Return the created user
        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(new_user.id)
            .fetch_one(pool)
            .await?;
        
        Ok(user)
    }
    
    // Test successful transaction
    let success_user = NewUser {
        id: Uuid::new_v4(),
        username: "transaction_success".to_string(),
        email: "transaction_success@example.com".to_string(),
        password_hash: "password123".to_string(),
    };
    
    match create_user_with_posts(pool, success_user).await {
        Ok(user) => println!("Successfully created user with posts: {}", user.username),
        Err(e) => println!("Error in transaction: {}", e),
    }
    
    // Test transaction rollback
    let rollback_user = NewUser {
        id: Uuid::new_v4(),
        username: "rollback_test".to_string(),
        email: "rollback@example.com".to_string(),
        password_hash: "password123".to_string(),
    };
    
    match create_user_with_posts(pool, rollback_user).await {
        Ok(user) => println!("Unexpectedly created user: {}", user.username),
        Err(UserError::InvalidInput(msg)) => {
            println!("Expected error: {}", msg);
            
            // Verify rollback worked
            let user_exists: bool = sqlx::query_scalar(
                "SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)"
            )
            .bind(&rollback_user.username)
            .fetch_one(pool)
            .await?;
            
            if user_exists {
                println!("ERROR: Rollback failed - user still exists");
            } else {
                println!("Rollback successful - user does not exist");
            }
        }
        Err(e) => println!("Unexpected error: {}", e),
    }
    
    // Example 2: Nested transactions with error handling
    async fn complex_user_operation(pool: &PgPool, user_id: Uuid) -> Result<(), UserError> {
        let mut tx = pool.begin().await?;
        
        // Get user
        let user = match sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(user_id)
            .fetch_one(&mut tx)
            .await
        {
            Ok(user) => user,
            Err(SqlxError::RowNotFound) => {
                return Err(UserError::NotFound("User not found".to_string()));
            }
            Err(e) => return Err(UserError::from(e)),
        };
        
        // Create a savepoint
        let savepoint = tx.begin().await?;
        
        // Try to update user
        match sqlx::query("UPDATE users SET username = $1 WHERE id = $2")
            .bind(format!("{}_updated", user.username))
            .bind(user_id)
            .execute(&mut *savepoint)
            .await
        {
            Ok(_) => {
                // Commit the savepoint
                savepoint.commit().await?;
                println!("User updated successfully");
            }
            Err(e) => {
                // Rollback the savepoint
                savepoint.rollback().await?;
                println!("Failed to update user, continuing: {}", e);
            }
        }
        
        // Commit the main transaction
        tx.commit().await?;
        
        Ok(())
    }
    
    // Test nested transaction
    if let Some(user) = sqlx::query_as::<_, User>("SELECT * FROM users LIMIT 1")
        .fetch_optional(pool)
        .await?
    {
        match complex_user_operation(pool, user.id).await {
            Ok(_) => println!("Complex operation completed successfully"),
            Err(e) => println!("Error in complex operation: {}", e),
        }
    }
    
    println!();
    Ok(())
}

async fn connection_error_handling(database_url: &str) -> anyhow::Result<()> {
    println!("5. Connection Error Handling");
    println!("-----------------------------");
    
    // Example 1: Invalid database URL
    println!("Example 1: Invalid database URL");
    match PgPool::connect("postgres://invalid:invalid@localhost/invalid").await {
        Ok(_) => println!("Unexpectedly connected to invalid database"),
        Err(e) => println!("Expected connection error: {}", e),
    }
    
    // Example 2: Connection pool timeout
    println!("Example 2: Connection pool timeout");
    let pool = PgPool::connect(database_url).await?;
    
    // Create a pool with very short timeout
    let timeout_pool = sqlx::postgres::PgPoolOptions::new()
        .acquire_timeout(std::time::Duration::from_millis(1))
        .connect(database_url)
        .await;
    
    match timeout_pool {
        Ok(_) => println!("Unexpectedly connected with very short timeout"),
        Err(SqlxError::PoolTimedOut) => println!("Expected pool timeout error"),
        Err(e) => println!("Other error: {}", e),
    }
    
    // Example 3: Pool exhaustion
    println!("Example 3: Pool exhaustion");
    let small_pool = sqlx::postgres::PgPoolOptions::new()
        .max_connections(1)
        .connect(database_url)
        .await?;
    
    // Acquire the only connection
    let conn = small_pool.acquire().await?;
    println!("Acquired the only connection");
    
    // Try to acquire another connection (should timeout)
    match tokio::time::timeout(
        std::time::Duration::from_secs(2),
        small_pool.acquire()
    ).await {
        Ok(Ok(_)) => println!("Unexpectedly acquired second connection"),
        Ok(Err(e)) => println!("Error acquiring second connection: {}", e),
        Err(_) => println!("Timeout acquiring second connection (expected)"),
    }
    
    // Release the connection
    drop(conn);
    println!("Released connection");
    
    // Now we should be able to acquire a connection
    match small_pool.acquire().await {
        Ok(_) => println!("Successfully acquired connection after release"),
        Err(e) => println!("Error acquiring connection after release: {}", e),
    }
    
    small_pool.close().await;
    pool.close().await;
    
    println!();
    Ok(())
}

async fn validation_error_handling(pool: &PgPool) -> anyhow::Result<()> {
    println!("6. Validation Error Handling");
    println!("-----------------------------");
    
    // Example 1: Input validation before database operations
    async fn validate_and_create_user(pool: &PgPool, username: &str, email: &str) -> Result<User, UserError> {
        // Validate username
        if username.is_empty() {
            return Err(UserError::InvalidInput("Username cannot be empty".to_string()));
        }
        
        if username.len() < 3 {
            return Err(UserError::InvalidInput("Username must be at least 3 characters".to_string()));
        }
        
        if username.len() > 50 {
            return Err(UserError::InvalidInput("Username must be less than 50 characters".to_string()));
        }
        
        // Validate email
        if email.is_empty() {
            return Err(UserError::InvalidInput("Email cannot be empty".to_string()));
        }
        
        if !email.contains('@') {
            return Err(UserError::InvalidInput("Email must contain @".to_string()));
        }
        
        // Check if username already exists
        let username_exists: bool = sqlx::query_scalar(
            "SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)"
        )
        .bind(username)
        .fetch_one(pool)
        .await?;
        
        if username_exists {
            return Err(UserError::AlreadyExists("Username already exists".to_string()));
        }
        
        // Check if email already exists
        let email_exists: bool = sqlx::query_scalar(
            "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)"
        )
        .bind(email)
        .fetch_one(pool)
        .await?;
        
        if email_exists {
            return Err(UserError::AlreadyExists("Email already exists".to_string()));
        }
        
        // Create user
        let new_user = NewUser {
            id: Uuid::new_v4(),
            username: username.to_string(),
            email: email.to_string(),
            password_hash: "password123".to_string(),
        };
        
        sqlx::query(
            "INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4)"
        )
        .bind(new_user.id)
        .bind(&new_user.username)
        .bind(&new_user.email)
        .bind(&new_user.password_hash)
        .execute(pool)
        .await?;
        
        // Return the created user
        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(new_user.id)
            .fetch_one(pool)
            .await?;
        
        Ok(user)
    }
    
    // Test validation
    let test_cases = vec![
        ("", "test@example.com"), // Empty username
        ("ab", "test@example.com"), // Username too short
        ("a".repeat(51).as_str(), "test@example.com"), // Username too long
        ("valid_user", ""), // Empty email
        ("valid_user", "invalid-email"), // Invalid email
        ("error_test_user", "new@example.com"), // Existing username
        ("transaction_success", "transaction_success@example.com"), // Existing email
        ("valid_new_user", "valid_new@example.com"), // Valid input
    ];
    
    for (username, email) in test_cases {
        println!("Testing: username='{}', email='{}'", username, email);
        match validate_and_create_user(pool, username, email).await {
            Ok(user) => println!("  ✓ Created user: {}", user.username),
            Err(UserError::InvalidInput(msg)) => println!("  ✗ Validation error: {}", msg),
            Err(UserError::AlreadyExists(msg)) => println!("  ✗ Conflict error: {}", msg),
            Err(e) => println!("  ✗ Other error: {}", e),
        }
    }
    
    // Example 2: Batch validation
    async fn validate_and_create_users(pool: &PgPool, users: Vec<(String, String)>) -> Vec<Result<User, UserError>> {
        let mut results = Vec::new();
        
        for (username, email) in users {
            let result = validate_and_create_user(pool, &username, &email).await;
            results.push(result);
        }
        
        results
    }
    
    let batch_users = vec![
        ("batch_user_1".to_string(), "batch1@example.com".to_string()),
        ("batch_user_2".to_string(), "batch2@example.com".to_string()),
        ("batch_user_1".to_string(), "batch3@example.com".to_string()), // Duplicate username
        ("batch_user_3".to_string(), "batch2@example.com".to_string()), // Duplicate email
    ];
    
    println!("Batch user creation:");
    let batch_results = validate_and_create_users(pool, batch_users).await;
    
    for (i, result) in batch_results.into_iter().enumerate() {
        match result {
            Ok(user) => println!("  ✓ {}: Created user {}", i + 1, user.username),
            Err(e) => println!("  ✗ {}: {}", i + 1, e),
        }
    }
    
    println!();
    Ok(())
}