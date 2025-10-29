use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{Html, IntoResponse, Json},
    routing::{get, post, put, delete},
    Router,
};
use std::net::SocketAddr;
use std::sync::{Arc, Mutex};
use tower::ServiceBuilder;
use tower_http::{
    cors::{Any, CorsLayer},
    services::ServeDir,
    trace::TraceLayer,
    compression::CompressionLayer,
};
use tracing::{info, Level};
use tracing_subscriber;
use uuid::Uuid;
use std::collections::HashMap;

mod models;
mod handlers;
mod middleware;
mod extractors;
mod websocket;

use models::*;
use handlers::*;
use extractors::*;
use websocket::*;

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_max_level(Level::INFO)
        .init();

    // Initialize shared state
    let app_state = Arc::new(AppState {
        users: Mutex::new(Vec::new()),
        counter: Mutex::new(0),
        messages: Mutex::new(Vec::new()),
    });
    
    // Initialize WebSocket state
    let ws_state = Arc::new(WebSocketState::default());

    // Build our application with routes
    let app = Router::new()
        // Basic routes
        .route("/", get(root))
        .route("/hello", get(hello_world))
        .route("/json", get(json_response))
        .route("/echo", post(echo))
        
        // User management routes
        .route("/users", get(get_users).post(create_user))
        .route("/users/:id", get(get_user).put(update_user).delete(delete_user))
        
        // Extractor examples
        .route("/extractors/path/:name/:age", get(path_extractor))
        .route("/extractors/query", get(query_extractor))
        .route("/extractors/json", post(json_extractor))
        .route("/extractors/form", post(form_extractor))
        
        // State management
        .route("/counter", get(get_counter).post(increment_counter))
        
        // Middleware examples
        .route("/middleware/trace", get(middleware_trace))
        .route("/middleware/auth", get(middleware_auth))
        
        // File serving
        .nest_service("/static", ServeDir::new("static"))
        
        // WebSocket
        .route("/ws", get(websocket_handler))
        .with_state(ws_state)
        
        // Error handling examples
        .route("/error/panic", get(error_panic))
        .route("/error/custom", get(error_custom))
        
        // Streaming example
        .route("/stream", get(stream_data))
        
        // Form handling
        .route("/form", get(form_page))
        .route("/form/submit", post(form_submit))
        
        // Cookie handling
        .route("/cookies/set", get(set_cookies))
        .route("/cookies/get", get(get_cookies))
        
        // Apply middleware
        .layer(
            ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())
                .layer(CompressionLayer::new())
                .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any))
        )
        .with_state(app_state);

    // Run the server
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    info!("🚀 Axum server listening on http://{}", addr);
    info!("📚 Available endpoints:");
    info!("  GET  / - Root");
    info!("  GET  /hello - Hello world");
    info!("  GET  /json - JSON response");
    info!("  POST /echo - Echo service");
    info!("  GET  /users - Get all users");
    info!("  POST /users - Create user");
    info!("  GET  /users/:id - Get user by ID");
    info!("  PUT  /users/:id - Update user");
    info!("  DELETE /users/:id - Delete user");
    info!("  GET  /extractors/path/:name/:age - Path extractor example");
    info!("  GET  /extractors/query?param=value - Query extractor example");
    info!("  POST /extractors/json - JSON extractor example");
    info!("  POST /extractors/form - Form extractor example");
    info!("  GET  /counter - Get counter");
    info!("  POST /counter/increment - Increment counter");
    info!("  GET  /middleware/trace - Middleware trace example");
    info!("  GET  /middleware/auth - Auth middleware example");
    info!("  GET  /static/* - Static files");
    info!("  GET  /ws - WebSocket example");
    info!("  GET  /error/panic - Panic example");
    info!("  GET  /error/custom - Custom error example");
    info!("  GET  /stream - Streaming example");
    info!("  GET  /form - Form page");
    info!("  POST /form/submit - Form submit");
    info!("  GET  /cookies/set - Set cookies");
    info!("  GET  /cookies/get - Get cookies");

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// Basic handlers
async fn root() -> &'static str {
    "🦀 Welcome to Axum Learning Server!"
}

async fn hello_world() -> &'static str {
    "Hello, Axum! 🚀"
}

async fn json_response() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "message": "This is a JSON response",
        "framework": "Axum",
        "version": "0.7"
    }))
}

async fn echo(body: String) -> String {
    body
}

// Error handlers
async fn error_panic() -> &'static str {
    panic!("This is a deliberate panic for error handling demonstration");
}

async fn error_custom() -> Result<String, AppError> {
    Err(AppError::NotFound("Resource not found".to_string()))
}

// Streaming handler
async fn stream_data() -> impl IntoResponse {
    let stream = tokio_stream::wrappers::TcpListenerStream::new(tokio::net::TcpListener::bind("0.0.0.0:0").await.unwrap());
    
    let sse_stream = tokio_stream::iter(0..100)
        .map(|i| Ok(format!("data: {}\n\n", i)))
        .throttle(std::time::Duration::from_millis(100));
    
    (
        [("content-type", "text/event-stream")],
        axum::response::Body::from_stream(sse_stream)
    )
}