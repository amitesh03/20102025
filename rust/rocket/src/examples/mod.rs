pub mod basic_routes;
pub mod request_data;
pub mod response_types;
pub mod error_handling;
pub mod state_management;
pub mod middleware;
pub mod websockets;
pub mod file_upload;

// Re-export all example handlers
pub use basic_routes::*;
pub use request_data::*;
pub use response_types::*;
pub use error_handling::*;
pub use state_management::*;
pub use middleware::*;
pub use websockets::*;
pub use file_upload::*;