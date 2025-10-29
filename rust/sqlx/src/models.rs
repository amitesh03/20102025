use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};
use uuid::Uuid;

// User model
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub last_login: Option<DateTime<Utc>>,
    pub is_active: bool,
}

// New user for creation
#[derive(Debug, Serialize, Deserialize)]
pub struct NewUser {
    pub username: String,
    pub email: String,
    pub password: String,
}

// Update user
#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateUser {
    pub username: Option<String>,
    pub email: Option<String>,
    pub password: Option<String>,
    pub is_active: Option<bool>,
}

// Post model
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Post {
    pub id: Uuid,
    pub title: String,
    pub content: String,
    pub author_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub published_at: Option<DateTime<Utc>>,
    pub is_published: bool,
    pub view_count: i64,
}

// New post for creation
#[derive(Debug, Serialize, Deserialize)]
pub struct NewPost {
    pub title: String,
    pub content: String,
    pub author_id: Uuid,
}

// Update post
#[derive(Debug, Serialize, Deserialize)]
pub struct UpdatePost {
    pub title: Option<String>,
    pub content: Option<String>,
    pub is_published: Option<bool>,
}

// Comment model
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Comment {
    pub id: Uuid,
    pub content: String,
    pub author_id: Uuid,
    pub post_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub is_approved: bool,
}

// New comment for creation
#[derive(Debug, Serialize, Deserialize)]
pub struct NewComment {
    pub content: String,
    pub author_id: Uuid,
    pub post_id: Uuid,
}

// Update comment
#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateComment {
    pub content: Option<String>,
    pub is_approved: Option<bool>,
}

// Activity log model
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ActivityLog {
    pub id: Uuid,
    pub user_id: Option<Uuid>,
    pub action: String,
    pub resource_type: String,
    pub resource_id: Option<Uuid>,
    pub details: Option<serde_json::Value>,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub created_at: DateTime<Utc>,
}

// New activity log for creation
#[derive(Debug, Serialize, Deserialize)]
pub struct NewActivityLog {
    pub user_id: Option<Uuid>,
    pub action: String,
    pub resource_type: String,
    pub resource_id: Option<Uuid>,
    pub details: Option<serde_json::Value>,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
}

// User statistics
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct UserStats {
    pub user_id: Uuid,
    pub username: String,
    pub post_count: i64,
    pub comment_count: i64,
    pub last_activity: Option<DateTime<Utc>>,
}

// Post statistics
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct PostStats {
    pub post_id: Uuid,
    pub title: String,
    pub author_username: String,
    pub comment_count: i64,
    pub view_count: i64,
    pub created_at: DateTime<Utc>,
}

// Pagination parameters
#[derive(Debug, Serialize, Deserialize)]
pub struct PaginationParams {
    pub page: u32,
    pub per_page: u32,
}

impl Default for PaginationParams {
    fn default() -> Self {
        Self {
            page: 1,
            per_page: 20,
        }
    }
}

// Paginated result
#[derive(Debug, Serialize, Deserialize)]
pub struct PaginatedResult<T> {
    pub items: Vec<T>,
    pub total: u64,
    pub page: u32,
    pub per_page: u32,
    pub total_pages: u32,
}

impl<T> PaginatedResult<T> {
    pub fn new(items: Vec<T>, total: u64, page: u32, per_page: u32) -> Self {
        let total_pages = (total as f64 / per_page as f64).ceil() as u32;
        Self {
            items,
            total,
            page,
            per_page,
            total_pages,
        }
    }
}

// Search parameters
#[derive(Debug, Serialize, Deserialize)]
pub struct SearchParams {
    pub query: String,
    pub page: Option<u32>,
    pub per_page: Option<u32>,
}

// User session model
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserSession {
    pub id: Uuid,
    pub user_id: Uuid,
    pub token: String,
    pub expires_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub last_used: Option<DateTime<Utc>>,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
}

// New session for creation
#[derive(Debug, Serialize, Deserialize)]
pub struct NewUserSession {
    pub user_id: Uuid,
    pub token: String,
    pub expires_at: DateTime<Utc>,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
}

// Database configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseConfig {
    pub host: String,
    pub port: u16,
    pub username: String,
    pub password: String,
    pub database: String,
    pub ssl_mode: String,
    pub max_connections: u32,
}

impl DatabaseConfig {
    pub fn database_url(&self) -> String {
        format!(
            "postgres://{}:{}@{}:{}/{}?sslmode={}",
            self.username, self.password, self.host, self.port, self.database, self.ssl_mode
        )
    }
}

// API response wrapper
#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub message: String,
    pub error: Option<String>,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            message: "Operation successful".to_string(),
            error: None,
        }
    }
    
    pub fn error(message: String) -> Self {
        Self {
            success: false,
            data: None,
            message: "Operation failed".to_string(),
            error: Some(message),
        }
    }
}

// Query builder helpers
pub struct QueryBuilder;

impl QueryBuilder {
    pub fn pagination_sql(page: u32, per_page: u32) -> String {
        let offset = (page - 1) * per_page;
        format!("LIMIT {} OFFSET {}", per_page, offset)
    }
    
    pub fn search_sql(table: &str, search_fields: &[&str], query: &str) -> String {
        let conditions: Vec<String> = search_fields
            .iter()
            .map(|field| format!("{} ILIKE '%{}%'", field, query))
            .collect();
        
        format!("WHERE {}", conditions.join(" OR "))
    }
}

// Custom types for database
pub mod custom_types {
    use serde::{Deserialize, Serialize};
    use sqlx::decode::Decode;
    use sqlx::encode::Encode;
    use sqlx::postgres::PgArgumentBuffer;
    use sqlx::postgres::TypeInfo;
    use sqlx::postgres::types::PgHasArrayType;
    use sqlx::{Postgres, Type, Value};
    use std::error::Error;
    
    // Custom type for tags array
    #[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
    #[sqlx(type_name = "text[]")]
    pub struct TagsArray(pub Vec<String>);
    
    // Custom type for JSON metadata
    #[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
    #[sqlx(type_name = "jsonb")]
    pub struct JsonMetadata(pub serde_json::Value);
    
    // Custom type for user roles
    #[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
    #[sqlx(type_name = "user_role")]
    pub enum UserRole {
        Admin,
        Moderator,
        User,
        Guest,
    }
    
    impl Default for UserRole {
        fn default() -> Self {
            UserRole::User
        }
    }
}