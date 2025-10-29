use actix_web::{get, post, web, HttpRequest, HttpResponse, Result, Responder};
use actix_files::{NamedFile, Files};
use actix::prelude::*;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use uuid::Uuid;
use futures::stream::{self, StreamExt};

// WebSocket examples
use actix::prelude::*;
use actix_web_actors::ws;

// WebSocket message types
#[derive(Message)]
#[rtype(result = "()")]
pub struct ChatMessage {
    pub id: Uuid,
    pub username: String,
    pub message: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

// WebSocket actor
pub struct MyWebSocket {
    pub addr: Addr<ChatServer>,
    pub id: Uuid,
    pub username: String,
}

impl Actor for MyWebSocket {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        let addr = ctx.address();
        self.addr.do_send(Connect {
            addr: addr.recipient(),
            username: self.username.clone(),
        });
    }

    fn stopped(&mut self, ctx: &mut Self::Context) {
        self.addr.do_send(Disconnect {
            id: self.id,
            username: self.username.clone(),
        });
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for MyWebSocket {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Text(text)) => {
                let chat_msg = ChatMessage {
                    id: Uuid::new_v4(),
                    username: self.username.clone(),
                    message: text.to_string(),
                    timestamp: chrono::Utc::now(),
                };
                self.addr.do_send(chat_msg);
            }
            Ok(ws::Message::Binary(bin)) => ctx.binary(bin),
            Ok(ws::Message::Close(reason)) => {
                ctx.close(reason);
                ctx.stop();
            }
            _ => (),
        }
    }
}

// Chat server
pub struct ChatServer {
    sessions: HashMap<Uuid, Recipient<ChatMessage>>,
}

impl Actor for ChatServer {
    type Context = Context<Self>;
}

impl Default for ChatServer {
    fn default() -> Self {
        let mut server = Self {
            sessions: HashMap::new(),
        };
        server
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Connect {
    pub addr: Recipient<ChatMessage>,
    pub username: String,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Disconnect {
    pub id: Uuid,
    pub username: String,
}

impl Handler<Connect> for ChatServer {
    type Result = ();

    fn handle(&mut self, msg: Connect, _ctx: &mut Self::Context) -> Self::Result {
        let id = Uuid::new_v4();
        self.sessions.insert(id, msg.addr);
        println!("{} connected", msg.username);
    }
}

impl Handler<Disconnect> for ChatServer {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _ctx: &mut Self::Context) -> Self::Result {
        self.sessions.retain(|_, addr| {
            !addr.do_send(ChatMessage {
                id: Uuid::new_v4(),
                username: "System".to_string(),
                message: format!("{} disconnected", msg.username),
                timestamp: chrono::Utc::now(),
            }).is_err()
        });
        println!("{} disconnected", msg.username);
    }
}

impl Handler<ChatMessage> for ChatServer {
    type Result = ();

    fn handle(&mut self, msg: ChatMessage, _ctx: &mut Self::Context) -> Self::Result {
        for session in self.sessions.values() {
            let _ = session.do_send(msg.clone());
        }
    }
}

// WebSocket route
pub async fn websocket_index(
    req: HttpRequest,
    stream: web::Payload,
    chat_server: web::Data<Addr<ChatServer>>,
) -> Result<HttpResponse> {
    let username = req
        .match_info()
        .get("username")
        .unwrap_or("Anonymous")
        .to_string();

    ws::start(MyWebSocket {
        addr: chat_server.get_ref().clone(),
        id: Uuid::new_v4(),
        username,
    }, &req, stream)
}

// File serving examples
#[get("/static/{filename:.*}")]
pub async fn serve_static_file(path: web::Path<String>) -> Result<impl Responder> {
    let file_path = format!("static/{}", path);
    match NamedFile::open(file_path) {
        Ok(file) => Ok(file),
        Err(_) => Ok(HttpResponse::NotFound().json(serde_json::json!({
            "error": "File not found"
        }))),
    }
}

// Streaming examples
#[get("/stream")]
pub async fn stream_data() -> impl Responder {
    let stream = stream::iter(0..100)
        .map(|i| {
            Ok(web::Bytes::from(format!("data: {}\n\n", i)))
        })
        .throttle(std::time::Duration::from_millis(100));

    HttpResponse::Ok()
        .content_type("text/event-stream")
        .streaming(stream)
}

// Form handling examples
#[get("/form")]
pub async fn form_page() -> impl Responder {
    let html = r#"
    <!DOCTYPE html>
    <html>
    <head>
        <title>Form Example</title>
    </head>
    <body>
        <h1>Form Example</h1>
        <form method="post" action="/form/submit">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name">
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email">
            </div>
            <div>
                <label for="message">Message:</label>
                <textarea id="message" name="message"></textarea>
            </div>
            <button type="submit">Submit</button>
        </form>
    </body>
    </html>
    "#;
    
    HttpResponse::Ok().content_type("text/html").body(html)
}

#[derive(serde::Deserialize)]
pub struct FormData {
    name: String,
    email: String,
    message: String,
}

#[post("/form/submit")]
pub async fn submit_form(form: web::Form<FormData>) -> impl Responder {
    println!("Received form data: {:?}", form);
    
    HttpResponse::Ok().json(serde_json::json!({
        "message": "Form submitted successfully",
        "data": {
            "name": form.name,
            "email": form.email,
            "message": form.message
        }
    }))
}

// Cookie examples
#[get("/cookies/set")]
pub async fn set_cookies() -> impl Responder {
    HttpResponse::Ok()
        .cookie(
            actix_web::cookie::Cookie::build("user_id", "12345")
                .http_only(true)
                .secure(false)
                .finish(),
        )
        .cookie(
            actix_web::cookie::Cookie::build("session_token", "abcdef123456")
                .http_only(true)
                .secure(false)
                .finish(),
        )
        .json(serde_json::json!({
            "message": "Cookies set successfully"
        }))
}

#[get("/cookies/get")]
pub async fn get_cookies(req: HttpRequest) -> impl Responder {
    let mut cookies = HashMap::new();
    
    if let Some(user_id) = req.cookie("user_id") {
        cookies.insert("user_id".to_string(), user_id.value().to_string());
    }
    
    if let Some(session_token) = req.cookie("session_token") {
        cookies.insert("session_token".to_string(), session_token.value().to_string());
    }
    
    HttpResponse::Ok().json(serde_json::json!({
        "cookies": cookies
    }))
}

// Query parameter examples
#[get("/query")]
pub async fn query_params(req: HttpRequest) -> impl Responder {
    let query = req.query_string();
    
    HttpResponse::Ok().json(serde_json::json!({
        "query_string": query,
        "message": "Query parameters received"
    }))
}

// Path parameter examples
#[get("/path/{name}/{age}")]
pub async fn path_params(path: web::Path<(String, u32)>) -> impl Responder {
    let (name, age) = path.into_inner();
    
    HttpResponse::Ok().json(serde_json::json!({
        "name": name,
        "age": age,
        "message": "Path parameters extracted successfully"
    }))
}

// Request body examples
#[post("/body/json")]
pub async fn json_body(body: web::Json<serde_json::Value>) -> impl Responder {
    println!("Received JSON body: {:?}", body);
    
    HttpResponse::Ok().json(serde_json::json!({
        "message": "JSON body received successfully",
        "received_data": body.into_inner()
    }))
}

#[post("/body/text")]
pub async fn text_body(body: String) -> impl Responder {
    println!("Received text body: {}", body);
    
    HttpResponse::Ok().json(serde_json::json!({
        "message": "Text body received successfully",
        "received_data": body
    }))
}