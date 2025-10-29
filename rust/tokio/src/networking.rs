use tracing::info;
use std::time::Duration;

pub async fn run() -> anyhow::Result<()> {
    info!("=== Async Networking ===");
    info!();
    
    tcp_client().await?;
    tcp_server().await?;
    udp_socket().await?;
    http_client().await?;
    
    info!();
    Ok(())
}

async fn tcp_client() -> anyhow::Result<()> {
    info!("1. TCP Client");
    info!("--------------");
    
    use tokio::io::{AsyncReadExt, AsyncWriteExt};
    use tokio::net::TcpStream;
    
    // Connect to a TCP server (using httpbin.org for demonstration)
    match TcpStream::connect("httpbin.org:80").await {
        Ok(mut stream) => {
            info!("Connected to httpbin.org:80");
            
            // Send HTTP request
            let request = "GET /get HTTP/1.1\r\nHost: httpbin.org\r\nConnection: close\r\n\r\n";
            stream.write_all(request.as_bytes()).await?;
            info!("Sent HTTP request");
            
            // Read response
            let mut response = Vec::new();
            stream.read_to_end(&mut response).await?;
            info!("Received {} bytes", response.len());
            
            // Print first 200 bytes of response
            let preview = String::from_utf8_lossy(&response[..response.len().min(200)]);
            info!("Response preview:\n{}", preview);
        }
        Err(e) => {
            info!("Failed to connect: {}", e);
        }
    }
    
    info!();
    Ok(())
}

async fn tcp_server() -> anyhow::Result<()> {
    info!("2. TCP Server");
    info!("--------------");
    
    use tokio::io::{AsyncReadExt, AsyncWriteExt};
    use tokio::net::{TcpListener, TcpStream};
    use std::sync::Arc;
    
    // Create a simple echo server
    async fn handle_client(mut stream: TcpStream) -> anyhow::Result<()> {
        let addr = stream.peer_addr()?;
        info!("New connection from {}", addr);
        
        let mut buffer = [0; 1024];
        
        loop {
            // Read data from client
            let n = match stream.read(&mut buffer).await {
                Ok(n) if n == 0 => {
                    info!("Connection closed by {}", addr);
                    return Ok(());
                }
                Ok(n) => n,
                Err(e) => {
                    info!("Failed to read from {}: {}", addr, e);
                    return Ok(());
                }
            };
            
            let data = &buffer[..n];
            info!("Received {} bytes from {}: {:?}", n, addr, data);
            
            // Echo the data back
            if let Err(e) = stream.write_all(data).await {
                info!("Failed to write to {}: {}", addr, e);
                return Ok(());
            }
        }
    }
    
    // Bind to localhost:0 to get an available port
    let listener = TcpListener::bind("127.0.0.1:0").await?;
    let port = listener.local_addr()?.port();
    info!("TCP server listening on 127.0.0.1:{}", port);
    
    // Spawn the server task
    let server_handle = tokio::spawn(async move {
        loop {
            match listener.accept().await {
                Ok((stream, addr)) => {
                    info!("Accepted connection from {}", addr);
                    tokio::spawn(handle_client(stream));
                }
                Err(e) => {
                    info!("Failed to accept connection: {}", e);
                    break;
                }
            }
        }
    });
    
    // Give the server time to start
    tokio::time::sleep(Duration::from_millis(100)).await;
    
    // Test the server with a client
    {
        let mut client = TcpStream::connect(format!("127.0.0.1:{}", port)).await?;
        info!("Connected to test server");
        
        // Send test data
        let test_data = b"Hello, TCP server!";
        client.write_all(test_data).await?;
        info!("Sent test data");
        
        // Read response
        let mut response = vec![0u8; test_data.len()];
        client.read_exact(&mut response).await?;
        info!("Received echo: {:?}", String::from_utf8_lossy(&response));
    }
    
    // Stop the server
    server_handle.abort();
    
    info!();
    Ok(())
}

async fn udp_socket() -> anyhow::Result<()> {
    info!("3. UDP Socket");
    info!("--------------");
    
    use tokio::net::UdpSocket;
    
    // Create a UDP socket bound to localhost:0
    let socket = UdpSocket::bind("127.0.0.1:0").await?;
    let local_port = socket.local_addr()?.port();
    info!("UDP socket bound to 127.0.0.1:{}", local_port);
    
    // Create another socket to send/receive messages
    let peer_socket = UdpSocket::bind("127.0.0.1:0").await?;
    let peer_port = peer_socket.local_addr()?.port();
    info!("Peer socket bound to 127.0.0.1:{}", peer_port);
    
    // Spawn a task to receive messages
    let socket_clone = socket.clone();
    let receiver_handle = tokio::spawn(async move {
        let mut buf = [0; 1024];
        
        match socket_clone.recv_from(&mut buf).await {
            Ok((len, addr)) => {
                let message = String::from_utf8_lossy(&buf[..len]);
                info!("Received '{}' from {}", message, addr);
            }
            Err(e) => {
                info!("Failed to receive: {}", e);
            }
        }
    });
    
    // Send a message from peer to socket
    let message = "Hello, UDP!";
    peer_socket
        .send_to(message.as_bytes(), format!("127.0.0.1:{}", local_port))
        .await?;
    info!("Sent '{}' to 127.0.0.1:{}", message, local_port);
    
    // Wait for the receiver to get the message
    receiver_handle.await?;
    
    info!();
    Ok(())
}

async fn http_client() -> anyhow::Result<()> {
    info!("4. HTTP Client");
    info!("----------------");
    
    use reqwest;
    use serde_json::Value;
    
    // Example 1: Simple GET request
    info!("Example 1: Simple GET request");
    match reqwest::get("https://httpbin.org/get").await {
        Ok(response) => {
            info!("Response status: {}", response.status());
            
            match response.json::<Value>().await {
                Ok(json) => {
                    if let Some(origin) = json.get("origin").and_then(|v| v.as_str()) {
                        info!("Your IP address (from httpbin): {}", origin);
                    }
                }
                Err(e) => info!("Failed to parse JSON: {}", e),
            }
        }
        Err(e) => info!("GET request failed: {}", e),
    }
    
    // Example 2: POST request with JSON body
    info!("Example 2: POST request with JSON");
    let client = reqwest::Client::new();
    let post_data = serde_json::json!({
        "name": "Rust Developer",
        "message": "Learning async programming with Tokio"
    });
    
    match client
        .post("https://httpbin.org/post")
        .json(&post_data)
        .send()
        .await
    {
        Ok(response) => {
            info!("POST response status: {}", response.status());
            
            match response.json::<Value>().await {
                Ok(json) => {
                    if let Some(data) = json.get("json") {
                        info!("Server received JSON: {}", data);
                    }
                }
                Err(e) => info!("Failed to parse JSON: {}", e),
            }
        }
        Err(e) => info!("POST request failed: {}", e),
    }
    
    // Example 3: Streaming response
    info!("Example 3: Streaming response");
    match client.get("https://httpbin.org/stream/5").send().await {
        Ok(response) => {
            info!("Streaming response status: {}", response.status());
            
            let mut stream = response.bytes_stream();
            let mut count = 0;
            
            use futures_util::StreamExt;
            while let Some(chunk_result) = stream.next().await {
                match chunk_result {
                    Ok(chunk) => {
                        count += 1;
                        let chunk_str = String::from_utf8_lossy(&chunk);
                        info!("Stream chunk {}: {}", count, chunk_str.trim());
                    }
                    Err(e) => {
                        info!("Stream error: {}", e);
                        break;
                    }
                }
                
                if count >= 3 { // Limit output for demo
                    break;
                }
            }
        }
        Err(e) => info!("Stream request failed: {}", e),
    }
    
    // Example 4: Concurrent requests
    info!("Example 4: Concurrent requests");
    let urls = vec![
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/2",
        "https://httpbin.org/delay/1",
    ];
    
    let start = std::time::Instant::now();
    
    let futures: Vec<_> = urls
        .into_iter()
        .map(|url| {
            let client = client.clone();
            tokio::spawn(async move {
                let response = client.get(url).send().await?;
                Ok::<_, reqwest::Error>(response)
            })
        })
        .collect();
    
    // Wait for all requests to complete
    for future in futures {
        match future.await {
            Ok(Ok(response)) => {
                info!("Completed request with status: {}", response.status());
            }
            Ok(Err(e)) => info!("Request failed: {}", e),
            Err(e) => info!("Task panicked: {}", e),
        }
    }
    
    let duration = start.elapsed();
    info!("All concurrent requests completed in {:?}", duration);
    
    info!();
    Ok(())
}