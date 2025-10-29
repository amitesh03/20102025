use tracing::info;
use std::time::Duration;

pub async fn run() -> anyhow::Result<()> {
    info!("=== Tokio Tasks ===");
    info!();
    
    task_spawn().await?;
    task_blocking().await?;
    task_local().await?;
    task_cancellation().await?;
    task_timeout().await?;
    task_abort().await?;
    
    info!();
    Ok(())
}

async fn task_spawn() -> anyhow::Result<()> {
    info!("1. Task Spawning");
    info!("----------------");
    
    async fn worker(id: i32) {
        info!("Worker {} started", id);
        tokio::time::sleep(Duration::from_millis(100 * id as u64)).await;
        info!("Worker {} finished", id);
    }
    
    // Spawn tasks in different ways
    tokio::spawn(worker(1));
    tokio::spawn(worker(2));
    
    // Spawn with a name (for debugging)
    tokio::task::spawn_named("worker-3", async {
        worker(3).await;
    });
    
    // Spawn blocking operation
    tokio::task::spawn_blocking(|| {
        info!("Blocking operation started");
        std::thread::sleep(Duration::from_millis(200));
        info!("Blocking operation finished");
    });
    
    // Give tasks time to complete
    tokio::time::sleep(Duration::from_millis(500)).await;
    
    info!();
    Ok(())
}

async fn task_blocking() -> anyhow::Result<()> {
    info!("2. Blocking Tasks");
    info!("------------------");
    
    async fn cpu_intensive_task() -> u64 {
        // This function simulates a CPU-intensive operation
        info!("Starting CPU-intensive task");
        
        // Move to blocking thread pool
        let result = tokio::task::spawn_blocking(|| {
            let mut sum = 0u64;
            for i in 0..10_000_000 {
                sum += i;
            }
            sum
        }).await?;
        
        info!("CPU-intensive task completed");
        result
    }
    
    // Run CPU-intensive task concurrently with other work
    let cpu_task = tokio::spawn(cpu_intensive_task());
    
    // Do other work while CPU task runs
    for i in 1..=3 {
        info!("Doing other work {}", i);
        tokio::time::sleep(Duration::from_millis(50)).await;
    }
    
    let result = cpu_task.await?;
    info!("CPU task result: {}", result);
    
    info!();
    Ok(())
}

async fn task_local() -> anyhow::Result<()> {
    info!("3. Task-Local Storage");
    info!("----------------------");
    
    use tokio::task::LocalSet;
    
    // Create a task-local variable
    tokio::task_local! {
        static REQUEST_ID: String;
    }
    
    async fn process_request() {
        let request_id = REQUEST_ID.with(|id| id.clone());
        info!("Processing request with ID: {}", request_id);
        
        // Simulate work
        tokio::time::sleep(Duration::from_millis(100)).await;
        
        // Access the task-local variable again
        REQUEST_ID.with(|id| {
            info!("Completed processing request with ID: {}", id);
        });
    }
    
    // Create a LocalSet for task-local variables
    let local_set = LocalSet::new();
    
    // Run tasks with different request IDs
    local_set.run_until(async {
        // First request
        REQUEST_ID.scope("req-123".to_string(), async {
            tokio::spawn(process_request()).await.unwrap();
        }).await;
        
        // Second request
        REQUEST_ID.scope("req-456".to_string(), async {
            tokio::spawn(process_request()).await.unwrap();
        }).await;
        
        // Give tasks time to complete
        tokio::time::sleep(Duration::from_millis(200)).await;
    }).await;
    
    info!();
    Ok(())
}

async fn task_cancellation() -> anyhow::Result<()> {
    info!("4. Task Cancellation");
    info!("---------------------");
    
    async fn long_running_task(mut shutdown: tokio::sync::oneshot::Receiver<()>) {
        info!("Long-running task started");
        
        let mut counter = 0;
        loop {
            // Check for shutdown signal
            if shutdown.try_recv().is_ok() {
                info!("Long-running task received shutdown signal");
                break;
            }
            
            counter += 1;
            info!("Long-running task iteration {}", counter);
            
            // Do some work
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
        
        info!("Long-running task completed");
    }
    
    // Create shutdown channel
    let (shutdown_tx, shutdown_rx) = tokio::sync::oneshot::channel();
    
    // Spawn the long-running task
    let task_handle = tokio::spawn(long_running_task(shutdown_rx));
    
    // Let it run for a bit
    tokio::time::sleep(Duration::from_millis(350)).await;
    
    // Send shutdown signal
    info!("Sending shutdown signal");
    let _ = shutdown_tx.send(());
    
    // Wait for task to complete
    task_handle.await?;
    
    info!();
    Ok(())
}

async fn task_timeout() -> anyhow::Result<()> {
    info!("5. Task Timeout");
    info!("----------------");
    
    async fn slow_operation(delay_ms: u64) -> String {
        info!("Starting slow operation ({}ms delay)", delay_ms);
        tokio::time::sleep(Duration::from_millis(delay_ms)).await;
        info!("Slow operation completed");
        "Operation result".to_string()
    }
    
    // Example 1: Operation completes before timeout
    info!("Example 1: Fast operation with timeout");
    match tokio::time::timeout(
        Duration::from_millis(200),
        slow_operation(100)
    ).await {
        Ok(result) => info!("  Result: {}", result),
        Err(_) => info!("  Operation timed out"),
    }
    
    // Example 2: Operation times out
    info!("Example 2: Slow operation with timeout");
    match tokio::time::timeout(
        Duration::from_millis(100),
        slow_operation(200)
    ).await {
        Ok(result) => info!("  Result: {}", result),
        Err(_) => info!("  Operation timed out"),
    }
    
    // Example 3: Using timeout with spawn
    info!("Example 3: Timeout with spawned task");
    let task = tokio::spawn(slow_operation(300));
    
    match tokio::time::timeout(Duration::from_millis(200), task).await {
        Ok(Ok(result)) => info!("  Result: {}", result),
        Ok(Err(e)) => info!("  Task panicked: {}", e),
        Err(_) => {
            info!("  Operation timed out, aborting task");
            // Note: In a real scenario, you might want to handle cleanup here
        }
    }
    
    info!();
    Ok(())
}

async fn task_abort() -> anyhow::Result<()> {
    info!("6. Task Abortion");
    info!("-----------------");
    
    async fn abortable_task() {
        info!("Abortable task started");
        
        for i in 1..=10 {
            info!("Abortable task iteration {}", i);
            
            // Check if we should abort
            tokio::task::yield_now().await;
            
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
        
        info!("Abortable task completed naturally");
    }
    
    // Spawn an abortable task
    let task_handle = tokio::spawn(abortable_task());
    
    // Let it run for a bit
    tokio::time::sleep(Duration::from_millis(350)).await;
    
    // Abort the task
    info!("Aborting task");
    task_handle.abort();
    
    // Wait for the task to finish (it will return Aborted)
    match task_handle.await {
        Ok(_) => info!("Task completed normally"),
        Err(e) if e.is_cancelled() => info!("Task was cancelled/aborted"),
        Err(e) => info!("Task panicked: {}", e),
    }
    
    info!();
    Ok(())
}