use rocket::futures::{SinkExt, StreamExt};
use rocket::response::content::RawHtml;
use rocket::serde::json::Json;
use rocket::tokio::sync::broadcast::{channel, Sender};
use rocket::tokio::time::{interval, Duration};
use rocket::{get, routes, State};
use rocket_ws::{WebSocket, WebSocketChannel, Message};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use uuid::Uuid;
use crate::models::ApiResponse;

// WebSocket message types
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WsMessage {
    Chat { id: Uuid, user: String, message: String, timestamp: String },
    System { message: String },
    UserJoined { user: String },
    UserLeft { user: String },
    Ping,
    Pong,
    Error { message: String },
}

// Chat room state
pub struct ChatRoom {
    users: Mutex<HashMap<String, String>>, // user_id -> username
    broadcast: Sender<WsMessage>,
}

impl ChatRoom {
    pub fn new() -> Self {
        let (tx, _) = channel(100);
        Self {
            users: Mutex::new(HashMap::new()),
            broadcast: tx,
        }
    }

    pub fn add_user(&self, user_id: String, username: String) {
        self.users.lock().unwrap().insert(user_id, username);
    }

    pub fn remove_user(&self, user_id: &str) -> Option<String> {
        self.users.lock().unwrap().remove(user_id)
    }

    pub fn get_users(&self) -> Vec<String> {
        self.users.lock().unwrap().values().cloned().collect()
    }

    pub fn broadcast(&self, message: WsMessage) {
        let _ = self.broadcast.send(message);
    }
}

// WebSocket endpoint for chat
#[get("/websocket")]
pub fn websocket(chat_room: &State<ChatRoom>, ws: WebSocket, mut channel: WebSocketChannel) {
    let user_id = Uuid::new_v4().to_string();
    let username = format!("User-{}", &user_id[..8]);
    
    // Add user to chat room
    chat_room.add_user(user_id.clone(), username.clone());
    
    // Broadcast user joined message
    chat_room.broadcast(WsMessage::UserJoined { user: username.clone() });
    
    // Subscribe to broadcast messages
    let mut rx = chat_room.broadcast.subscribe();
    
    // Handle WebSocket connection
    rocket::tokio::spawn(async move {
        let mut interval_timer = interval(Duration::from_secs(30));
        
        loop {
            tokio::select! {
                // Handle incoming messages from client
                Some(msg) = channel.next() => {
                    match msg {
                        Message::Text(text) => {
                            match serde_json::from_str::<serde_json::Value>(&text) {
                                Ok(json) => {
                                    if let Some(message) = json.get("message").and_then(|v| v.as_str()) {
                                        let chat_message = WsMessage::Chat {
                                            id: Uuid::new_v4(),
                                            user: username.clone(),
                                            message: message.to_string(),
                                            timestamp: chrono::Utc::now().to_rfc3339(),
                                        };
                                        chat_room.broadcast(chat_message);
                                    }
                                }
                                Err(_) => {
                                    let _ = channel.send(Message::Text(serde_json::to_string(&WsMessage::Error {
                                        message: "Invalid JSON format".to_string(),
                                    }).unwrap_or_default())).await;
                                }
                            }
                        }
                        Message::Close(_) => {
                            break;
                        }
                        Message::Ping(data) => {
                            let _ = channel.send(Message::Pong(data)).await;
                        }
                        Message::Pong(_) => {
                            // Handle pong if needed
                        }
                        _ => {}
                    }
                }
                
                // Handle broadcast messages
                Ok(msg) = rx.recv() => {
                    if let Ok(text) = serde_json::to_string(&msg) {
                        let _ = channel.send(Message::Text(text)).await;
                    }
                }
                
                // Send periodic ping
                _ = interval_timer.tick() => {
                    let _ = channel.send(Message::Text(serde_json::to_string(&WsMessage::Ping).unwrap_or_default())).await;
                }
            }
        }
        
        // Remove user from chat room
        if let Some(username) = chat_room.remove_user(&user_id) {
            chat_room.broadcast(WsMessage::UserLeft { user: username });
        }
    });
}

// WebSocket test page
#[get("/websocket")]
pub fn websocket_page() -> RawHtml<&'static str> {
    RawHtml(r#"
<!DOCTYPE html>
<html>
<head>
    <title>WebSocket Chat Demo</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
        .chat-container { display: flex; height: 500px; }
        .users-panel { width: 200px; background-color: #f8f9fa; border-right: 1px solid #ddd; padding: 15px; }
        .messages-panel { flex: 1; display: flex; flex-direction: column; }
        .messages { flex: 1; padding: 20px; overflow-y: auto; }
        .input-panel { padding: 15px; border-top: 1px solid #ddd; display: flex; }
        .message-input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-right: 10px; }
        .send-button { background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        .send-button:hover { background-color: #0056b3; }
        .message { margin-bottom: 15px; padding: 10px; border-radius: 8px; max-width: 80%; }
        .message.own { background-color: #007bff; color: white; margin-left: auto; text-align: right; }
        .message.other { background-color: #e9ecef; }
        .message.system { background-color: #d4edda; color: #155724; text-align: center; margin: 0 auto; }
        .message-header { font-size: 12px; opacity: 0.7; margin-bottom: 5px; }
        .users-list { margin-top: 10px; }
        .user-item { padding: 5px 0; border-bottom: 1px solid #eee; }
        .status { padding: 10px; background-color: #f8f9fa; border-radius: 4px; margin-bottom: 10px; }
        .status.connected { color: #28a745; }
        .status.disconnected { color: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>WebSocket Chat Demo</h1>
            <div id="status" class="status disconnected">Disconnected</div>
        </div>
        
        <div class="chat-container">
            <div class="users-panel">
                <h3>Online Users</h3>
                <div id="users-list" class="users-list">
                    <div class="user-item">Loading...</div>
                </div>
            </div>
            
            <div class="messages-panel">
                <div id="messages" class="messages">
                    <div class="message system">
                        <div>Welcome to the WebSocket chat demo!</div>
                    </div>
                </div>
                
                <div class="input-panel">
                    <input type="text" id="message-input" class="message-input" placeholder="Type your message..." disabled>
                    <button id="send-button" class="send-button" disabled>Send</button>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        let ws = null;
        let reconnectInterval = null;
        let username = 'User-' + Math.random().toString(36).substr(2, 8);
        
        function connect() {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/websocket`;
            
            ws = new WebSocket(wsUrl);
            
            ws.onopen = function() {
                console.log('WebSocket connected');
                updateStatus('Connected', true);
                document.getElementById('message-input').disabled = false;
                document.getElementById('send-button').disabled = false;
                
                if (reconnectInterval) {
                    clearInterval(reconnectInterval);
                    reconnectInterval = null;
                }
            };
            
            ws.onmessage = function(event) {
                try {
                    const message = JSON.parse(event.data);
                    handleMessage(message);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };
            
            ws.onclose = function() {
                console.log('WebSocket disconnected');
                updateStatus('Disconnected', false);
                document.getElementById('message-input').disabled = true;
                document.getElementById('send-button').disabled = true;
                
                // Attempt to reconnect after 3 seconds
                if (!reconnectInterval) {
                    reconnectInterval = setInterval(connect, 3000);
                }
            };
            
            ws.onerror = function(error) {
                console.error('WebSocket error:', error);
                addSystemMessage('Connection error occurred');
            };
        }
        
        function handleMessage(message) {
            switch (message.type) {
                case 'Chat':
                    addChatMessage(message.user, message.message, message.timestamp, message.user === username);
                    break;
                case 'System':
                    addSystemMessage(message.message);
                    break;
                case 'UserJoined':
                    addSystemMessage(`${message.user} joined the chat`);
                    break;
                case 'UserLeft':
                    addSystemMessage(`${message.user} left the chat`);
                    break;
                case 'Ping':
                    // Respond to ping with pong
                    ws.send(JSON.stringify({ type: 'Pong' }));
                    break;
                case 'Error':
                    addSystemMessage(`Error: ${message.message}`);
                    break;
            }
        }
        
        function addChatMessage(user, message, timestamp, isOwn) {
            const messagesDiv = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isOwn ? 'own' : 'other'}`;
            
            const time = new Date(timestamp).toLocaleTimeString();
            messageDiv.innerHTML = `
                <div class="message-header">${user} - ${time}</div>
                <div>${message}</div>
            `;
            
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        function addSystemMessage(message) {
            const messagesDiv = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message system';
            messageDiv.innerHTML = `<div>${message}</div>`;
            
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        function updateStatus(text, isConnected) {
            const statusDiv = document.getElementById('status');
            statusDiv.textContent = text;
            statusDiv.className = `status ${isConnected ? 'connected' : 'disconnected'}`;
        }
        
        function sendMessage() {
            const input = document.getElementById('message-input');
            const message = input.value.trim();
            
            if (message && ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ message: message }));
                input.value = '';
            }
        }
        
        // Event listeners
        document.getElementById('send-button').addEventListener('click', sendMessage);
        document.getElementById('message-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Connect when page loads
        window.addEventListener('load', connect);
        
        // Clean up when page unloads
        window.addEventListener('beforeunload', function() {
            if (ws) {
                ws.close();
            }
        });
    </script>
</body>
</html>
    "#)
}

// WebSocket API endpoint for testing
#[get("/websocket/api")]
pub fn websocket_api() -> Json<ApiResponse<&'static str>> {
    Json(ApiResponse::success("WebSocket API endpoint. Use /websocket for the chat interface."))
}

// WebSocket status endpoint
#[get("/websocket/status")]
pub fn websocket_status(chat_room: &State<ChatRoom>) -> Json<ApiResponse<serde_json::Value>> {
    let users = chat_room.get_users();
    let status = serde_json::json!({
        "active_users": users.len(),
        "users": users,
        "websocket_endpoint": "/websocket",
        "features": [
            "Real-time chat",
            "User presence",
            "Automatic reconnection",
            "Ping/pong heartbeat",
            "Message broadcasting"
        ]
    });
    
    Json(ApiResponse::success(status))
}

// Simple echo WebSocket for testing
#[get("/websocket/echo")]
pub fn websocket_echo(ws: WebSocket, mut channel: WebSocketChannel) {
    rocket::tokio::spawn(async move {
        loop {
            match channel.next().await {
                Some(Message::Text(text)) => {
                    let echo = format!("Echo: {}", text);
                    let _ = channel.send(Message::Text(echo)).await;
                }
                Some(Message::Binary(data)) => {
                    let _ = channel.send(Message::Binary(data)).await;
                }
                Some(Message::Close(_)) => {
                    break;
                }
                Some(Message::Ping(data)) => {
                    let _ = channel.send(Message::Pong(data)).await;
                }
                _ => {}
            }
        }
    });
}

// WebSocket test page for echo
#[get("/websocket/echo")]
pub fn websocket_echo_page() -> RawHtml<&'static str> {
    RawHtml(r#"
<!DOCTYPE html>
<html>
<head>
    <title>WebSocket Echo Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        .test-area { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        input { width: 70%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { width: 25%; padding: 8px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background-color: #0056b3; }
        .messages { height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; margin-top: 10px; }
        .message { margin: 5px 0; padding: 5px; border-radius: 3px; }
        .sent { background-color: #d4edda; text-align: right; }
        .received { background-color: #f8f9fa; }
        .status { padding: 10px; margin: 10px 0; border-radius: 4px; }
        .connected { background-color: #d4edda; color: #155724; }
        .disconnected { background-color: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <div class="container">
        <h1>WebSocket Echo Test</h1>
        
        <div id="status" class="status disconnected">Disconnected</div>
        
        <div class="test-area">
            <h3>Send Message</h3>
            <input type="text" id="message-input" placeholder="Type a message to echo...">
            <button id="send-button">Send</button>
            <div id="messages" class="messages"></div>
        </div>
        
        <div class="test-area">
            <h3>Instructions</h3>
            <p>This page tests a simple echo WebSocket server:</p>
            <ul>
                <li>Type a message and click Send</li>
                <li>The server will echo your message back</li>
                <li>Try sending different types of messages</li>
                <li>Check the connection status</li>
            </ul>
        </div>
    </div>
    
    <script>
        let ws = null;
        
        function connect() {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/websocket/echo`;
            
            ws = new WebSocket(wsUrl);
            
            ws.onopen = function() {
                updateStatus('Connected', true);
                addMessage('Connected to echo server', 'system');
            };
            
            ws.onmessage = function(event) {
                addMessage(event.data, 'received');
            };
            
            ws.onclose = function() {
                updateStatus('Disconnected', false);
                addMessage('Disconnected from server', 'system');
            };
            
            ws.onerror = function(error) {
                console.error('WebSocket error:', error);
                addMessage('Connection error', 'system');
            };
        }
        
        function sendMessage() {
            const input = document.getElementById('message-input');
            const message = input.value.trim();
            
            if (message && ws && ws.readyState === WebSocket.OPEN) {
                ws.send(message);
                addMessage(message, 'sent');
                input.value = '';
            }
        }
        
        function addMessage(text, type) {
            const messagesDiv = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.textContent = text;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        function updateStatus(text, isConnected) {
            const statusDiv = document.getElementById('status');
            statusDiv.textContent = text;
            statusDiv.className = `status ${isConnected ? 'connected' : 'disconnected'}`;
        }
        
        document.getElementById('send-button').addEventListener('click', sendMessage);
        document.getElementById('message-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        window.addEventListener('load', connect);
    </script>
</body>
</html>
    "#)
}