use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder, Result};
use actix::Addr;
use std::sync::Mutex;

mod examples;
mod models;
mod middleware;
mod handlers;

use examples::*;
use examples::ChatServer;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    
    println!("🚀 Starting Actix Web Learning Server on http://127.0.0.1:8080");
    println!("📚 Available endpoints:");
    println!("  GET  /hello - Basic hello world");
    println!("  GET  /json - JSON response example");
    println!("  POST /echo - Echo service");
    println!("  GET  /users - Get all users");
    println!("  POST /users - Create a user");
    println!("  GET  /users/:id - Get user by ID");
    println!("  GET  /middleware/test - Middleware test");
    println!("  GET  /examples/form - Form example");
    println!("  GET  /examples/stream - Stream example");
    println!("  GET  /ws/{username} - WebSocket example");
    
    // Shared application state
    let app_state = web::Data::new(AppState {
        counter: Mutex::new(0),
        users: Mutex::new(Vec::new()),
    });
    
    // Chat server for WebSocket
    let chat_server = ChatServer::default().start();

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .app_data(web::Data::new(chat_server.clone()))
            .service(hello_world)
            .service(json_response)
            .service(echo_service)
            .configure(handlers::configure_routes)
            .configure(middleware::configure_middleware)
            .service(
                web::scope("/examples")
                    .service(form_page)
                    .service(submit_form)
                    .service(stream_data)
                    .service(serve_static_file)
                    .service(set_cookies)
                    .service(get_cookies)
                    .service(query_params)
                    .service(path_params)
                    .service(json_body)
                    .service(text_body)
            )
            .service(
                web::scope("/ws").route("/{username}", web::get().to(websocket_index))
            )
            .service(
                web::scope("/counter")
                    .service(handlers::get_counter)
                    .service(handlers::increment_counter)
            )
            .service(
                web::scope("/error")
                    .service(handlers::error_example)
                    .service(handlers::custom_error_example)
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}

// Basic application state
pub struct AppState {
    pub counter: Mutex<i32>,
    pub users: Mutex<Vec<models::User>>,
}

// Basic routes
#[get("/hello")]
async fn hello_world() -> impl Responder {
    HttpResponse::Ok().body("Hello, Actix Web! 🦀")
}

#[get("/json")]
async fn json_response() -> impl Responder {
    let response = serde_json::json!({
        "message": "This is a JSON response",
        "framework": "Actix Web",
        "version": "4.0"
    });
    HttpResponse::Ok().json(response)
}

#[post("/echo")]
async fn echo_service(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}
