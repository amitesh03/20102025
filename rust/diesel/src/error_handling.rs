use diesel::result::{Error as DieselError, QueryResult};
use thiserror::Error;
use uuid::Uuid;

use crate::models::*;
use crate::schema::*;
use crate::crud_operations::*;

// Custom error types
#[derive(Debug, Error)]
pub enum DatabaseError {
    #[error("Database connection error: {0}")]
    ConnectionError(String),
    
    #[error("User not found with ID: {0}")]
    UserNotFound(Uuid),
    
    #[error("Post not found with ID: {0}")]
    PostNotFound(Uuid),
    
    #[error("Comment not found with ID: {0}")]
    CommentNotFound(Uuid),
    
    #[error("Username already exists: {0}")]
    UsernameAlreadyExists(String),
    
    #[error("Email already exists: {0}")]
    EmailAlreadyExists(String),
    
    #[error("Validation error: {0}")]
    ValidationError(String),
    
    #[error("Foreign key constraint violation: {0}")]
    ForeignKeyViolation(String),
    
    #[error("Unique constraint violation: {0}")]
    UniqueConstraintViolation(String),
    
    #[error("Database error: {0}")]
    DatabaseError(String),
}

// Result type for our application
pub type DbResult<T> = Result<T, DatabaseError>;

// Convert Diesel errors to our custom error type
impl From<DieselError> for DatabaseError {
    fn from(error: DieselError) -> Self {
        match error {
            DieselError::NotFound => DatabaseError::DatabaseError("Record not found".to_string()),
            DieselError::DatabaseError(kind, info) => {
                match kind {
                    diesel::result::DatabaseErrorKind::UniqueViolation => {
                        let message = info.message();
                        if message.contains("users_username_key") {
                            DatabaseError::UsernameAlreadyExists("Username already exists".to_string())
                        } else if message.contains("users_email_key") {
                            DatabaseError::EmailAlreadyExists("Email already exists".to_string())
                        } else {
                            DatabaseError::UniqueConstraintViolation(message.to_string())
                        }
                    },
                    diesel::result::DatabaseErrorKind::ForeignKeyViolation => {
                        DatabaseError::ForeignKeyViolation(info.message().to_string())
                    },
                    _ => DatabaseError::DatabaseError(info.message().to_string()),
                }
            },
            _ => DatabaseError::DatabaseError(format!("Diesel error: {}", error)),
        }
    }
}

// Safe CRUD operations with proper error handling
pub fn create_user_safe(conn: &mut PgConnection, new_user: &NewUser) -> DbResult<User> {
    // Validate input
    if new_user.username.is_empty() {
        return Err(DatabaseError::ValidationError("Username cannot be empty".to_string()));
    }
    
    if new_user.email.is_empty() {
        return Err(DatabaseError::ValidationError("Email cannot be empty".to_string()));
    }
    
    if !new_user.email.contains('@') {
        return Err(DatabaseError::ValidationError("Invalid email format".to_string()));
    }
    
    // Check if username already exists
    if is_username_taken(conn, new_user.username)? {
        return Err(DatabaseError::UsernameAlreadyExists(new_user.username.to_string()));
    }
    
    // Check if email already exists
    if is_email_taken(conn, new_user.email)? {
        return Err(DatabaseError::EmailAlreadyExists(new_user.email.to_string()));
    }
    
    // Create user
    create_user(conn, new_user).map_err(DatabaseError::from)
}

pub fn get_user_by_id_safe(conn: &mut PgConnection, user_id: Uuid) -> DbResult<User> {
    get_user_by_id(conn, user_id)
        .map_err(|e| match e {
            DieselError::NotFound => DatabaseError::UserNotFound(user_id),
            _ => DatabaseError::from(e),
        })
}

pub fn update_user_safe(
    conn: &mut PgConnection,
    user_id: Uuid,
    username: Option<&str>,
    email: Option<&str>,
) -> DbResult<User> {
    // Validate input if provided
    if let Some(username) = username {
        if username.is_empty() {
            return Err(DatabaseError::ValidationError("Username cannot be empty".to_string()));
        }
        
        // Check if username is taken by another user
        let existing_user = get_user_by_username(conn, username);
        if let Ok(existing) = existing_user {
            if existing.id != user_id {
                return Err(DatabaseError::UsernameAlreadyExists(username.to_string()));
            }
        }
    }
    
    if let Some(email) = email {
        if email.is_empty() {
            return Err(DatabaseError::ValidationError("Email cannot be empty".to_string()));
        }
        
        if !email.contains('@') {
            return Err(DatabaseError::ValidationError("Invalid email format".to_string()));
        }
        
        // Check if email is taken by another user
        let existing_user = get_user_by_email(conn, email);
        if let Ok(existing) = existing_user {
            if existing.id != user_id {
                return Err(DatabaseError::EmailAlreadyExists(email.to_string()));
            }
        }
    }
    
    // Check if user exists
    if !user_exists(conn, user_id)? {
        return Err(DatabaseError::UserNotFound(user_id));
    }
    
    // Update user
    update_user(conn, user_id, username, email).map_err(DatabaseError::from)
}

pub fn delete_user_safe(conn: &mut PgConnection, user_id: Uuid) -> DbResult<()> {
    // Check if user exists
    if !user_exists(conn, user_id)? {
        return Err(DatabaseError::UserNotFound(user_id));
    }
    
    // Check if user has posts (optional business rule)
    let user_posts = get_posts_by_user(conn, user_id)?;
    if !user_posts.is_empty() {
        return Err(DatabaseError::ForeignKeyViolation(
            "Cannot delete user with existing posts".to_string()
        ));
    }
    
    // Delete user
    delete_user(conn, user_id)
        .map(|_| ())
        .map_err(DatabaseError::from)
}

pub fn create_post_safe(conn: &mut PgConnection, new_post: &NewPost) -> DbResult<Post> {
    // Validate input
    if new_post.title.is_empty() {
        return Err(DatabaseError::ValidationError("Title cannot be empty".to_string()));
    }
    
    if new_post.content.is_empty() {
        return Err(DatabaseError::ValidationError("Content cannot be empty".to_string()));
    }
    
    // Check if user exists
    if !user_exists(conn, new_post.user_id)? {
        return Err(DatabaseError::UserNotFound(new_post.user_id));
    }
    
    // Create post
    create_post(conn, new_post).map_err(DatabaseError::from)
}

pub fn get_post_by_id_safe(conn: &mut PgConnection, post_id: Uuid) -> DbResult<Post> {
    get_post_by_id(conn, post_id)
        .map_err(|e| match e {
            DieselError::NotFound => DatabaseError::PostNotFound(post_id),
            _ => DatabaseError::from(e),
        })
}

pub fn update_post_safe(
    conn: &mut PgConnection,
    post_id: Uuid,
    title: Option<&str>,
    content: Option<&str>,
    published: Option<bool>,
) -> DbResult<Post> {
    // Validate input if provided
    if let Some(title) = title {
        if title.is_empty() {
            return Err(DatabaseError::ValidationError("Title cannot be empty".to_string()));
        }
    }
    
    if let Some(content) = content {
        if content.is_empty() {
            return Err(DatabaseError::ValidationError("Content cannot be empty".to_string()));
        }
    }
    
    // Check if post exists
    if !post_exists(conn, post_id)? {
        return Err(DatabaseError::PostNotFound(post_id));
    }
    
    // Update post
    update_post(conn, post_id, title, content, published).map_err(DatabaseError::from)
}

pub fn delete_post_safe(conn: &mut PgConnection, post_id: Uuid) -> DbResult<()> {
    // Check if post exists
    if !post_exists(conn, post_id)? {
        return Err(DatabaseError::PostNotFound(post_id));
    }
    
    // Delete comments first (cascade delete would handle this automatically with proper foreign key constraints)
    delete_comments_by_post(conn, post_id)?;
    
    // Delete post
    delete_post(conn, post_id)
        .map(|_| ())
        .map_err(DatabaseError::from)
}

pub fn create_comment_safe(conn: &mut PgConnection, new_comment: &NewComment) -> DbResult<Comment> {
    // Validate input
    if new_comment.content.is_empty() {
        return Err(DatabaseError::ValidationError("Comment content cannot be empty".to_string()));
    }
    
    // Check if post exists
    if !post_exists(conn, new_comment.post_id)? {
        return Err(DatabaseError::PostNotFound(new_comment.post_id));
    }
    
    // Check if user exists
    if !user_exists(conn, new_comment.user_id)? {
        return Err(DatabaseError::UserNotFound(new_comment.user_id));
    }
    
    // Create comment
    create_comment(conn, new_comment).map_err(DatabaseError::from)
}

pub fn get_comment_by_id_safe(conn: &mut PgConnection, comment_id: Uuid) -> DbResult<Comment> {
    get_comment_by_id(conn, comment_id)
        .map_err(|e| match e {
            DieselError::NotFound => DatabaseError::CommentNotFound(comment_id),
            _ => DatabaseError::from(e),
        })
}

pub fn update_comment_safe(
    conn: &mut PgConnection,
    comment_id: Uuid,
    content: &str,
) -> DbResult<Comment> {
    // Validate input
    if content.is_empty() {
        return Err(DatabaseError::ValidationError("Comment content cannot be empty".to_string()));
    }
    
    // Check if comment exists
    if !comment_exists(conn, comment_id)? {
        return Err(DatabaseError::CommentNotFound(comment_id));
    }
    
    // Update comment
    update_comment(conn, comment_id, content).map_err(DatabaseError::from)
}

pub fn delete_comment_safe(conn: &mut PgConnection, comment_id: Uuid) -> DbResult<()> {
    // Check if comment exists
    if !comment_exists(conn, comment_id)? {
        return Err(DatabaseError::CommentNotFound(comment_id));
    }
    
    // Delete comment
    delete_comment(conn, comment_id)
        .map(|_| ())
        .map_err(DatabaseError::from)
}

// Batch operations with error handling
pub fn create_multiple_users_safe(conn: &mut PgConnection, new_users: &[NewUser]) -> DbResult<Vec<User>> {
    // Validate all users first
    for user in new_users {
        if user.username.is_empty() {
            return Err(DatabaseError::ValidationError("Username cannot be empty".to_string()));
        }
        
        if user.email.is_empty() {
            return Err(DatabaseError::ValidationError("Email cannot be empty".to_string()));
        }
        
        if !user.email.contains('@') {
            return Err(DatabaseError::ValidationError("Invalid email format".to_string()));
        }
        
        if is_username_taken(conn, user.username)? {
            return Err(DatabaseError::UsernameAlreadyExists(user.username.to_string()));
        }
        
        if is_email_taken(conn, user.email)? {
            return Err(DatabaseError::EmailAlreadyExists(user.email.to_string()));
        }
    }
    
    // Create all users
    create_multiple_users(conn, new_users).map_err(DatabaseError::from)
}

// Transaction examples
pub fn transfer_post_ownership(
    conn: &mut PgConnection,
    post_id: Uuid,
    from_user_id: Uuid,
    to_user_id: Uuid,
) -> DbResult<()> {
    conn.transaction::<(), DatabaseError, _>(|conn| {
        // Check if post exists
        if !post_exists(conn, post_id)? {
            return Err(DatabaseError::PostNotFound(post_id));
        }
        
        // Check if from_user exists
        if !user_exists(conn, from_user_id)? {
            return Err(DatabaseError::UserNotFound(from_user_id));
        }
        
        // Check if to_user exists
        if !user_exists(conn, to_user_id)? {
            return Err(DatabaseError::UserNotFound(to_user_id));
        }
        
        // Update post ownership
        diesel::update(posts::table.find(post_id))
            .set(posts::user_id.eq(to_user_id))
            .execute(conn)
            .map_err(DatabaseError::from)?;
        
        // Log the activity
        let activity_log = NewActivityLog {
            user_id: Some(from_user_id),
            action: "transferred_post",
            resource_type: "post",
            resource_id: Some(post_id),
            details: Some(&format!("Transferred post to user {}", to_user_id)),
        };
        
        create_activity_log(conn, &activity_log).map_err(DatabaseError::from)?;
        
        Ok(())
    })
}

// Utility functions for error handling
pub fn handle_database_error<T>(result: QueryResult<T>) -> DbResult<T> {
    result.map_err(DatabaseError::from)
}

pub fn log_error(error: &DatabaseError) {
    eprintln!("Database error: {}", error);
    
    // In a real application, you might want to:
    // 1. Log to a file
    // 2. Send to a logging service
    // 3. Include additional context
    // 4. Track error metrics
}

// Example of a recoverable operation
pub fn get_user_with_fallback(
    conn: &mut PgConnection,
    user_id: Uuid,
) -> DbResult<User> {
    match get_user_by_id_safe(conn, user_id) {
        Ok(user) => Ok(user),
        Err(DatabaseError::UserNotFound(_)) => {
            // Try to find user by username if ID lookup fails
            // This is just an example of error recovery
            log_error(&DatabaseError::UserNotFound(user_id));
            
            // Return a default user or try alternative lookup methods
            Err(DatabaseError::UserNotFound(user_id))
        },
        Err(e) => Err(e),
    }
}