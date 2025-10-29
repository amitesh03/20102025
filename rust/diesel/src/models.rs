use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

use crate::schema::*;

// User model
#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = users)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub full_name: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// NewUser for insertion
#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = users)]
pub struct NewUser<'a> {
    pub username: &'a str,
    pub email: &'a str,
    pub full_name: Option<&'a str>,
}

// UpdateUser for updates
#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = users)]
pub struct UpdateUser<'a> {
    pub username: Option<&'a str>,
    pub email: Option<&'a str>,
    pub full_name: Option<Option<&'a str>>,
    pub updated_at: DateTime<Utc>,
}

// Post model
#[derive(Debug, Queryable, Selectable, Serialize, Deserialize, Associations)]
#[diesel(belongs_to(User))]
#[diesel(table_name = posts)]
pub struct Post {
    pub id: Uuid,
    pub title: String,
    pub content: String,
    pub user_id: Uuid,
    pub published: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// NewPost for insertion
#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = posts)]
pub struct NewPost<'a> {
    pub title: &'a str,
    pub content: &'a str,
    pub user_id: Uuid,
    pub published: bool,
}

// UpdatePost for updates
#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = posts)]
pub struct UpdatePost<'a> {
    pub title: Option<&'a str>,
    pub content: Option<&'a str>,
    pub published: Option<bool>,
    pub updated_at: DateTime<Utc>,
}

// Comment model
#[derive(Debug, Queryable, Selectable, Serialize, Deserialize, Associations)]
#[diesel(belongs_to(User))]
#[diesel(belongs_to(Post))]
#[diesel(table_name = comments)]
pub struct Comment {
    pub id: Uuid,
    pub content: String,
    pub post_id: Uuid,
    pub user_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// NewComment for insertion
#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = comments)]
pub struct NewComment<'a> {
    pub content: &'a str,
    pub post_id: Uuid,
    pub user_id: Uuid,
}

// UpdateComment for updates
#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = comments)]
pub struct UpdateComment<'a> {
    pub content: Option<&'a str>,
    pub updated_at: DateTime<Utc>,
}

// User with posts (for joined queries)
#[derive(Debug, Queryable, Serialize, Deserialize)]
pub struct UserWithPosts {
    #[diesel(embed)]
    pub user: User,
    pub posts: Vec<Post>,
}

// Post with user (for joined queries)
#[derive(Debug, Queryable, Serialize, Deserialize)]
pub struct PostWithUser {
    #[diesel(embed)]
    pub post: Post,
    #[diesel(embed)]
    pub user: User,
}

// Post with comments (for joined queries)
#[derive(Debug, Queryable, Serialize, Deserialize)]
pub struct PostWithComments {
    #[diesel(embed)]
    pub post: Post,
    pub comments: Vec<Comment>,
}

// User with posts and comments (for complex queries)
#[derive(Debug, Serialize, Deserialize)]
pub struct UserWithPostsAndComments {
    pub user: User,
    pub posts: Vec<PostWithComments>,
}

// Post statistics
#[derive(Debug, Queryable, Serialize, Deserialize)]
pub struct PostStats {
    pub user_id: Uuid,
    pub username: String,
    pub post_count: i64,
}

// User statistics
#[derive(Debug, Queryable, Serialize, Deserialize)]
pub struct UserStats {
    pub id: Uuid,
    pub username: String,
    pub post_count: i64,
    pub comment_count: i64,
}

// Search result
#[derive(Debug, Serialize, Deserialize)]
pub struct SearchResult {
    pub users: Vec<User>,
    pub posts: Vec<Post>,
    pub comments: Vec<Comment>,
}

// Pagination info
#[derive(Debug, Serialize, Deserialize)]
pub struct PaginationInfo {
    pub page: i64,
    pub per_page: i64,
    pub total: i64,
    pub total_pages: i64,
}

// Paginated result
#[derive(Debug, Serialize, Deserialize)]
pub struct PaginatedResult<T> {
    pub data: Vec<T>,
    pub pagination: PaginationInfo,
}

// Custom query result for complex joins
#[derive(Debug, QueryableByName, Serialize, Deserialize)]
pub struct CustomQueryResult {
    #[diesel(sql_type = diesel::sql_types::Uuid)]
    pub id: Uuid,
    #[diesel(sql_type = diesel::sql_types::Text)]
    pub title: String,
    #[diesel(sql_type = diesel::sql_types::Text)]
    pub username: String,
    #[diesel(sql_type = diesel::sql_types::BigInt)]
    pub comment_count: i64,
}

// Aggregate result
#[derive(Debug, Queryable, Serialize, Deserialize)]
pub struct AggregateResult {
    pub total_users: i64,
    pub total_posts: i64,
    pub total_comments: i64,
    pub published_posts: i64,
    pub unpublished_posts: i64,
}

// Activity log
#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = activity_logs)]
pub struct ActivityLog {
    pub id: Uuid,
    pub user_id: Option<Uuid>,
    pub action: String,
    pub resource_type: String,
    pub resource_id: Option<Uuid>,
    pub details: Option<String>,
    pub created_at: DateTime<Utc>,
}

// NewActivityLog for insertion
#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = activity_logs)]
pub struct NewActivityLog<'a> {
    pub user_id: Option<Uuid>,
    pub action: &'a str,
    pub resource_type: &'a str,
    pub resource_id: Option<Uuid>,
    pub details: Option<&'a str>,
}

// User profile (aggregated data)
#[derive(Debug, Serialize, Deserialize)]
pub struct UserProfile {
    pub user: User,
    pub post_count: i64,
    pub comment_count: i64,
    pub recent_posts: Vec<Post>,
    pub recent_comments: Vec<Comment>,
}

// Dashboard data
#[derive(Debug, Serialize, Deserialize)]
pub struct DashboardData {
    pub user_stats: UserStats,
    pub recent_activity: Vec<ActivityLog>,
    pub popular_posts: Vec<PostWithUser>,
}

// Form data for creating/updating users
#[derive(Debug, Deserialize)]
pub struct UserFormData {
    pub username: String,
    pub email: String,
    pub full_name: Option<String>,
}

// Form data for creating/updating posts
#[derive(Debug, Deserialize)]
pub struct PostFormData {
    pub title: String,
    pub content: String,
    pub published: bool,
}

// Form data for creating/updating comments
#[derive(Debug, Deserialize)]
pub struct CommentFormData {
    pub content: String,
}

// Search parameters
#[derive(Debug, Deserialize)]
pub struct SearchParams {
    pub query: String,
    pub user_id: Option<Uuid>,
    pub post_id: Option<Uuid>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// Filter parameters for posts
#[derive(Debug, Deserialize)]
pub struct PostFilterParams {
    pub user_id: Option<Uuid>,
    pub published: Option<bool>,
    pub date_from: Option<DateTime<Utc>>,
    pub date_to: Option<DateTime<Utc>>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// Sort parameters
#[derive(Debug, Deserialize)]
pub struct SortParams {
    pub sort_by: Option<String>,
    pub sort_order: Option<String>,
}

impl Default for SortParams {
    fn default() -> Self {
        Self {
            sort_by: Some("created_at".to_string()),
            sort_order: Some("desc".to_string()),
        }
    }
}