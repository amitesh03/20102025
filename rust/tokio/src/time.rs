use tracing::info;
use std::time::Duration;

pub async fn run() -> anyhow::Result<()> {
    info!("=== Async Time ===");
    info!();
    
    sleep_example().await?;
    interval_example().await?;
    timeout_example().await?;
    instant_example().await?;
    delay_queue_example().await?;
    
    info!();
    Ok(())
}

async fn sleep_example() -> anyhow::Result<()> {
    info!("1. Sleep Example");
    info!("-----------------");
    
    // Basic sleep
    info!("Starting basic sleep for 200ms");
    tokio::time::sleep(Duration::from_millis(200)).await;
    info!("Basic sleep completed");
    
    // Sleep with different durations
    let durations = vec![
        Duration::from_millis(50),
        Duration::from_millis(100),
        Duration::from_millis(150),
    ];
    
    for (i, duration) in durations.iter().enumerate() {
        info!("Sleep {} for {:?}", i + 1, duration);
        tokio::time::sleep(*duration).await;
        info!("Sleep {} completed", i + 1);
    }
    
    // Sleep until a specific time
    info!("Sleeping until 2 seconds from now");
    let target_time = tokio::time::Instant::now() + Duration::from_secs(2);
    tokio::time::sleep_until(target_time).await;
    info!("Sleep until specific time completed");
    
    info!();
    Ok(())
}

async fn interval_example() -> anyhow::Result<()> {
    info!("2. Interval Example");
    info!("--------------------");
    
    use tokio::time::interval;
    
    // Create an interval that ticks every 100ms
    let mut interval = interval(Duration::from_millis(100));
    
    // Skip the first immediate tick
    interval.tick().await;
    
    info!("Starting interval ticks (every 100ms)");
    
    // Collect 5 ticks
    for i in 1..=5 {
        interval.tick().await;
        info!("Interval tick {}", i);
    }
    
    // Example with a periodic task
    info!("Starting periodic task that runs every 150ms for 1 second");
    let periodic_task = tokio::spawn(async move {
        let mut interval = interval(Duration::from_millis(150));
        interval.tick().await; // Skip first tick
        
        let mut count = 0;
        let start = tokio::time::Instant::now();
        
        while start.elapsed() < Duration::from_secs(1) {
            interval.tick().await;
            count += 1;
            info!("Periodic task execution {}", count);
        }
        
        info!("Periodic task completed {} executions", count);
    });
    
    periodic_task.await?;
    
    info!();
    Ok(())
}

async fn timeout_example() -> anyhow::Result<()> {
    info!("3. Timeout Example");
    info!("-------------------");
    
    // Example 1: Operation completes before timeout
    info!("Example 1: Fast operation with timeout");
    let fast_operation = async {
        tokio::time::sleep(Duration::from_millis(100)).await;
        "Fast operation completed"
    };
    
    match tokio::time::timeout(Duration::from_millis(200), fast_operation).await {
        Ok(result) => info!("  Result: {}", result),
        Err(_) => info!("  Operation timed out"),
    }
    
    // Example 2: Operation times out
    info!("Example 2: Slow operation with timeout");
    let slow_operation = async {
        tokio::time::sleep(Duration::from_millis(300)).await;
        "Slow operation completed"
    };
    
    match tokio::time::timeout(Duration::from_millis(200), slow_operation).await {
        Ok(result) => info!("  Result: {}", result),
        Err(_) => info!("  Operation timed out"),
    }
    
    // Example 3: Timeout with spawned task
    info!("Example 3: Timeout with spawned task");
    let task = tokio::spawn(async {
        tokio::time::sleep(Duration::from_millis(500)).await;
        "Spawned task completed"
    });
    
    match tokio::time::timeout(Duration::from_millis(300), task).await {
        Ok(Ok(result)) => info!("  Result: {}", result),
        Ok(Err(e)) => info!("  Task panicked: {}", e),
        Err(_) => {
            info!("  Operation timed out");
            // Note: The task is still running in the background
        }
    }
    
    // Example 4: Retry with timeout
    info!("Example 4: Retry with timeout");
    let mut attempts = 0;
    let max_attempts = 3;
    
    while attempts < max_attempts {
        attempts += 1;
        info!("  Attempt {}", attempts);
        
        let operation = async {
            // Simulate a flaky operation that succeeds on the 3rd attempt
            if attempts < 3 {
                tokio::time::sleep(Duration::from_millis(200)).await;
                return Err("Operation failed");
            }
            
            tokio::time::sleep(Duration::from_millis(100)).await;
            Ok("Operation succeeded")
        };
        
        match tokio::time::timeout(Duration::from_millis(150), operation).await {
            Ok(Ok(result)) => {
                info!("  Success: {}", result);
                break;
            }
            Ok(Err(e)) => {
                info!("  Failed: {}", e);
            }
            Err(_) => {
                info!("  Timed out");
            }
        }
    }
    
    info!();
    Ok(())
}

async fn instant_example() -> anyhow::Result<()> {
    info!("4. Instant Example");
    info!("------------------");
    
    use tokio::time::Instant;
    
    // Measure elapsed time
    let start = Instant::now();
    tokio::time::sleep(Duration::from_millis(200)).await;
    let elapsed = start.elapsed();
    info!("Elapsed time: {:?}", elapsed);
    
    // Compare instants
    let now = Instant::now();
    let future = now + Duration::from_secs(1);
    let past = now - Duration::from_millis(500);
    
    info!("Now: {:?}", now);
    info!("Future: {:?}", future);
    info!("Past: {:?}", past);
    
    info!("Future > now: {}", future > now);
    info!("Past < now: {}", past < now);
    
    // Duration until a future instant
    let until_future = future.duration_since(now);
    info!("Duration until future: {:?}", until_future);
    
    // Wait until a specific instant
    info!("Waiting until future instant...");
    tokio::time::sleep_until(future).await;
    info!("Waited until future instant");
    
    // Rate limiting with Instant
    info!("Rate limiting example (max 3 operations per second)");
    let start_time = Instant::now();
    let operation_interval = Duration::from_millis(300); // ~3.3 ops per second
    
    for i in 1..=5 {
        // Calculate when the next operation should run
        let next_operation_time = start_time + operation_interval * i;
        
        // Sleep until the next operation time
        tokio::time::sleep_until(next_operation_time).await;
        
        info!("Operation {} at {:?}", i, Instant::now().duration_since(start_time));
    }
    
    info!();
    Ok(())
}

async fn delay_queue_example() -> anyhow::Result<()> {
    info!("5. Delay Queue Example");
    info!("-----------------------");
    
    use tokio::time::{delay_queue, DelayQueue, Duration};
    use std::collections::HashMap;
    
    // Create a delay queue
    let mut delay_queue = DelayQueue::new();
    
    // Insert items with different delays
    let mut keys = HashMap::new();
    
    for i in 1..=5 {
        let key = format!("item-{}", i);
        let delay = Duration::from_millis(100 * i as u64);
        
        delay_queue.insert(key.clone(), delay);
        keys.insert(i, key);
        
        info!("Inserted {} with delay {:?}", keys[&i], delay);
    }
    
    // Process items as they become due
    info!("Processing items from delay queue...");
    
    while !delay_queue.is_empty() {
        // Wait for the next item to expire
        let expired = delay_queue.next().await.unwrap();
        let key = expired.get_ref();
        
        info!("Item {} expired after {:?}", key, expired.deadline());
        
        // Remove the item from the queue
        delay_queue.remove(expired);
    }
    
    info!("All items processed");
    
    // Example with reset functionality
    info!("Example with reset functionality");
    let mut delay_queue = DelayQueue::new();
    
    let key = "reset-item".to_string();
    delay_queue.insert(key.clone(), Duration::from_millis(200));
    
    // Reset the delay before it expires
    tokio::time::sleep(Duration::from_millis(100)).await;
    info!("Resetting item delay to 500ms");
    delay_queue.reset(&key, Duration::from_millis(500));
    
    // Wait for the item to expire
    let expired = delay_queue.next().await.unwrap();
    info!("Item {} expired after {:?}", expired.get_ref(), expired.deadline());
    
    info!();
    Ok(())
}