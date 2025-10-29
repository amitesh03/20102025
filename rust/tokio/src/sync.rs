use tracing::info;
use std::time::Duration;
use std::sync::Arc;

pub async fn run() -> anyhow::Result<()> {
    info!("=== Async Synchronization ===");
    info!();
    
    oneshot_channel().await?;
    broadcast_channel().await?;
    watch_channel().await?;
    mpsc_channel().await?;
    
    info!();
    Ok(())
}

async fn oneshot_channel() -> anyhow::Result<()> {
    info!("1. Oneshot Channel");
    info!("-------------------");
    
    use tokio::sync::oneshot;
    
    // Example 1: Basic oneshot communication
    info!("Example 1: Basic oneshot communication");
    
    let (tx, rx) = oneshot::channel();
    
    // Spawn a task that sends a value
    tokio::spawn(async move {
        info!("Sender: Preparing to send value");
        tokio::time::sleep(Duration::from_millis(100)).await;
        
        match tx.send("Hello from sender!") {
            Ok(_) => info!("Sender: Value sent successfully"),
            Err(_) => info!("Sender: Failed to send (receiver dropped)"),
        }
    });
    
    // Receive the value
    match rx.await {
        Ok(value) => info!("Receiver: Received '{}'", value),
        Err(_) => info!("Receiver: Sender dropped"),
    }
    
    // Example 2: Receiver dropped before sender sends
    info!("Example 2: Receiver dropped before sender sends");
    
    let (tx, rx) = oneshot::channel::<String>();
    
    // Spawn a task that tries to send
    let sender_handle = tokio::spawn(async move {
        tokio::time::sleep(Duration::from_millis(100)).await;
        
        match tx.send("This won't be received".to_string()) {
            Ok(_) => info!("Sender: Value sent successfully"),
            Err(_) => info!("Sender: Failed to send (receiver dropped)"),
        }
    });
    
    // Drop the receiver immediately
    drop(rx);
    info!("Receiver dropped immediately");
    
    sender_handle.await?;
    
    // Example 3: Sender dropped before receiver receives
    info!("Example 3: Sender dropped before receiver receives");
    
    let (tx, mut rx) = oneshot::channel::<i32>();
    
    // Spawn a task that drops the sender without sending
    tokio::spawn(async move {
        tokio::time::sleep(Duration::from_millis(100)).await;
        info!("Sender: Dropping without sending");
        drop(tx);
    });
    
    // Try to receive
    match rx.await {
        Ok(value) => info!("Receiver: Received '{}'", value),
        Err(_) => info!("Receiver: Sender dropped without sending"),
    }
    
    info!();
    Ok(())
}

async fn broadcast_channel() -> anyhow::Result<()> {
    info!("2. Broadcast Channel");
    info!("---------------------");
    
    use tokio::sync::broadcast;
    
    // Create a broadcast channel with capacity 10
    let (tx, mut rx1) = broadcast::channel(10);
    let mut rx2 = tx.subscribe();
    let mut rx3 = tx.subscribe();
    
    // Spawn receiver tasks
    let receiver1 = tokio::spawn(async move {
        info!("Receiver 1: Waiting for messages");
        while let Ok(msg) = rx1.recv().await {
            info!("Receiver 1: Got '{}'", msg);
            tokio::time::sleep(Duration::from_millis(50)).await;
        }
        info!("Receiver 1: Channel closed");
    });
    
    let receiver2 = tokio::spawn(async move {
        info!("Receiver 2: Waiting for messages");
        while let Ok(msg) = rx2.recv().await {
            info!("Receiver 2: Got '{}'", msg);
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
        info!("Receiver 2: Channel closed");
    });
    
    let receiver3 = tokio::spawn(async move {
        info!("Receiver 3: Waiting for messages");
        while let Ok(msg) = rx3.recv().await {
            info!("Receiver 3: Got '{}'", msg);
            tokio::time::sleep(Duration::from_millis(75)).await;
        }
        info!("Receiver 3: Channel closed");
    });
    
    // Send messages
    for i in 1..=5 {
        let msg = format!("Message {}", i);
        info!("Sender: Broadcasting '{}'", msg);
        
        match tx.send(msg.clone()) {
            Ok(count) => info!("Sender: Message sent to {} receivers", count),
            Err(_) => info!("Sender: No receivers"),
        }
        
        tokio::time::sleep(Duration::from_millis(200)).await;
    }
    
    // Drop the sender to close the channel
    drop(tx);
    info!("Sender: Dropped, closing channel");
    
    // Wait for receivers to finish
    receiver1.await?;
    receiver2.await?;
    receiver3.await?;
    
    info!();
    Ok(())
}

async fn watch_channel() -> anyhow::Result<()> {
    info!("3. Watch Channel");
    info!("------------------");
    
    use tokio::sync::watch;
    
    // Create a watch channel with initial value
    let (tx, mut rx) = watch::channel(0);
    
    // Spawn multiple receivers
    let mut rx2 = tx.subscribe();
    let mut rx3 = tx.subscribe();
    
    // Receiver 1
    let receiver1 = tokio::spawn(async move {
        info!("Watch Receiver 1: Starting");
        while rx.changed().await.is_ok() {
            let value = *rx.borrow();
            info!("Watch Receiver 1: Received value {}", value);
        }
        info!("Watch Receiver 1: Channel closed");
    });
    
    // Receiver 2
    let receiver2 = tokio::spawn(async move {
        info!("Watch Receiver 2: Starting");
        while rx2.changed().await.is_ok() {
            let value = *rx2.borrow();
            info!("Watch Receiver 2: Received value {}", value);
            tokio::time::sleep(Duration::from_millis(150)).await;
        }
        info!("Watch Receiver 2: Channel closed");
    });
    
    // Receiver 3
    let receiver3 = tokio::spawn(async move {
        info!("Watch Receiver 3: Starting");
        
        // Get the current value without waiting
        let initial_value = *rx3.borrow();
        info!("Watch Receiver 3: Initial value {}", initial_value);
        
        while rx3.changed().await.is_ok() {
            let value = *rx3.borrow();
            info!("Watch Receiver 3: Received value {}", value);
        }
        info!("Watch Receiver 3: Channel closed");
    });
    
    // Send values
    for i in 1..=5 {
        info!("Watch Sender: Sending value {}", i);
        
        // Note: send() returns an error if there are no receivers
        if tx.send(i).is_err() {
            info!("Watch Sender: No receivers");
            break;
        }
        
        tokio::time::sleep(Duration::from_millis(200)).await;
    }
    
    // Drop the sender to close the channel
    drop(tx);
    info!("Watch Sender: Dropped, closing channel");
    
    // Wait for receivers to finish
    receiver1.await?;
    receiver2.await?;
    receiver3.await?;
    
    info!();
    Ok(())
}

async fn mpsc_channel() -> anyhow::Result<()> {
    info!("4. MPSC Channel");
    info!("-----------------");
    
    use tokio::sync::mpsc;
    
    // Example 1: Basic MPSC (Multiple Producer, Single Consumer)
    info!("Example 1: Basic MPSC");
    
    let (tx, mut rx) = mpsc::channel::<String>(10);
    
    // Spawn multiple producers
    for i in 1..=3 {
        let tx = tx.clone();
        tokio::spawn(async move {
            for j in 1..=3 {
                let msg = format!("Producer {} Message {}", i, j);
                info!("Producer {}: Sending '{}'", i, msg);
                
                if tx.send(msg).await.is_err() {
                    info!("Producer {}: Receiver dropped", i);
                    break;
                }
                
                tokio::time::sleep(Duration::from_millis(100)).await;
            }
            info!("Producer {}: Finished", i);
        });
    }
    
    // Drop the original sender
    drop(tx);
    
    // Consumer
    let consumer = tokio::spawn(async move {
        info!("Consumer: Starting");
        while let Some(msg) = rx.recv().await {
            info!("Consumer: Received '{}'", msg);
            tokio::time::sleep(Duration::from_millis(50)).await;
        }
        info!("Consumer: Channel closed");
    });
    
    consumer.await?;
    
    // Example 2: Bounded channel with backpressure
    info!("Example 2: Bounded channel with backpressure");
    
    let (tx, mut rx) = mpsc::channel::<i32>(2); // Small buffer
    
    // Spawn a slow consumer
    let consumer_handle = tokio::spawn(async move {
        info!("Slow Consumer: Starting");
        while let Some(value) = rx.recv().await {
            info!("Slow Consumer: Processing {}", value);
            tokio::time::sleep(Duration::from_millis(200)).await;
            info!("Slow Consumer: Finished processing {}", value);
        }
        info!("Slow Consumer: Finished");
    });
    
    // Spawn a fast producer
    let producer_handle = tokio::spawn(async move {
        info!("Fast Producer: Starting");
        for i in 1..=5 {
            info!("Fast Producer: Trying to send {}", i);
            
            match tx.send(i).await {
                Ok(_) => info!("Fast Producer: Sent {}", i),
                Err(_) => {
                    info!("Fast Producer: Failed to send {}", i);
                    break;
                }
            }
            
            info!("Fast Producer: Waiting before next send");
            tokio::time::sleep(Duration::from_millis(50)).await;
        }
        info!("Fast Producer: Finished");
    });
    
    producer_handle.await?;
    consumer_handle.await?;
    
    // Example 3: try_send for non-blocking sends
    info!("Example 3: try_send for non-blocking sends");
    
    let (tx, mut rx) = mpsc::channel::<i32>(1); // Buffer of 1
    
    // Fill the buffer
    tx.send(1).await?;
    info!("try_send example: Filled buffer with value 1");
    
    // Try to send another value (should fail)
    match tx.try_send(2) {
        Ok(_) => info!("try_send example: Unexpectedly succeeded"),
        Err(mpsc::error::TrySendError::Full(value)) => {
            info!("try_send example: Channel full, couldn't send {}", value);
        }
        Err(mpsc::error::TrySendError::Closed(_)) => {
            info!("try_send example: Channel closed");
        }
    }
    
    // Receive the value
    let value = rx.recv().await.unwrap();
    info!("try_send example: Received {}", value);
    
    // Now try_send should work
    match tx.try_send(3) {
        Ok(_) => info!("try_send example: Successfully sent 3"),
        Err(e) => info!("try_send example: Error: {:?}", e),
    }
    
    // Clean up
    drop(tx);
    while rx.recv().await.is_some() {}
    
    info!();
    Ok(())
}