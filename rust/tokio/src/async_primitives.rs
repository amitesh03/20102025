use tracing::info;
use std::time::Duration;

pub async fn run() -> anyhow::Result<()> {
    info!("=== Async Primitives ===");
    info!();
    
    mutex_example().await?;
    rwlock_example().await?;
    semaphore_example().await?;
    barrier_example().await?;
    once_cell_example().await?;
    
    info!();
    Ok(())
}

async fn mutex_example() -> anyhow::Result<()> {
    info!("1. Async Mutex");
    info!("---------------");
    
    use tokio::sync::Mutex;
    use std::sync::Arc;
    
    let counter = Arc::new(Mutex::new(0));
    let mut handles = Vec::new();
    
    // Spawn multiple tasks that increment the counter
    for i in 0..5 {
        let counter = counter.clone();
        let handle = tokio::spawn(async move {
            for j in 0..10 {
                let mut value = counter.lock().await;
                *value += 1;
                info!("Task {} increment {} -> value = {}", i, j, *value);
                drop(value); // Release the lock before sleeping
                tokio::time::sleep(Duration::from_millis(10)).await;
            }
        });
        handles.push(handle);
    }
    
    // Wait for all tasks to complete
    for handle in handles {
        handle.await?;
    }
    
    let final_value = *counter.lock().await;
    info!("Final counter value: {}", final_value);
    
    info!();
    Ok(())
}

async fn rwlock_example() -> anyhow::Result<()> {
    info!("2. Async RwLock");
    info!("----------------");
    
    use tokio::sync::RwLock;
    use std::sync::Arc;
    
    let data = Arc::new(RwLock::new(vec![1, 2, 3, 4, 5]));
    let mut handles = Vec::new();
    
    // Spawn reader tasks
    for i in 0..3 {
        let data = data.clone();
        let handle = tokio::spawn(async move {
            let reader = data.read().await;
            info!("Reader {} sees data: {:?}", i, *reader);
            tokio::time::sleep(Duration::from_millis(100)).await;
            info!("Reader {} finished", i);
        });
        handles.push(handle);
    }
    
    // Spawn writer task
    let data_clone = data.clone();
    let writer_handle = tokio::spawn(async move {
        info!("Writer starting");
        let mut writer = data_clone.write().await;
        info!("Writer acquired lock");
        writer.push(6);
        writer.push(7);
        info!("Writer modified data: {:?}", *writer);
        tokio::time::sleep(Duration::from_millis(200)).await;
        info!("Writer finished");
    });
    
    // Wait for all tasks to complete
    for handle in handles {
        handle.await?;
    }
    writer_handle.await?;
    
    let final_data = data.read().await;
    info!("Final data: {:?}", *final_data);
    
    info!();
    Ok(())
}

async fn semaphore_example() -> anyhow::Result<()> {
    info!("3. Async Semaphore");
    info!("-------------------");
    
    use tokio::sync::Semaphore;
    use std::sync::Arc;
    
    // Create a semaphore with 2 permits
    let semaphore = Arc::new(Semaphore::new(2));
    let mut handles = Vec::new();
    
    // Spawn more tasks than permits
    for i in 0..5 {
        let semaphore = semaphore.clone();
        let handle = tokio::spawn(async move {
            info!("Task {} waiting for permit", i);
            
            // Acquire a permit
            let _permit = semaphore.acquire().await;
            info!("Task {} acquired permit", i);
            
            // Simulate work
            tokio::time::sleep(Duration::from_millis(200)).await;
            
            info!("Task {} releasing permit", i);
            // Permit is automatically released when dropped
        });
        handles.push(handle);
    }
    
    // Wait for all tasks to complete
    for handle in handles {
        handle.await?;
    }
    
    info!();
    Ok(())
}

async fn barrier_example() -> anyhow::Result<()> {
    info!("4. Async Barrier");
    info!("-----------------");
    
    use tokio::sync::Barrier;
    use std::sync::Arc;
    
    let num_tasks = 5;
    let barrier = Arc::new(Barrier::new(num_tasks));
    let mut handles = Vec::new();
    
    // Spawn tasks that wait at the barrier
    for i in 0..num_tasks {
        let barrier = barrier.clone();
        let handle = tokio::spawn(async move {
            info!("Task {} started", i);
            
            // Do some initial work
            tokio::time::sleep(Duration::from_millis(100 * i as u64)).await;
            info!("Task {} reached barrier", i);
            
            // Wait for all tasks to reach this point
            barrier.wait().await;
            
            info!("Task {} passed barrier", i);
            
            // Continue with work after barrier
            tokio::time::sleep(Duration::from_millis(50)).await;
            info!("Task {} finished", i);
        });
        handles.push(handle);
    }
    
    // Wait for all tasks to complete
    for handle in handles {
        handle.await?;
    }
    
    info!();
    Ok(())
}

async fn once_cell_example() -> anyhow::Result<()> {
    info!("5. Async Once Cell");
    info!("-------------------");
    
    use tokio::sync::OnceCell;
    use std::sync::Arc;
    
    // Create a OnceCell to store a value that will be computed once
    static CELL: OnceCell<String> = OnceCell::const_new();
    
    async fn expensive_computation() -> String {
        info!("Starting expensive computation");
        tokio::time::sleep(Duration::from_millis(200)).await;
        let result = "Expensive result".to_string();
        info!("Expensive computation completed");
        result
    }
    
    // Spawn multiple tasks that try to get the value
    let mut handles = Vec::new();
    
    for i in 0..3 {
        let handle = tokio::spawn(async move {
            info!("Task {} trying to get value", i);
            
            // Get or initialize the value
            let value = CELL.get_or_init(|| async {
                expensive_computation().await
            }).await;
            
            info!("Task {} got value: {}", i, value);
        });
        handles.push(handle);
    }
    
    // Wait for all tasks to complete
    for handle in handles {
        handle.await?;
    }
    
    // Verify the value is set
    if let Some(value) = CELL.get() {
        info!("Final value in cell: {}", value);
    }
    
    // Example with local OnceCell
    let local_cell = Arc::new(OnceCell::new());
    let mut handles = Vec::new();
    
    for i in 0..3 {
        let cell = local_cell.clone();
        let handle = tokio::spawn(async move {
            info!("Local task {} trying to get value", i);
            
            let value = cell.get_or_init(|| async {
                format!("Local value for task {}", i)
            }).await;
            
            info!("Local task {} got value: {}", i, value);
        });
        handles.push(handle);
    }
    
    for handle in handles {
        handle.await?;
    }
    
    info!();
    Ok(())
}