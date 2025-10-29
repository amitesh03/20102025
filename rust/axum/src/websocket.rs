use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade, CloseFrame},
        State,
    },
    response::Response,
};
use futures::{sink::SinkExt, stream::StreamExt};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{broadcast, RwLock};
use uuid::Uuid;
use tracing::{info, warn, error};

use crate::models::*;

// WebSocket state for managing connections
#[derive(Clone)]
pub struct WebSocketState {
    pub clients: Arc<RwLock<HashMap<Uuid, broadcast::Sender<ChatMessage>>>>,
}

impl Default for WebSocketState {
    fn default() -> Self {
        Self {
            clients: Arc::new(RwLock::new(HashMap::new())),
        }
    }
}

// WebSocket handler
pub async fn websocket_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<WebSocketState>>,
) -> Response {
    ws.on_upgrade(move |socket| handle_socket(socket, state))
}

// Handle individual WebSocket connection
async fn handle_socket(socket: WebSocket, state: Arc<WebSocketState>) {
    let (mut sender, mut receiver) = socket.split();
    let client_id = Uuid::new_v4();
    
    // Create a channel for this client
    let (tx, mut rx) = broadcast::channel(100);
    
    // Add client to the state
    {
        let mut clients = state.clients.write().await;
        clients.insert(client_id, tx.clone());
    }
    
    info!("Client {} connected", client_id);
    
    // Send welcome message
    let welcome_msg = ChatMessage {
        id: Uuid::new_v4(),
        username: "System".to_string(),
        message: format!("Welcome! Your ID is {}", client_id),
        timestamp: chrono::Utc::now(),
    };
    
    if let Err(e) = tx.send(welcome_msg.clone()) {
        error!("Failed to send welcome message: {}", e);
    }
    
    // Spawn a task to handle receiving messages from this client
    let recv_task = tokio::spawn(async move {
        while let Some(msg) = receiver.next().await {
            match msg {
                Ok(Message::Text(text)) => {
                    info!("Received message from client {}: {}", client_id, text);
                    
                    // Parse the message (expecting JSON format)
                    if let Ok(chat_msg) = serde_json::from_str::<serde_json::Value>(&text) {
                        if let (Some(username), Some(message)) = (
                            chat_msg.get("username").and_then(|v| v.as_str()),
                            chat_msg.get("message").and_then(|v| v.as_str())
                        ) {
                            let new_message = ChatMessage {
                                id: Uuid::new_v4(),
                                username: username.to_string(),
                                message: message.to_string(),
                                timestamp: chrono::Utc::now(),
                            };
                            
                            // Broadcast to all clients
                            let clients = state.clients.read().await;
                            for (_, client_tx) in clients.iter() {
                                if let Err(e) = client_tx.send(new_message.clone()) {
                                    warn!("Failed to send message to client: {}", e);
                                }
                            }
                        }
                    }
                },
                Ok(Message::Close(close_frame)) => {
                    info!("Client {} disconnected: {:?}", client_id, close_frame);
                    break;
                },
                Ok(Message::Ping(ping)) => {
                    // Respond to ping with pong
                    if let Err(e) = sender.send(Message::Pong(ping)).await {
                        error!("Failed to send pong: {}", e);
                        break;
                    }
                },
                Err(e) => {
                    error!("WebSocket error for client {}: {}", client_id, e);
                    break;
                },
                _ => {}
            }
        }
    });
    
    // Spawn a task to handle sending messages to this client
    let send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if let Ok(json) = serde_json::to_string(&msg) {
                if let Err(e) = sender.send(Message::Text(json)).await {
                    error!("Failed to send message to client {}: {}", client_id, e);
                    break;
                }
            }
        }
    });
    
    // Wait for either task to complete
    tokio::select! {
        _ = recv_task => {},
        _ = send_task => {},
    }
    
    // Remove client from state
    {
        let mut clients = state.clients.write().await;
        clients.remove(&client_id);
    }
    
    info!("Client {} disconnected", client_id);
}

// WebSocket chat room example
pub async fn chat_room_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<WebSocketState>>,
) -> Response {
    ws.on_upgrade(move |socket| handle_chat_room(socket, state))
}

async fn handle_chat_room(socket: WebSocket, state: Arc<WebSocketState>) {
    let (mut sender, mut receiver) = socket.split();
    let client_id = Uuid::new_v4();
    let mut username = format!("User_{}", client_id.to_string()[..8].to_uppercase());
    
    // Create a channel for this client
    let (tx, mut rx) = broadcast::channel(100);
    
    // Add client to the state
    {
        let mut clients = state.clients.write().await;
        clients.insert(client_id, tx.clone());
    }
    
    info!("Chat user {} connected as {}", client_id, username);
    
    // Send welcome message
    let welcome_msg = ChatMessage {
        id: Uuid::new_v4(),
        username: "System".to_string(),
        message: format!("{} joined the chat", username),
        timestamp: chrono::Utc::now(),
    };
    
    // Broadcast join message to all clients
    {
        let clients = state.clients.read().await;
        for (_, client_tx) in clients.iter() {
            let _ = client_tx.send(welcome_msg.clone());
        }
    }
    
    // Spawn a task to handle receiving messages from this client
    let state_clone = state.clone();
    let recv_task = tokio::spawn(async move {
        while let Some(msg) = receiver.next().await {
            match msg {
                Ok(Message::Text(text)) => {
                    // Handle special commands
                    if text.starts_with("/nick ") {
                        let new_username = text[6..].trim().to_string();
                        if !new_username.is_empty() {
                            let old_username = username.clone();
                            username = new_username;
                            
                            let nick_msg = ChatMessage {
                                id: Uuid::new_v4(),
                                username: "System".to_string(),
                                message: format!("{} is now known as {}", old_username, username),
                                timestamp: chrono::Utc::now(),
                            };
                            
                            let clients = state_clone.clients.read().await;
                            for (_, client_tx) in clients.iter() {
                                let _ = client_tx.send(nick_msg.clone());
                            }
                        }
                    } else if text == "/help" {
                        let help_msg = ChatMessage {
                            id: Uuid::new_v4(),
                            username: "System".to_string(),
                            message: "Available commands: /nick <name> - Change your nickname, /help - Show this help".to_string(),
                            timestamp: chrono::Utc::now(),
                        };
                        
                        if let Err(e) = tx.send(help_msg) {
                            error!("Failed to send help message: {}", e);
                        }
                    } else if !text.trim().is_empty() {
                        let chat_msg = ChatMessage {
                            id: Uuid::new_v4(),
                            username: username.clone(),
                            message: text,
                            timestamp: chrono::Utc::now(),
                        };
                        
                        // Broadcast to all clients
                        let clients = state_clone.clients.read().await;
                        for (_, client_tx) in clients.iter() {
                            if let Err(e) = client_tx.send(chat_msg.clone()) {
                                warn!("Failed to send message to client: {}", e);
                            }
                        }
                    }
                },
                Ok(Message::Close(close_frame)) => {
                    info!("Chat user {} disconnected: {:?}", client_id, close_frame);
                    break;
                },
                Ok(Message::Ping(ping)) => {
                    if let Err(e) = sender.send(Message::Pong(ping)).await {
                        error!("Failed to send pong: {}", e);
                        break;
                    }
                },
                Err(e) => {
                    error!("WebSocket error for client {}: {}", client_id, e);
                    break;
                },
                _ => {}
            }
        }
    });
    
    // Spawn a task to handle sending messages to this client
    let send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if let Ok(json) = serde_json::to_string(&msg) {
                if let Err(e) = sender.send(Message::Text(json)).await {
                    error!("Failed to send message to client {}: {}", client_id, e);
                    break;
                }
            }
        }
    });
    
    // Wait for either task to complete
    tokio::select! {
        _ = recv_task => {},
        _ = send_task => {},
    }
    
    // Remove client from state and broadcast leave message
    {
        let mut clients = state.clients.write().await;
        clients.remove(&client_id);
    }
    
    let leave_msg = ChatMessage {
        id: Uuid::new_v4(),
        username: "System".to_string(),
        message: format!("{} left the chat", username),
        timestamp: chrono::Utc::now(),
    };
    
    // Broadcast leave message to remaining clients
    {
        let clients = state.clients.read().await;
        for (_, client_tx) in clients.iter() {
            let _ = client_tx.send(leave_msg.clone());
        }
    }
    
    info!("Chat user {} ({}) disconnected", client_id, username);
}

// WebSocket echo example
pub async fn echo_handler(
    ws: WebSocketUpgrade,
) -> Response {
    ws.on_upgrade(echo_socket)
}

async fn echo_socket(socket: WebSocket) {
    let (mut sender, mut receiver) = socket.split();
    
    info!("Echo WebSocket client connected");
    
    while let Some(msg) = receiver.next().await {
        match msg {
            Ok(Message::Text(text)) => {
                let echo_text = format!("Echo: {}", text);
                if let Err(e) = sender.send(Message::Text(echo_text)).await {
                    error!("Failed to send echo message: {}", e);
                    break;
                }
            },
            Ok(Message::Binary(data)) => {
                if let Err(e) = sender.send(Message::Binary(data)).await {
                    error!("Failed to echo binary data: {}", e);
                    break;
                }
            },
            Ok(Message::Close(close_frame)) => {
                info!("Echo WebSocket client disconnected: {:?}", close_frame);
                break;
            },
            Ok(Message::Ping(ping)) => {
                if let Err(e) = sender.send(Message::Pong(ping)).await {
                    error!("Failed to send pong: {}", e);
                    break;
                }
            },
            Err(e) => {
                error!("Echo WebSocket error: {}", e);
                break;
            },
            _ => {}
        }
    }
    
    info!("Echo WebSocket client disconnected");
}