use tracing::info;
use std::time::Duration;
use futures_util::{Stream, StreamExt};

pub async fn run() -> anyhow::Result<()> {
    info!("=== Async Streams ===");
    info!();
    
    basic_streams().await?;
    stream_adapters().await?;
    stream_combinators().await?;
    async_generator().await?;
    tokio_stream_examples().await?;
    
    info!();
    Ok(())
}

async fn basic_streams() -> anyhow::Result<()> {
    info!("1. Basic Streams");
    info!("-----------------");
    
    // Example 1: Create a simple stream from an iterator
    info!("Example 1: Stream from iterator");
    let numbers = vec![1, 2, 3, 4, 5];
    let mut stream = futures_util::stream::iter(numbers);
    
    while let Some(number) = stream.next().await {
        info!("Received number: {}", number);
    }
    
    // Example 2: Create a stream that yields values over time
    info!("Example 2: Time-based stream");
    
    let time_stream = async_stream::stream! {
        for i in 1..=5 {
            yield i;
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
    };
    
    tokio::pin!(time_stream);
    
    while let Some(value) = time_stream.next().await {
        info!("Time stream yielded: {}", value);
    }
    
    // Example 3: Stream from a channel
    info!("Example 3: Stream from channel");
    
    use tokio::sync::mpsc;
    
    let (tx, rx) = mpsc::channel(10);
    
    // Spawn a sender
    tokio::spawn(async move {
        for i in 1..=5 {
            tx.send(i).await.unwrap();
            tokio::time::sleep(Duration::from_millis(50)).await;
        }
    });
    
    // Convert receiver to a stream
    let mut channel_stream = ReceiverStream::new(rx);
    
    while let Some(value) = channel_stream.next().await {
        info!("Channel stream yielded: {}", value);
    }
    
    info!();
    Ok(())
}

async fn stream_adapters() -> anyhow::Result<()> {
    info!("2. Stream Adapters");
    info!("-------------------");
    
    // Create a stream of numbers
    let numbers = futures_util::stream::iter(1..=10);
    
    // Example 1: Filter
    info!("Example 1: Filter even numbers");
    let even_numbers = numbers.clone().filter(|x| async move { x % 2 == 0 });
    
    tokio::pin!(even_numbers);
    
    while let Some(number) = even_numbers.next().await {
        info!("Even number: {}", number);
    }
    
    // Example 2: Map
    info!("Example 2: Map to squares");
    let squares = numbers.clone().map(|x| x * x);
    
    tokio::pin!(squares);
    
    let mut count = 0;
    while let Some(square) = squares.next().await {
        count += 1;
        info!("Square {}: {}", count, square);
        if count >= 5 { break; }
    }
    
    // Example 3: Filter + Map chain
    info!("Example 3: Filter odd numbers and double them");
    let doubled_odds = numbers.clone()
        .filter(|x| async move { x % 2 != 0 })
        .map(|x| x * 2);
    
    tokio::pin!(doubled_odds);
    
    while let Some(value) = doubled_odds.next().await {
        info!("Doubled odd: {}", value);
    }
    
    // Example 4: Take
    info!("Example 4: Take first 3 values");
    let first_three = numbers.clone().take(3);
    
    tokio::pin!(first_three);
    
    while let Some(value) = first_three.next().await {
        info!("First three: {}", value);
    }
    
    // Example 5: Skip
    info!("Example 5: Skip first 3 values");
    let after_three = numbers.clone().skip(3);
    
    tokio::pin!(after_three);
    
    let mut count = 0;
    while let Some(value) = after_three.next().await {
        count += 1;
        info!("After skip {}: {}", count, value);
        if count >= 3 { break; }
    }
    
    info!();
    Ok(())
}

async fn stream_combinators() -> anyhow::Result<()> {
    info!("3. Stream Combinators");
    info!("---------------------");
    
    use futures_util::stream;
    
    // Example 1: Chain streams
    info!("Example 1: Chain streams");
    let stream1 = stream::iter(vec![1, 2, 3]);
    let stream2 = stream::iter(vec![4, 5, 6]);
    let stream3 = stream::iter(vec![7, 8, 9]);
    
    let chained = stream1.chain(stream2).chain(stream3);
    
    tokio::pin!(chained);
    
    while let Some(value) = chained.next().await {
        info!("Chained value: {}", value);
    }
    
    // Example 2: Select between streams
    info!("Example 2: Select between streams");
    
    let fast_stream = async_stream::stream! {
        for i in 1..=5 {
            yield format!("Fast {}", i);
            tokio::time::sleep(Duration::from_millis(50)).await;
        }
    };
    
    let slow_stream = async_stream::stream! {
        for i in 1..=3 {
            yield format!("Slow {}", i);
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
    };
    
    let selected = futures_util::stream::select(fast_stream, slow_stream);
    
    tokio::pin!(selected);
    
    while let Some(value) = selected.next().await {
        info!("Selected value: {}", value);
    }
    
    // Example 3: Merge streams
    info!("Example 3: Merge streams");
    
    let stream_a = async_stream::stream! {
        for i in 1..=3 {
            yield i;
            tokio::time::sleep(Duration::from_millis(80)).await;
        }
    };
    
    let stream_b = async_stream::stream! {
        for i in 10..=12 {
            yield i;
            tokio::time::sleep(Duration::from_millis(60)).await;
        }
    };
    
    let merged = futures_util::stream::select(stream_a, stream_b);
    
    tokio::pin!(merged);
    
    while let Some(value) = merged.next().await {
        info!("Merged value: {}", value);
    }
    
    // Example 4: Zip streams
    info!("Example 4: Zip streams");
    
    let numbers = stream::iter(vec![1, 2, 3, 4, 5]);
    let words = stream::iter(vec!["one", "two", "three", "four", "five"]);
    
    let zipped = numbers.zip(words);
    
    tokio::pin!(zipped);
    
    while let Some((number, word)) = zipped.next().await {
        info!("Zipped: {} = {}", number, word);
    }
    
    info!();
    Ok(())
}

async fn async_generator() -> anyhow::Result<()> {
    info!("4. Async Generator");
    info!("--------------------");
    
    // Example 1: Simple async generator
    info!("Example 1: Simple async generator");
    
    let simple_generator = async_stream::stream! {
        for i in 1..=5 {
            yield i;
            tokio::time::sleep(Duration::from_millis(50)).await;
        }
    };
    
    tokio::pin!(simple_generator);
    
    while let Some(value) = simple_generator.next().await {
        info!("Generator yielded: {}", value);
    }
    
    // Example 2: Generator with conditional yielding
    info!("Example 2: Conditional generator");
    
    let conditional_generator = async_stream::stream! {
        for i in 1..=10 {
            if i % 2 == 0 {
                yield i;
            } else {
                // Skip odd numbers
                continue;
            }
            tokio::time::sleep(Duration::from_millis(30)).await;
        }
    };
    
    tokio::pin!(conditional_generator);
    
    while let Some(value) = conditional_generator.next().await {
        info!("Conditional generator yielded: {}", value);
    }
    
    // Example 3: Generator with complex computation
    info!("Example 3: Generator with computation");
    
    let compute_generator = async_stream::stream! {
        let mut sum = 0;
        for i in 1..=5 {
            sum += i;
            yield (i, sum);
            tokio::time::sleep(Duration::from_millis(70)).await;
        }
    };
    
    tokio::pin!(compute_generator);
    
    while let Some((number, sum)) = compute_generator.next().await {
        info!("Computation: {} -> cumulative sum {}", number, sum);
    }
    
    // Example 4: Generator that produces different types
    info!("Example 4: Multi-type generator");
    
    let multi_type_generator = async_stream::stream! {
        yield 42i32;
        tokio::time::sleep(Duration::from_millis(50)).await;
        yield "Hello".to_string();
        tokio::time::sleep(Duration::from_millis(50)).await;
        yield true;
        tokio::time::sleep(Duration::from_millis(50)).await;
        yield 3.14f64;
    };
    
    tokio::pin!(multi_type_generator);
    
    while let Some(value) = multi_type_generator.next().await {
        info!("Multi-type generator yielded: {:?}", value);
    }
    
    info!();
    Ok(())
}

async fn tokio_stream_examples() -> anyhow::Result<()> {
    info!("5. Tokio Stream Utilities");
    info!("--------------------------");
    
    use tokio_stream::{self as tokio_stream_ext, StreamExt};
    use tokio::sync::mpsc;
    
    // Example 1: Throttle a stream
    info!("Example 1: Throttle stream");
    
    let fast_stream = async_stream::stream! {
        for i in 1..=10 {
            yield i;
            tokio::time::sleep(Duration::from_millis(20)).await;
        }
    };
    
    let throttled = fast_stream.throttle(Duration::from_millis(100));
    
    tokio::pin!(throttled);
    
    while let Some(value) = throttled.next().await {
        info!("Throttled value: {}", value);
    }
    
    // Example 2: Split stream into chunks
    info!("Example 2: Chunk stream");
    
    let number_stream = futures_util::stream::iter(1..=10);
    let chunks = number_stream.chunks(3);
    
    tokio::pin!(chunks);
    
    while let Some(chunk) = chunks.next().await {
        info!("Chunk: {:?}", chunk);
    }
    
    // Example 3: Timeout stream operations
    info!("Example 3: Timeout stream operations");
    
    let slow_stream = async_stream::stream! {
        for i in 1..=5 {
            yield i;
            tokio::time::sleep(Duration::from_millis(200)).await;
        }
    };
    
    let timeout_stream = slow_stream.timeout(Duration::from_millis(150));
    
    tokio::pin!(timeout_stream);
    
    while let Some(result) = timeout_stream.next().await {
        match result {
            Ok(value) => info!("Received value: {}", value),
            Err(e) => info!("Timeout error: {}", e),
        }
    }
    
    // Example 4: Collect stream into collection
    info!("Example 4: Collect stream");
    
    let collect_stream = futures_util::stream::iter(1..=10);
    let collected: Vec<i32> = collect_stream.collect().await;
    
    info!("Collected values: {:?}", collected);
    
    // Example 5: Fold/reduce stream
    info!("Example 5: Fold stream");
    
    let fold_stream = futures_util::stream::iter(1..=10);
    let sum = fold_stream.fold(0, |acc, x| async move { acc + x }).await;
    
    info!("Sum of 1..10: {}", sum);
    
    // Example 6: For each stream item
    info!("Example 6: For each stream item");
    
    let for_each_stream = futures_util::stream::iter(vec!["apple", "banana", "cherry"]);
    
    for_each_stream.for_each(|item| async move {
        info!("Processing item: {}", item);
        tokio::time::sleep(Duration::from_millis(50)).await;
    }).await;
    
    // Example 7: Filter map
    info!("Example 7: Filter map");
    
    let filter_map_stream = futures_util::stream::iter(1..=10);
    let processed = filter_map_stream.filter_map(|x| async move {
        if x % 2 == 0 {
            Some(x * x)
        } else {
            None
        }
    });
    
    tokio::pin!(processed);
    
    while let Some(value) = processed.next().await {
        info!("Processed value: {}", value);
    }
    
    // Example 8: Scan (like fold but yields intermediate results)
    info!("Example 8: Scan");
    
    let scan_stream = futures_util::stream::iter(1..=5);
    let scanned = scan_stream.scan(0, |acc, x| async move {
        *acc += x;
        Some(*acc)
    });
    
    tokio::pin!(scanned);
    
    while let Some(value) = scanned.next().await {
        info!("Scanned value: {}", value);
    }
    
    info!();
    Ok(())
}

// Helper struct to convert a tokio mpsc receiver into a stream
struct ReceiverStream<T> {
    receiver: tokio::sync::mpsc::Receiver<T>,
}

impl<T> ReceiverStream<T> {
    fn new(receiver: tokio::sync::mpsc::Receiver<T>) -> Self {
        Self { receiver }
    }
}

impl<T> Stream for ReceiverStream<T> {
    type Item = T;
    
    fn poll_next(
        mut self: std::pin::Pin<&mut Self>,
        cx: &mut std::task::Context<'_>,
    ) -> std::task::Poll<Option<Self::Item>> {
        use std::task::Poll;
        
        match self.receiver.poll_recv(cx) {
            Poll::Ready(item) => Poll::Ready(item),
            Poll::Pending => Poll::Pending,
        }
    }
}