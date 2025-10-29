use tracing::info;

pub async fn run() -> anyhow::Result<()> {
    info!("=== Tokio Basics ===");
    info!();
    
    hello_world().await?;
    basic_async_fn().await?;
    async_with_await().await?;
    concurrent_tasks().await?;
    tokio_spawn().await?;
    join_handles().await?;
    
    info!();
    Ok(())
}

async fn hello_world() -> anyhow::Result<()> {
    info!("1. Hello World Async Function");
    info!("------------------------------");
    
    async fn say_hello() {
        info!("Hello, async world!");
    }
    
    say_hello().await;
    info!();
    Ok(())
}

async fn basic_async_fn() -> anyhow::Result<()> {
    info!("2. Basic Async Function");
    info!("------------------------");
    
    async fn compute_square(x: i32) -> i32 {
        info!("Computing square of {}", x);
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
        x * x
    }
    
    let result = compute_square(5).await;
    info!("Result: {}", result);
    info!();
    Ok(())
}

async fn async_with_await() -> anyhow::Result<()> {
    info!("3. Async with Multiple Awaits");
    info!("-------------------------------");
    
    async fn process_data() -> Vec<i32> {
        info!("Step 1: Collecting data");
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
        
        let data = vec![1, 2, 3, 4, 5];
        info!("Step 2: Processing {} items", data.len());
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
        
        let processed: Vec<i32> = data.iter().map(|x| x * 2).collect();
        info!("Step 3: Processing complete");
        
        processed
    }
    
    let result = process_data().await;
    info!("Processed data: {:?}", result);
    info!();
    Ok(())
}

async fn concurrent_tasks() -> anyhow::Result<()> {
    info!("4. Concurrent Tasks");
    info!("--------------------");
    
    async fn task_one() -> String {
        info!("Task one started");
        tokio::time::sleep(tokio::time::Duration::from_millis(200)).await;
        info!("Task one completed");
        "Result from task one".to_string()
    }
    
    async fn task_two() -> String {
        info!("Task two started");
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
        info!("Task two completed");
        "Result from task two".to_string()
    }
    
    // Run tasks concurrently using tokio::join!
    let (result_one, result_two) = tokio::join!(task_one(), task_two());
    
    info!("Results:");
    info!("  Task one: {}", result_one);
    info!("  Task two: {}", result_two);
    info!();
    Ok(())
}

async fn tokio_spawn() -> anyhow::Result<()> {
    info!("5. Tokio Spawn");
    info!("----------------");
    
    async fn background_task(id: i32) {
        for i in 1..=3 {
            info!("Background task {} iteration {}", id, i);
            tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
        }
        info!("Background task {} completed", id);
    }
    
    // Spawn background tasks
    let handle1 = tokio::spawn(background_task(1));
    let handle2 = tokio::spawn(background_task(2));
    
    info!("Main thread continues while background tasks run");
    
    // Wait for tasks to complete
    let _ = handle1.await;
    let _ = handle2.await;
    
    info!("All background tasks completed");
    info!();
    Ok(())
}

async fn join_handles() -> anyhow::Result<()> {
    info!("6. Join Handles");
    info!("----------------");
    
    async fn compute_fibonacci(n: u32) -> u64 {
        if n <= 1 {
            return n as u64;
        }
        
        tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;
        
        let (a, b) = tokio::join!(
            compute_fibonacci(n - 1),
            compute_fibonacci(n - 2)
        );
        
        a + b
    }
    
    // Spawn multiple Fibonacci computations
    let handles: Vec<_> = (10..=15)
        .map(|n| tokio::spawn(compute_fibonacci(n)))
        .collect();
    
    // Collect results
    let mut results = Vec::new();
    for handle in handles {
        let result = handle.await?;
        results.push(result);
    }
    
    info!("Fibonacci results:");
    for (i, result) in results.iter().enumerate() {
        info!("  Fibonacci({}) = {}", i + 10, result);
    }
    
    info!();
    Ok(())
}