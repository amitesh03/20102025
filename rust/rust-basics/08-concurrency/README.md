# 08. Concurrency

This section covers Rust's approach to concurrent programming, which emphasizes safety and preventing data races.

## Topics Covered

1. **Threads**
   - Creating threads
   - Joining threads
   - Using move closures
2. **Channels**
   - Creating channels
   - Sending and receiving messages
3. **Shared State**
   - Mutex
   - Arc
4. **Async/Await** (introduction)

## Key Concepts

### Threads

Threads allow you to run multiple pieces of code concurrently.

### Channels

Channels provide a way for threads to communicate with each other by sending messages.

### Shared State

Shared state concurrency allows multiple threads to access shared data safely using synchronization primitives.

## Examples

Each example in the `examples/` folder demonstrates a specific concept. Run them with:

```bash
cargo run --bin example_name
```

## Exercises

Test your understanding with the exercises in the `exercises/` folder.