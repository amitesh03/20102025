use tracing::info;
use std::time::Duration;
use std::sync::Arc;

pub async fn run() -> anyhow::Result<()> {
    info!("=== Advanced Channel Patterns ===");
    info!();
    
    fan_out_fan_in().await?;
    request_response_pattern().await?;
    worker_pool().await?;
    select_on_channels().await?;
    channel_combinations().await?;
    
    info!();
    Ok(())
}

async fn fan_out_fan_in() -> anyhow::Result<()> {
    info!("1. Fan-out/Fan-in Pattern");
    info!("-------------------------");
    
    use tokio::sync::mpsc;
    
    // Create channels for fan-out/fan-in
    let (work_tx, work_rx) = mpsc::channel::<i32>(10);
    let (result_tx, mut result_rx) = mpsc::channel::<i32>(10);
    
    // Fan-out: Spawn multiple workers
    let mut workers = Vec::new();
    for i in 1..=3 {
        let (tx, rx) = mpsc::channel::<i32>(5);
        workers.push(tx);
        
        // Forward work to each worker
        let work_rx = work_rx.clone();
        tokio::spawn(async move {
            while let Some(work) = work_rx.recv().await {
                info!("Worker {}: Processing {}", i, work);
                
                // Simulate work
                tokio::time::sleep(Duration::from_millis(100)).await;
                
                let result = work * 2;
                info!("Worker {}: Result {}", i, result);
                
                if tx.send(result).await.is_err() {
                    info!("Worker {}: Result channel closed", i);
                    break;
                }
            }
            info!("Worker {}: Finished", i);
        });
    }
    
    // Fan-in: Collect results from all workers
    tokio::spawn(async move {
        for worker_tx in workers {
            let mut worker_rx = worker_tx.subscribe();
            tokio::spawn(async move {
                while let Ok(result) = worker_rx.recv().await {
                    if result_tx.send(result).await.is_err() {
                        info!("Result collector: Channel closed");
                        break;
                    }
                }
            });
        }
    });
    
    // Send work items
    for i in 1..=6 {
        info!("Sending work item: {}", i);
        work_tx.send(i).await?;
    }
    
    // Close the work channel
    drop(work_tx);
    info!("Closed work channel");
    
    // Collect results
    let mut results = Vec::new();
    while let Some(result) = result_rx.recv().await {
        results.push(result);
        info!("Collected result: {}", result);
    }
    
    info!("All results collected: {:?}", results);
    
    info!();
    Ok(())
}

async fn request_response_pattern() -> anyhow::Result<()> {
    info!("2. Request/Response Pattern");
    info!("----------------------------");
    
    use tokio::sync::mpsc;
    use std::collections::HashMap;
    
    // Define request and response types
    type Request = String;
    type Response = String;
    type Responder = mpsc::Sender<Response>;
    
    // Create a channel for requests
    let (request_tx, mut request_rx) = mpsc::channel::<(Request, Responder)>(10);
    
    // Spawn a server that handles requests
    tokio::spawn(async move {
        info!("Request server: Starting");
        
        while let Some((request, responder)) = request_rx.recv().await {
            info!("Request server: Processing '{}'", request);
            
            // Simulate processing
            tokio::time::sleep(Duration::from_millis(100)).await;
            
            let response = format!("Response to '{}'", request);
            info!("Request server: Sending '{}'", response);
            
            if responder.send(response).await.is_err() {
                info!("Request server: Failed to send response (requester dropped)");
            }
        }
        
        info!("Request server: Shutting down");
    });
    
    // Spawn multiple clients that make requests
    let mut client_handles = Vec::new();
    
    for i in 1..=3 {
        let request_tx = request_tx.clone();
        
        let handle = tokio::spawn(async move {
            info!("Client {}: Starting", i);
            
            for j in 1..=2 {
                let request = format!("Client {} Request {}", i, j);
                info!("Client {}: Sending '{}'", i, request);
                
                // Create a response channel
                let (response_tx, mut response_rx) = mpsc::channel(1);
                
                // Send the request
                if request_tx.send((request, response_tx)).await.is_err() {
                    info!("Client {}: Server dropped", i);
                    break;
                }
                
                // Wait for response
                match response_rx.recv().await {
                    Some(response) => {
                        info!("Client {}: Received '{}'", i, response);
                    }
                    None => {
                        info!("Client {}: No response received", i);
                        break;
                    }
                }
                
                tokio::time::sleep(Duration::from_millis(50)).await;
            }
            
            info!("Client {}: Finished", i);
        });
        
        client_handles.push(handle);
    }
    
    // Drop our reference to the request channel
    drop(request_tx);
    
    // Wait for all clients to finish
    for handle in client_handles {
        handle.await?;
    }
    
    info!();
    Ok(())
}

async fn worker_pool() -> anyhow::Result<()> {
    info!("3. Worker Pool Pattern");
    info!("-----------------------");
    
    use tokio::sync::mpsc;
    
    // Define task and result types
    type Task = i32;
    type Result = i32;
    
    // Create channels
    let (task_tx, task_rx) = mpsc::channel::<Task>(20);
    let (result_tx, mut result_rx) = mpsc::channel::<Result>(20);
    
    // Spawn worker pool
    let worker_count = 3;
    for worker_id in 1..=worker_count {
        let task_rx = task_rx.clone();
        let result_tx = result_tx.clone();
        
        tokio::spawn(async move {
            info!("Worker {}: Starting", worker_id);
            
            while let Some(task) = task_rx.recv().await {
                info!("Worker {}: Processing task {}", worker_id, task);
                
                // Simulate work
                tokio::time::sleep(Duration::from_millis(100)).await;
                
                let result = task * task; // Square the input
                info!("Worker {}: Task {} result {}", worker_id, task, result);
                
                if result_tx.send(result).await.is_err() {
                    info!("Worker {}: Result channel closed", worker_id);
                    break;
                }
            }
            
            info!("Worker {}: Shutting down", worker_id);
        });
    }
    
    // Drop the original task receiver
    drop(task_rx);
    drop(result_tx);
    
    // Submit tasks
    let task_count = 10;
    info!("Submitting {} tasks", task_count);
    
    for i in 1..=task_count {
        info!("Submitting task {}", i);
        task_tx.send(i).await?;
    }
    
    // Close the task channel to signal workers to shut down
    drop(task_tx);
    info!("Closed task channel");
    
    // Collect results
    let mut results = Vec::new();
    while let Some(result) = result_rx.recv().await {
        results.push(result);
        info!("Collected result: {}", result);
    }
    
    info!("Collected {} results out of {} tasks", results.len(), task_count);
    
    info!();
    Ok(())
}

async fn select_on_channels() -> anyhow::Result<()> {
    info!("4. Select on Multiple Channels");
    info!("--------------------------------");
    
    use tokio::sync::mpsc;
    use tokio::select;
    
    // Create multiple channels
    let (tx1, mut rx1) = mpsc::channel::<i32>(5);
    let (tx2, mut rx2) = mpsc::channel::<String>(5);
    let (tx3, mut rx3) = mpsc::channel::<bool>(5);
    
    // Spawn senders for each channel
    tokio::spawn(async move {
        for i in 1..=5 {
            tokio::time::sleep(Duration::from_millis(150)).await;
            info!("Channel 1: Sending {}", i);
            let _ = tx1.send(i).await;
        }
    });
    
    tokio::spawn(async move {
        let messages = vec!["Hello", "World", "From", "Channel", "2"];
        for msg in messages {
            tokio::time::sleep(Duration::from_millis(100)).await;
            info!("Channel 2: Sending '{}'", msg);
            let _ = tx2.send(msg.to_string()).await;
        }
    });
    
    tokio::spawn(async move {
        for i in 1..=3 {
            tokio::time::sleep(Duration::from_millis(200)).await;
            let value = i % 2 == 0;
            info!("Channel 3: Sending {}", value);
            let _ = tx3.send(value).await;
        }
    });
    
    // Use select to receive from multiple channels
    let mut received = 0;
    loop {
        select! {
            // Receive from channel 1
            value = rx1.recv() => {
                match value {
                    Some(v) => {
                        received += 1;
                        info!("Selected from channel 1: {}", v);
                    }
                    None => info!("Channel 1 closed"),
                }
            }
            
            // Receive from channel 2
            value = rx2.recv() => {
                match value {
                    Some(v) => {
                        received += 1;
                        info!("Selected from channel 2: '{}'", v);
                    }
                    None => info!("Channel 2 closed"),
                }
            }
            
            // Receive from channel 3
            value = rx3.recv() => {
                match value {
                    Some(v) => {
                        received += 1;
                        info!("Selected from channel 3: {}", v);
                    }
                    None => info!("Channel 3 closed"),
                }
            }
            
            // Timeout case
            _ = tokio::time::sleep(Duration::from_millis(500)) => {
                info!("Select timeout");
                break;
            }
        }
        
        // Exit if we've received enough messages
        if received >= 8 {
            break;
        }
    }
    
    info!("Select example completed, received {} messages", received);
    
    info!();
    Ok(())
}

async fn channel_combinations() -> anyhow::Result<()> {
    info!("5. Channel Combinations");
    info!("------------------------");
    
    use tokio::sync::{mpsc, broadcast, watch};
    use tokio::select;
    
    // Example 1: Broadcast + MPSC for work distribution
    info!("Example 1: Broadcast + MPSC for work distribution");
    
    let (work_tx, mut work_rx) = mpsc::channel::<i32>(10);
    let (status_tx, _status_rx1) = broadcast::channel::<String>(10);
    let mut status_rx2 = status_tx.subscribe();
    
    // Worker that processes work and reports status
    tokio::spawn(async move {
        while let Some(work) = work_rx.recv().await {
            info!("Worker: Processing {}", work);
            
            // Report status
            let _ = status_tx.send(format!("Processing {}", work));
            
            tokio::time::sleep(Duration::from_millis(100)).await;
            
            let _ = status_tx.send(format!("Completed {}", work));
            info!("Worker: Completed {}", work);
        }
    });
    
    // Status monitor
    tokio::spawn(async move {
        while let Ok(status) = status_rx2.recv().await {
            info!("Status monitor: {}", status);
        }
    });
    
    // Send work
    for i in 1..=3 {
        work_tx.send(i).await?;
        tokio::time::sleep(Duration::from_millis(50)).await;
    }
    
    tokio::time::sleep(Duration::from_millis(400)).await;
    
    // Example 2: Watch + MPSC for configuration updates
    info!("Example 2: Watch + MPSC for configuration updates");
    
    let (config_tx, config_rx) = watch::channel("initial");
    let (task_tx, mut task_rx) = mpsc::channel::<i32>(10);
    
    // Task that uses configuration
    tokio::spawn(async move {
        let mut config_rx = config_rx;
        loop {
            select! {
                // Check for configuration changes
                _ = config_rx.changed() => {
                    let config = config_rx.borrow().clone();
                    info!("Configuration updated to: {}", config);
                }
                
                // Process tasks
                task = task_rx.recv() => {
                    match task {
                        Some(task_id) => {
                            let config = config_rx.borrow().clone();
                            info!("Processing task {} with config: {}", task_id, config);
                            tokio::time::sleep(Duration::from_millis(100)).await;
                        }
                        None => {
                            info!("Task channel closed");
                            break;
                        }
                    }
                }
            }
        }
    });
    
    // Send initial tasks
    for i in 1..=3 {
        task_tx.send(i).await?;
    }
    
    // Update configuration
    tokio::time::sleep(Duration::from_millis(150)).await;
    config_tx.send("updated").unwrap();
    info!("Configuration updated to 'updated'");
    
    // Send more tasks
    for i in 4..=5 {
        task_tx.send(i).await?;
    }
    
    tokio::time::sleep(Duration::from_millis(300)).await;
    
    // Example 3: Channel chaining
    info!("Example 3: Channel chaining");
    
    let (input_tx, mut input_rx) = mpsc::channel::<i32>(10);
    let (middle_tx, mut middle_rx) = mpsc::channel::<i32>(10);
    let (output_tx, mut output_rx) = mpsc::channel::<i32>(10);
    
    // Stage 1: Input to Middle
    tokio::spawn(async move {
        while let Some(input) = input_rx.recv().await {
            let middle = input * 2;
            info!("Stage 1: {} -> {}", input, middle);
            let _ = middle_tx.send(middle).await;
        }
    });
    
    // Stage 2: Middle to Output
    tokio::spawn(async move {
        while let Some(middle) = middle_rx.recv().await {
            let output = middle + 10;
            info!("Stage 2: {} -> {}", middle, output);
            let _ = output_tx.send(output).await;
        }
    });
    
    // Send inputs
    for i in 1..=3 {
        input_tx.send(i).await?;
    }
    drop(input_tx);
    
    // Collect outputs
    let mut results = Vec::new();
    while let Some(output) = output_rx.recv().await {
        results.push(output);
        info!("Final output: {}", output);
    }
    
    info!("Channel chaining results: {:?}", results);
    
    info!();
    Ok(())
}