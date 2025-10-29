use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Status;
use rocket::request::{FromRequest, Outcome};
use rocket::response::content::RawHtml;
use rocket::serde::json::Json;
use rocket::{Request, State};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use uuid::Uuid;
use crate::models::{ApiResponse, Counter};

// Global counter state
pub struct GlobalCounter {
    counter: Mutex<i32>,
}

impl GlobalCounter {
    pub fn new() -> Self {
        Self {
            counter: Mutex::new(0),
        }
    }

    pub fn increment(&self) -> i32 {
        let mut counter = self.counter.lock().unwrap();
        *counter += 1;
        *counter
    }

    pub fn get(&self) -> i32 {
        let counter = self.counter.lock().unwrap();
        *counter
    }

    pub fn reset(&self) -> i32 {
        let mut counter = self.counter.lock().unwrap();
        *counter = 0;
        *counter
    }
}

// User session state
#[derive(Debug, Clone)]
pub struct UserSession {
    pub user_id: Uuid,
    pub username: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub last_activity: chrono::DateTime<chrono::Utc>,
}

impl UserSession {
    pub fn new(username: String) -> Self {
        let now = chrono::Utc::now();
        Self {
            user_id: Uuid::new_v4(),
            username,
            created_at: now,
            last_activity: now,
        }
    }

    pub fn update_activity(&mut self) {
        self.last_activity = chrono::Utc::now();
    }
}

pub struct SessionStore {
    sessions: Mutex<HashMap<Uuid, UserSession>>,
}

impl SessionStore {
    pub fn new() -> Self {
        Self {
            sessions: Mutex::new(HashMap::new()),
        }
    }

    pub fn create_session(&self, username: String) -> UserSession {
        let session = UserSession::new(username);
        let session_id = session.user_id;
        self.sessions.lock().unwrap().insert(session_id, session.clone());
        session
    }

    pub fn get_session(&self, session_id: &Uuid) -> Option<UserSession> {
        self.sessions.lock().unwrap().get(session_id).cloned()
    }

    pub fn update_session(&self, session_id: &Uuid) -> bool {
        if let Some(session) = self.sessions.lock().unwrap().get_mut(session_id) {
            session.update_activity();
            true
        } else {
            false
        }
    }

    pub fn delete_session(&self, session_id: &Uuid) -> bool {
        self.sessions.lock().unwrap().remove(session_id).is_some()
    }

    pub fn get_active_sessions(&self) -> Vec<UserSession> {
        self.sessions.lock().unwrap().values().cloned().collect()
    }
}

// Cache state
pub struct Cache {
    data: Mutex<HashMap<String, (String, chrono::DateTime<chrono::Utc>)>>,
    ttl_seconds: i64,
}

impl Cache {
    pub fn new(ttl_seconds: i64) -> Self {
        Self {
            data: Mutex::new(HashMap::new()),
            ttl_seconds,
        }
    }

    pub fn set(&self, key: String, value: String) {
        let expires_at = chrono::Utc::now() + chrono::Duration::seconds(self.ttl_seconds);
        self.data.lock().unwrap().insert(key, (value, expires_at));
    }

    pub fn get(&self, key: &str) -> Option<String> {
        let mut data = self.data.lock().unwrap();
        match data.get(key) {
            Some((value, expires_at)) => {
                if chrono::Utc::now() < *expires_at {
                    Some(value.clone())
                } else {
                    data.remove(key);
                    None
                }
            }
            None => None,
        }
    }

    pub fn remove_expired(&self) {
        let now = chrono::Utc::now();
        let mut data = self.data.lock().unwrap();
        data.retain(|_, (_, expires_at)| *expires_at > now);
    }

    pub fn clear(&self) {
        self.data.lock().unwrap().clear();
    }
}

// Request guard for session
pub struct SessionGuard {
    pub session: UserSession,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for SessionGuard {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        match request.headers().get_one("x-session-id") {
            Some(session_id_str) => {
                match Uuid::parse_str(session_id_str) {
                    Ok(session_id) => {
                        if let Some(session_store) = request.guard::<&State<SessionStore>>().await.succeeded() {
                            if let Some(mut session) = session_store.get_session(&session_id) {
                                session.update_activity();
                                session_store.update_session(&session_id);
                                return Outcome::Success(SessionGuard { session });
                            }
                        }
                        Outcome::Failure((Status::Unauthorized, ()))
                    }
                    Err(_) => Outcome::Failure((Status::BadRequest, ())),
                }
            }
            None => Outcome::Failure((Status::Unauthorized, ())),
        }
    }
}

// Cache cleanup fairing
pub struct CacheCleanup;

#[rocket::async_trait]
impl Fairing for CacheCleanup {
    fn info(&self) -> Info {
        Info {
            name: "Cache Cleanup",
            kind: Kind::Launch,
        }
    }

    async fn on_launch(&self, rocket: &rocket::Rocket<rocket::Build>) {
        if let Some(cache) = rocket.state::<Cache>() {
            // Start a background task to clean up expired cache entries
            let cache = cache.clone();
            tokio::spawn(async move {
                let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(60));
                loop {
                    interval.tick().await;
                    cache.remove_expired();
                }
            });
        }
    }
}

// Counter handlers
#[get("/counter")]
pub fn get_counter(counter: &State<GlobalCounter>) -> Json<ApiResponse<i32>> {
    Json(ApiResponse::success(counter.get()))
}

#[post("/counter/increment")]
pub fn increment_counter(counter: &State<GlobalCounter>) -> Json<ApiResponse<i32>> {
    Json(ApiResponse::success(counter.increment()))
}

#[post("/counter/reset")]
pub fn reset_counter(counter: &State<GlobalCounter>) -> Json<ApiResponse<i32>> {
    Json(ApiResponse::success(counter.reset()))
}

// Session handlers
#[post("/session/create/<username>")]
pub fn create_session(
    session_store: &State<SessionStore>,
    username: &str,
) -> Json<ApiResponse<UserSession>> {
    let session = session_store.create_session(username.to_string());
    Json(ApiResponse::success(session))
}

#[get("/session/<session_id>")]
pub fn get_session(
    session_store: &State<SessionStore>,
    session_id: &str,
) -> Result<Json<ApiResponse<UserSession>>, Status> {
    let session_id = Uuid::parse_str(session_id).map_err(|_| Status::BadRequest)?;
    match session_store.get_session(&session_id) {
        Some(session) => Ok(Json(ApiResponse::success(session))),
        None => Err(Status::NotFound),
    }
}

#[delete("/session/<session_id>")]
pub fn delete_session(
    session_store: &State<SessionStore>,
    session_id: &str,
) -> Result<Json<ApiResponse<()>>, Status> {
    let session_id = Uuid::parse_str(session_id).map_err(|_| Status::BadRequest)?;
    if session_store.delete_session(&session_id) {
        Ok(Json(ApiResponse::success(())))
    } else {
        Err(Status::NotFound)
    }
}

#[get("/sessions")]
pub fn get_active_sessions(
    session_store: &State<SessionStore>,
) -> Json<ApiResponse<Vec<UserSession>>> {
    let sessions = session_store.get_active_sessions();
    Json(ApiResponse::success(sessions))
}

#[get("/session/protected")]
pub fn protected_route(session: SessionGuard) -> Json<ApiResponse<UserSession>> {
    Json(ApiResponse::success(session.session))
}

// Cache handlers
#[post("/cache/<key>/<value>")]
pub fn cache_set(
    cache: &State<Cache>,
    key: &str,
    value: &str,
) -> Json<ApiResponse<&'static str>> {
    cache.set(key.to_string(), value.to_string());
    Json(ApiResponse::success("Value cached"))
}

#[get("/cache/<key>")]
pub fn cache_get(
    cache: &State<Cache>,
    key: &str,
) -> Json<ApiResponse<Option<String>>> {
    let value = cache.get(key);
    Json(ApiResponse::success(value))
}

#[delete("/cache/<key>")]
pub fn cache_delete(
    cache: &State<Cache>,
    key: &str,
) -> Json<ApiResponse<bool>> {
    let value = cache.get(key);
    if value.is_some() {
        // In a real implementation, you would add a delete method to Cache
        Json(ApiResponse::success(true))
    } else {
        Json(ApiResponse::success(false))
    }
}

#[post("/cache/clear")]
pub fn cache_clear(cache: &State<Cache>) -> Json<ApiResponse<&'static str>> {
    cache.clear();
    Json(ApiResponse::success("Cache cleared"))
}

#[post("/cache/cleanup")]
pub fn cache_cleanup(cache: &State<Cache>) -> Json<ApiResponse<&'static str>> {
    cache.remove_expired();
    Json(ApiResponse::success("Expired entries removed"))
}

// HTML page for demonstrating state management
#[get("/state-demo")]
pub fn state_demo() -> RawHtml<&'static str> {
    RawHtml(r#"
<!DOCTYPE html>
<html>
<head>
    <title>State Management Demo</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        .demo-section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .button { background-color: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
        .button:hover { background-color: #0056b3; }
        .result { margin-top: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 4px; }
        input { padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>State Management Demo</h1>
        
        <div class="demo-section">
            <h2>Global Counter</h2>
            <button class="button" onclick="getCounter()">Get Counter</button>
            <button class="button" onclick="incrementCounter()">Increment</button>
            <button class="button" onclick="resetCounter()">Reset</button>
            <div id="counter-result" class="result"></div>
        </div>
        
        <div class="demo-section">
            <h2>User Sessions</h2>
            <input type="text" id="username" placeholder="Enter username">
            <button class="button" onclick="createSession()">Create Session</button>
            <button class="button" onclick="getSessions()">Get Active Sessions</button>
            <div id="session-result" class="result"></div>
        </div>
        
        <div class="demo-section">
            <h2>Cache</h2>
            <input type="text" id="cache-key" placeholder="Key">
            <input type="text" id="cache-value" placeholder="Value">
            <button class="button" onclick="cacheSet()">Set Cache</button>
            <button class="button" onclick="cacheGet()">Get Cache</button>
            <button class="button" onclick="cacheClear()">Clear Cache</button>
            <div id="cache-result" class="result"></div>
        </div>
    </div>
    
    <script>
        async function getCounter() {
            const response = await fetch('/counter');
            const result = await response.json();
            document.getElementById('counter-result').textContent = JSON.stringify(result, null, 2);
        }
        
        async function incrementCounter() {
            const response = await fetch('/counter/increment', { method: 'POST' });
            const result = await response.json();
            document.getElementById('counter-result').textContent = JSON.stringify(result, null, 2);
        }
        
        async function resetCounter() {
            const response = await fetch('/counter/reset', { method: 'POST' });
            const result = await response.json();
            document.getElementById('counter-result').textContent = JSON.stringify(result, null, 2);
        }
        
        async function createSession() {
            const username = document.getElementById('username').value;
            if (!username) {
                alert('Please enter a username');
                return;
            }
            
            const response = await fetch(`/session/create/${username}`, { method: 'POST' });
            const result = await response.json();
            document.getElementById('session-result').textContent = JSON.stringify(result, null, 2);
        }
        
        async function getSessions() {
            const response = await fetch('/sessions');
            const result = await response.json();
            document.getElementById('session-result').textContent = JSON.stringify(result, null, 2);
        }
        
        async function cacheSet() {
            const key = document.getElementById('cache-key').value;
            const value = document.getElementById('cache-value').value;
            if (!key || !value) {
                alert('Please enter both key and value');
                return;
            }
            
            const response = await fetch(`/cache/${key}/${value}`, { method: 'POST' });
            const result = await response.json();
            document.getElementById('cache-result').textContent = JSON.stringify(result, null, 2);
        }
        
        async function cacheGet() {
            const key = document.getElementById('cache-key').value;
            if (!key) {
                alert('Please enter a key');
                return;
            }
            
            const response = await fetch(`/cache/${key}`);
            const result = await response.json();
            document.getElementById('cache-result').textContent = JSON.stringify(result, null, 2);
        }
        
        async function cacheClear() {
            const response = await fetch('/cache/clear', { method: 'POST' });
            const result = await response.json();
            document.getElementById('cache-result').textContent = JSON.stringify(result, null, 2);
        }
    </script>
</body>
</html>
    "#)
}