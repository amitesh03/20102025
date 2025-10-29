# Tokio Async Runtime Examples

This project contains comprehensive examples of using the Tokio async runtime in Rust. Tokio is an asynchronous runtime for the Rust programming language that provides the building blocks needed for writing reliable asynchronous applications with Rust.

## Project Structure

```
tokio/
├── Cargo.toml          # Dependencies
├── README.md           # This file
└── src/
    ├── main.rs         # Main application entry point
    ├── basics.rs       # Basic async/await concepts
    ├── tasks.rs        # Task spawning and management
    ├── async_primitives.rs # Async synchronization primitives
    ├── io.rs           # Async I/O operations
    ├── networking.rs   # Async networking
    ├── time.rs         # Time and timers
    ├── sync.rs         # Synchronization primitives
    ├── channels.rs     # Advanced channel patterns
    ├── streams.rs      # Async streams
    └── error_handling.rs # Error handling in async code
```

## Features Demonstrated

### 1. Basic Async Concepts
- Hello world async functions
- Async function composition
- Concurrent task execution with `tokio::join!`
- Task spawning with `tokio::spawn`
- Join handles and task management

### 2. Task Management
- Task spawning and lifecycle
- Blocking operations with `spawn_blocking`
- Task-local storage
- Task cancellation and shutdown
- Timeouts and task abortion

### 3. Async Primitives
- Async `Mutex` for exclusive access
- Async `RwLock` for read-write access
- Async `Semaphore` for limiting concurrency
- Async `Barrier` for synchronization points
- Async `OnceCell` for one-time initialization

### 4. Async I/O
- File operations (read, write, append)
- Buffered I/O with `BufReader` and `BufWriter`
- Async stdin/stdout handling
- Buffer operations and efficiency

### 5. Async Networking
- TCP client and server
- UDP sockets
- HTTP client with reqwest
- Concurrent network operations

### 6. Time and Timers
- `tokio::time::sleep` for delays
- Intervals for periodic operations
- Timeouts for operations
- Instant and duration handling
- Delay queues for scheduled operations

### 7. Synchronization Primitives
- Oneshot channels for one-time communication
- Broadcast channels for pub/sub patterns
- Watch channels for value changes
- MPSC channels for multiple producers
- Channel combinations and patterns

### 8. Advanced Channel Patterns
- Fan-out/fan-in patterns
- Request/response patterns
- Worker pool implementation
- Select on multiple channels
- Channel chaining and combinations

### 9. Async Streams
- Creating streams from iterators
- Stream adapters (map, filter, take, etc.)
- Stream combinators (chain, select, merge, zip)
- Async generators
- Tokio stream utilities

### 10. Error Handling
- Basic Result handling in async
- Custom error types with `thiserror`
- Error propagation and conversion
- Error recovery strategies (retry, fallback)
- Error handling with `select!`

## Getting Started

### Prerequisites
- Rust 1.70 or higher
- Cargo

### Running the Examples

1. Clone the repository or navigate to the tokio directory
2. Run the application:
   ```bash
   cargo run
   ```

3. The examples will run sequentially, demonstrating each concept

### Running Individual Examples

You can modify the `main.rs` file to run only specific examples by commenting out the ones you don't want to run:

```rust
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_max_level(Level::INFO)
        .init();
    
    info!("Tokio Examples");
    info!("================");
    info!();
    
    // Run only the examples you want
    basics::run().await?;
    tasks::run().await?;
    // Comment out other examples...
    
    info!("All examples completed successfully!");
    Ok(())
}
```

## Key Concepts

### Async/Await Syntax
```rust
async fn example() -> Result<String, Error> {
    let result = some_async_function().await?;
    Ok(result)
}
```

### Task Spawning
```rust
let handle = tokio::spawn(async {
    // Async work here
});

let result = handle.await?;
```

### Concurrent Operations
```rust
let (result1, result2) = tokio::join!(
    async_operation_1(),
    async_operation_2()
);
```

### Channels
```rust
use tokio::sync::mpsc;

let (tx, mut rx) = mpsc::channel(10);

// Send
tx.send(value).await?;

// Receive
let value = rx.recv().await?;
```

### Time Operations
```rust
// Sleep
tokio::time::sleep(Duration::from_secs(1)).await;

// Timeout
let result = tokio::time::timeout(
    Duration::from_secs(5),
    long_running_operation()
).await?;
```

## Dependencies

The project uses several key dependencies:

- `tokio` with the `full` feature flag - The async runtime
- `tokio-util` - Additional utilities for Tokio
- `futures` - Future and stream utilities
- `serde` and `serde_json` - Serialization
- `tracing` and `tracing-subscriber` - Structured logging
- `anyhow` and `thiserror` - Error handling
- `reqwest` - HTTP client
- `async-stream` - Async stream generators

## Learning Path

1. **Start with `basics.rs`** - Understand async/await fundamentals
2. **Move to `tasks.rs`** - Learn about task management
3. **Study `async_primitives.rs`** - Master synchronization
4. **Explore `io.rs` and `networking.rs`** - Practical I/O
5. **Dive into `sync.rs` and `channels.rs`** - Advanced patterns
6. **Check `streams.rs`** - Stream processing
7. **Finish with `error_handling.rs`** - Robust error management

## Common Patterns

### Retry Pattern
```rust
async fn retry_operation<F, Fut, T, E>(operation: F, max_retries: usize) -> Result<T, E>
where
    F: Fn(usize) -> Fut,
    Fut: std::future::Future<Output = Result<T, E>>,
{
    for attempt in 1..=max_retries {
        match operation(attempt).await {
            Ok(result) => return Ok(result),
            Err(_) if attempt < max_retries => continue,
            Err(e) => return Err(e),
        }
    }
    unreachable!()
}
```

### Worker Pool
```rust
let (task_tx, task_rx) = mpsc::channel(100);

for _ in 0..num_workers {
    let task_rx = task_rx.clone();
    tokio::spawn(async move {
        while let Some(task) = task_rx.recv().await {
            process_task(task).await;
        }
    });
}
```

### Graceful Shutdown
```rust
let (shutdown_tx, shutdown_rx) = oneshot::channel();

tokio::spawn(async move {
    while let Some(task) = task_rx.recv().await {
        select! {
            result = process_task(task) => {
                // Handle result
            }
            _ = &mut shutdown_signal => {
                info!("Shutting down worker");
                break;
            }
        }
    }
});
```

## Performance Considerations

1. **Use `spawn_blocking` for CPU-intensive tasks**
2. **Buffer channels appropriately**
3. **Prefer `tokio::join!` over sequential awaits when possible**
4. **Use streams for large data sets**
5. **Implement proper error handling to avoid panics**

## Testing

While this example doesn't include tests, in a real application you would:

1. Add `#[cfg(test)]` modules
2. Use `tokio::test` for async tests
3. Mock dependencies for unit tests
4. Use `tokio-test` for testing utilities

## Additional Resources

- [Tokio Documentation](https://tokio.rs/tokio/tutorial)
- [Async Rust Book](https://rust-lang.github.io/async-book/)
- [Rust Async Book](https://rust-lang.github.io/async-book/)
- [Tokio GitHub Repository](https://github.com/tokio-rs/tokio)
- [Futures Documentation](https://docs.rs/futures/)

## Contributing

Feel free to submit issues and enhancement requests!