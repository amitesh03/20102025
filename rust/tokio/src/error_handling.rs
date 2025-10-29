use tracing::info;
use std::time::Duration;
use thiserror::Error;

pub async fn run() -> anyhow::Result<()> {
    info!("=== Async Error Handling ===");
    info!();
    
    basic_error_handling().await?;
    custom_error_types().await?;
    error_propagation().await?;
    error_recovery().await?;
    error_handling_with_select().await?;
    
    info!();
    Ok(())
}

async fn basic_error_handling() -> anyhow::Result<()> {
    info!("1. Basic Error Handling");
    info!("------------------------");
    
    // Example 1: Using Result with async functions
    info!("Example 1: Result with async functions");
    
    async fn might_fail(should_fail: bool) -> Result<String, &'static str> {
        tokio::time::sleep(Duration::from_millis(100)).await;
        
        if should_fail {
            Err("Something went wrong")
        } else {
            Ok("Success!".to_string())
        }
    }
    
    // Handle success case
    match might_fail(false).await {
        Ok(message) => info!("  Success: {}", message),
        Err(e) => info!("  Error: {}", e),
    }
    
    // Handle error case
    match might_fail(true).await {
        Ok(message) => info!("  Success: {}", message),
        Err(e) => info!("  Error: {}", e),
    }
    
    // Example 2: Using ? operator in async functions
    info!("Example 2: ? operator in async functions");
    
    async fn step_one() -> Result<i32, &'static str> {
        tokio::time::sleep(Duration::from_millis(50)).await;
        Ok(42)
    }
    
    async fn step_two(input: i32) -> Result<i32, &'static str> {
        tokio::time::sleep(Duration::from_millis(50)).await;
        if input == 0 {
            Err("Input cannot be zero")
        } else {
            Ok(input * 2)
        }
    }
    
    async fn pipeline() -> Result<i32, &'static str> {
        let result1 = step_one().await?;
        let result2 = step_two(result1).await?;
        Ok(result2)
    }
    
    match pipeline().await {
        Ok(result) => info!("  Pipeline result: {}", result),
        Err(e) => info!("  Pipeline error: {}", e),
    }
    
    info!();
    Ok(())
}

async fn custom_error_types() -> anyhow::Result<()> {
    info!("2. Custom Error Types");
    info!("----------------------");
    
    // Define custom error types
    #[derive(Debug, Error)]
    enum ProcessingError {
        #[error("Invalid input: {0}")]
        InvalidInput(String),
        
        #[error("Network error: {0}")]
        Network(String),
        
        #[error("Timeout occurred after {0}ms")]
        Timeout(u64),
        
        #[error("Permission denied for user {user}")]
        PermissionDenied { user: String },
    }
    
    // Async functions that return custom errors
    async fn validate_input(input: &str) -> Result<(), ProcessingError> {
        tokio::time::sleep(Duration::from_millis(50)).await;
        
        if input.is_empty() {
            return Err(ProcessingError::InvalidInput("Input cannot be empty".to_string()));
        }
        
        if input.len() > 10 {
            return Err(ProcessingError::InvalidInput("Input too long".to_string()));
        }
        
        Ok(())
    }
    
    async fn fetch_data(url: &str) -> Result<String, ProcessingError> {
        tokio::time::sleep(Duration::from_millis(100)).await;
        
        if url.contains("invalid") {
            return Err(ProcessingError::Network("Invalid URL".to_string()));
        }
        
        Ok("Data from valid URL".to_string())
    }
    
    async fn check_permission(user: &str) -> Result<(), ProcessingError> {
        tokio::time::sleep(Duration::from_millis(50)).await;
        
        if user == "admin" {
            Ok(())
        } else {
            Err(ProcessingError::PermissionDenied { user: user.to_string() })
        }
    }
    
    // Example usage
    info!("Example 1: Validation error");
    match validate_input("").await {
        Ok(_) => info!("  Validation passed"),
        Err(e) => info!("  Validation failed: {}", e),
    }
    
    info!("Example 2: Network error");
    match fetch_data("invalid://example.com").await {
        Ok(data) => info!("  Data: {}", data),
        Err(e) => info!("  Network error: {}", e),
    }
    
    info!("Example 3: Permission error");
    match check_permission("user").await {
        Ok(_) => info!("  Permission granted"),
        Err(e) => info!("  Permission denied: {}", e),
    }
    
    info!();
    Ok(())
}

async fn error_propagation() -> anyhow::Result<()> {
    info!("3. Error Propagation");
    info!("---------------------");
    
    // Define different error types
    #[derive(Debug, Error)]
    enum DatabaseError {
        #[error("Connection failed")]
        ConnectionFailed,
        
        #[error("Query failed: {0}")]
        QueryFailed(String),
    }
    
    #[derive(Debug, Error)]
    enum ServiceError {
        #[error("Database error: {0}")]
        Database(#[from] DatabaseError),
        
        #[error("Authentication failed")]
        AuthenticationFailed,
        
        #[error("Rate limit exceeded")]
        RateLimitExceeded,
    }
    
    // Simulated database operations
    async fn connect_to_db() -> Result<(), DatabaseError> {
        tokio::time::sleep(Duration::from_millis(50)).await;
        // Simulate connection failure 50% of the time
        if std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs() % 2 == 0 {
            Err(DatabaseError::ConnectionFailed)
        } else {
            Ok(())
        }
    }
    
    async fn execute_query(query: &str) -> Result<String, DatabaseError> {
        tokio::time::sleep(Duration::from_millis(50)).await;
        
        if query.contains("invalid") {
            Err(DatabaseError::QueryFailed("Syntax error".to_string()))
        } else {
            Ok("Query result".to_string())
        }
    }
    
    // Service layer that uses database
    async fn get_user_data(user_id: i32) -> Result<String, ServiceError> {
        // Connect to database
        connect_to_db().await?;
        
        // Execute query
        let query = format!("SELECT * FROM users WHERE id = {}", user_id);
        let result = execute_query(&query).await?;
        
        Ok(result)
    }
    
    // Example usage
    info!("Example 1: Error propagation with From trait");
    match get_user_data(123).await {
        Ok(data) => info!("  User data: {}", data),
        Err(e) => info!("  Error: {}", e),
    }
    
    // Example 2: Manual error conversion
    async fn get_user_data_manual(user_id: i32) -> Result<String, ServiceError> {
        connect_to_db().await.map_err(ServiceError::Database)?;
        
        let query = format!("SELECT * FROM users WHERE id = {}", user_id);
        let result = execute_query(&query).await.map_err(ServiceError::Database)?;
        
        Ok(result)
    }
    
    match get_user_data_manual(456).await {
        Ok(data) => info!("  User data: {}", data),
        Err(e) => info!("  Error: {}", e),
    }
    
    info!();
    Ok(())
}

async fn error_recovery() -> anyhow::Result<()> {
    info!("4. Error Recovery");
    info!("------------------");
    
    // Example 1: Retry mechanism
    info!("Example 1: Retry mechanism");
    
    async fn unreliable_operation(attempt: usize) -> Result<String, &'static str> {
        tokio::time::sleep(Duration::from_millis(100)).await;
        
        // Fail on first 2 attempts, succeed on 3rd
        if attempt < 3 {
            Err("Temporary failure")
        } else {
            Ok("Success after retries".to_string())
        }
    }
    
    async fn retry_operation<F, Fut, T, E>(operation: F, max_retries: usize) -> Result<T, E>
    where
        F: Fn(usize) -> Fut,
        Fut: std::future::Future<Output = Result<T, E>>,
        E: std::fmt::Display,
    {
        let mut last_error = None;
        
        for attempt in 1..=max_retries {
            info!("  Attempt {}", attempt);
            
            match operation(attempt).await {
                Ok(result) => {
                    info!("  Success on attempt {}", attempt);
                    return Ok(result);
                }
                Err(e) => {
                    info!("  Attempt {} failed: {}", attempt, e);
                    last_error = Some(e);
                    
                    if attempt < max_retries {
                        let delay = Duration::from_millis(100 * attempt as u64);
                        info!("  Retrying after {:?}", delay);
                        tokio::time::sleep(delay).await;
                    }
                }
            }
        }
        
        Err(last_error.unwrap())
    }
    
    match retry_operation(unreliable_operation, 5).await {
        Ok(result) => info!("  Final result: {}", result),
        Err(e) => info!("  All retries failed: {}", e),
    }
    
    // Example 2: Fallback strategy
    info!("Example 2: Fallback strategy");
    
    async fn primary_service() -> Result<String, &'static str> {
        tokio::time::sleep(Duration::from_millis(100)).await;
        Err("Primary service unavailable")
    }
    
    async fn fallback_service() -> Result<String, &'static str> {
        tokio::time::sleep(Duration::from_millis(50)).await;
        Ok("Fallback service response".to_string())
    }
    
    async fn get_data_with_fallback() -> String {
        match primary_service().await {
            Ok(data) => data,
            Err(e) => {
                info!("  Primary service failed: {}", e);
                info!("  Trying fallback service");
                
                match fallback_service().await {
                    Ok(data) => data,
                    Err(e) => {
                        info!("  Fallback service also failed: {}", e);
                        "Default data".to_string()
                    }
                }
            }
        }
    }
    
    let result = get_data_with_fallback().await;
    info!("  Final result: {}", result);
    
    // Example 3: Circuit breaker pattern
    info!("Example 3: Circuit breaker pattern");
    
    #[derive(Debug, Clone)]
    enum CircuitState {
        Closed,
        Open,
        HalfOpen,
    }
    
    struct CircuitBreaker {
        state: CircuitState,
        failure_count: usize,
        failure_threshold: usize,
        timeout: Duration,
        last_failure: Option<std::time::Instant>,
    }
    
    impl CircuitBreaker {
        fn new(failure_threshold: usize, timeout: Duration) -> Self {
            Self {
                state: CircuitState::Closed,
                failure_count: 0,
                failure_threshold,
                timeout,
                last_failure: None,
            }
        }
        
        async fn call<F, Fut, T, E>(&mut self, operation: F) -> Result<T, E>
        where
            F: FnOnce() -> Fut,
            Fut: std::future::Future<Output = Result<T, E>>,
        {
            match self.state {
                CircuitState::Open => {
                    if let Some(last_failure) = self.last_failure {
                        if last_failure.elapsed() > self.timeout {
                            info!("  Circuit breaker transitioning to half-open");
                            self.state = CircuitState::HalfOpen;
                        } else {
                            info!("  Circuit breaker is open, rejecting request");
                            return Err(operation().await.unwrap_err()); // This is simplified
                        }
                    }
                }
                _ => {}
            }
            
            match operation().await {
                Ok(result) => {
                    if let CircuitState::HalfOpen = self.state {
                        info!("  Circuit breaker closing");
                        self.state = CircuitState::Closed;
                    }
                    self.failure_count = 0;
                    Ok(result)
                }
                Err(e) => {
                    self.failure_count += 1;
                    self.last_failure = Some(std::time::Instant::now());
                    
                    if self.failure_count >= self.failure_threshold {
                        info!("  Circuit breaker opening");
                        self.state = CircuitState::Open;
                    }
                    
                    Err(e)
                }
            }
        }
    }
    
    async fn flaky_service(success_rate: f64) -> Result<String, &'static str> {
        tokio::time::sleep(Duration::from_millis(50)).await;
        
        if rand::random::<f64>() < success_rate {
            Ok("Service response".to_string())
        } else {
            Err("Service error")
        }
    }
    
    let mut circuit_breaker = CircuitBreaker::new(3, Duration::from_secs(1));
    
    for i in 1..=8 {
        info!("  Request {}", i);
        
        match circuit_breaker.call(|| flaky_service(0.3)).await {
            Ok(result) => info!("  Success: {}", result),
            Err(e) => info!("  Error: {}", e),
        }
        
        tokio::time::sleep(Duration::from_millis(100)).await;
    }
    
    info!();
    Ok(())
}

async fn error_handling_with_select() -> anyhow::Result<()> {
    info!("5. Error Handling with Select");
    info!("-------------------------------");
    
    use tokio::select;
    use tokio::sync::oneshot;
    
    // Example 1: Select with timeout and error handling
    info!("Example 1: Select with timeout");
    
    async fn slow_operation() -> Result<String, &'static str> {
        tokio::time::sleep(Duration::from_millis(300)).await;
        Ok("Operation completed".to_string())
    }
    
    let operation = slow_operation();
    
    select! {
        result = operation => {
            match result {
                Ok(data) => info!("  Operation succeeded: {}", data),
                Err(e) => info!("  Operation failed: {}", e),
            }
        }
        _ = tokio::time::sleep(Duration::from_millis(200)) => {
            info!("  Operation timed out");
        }
    }
    
    // Example 2: Select with cancellation
    info!("Example 2: Select with cancellation");
    
    async fn cancellable_operation(mut shutdown: oneshot::Receiver<()>) -> Result<String, &'static str> {
        select! {
            _ = shutdown => {
                info!("  Operation cancelled");
                Err("Operation was cancelled")
            }
            _ = tokio::time::sleep(Duration::from_millis(300)) => {
                Ok("Operation completed".to_string())
            }
        }
    }
    
    // Test without cancellation
    let (_, shutdown_tx) = oneshot::channel();
    match cancellable_operation(shutdown_tx).await {
        Ok(result) => info!("  Result: {}", result),
        Err(e) => info!("  Error: {}", e),
    }
    
    // Test with cancellation
    let (shutdown_tx, shutdown_rx) = oneshot::channel();
    let operation = cancellable_operation(shutdown_rx);
    
    // Cancel after 100ms
    tokio::spawn(async move {
        tokio::time::sleep(Duration::from_millis(100)).await;
        let _ = shutdown_tx.send(());
    });
    
    match operation.await {
        Ok(result) => info!("  Result: {}", result),
        Err(e) => info!("  Error: {}", e),
    }
    
    // Example 3: Race between multiple operations with different error types
    info!("Example 3: Race between operations");
    
    async fn operation_a() -> Result<String, String> {
        tokio::time::sleep(Duration::from_millis(200)).await;
        Err("Operation A failed".to_string())
    }
    
    async fn operation_b() -> Result<i32, &'static str> {
        tokio::time::sleep(Duration::from_millis(150)).await;
        Ok(42)
    }
    
    select! {
        result_a = operation_a() => {
            match result_a {
                Ok(data) => info!("  Operation A succeeded: {}", data),
                Err(e) => info!("  Operation A failed: {}", e),
            }
        }
        result_b = operation_b() => {
            match result_b {
                Ok(data) => info!("  Operation B succeeded: {}", data),
                Err(e) => info!("  Operation B failed: {}", e),
            }
        }
    }
    
    info!();
    Ok(())
}