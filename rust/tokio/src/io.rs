use tracing::info;
use std::time::Duration;

pub async fn run() -> anyhow::Result<()> {
    info!("=== Async I/O ===");
    info!();
    
    file_operations().await?;
    async_read().await?;
    async_write().await?;
    async_stdin_stdout().await?;
    buffer_operations().await?;
    
    info!();
    Ok(())
}

async fn file_operations() -> anyhow::Result<()> {
    info!("1. File Operations");
    info!("-------------------");
    
    use tokio::fs;
    use tokio::io::AsyncWriteExt;
    
    // Create a temporary file
    let file_path = "temp_example.txt";
    
    // Write to file
    {
        let mut file = fs::File::create(file_path).await?;
        let content = "Hello, async file I/O!\nThis is a test file.\n";
        file.write_all(content.as_bytes()).await?;
        file.flush().await?;
        info!("Wrote content to {}", file_path);
    }
    
    // Read from file
    {
        let mut content = String::new();
        let mut file = fs::File::open(file_path).await?;
        use tokio::io::AsyncReadExt;
        file.read_to_string(&mut content).await?;
        info!("Read from file:\n{}", content);
    }
    
    // Append to file
    {
        let mut file = fs::OpenOptions::new()
            .append(true)
            .open(file_path)
            .await?;
        file.write_all(b"This line was appended.\n").await?;
        file.flush().await?;
        info!("Appended to file");
    }
    
    // Read file metadata
    {
        let metadata = fs::metadata(file_path).await?;
        info!("File size: {} bytes", metadata.len());
        info!("Is file: {}", metadata.is_file());
    }
    
    // Clean up
    fs::remove_file(file_path).await?;
    info!("Removed temporary file");
    
    info!();
    Ok(())
}

async fn async_read() -> anyhow::Result<()> {
    info!("2. Async Reading");
    info!("-----------------");
    
    use tokio::io::{AsyncReadExt, BufReader};
    use tokio::fs::File;
    
    // Create a test file
    let file_path = "async_read_test.txt";
    {
        let mut file = File::create(file_path).await?;
        use tokio::io::AsyncWriteExt;
        for i in 1..=10 {
            file.write_all(format!("Line {}\n", i).as_bytes()).await?;
        }
        file.flush().await?;
    }
    
    // Read entire file into string
    {
        let mut content = String::new();
        let mut file = File::open(file_path).await?;
        file.read_to_string(&mut content).await?;
        info!("Read entire file:\n{}", content);
    }
    
    // Read line by line using BufReader
    {
        let file = File::open(file_path).await?;
        let mut reader = BufReader::new(file);
        let mut line = String::new();
        let mut line_count = 0;
        
        loop {
            let bytes_read = reader.read_line(&mut line).await?;
            if bytes_read == 0 {
                break;
            }
            
            line_count += 1;
            info!("Read line {}: {}", line_count, line.trim());
            line.clear();
        }
    }
    
    // Read specific number of bytes
    {
        let mut file = File::open(file_path).await?;
        let mut buffer = [0u8; 20];
        let bytes_read = file.read(&mut buffer).await?;
        info!("Read {} bytes: {:?}", bytes_read, &buffer[..bytes_read]);
    }
    
    // Clean up
    tokio::fs::remove_file(file_path).await?;
    
    info!();
    Ok(())
}

async fn async_write() -> anyhow::Result<()> {
    info!("3. Async Writing");
    info!("------------------");
    
    use tokio::io::{AsyncWriteExt, BufWriter};
    use tokio::fs::File;
    
    // Create a test file
    let file_path = "async_write_test.txt";
    
    // Write with buffering
    {
        let file = File::create(file_path).await?;
        let mut writer = BufWriter::new(file);
        
        for i in 1..=5 {
            let line = format!("Buffered line {}\n", i);
            writer.write_all(line.as_bytes()).await?;
            info!("Wrote to buffer: {}", line.trim());
        }
        
        // Flush ensures all buffered data is written
        writer.flush().await?;
        info!("Flushed buffer to disk");
    }
    
    // Append with BufWriter
    {
        let file = tokio::fs::OpenOptions::new()
            .append(true)
            .open(file_path)
            .await?;
        let mut writer = BufWriter::new(file);
        
        writer.write_all(b"\n--- Appended section ---\n").await?;
        
        for i in 1..=3 {
            let line = format!("Appended line {}\n", i);
            writer.write_all(line.as_bytes()).await?;
        }
        
        writer.flush().await?;
        info!("Appended content to file");
    }
    
    // Read back to verify
    {
        let mut content = String::new();
        let mut file = File::open(file_path).await?;
        use tokio::io::AsyncReadExt;
        file.read_to_string(&mut content).await?;
        info!("Final file content:\n{}", content);
    }
    
    // Clean up
    tokio::fs::remove_file(file_path).await?;
    
    info!();
    Ok(())
}

async fn async_stdin_stdout() -> anyhow::Result<()> {
    info!("4. Async Stdin/Stdout");
    info!("----------------------");
    
    use tokio::io::{self, AsyncBufReadExt, BufReader};
    
    // Note: This example is for demonstration. In a real scenario,
    // you might not want to block on stdin in examples.
    
    info!("Simulating async stdout operations");
    
    // Async stdout
    {
        use tokio::io::AsyncWriteExt;
        let mut stdout = io::stdout();
        
        stdout.write_all(b"Hello from async stdout!\n").await?;
        stdout.flush().await?;
        
        // Write with formatting
        use std::fmt::Write;
        let mut buffer = String::new();
        writeln!(&mut buffer, "Formatted output: {}", 42)?;
        stdout.write_all(buffer.as_bytes()).await?;
        stdout.flush().await?;
    }
    
    // Simulate async stdin (normally would wait for user input)
    info!("Simulating async stdin operations");
    
    // Create a mock input for demonstration
    let mock_input = "line 1\nline 2\nline 3\n";
    let mut cursor = io::BufReader::new(mock_input.as_bytes());
    
    let mut line = String::new();
    let mut line_count = 0;
    
    loop {
        let bytes_read = cursor.read_line(&mut line).await?;
        if bytes_read == 0 {
            break;
        }
        
        line_count += 1;
        info!("Read from stdin: {}", line.trim());
        line.clear();
        
        // Simulate processing each line
        tokio::time::sleep(Duration::from_millis(50)).await;
    }
    
    info!();
    Ok(())
}

async fn buffer_operations() -> anyhow::Result<()> {
    info!("5. Buffer Operations");
    info!("----------------------");
    
    use tokio::io::{AsyncReadExt, AsyncWriteExt, BufReader, BufWriter};
    use bytes::{Buf, BufMut, BytesMut};
    
    // Example 1: BufReader for efficient reading
    {
        let data = b"The quick brown fox jumps over the lazy dog";
        let mut reader = BufReader::new(&data[..]);
        
        // Read until a space
        let mut word = Vec::new();
        reader.read_until(b' ', &mut word).await?;
        info!("Read until space: {}", String::from_utf8_lossy(&word));
        
        // Read remaining data
        let mut remaining = String::new();
        reader.read_to_string(&mut remaining).await?;
        info!("Remaining data: {}", remaining);
    }
    
    // Example 2: BufWriter for efficient writing
    {
        let mut buffer = Vec::new();
        let mut writer = BufWriter::new(&mut buffer);
        
        // Write multiple small chunks
        for i in 1..=5 {
            let chunk = format!("Chunk {}\n", i);
            writer.write_all(chunk.as_bytes()).await?;
            info!("Wrote chunk to buffer (not flushed yet)");
        }
        
        // Flush to ensure all data is written
        writer.flush().await?;
        info!("Flushed buffer, total size: {} bytes", buffer.len());
        
        let content = String::from_utf8_lossy(&buffer);
        info!("Buffer content:\n{}", content);
    }
    
    // Example 3: BytesMut for dynamic buffers
    {
        let mut buffer = BytesMut::with_capacity(1024);
        
        // Put data into buffer
        buffer.put("Hello, ".as_bytes());
        buffer.put("BytesMut!".as_bytes());
        
        info!("BytesMut content: {:?}", String::from_utf8_lossy(&buffer));
        
        // Extract data from buffer
        let data = buffer.split();
        info!("Extracted data: {:?}", String::from_utf8_lossy(&data));
        
        // Buffer is now empty after split
        info!("Buffer after split: {:?}", buffer);
    }
    
    // Example 4: Copy operation with buffering
    {
        let source = b"Source data for copy operation";
        let mut dest = Vec::new();
        
        let mut reader = BufReader::new(&source[..]);
        let mut writer = BufWriter::new(&mut dest);
        
        io::copy(&mut reader, &mut writer).await?;
        writer.flush().await?;
        
        info!("Copied data: {}", String::from_utf8_lossy(&dest));
    }
    
    info!();
    Ok(())
}