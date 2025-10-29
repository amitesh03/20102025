pub mod models;
pub mod handlers;
pub mod examples;
pub mod middleware;

use crate::examples::state_management::{GlobalCounter, SessionStore, Cache};
use crate::examples::websockets::ChatRoom;
use crate::examples::file_upload::FileStorage;
use crate::middleware::{RequestLogger, ResponseLogger, RequestTimer, RateLimiter, RequestId, SecurityHeaders, RequestSizeLimiter, CustomHeaders};

// Initialize application state
pub fn init_state() -> (
    GlobalCounter,
    SessionStore,
    Cache,
    ChatRoom,
    FileStorage,
) {
    (
        GlobalCounter::new(),
        SessionStore::new(),
        Cache::new(3600), // 1 hour TTL
        ChatRoom::new(),
        FileStorage::new("uploads"),
    )
}

// Initialize middleware
pub fn init_middleware() -> (
    RequestLogger,
    ResponseLogger,
    RequestTimer,
    RateLimiter,
    RequestId,
    SecurityHeaders,
    RequestSizeLimiter,
    CustomHeaders,
) {
    (
        RequestLogger,
        ResponseLogger,
        RequestTimer::new(),
        RateLimiter::new(100, 60), // 100 requests per minute
        RequestId,
        SecurityHeaders,
        RequestSizeLimiter::new(10 * 1024 * 1024), // 10MB limit
        CustomHeaders,
    )
}