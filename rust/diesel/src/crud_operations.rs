use diesel::prelude::*;
use uuid::Uuid;
use chrono::Utc;

use crate::models::*;
use crate::schema::*;

// User CRUD operations
pub fn create_user(conn: &mut PgConnection, new_user: &NewUser) -> QueryResult<User> {
    diesel::insert_into(users::table)
        .values(new_user)
        .returning(User::as_returning())
        .get_result(conn)
}

pub fn get_all_users(conn: &mut PgConnection) -> QueryResult<Vec<User>> {
    users::table.load::<User>(conn)
}

pub fn get_user_by_id(conn: &mut PgConnection, user_id: Uuid) -> QueryResult<User> {
    users::table.find(user_id).first::<User>(conn)
}

pub fn get_user_by_username(conn: &mut PgConnection, username: &str) -> QueryResult<User> {
    users::table.filter(users::username.eq(username)).first::<User>(conn)
}

pub fn get_user_by_email(conn: &mut PgConnection, email: &str) -> QueryResult<User> {
    users::table.filter(users::email.eq(email)).first::<User>(conn)
}

pub fn update_user(
    conn: &mut PgConnection,
    user_id: Uuid,
    username: Option<&str>,
    email: Option<&str>,
) -> QueryResult<User> {
    let update_data = UpdateUser {
        username,
        email,
        full_name: None, // We don't update full_name in this function
        updated_at: Utc::now(),
    };
    
    diesel::update(users::table.find(user_id))
        .set(&update_data)
        .returning(User::as_returning())
        .get_result(conn)
}

pub fn update_user_full(
    conn: &mut PgConnection,
    user_id: Uuid,
    username: Option<&str>,
    email: Option<&str>,
    full_name: Option<Option<&str>>,
) -> QueryResult<User> {
    let update_data = UpdateUser {
        username,
        email,
        full_name,
        updated_at: Utc::now(),
    };
    
    diesel::update(users::table.find(user_id))
        .set(&update_data)
        .returning(User::as_returning())
        .get_result(conn)
}

pub fn delete_user(conn: &mut PgConnection, user_id: Uuid) -> QueryResult<usize> {
    diesel::delete(users::table.find(user_id)).execute(conn)
}

// Post CRUD operations
pub fn create_post(conn: &mut PgConnection, new_post: &NewPost) -> QueryResult<Post> {
    diesel::insert_into(posts::table)
        .values(new_post)
        .returning(Post::as_returning())
        .get_result(conn)
}

pub fn get_all_posts(conn: &mut PgConnection) -> QueryResult<Vec<Post>> {
    posts::table.load::<Post>(conn)
}

pub fn get_post_by_id(conn: &mut PgConnection, post_id: Uuid) -> QueryResult<Post> {
    posts::table.find(post_id).first::<Post>(conn)
}

pub fn get_posts_by_user(conn: &mut PgConnection, user_id: Uuid) -> QueryResult<Vec<Post>> {
    posts::table.filter(posts::user_id.eq(user_id)).load::<Post>(conn)
}

pub fn get_published_posts(conn: &mut PgConnection) -> QueryResult<Vec<Post>> {
    posts::table.filter(posts::published.eq(true)).load::<Post>(conn)
}

pub fn get_unpublished_posts(conn: &mut PgConnection) -> QueryResult<Vec<Post>> {
    posts::table.filter(posts::published.eq(false)).load::<Post>(conn)
}

pub fn update_post(
    conn: &mut PgConnection,
    post_id: Uuid,
    title: Option<&str>,
    content: Option<&str>,
    published: Option<bool>,
) -> QueryResult<Post> {
    let update_data = UpdatePost {
        title,
        content,
        published,
        updated_at: Utc::now(),
    };
    
    diesel::update(posts::table.find(post_id))
        .set(&update_data)
        .returning(Post::as_returning())
        .get_result(conn)
}

pub fn publish_post(conn: &mut PgConnection, post_id: Uuid) -> QueryResult<Post> {
    diesel::update(posts::table.find(post_id))
        .set(posts::published.eq(true))
        .returning(Post::as_returning())
        .get_result(conn)
}

pub fn unpublish_post(conn: &mut PgConnection, post_id: Uuid) -> QueryResult<Post> {
    diesel::update(posts::table.find(post_id))
        .set(posts::published.eq(false))
        .returning(Post::as_returning())
        .get_result(conn)
}

pub fn delete_post(conn: &mut PgConnection, post_id: Uuid) -> QueryResult<usize> {
    diesel::delete(posts::table.find(post_id)).execute(conn)
}

// Comment CRUD operations
pub fn create_comment(conn: &mut PgConnection, new_comment: &NewComment) -> QueryResult<Comment> {
    diesel::insert_into(comments::table)
        .values(new_comment)
        .returning(Comment::as_returning())
        .get_result(conn)
}

pub fn get_all_comments(conn: &mut PgConnection) -> QueryResult<Vec<Comment>> {
    comments::table.load::<Comment>(conn)
}

pub fn get_comment_by_id(conn: &mut PgConnection, comment_id: Uuid) -> QueryResult<Comment> {
    comments::table.find(comment_id).first::<Comment>(conn)
}

pub fn get_comments_by_post(conn: &mut PgConnection, post_id: Uuid) -> QueryResult<Vec<Comment>> {
    comments::table.filter(comments::post_id.eq(post_id)).load::<Comment>(conn)
}

pub fn get_comments_by_user(conn: &mut PgConnection, user_id: Uuid) -> QueryResult<Vec<Comment>> {
    comments::table.filter(comments::user_id.eq(user_id)).load::<Comment>(conn)
}

pub fn update_comment(
    conn: &mut PgConnection,
    comment_id: Uuid,
    content: &str,
) -> QueryResult<Comment> {
    let update_data = UpdateComment {
        content: Some(content),
        updated_at: Utc::now(),
    };
    
    diesel::update(comments::table.find(comment_id))
        .set(&update_data)
        .returning(Comment::as_returning())
        .get_result(conn)
}

pub fn delete_comment(conn: &mut PgConnection, comment_id: Uuid) -> QueryResult<usize> {
    diesel::delete(comments::table.find(comment_id)).execute(conn)
}

pub fn delete_comments_by_post(conn: &mut PgConnection, post_id: Uuid) -> QueryResult<usize> {
    diesel::delete(comments::table.filter(comments::post_id.eq(post_id))).execute(conn)
}

// Activity log operations
pub fn create_activity_log(conn: &mut PgConnection, new_log: &NewActivityLog) -> QueryResult<ActivityLog> {
    diesel::insert_into(activity_logs::table)
        .values(new_log)
        .returning(ActivityLog::as_returning())
        .get_result(conn)
}

pub fn get_activity_logs_by_user(conn: &mut PgConnection, user_id: Uuid) -> QueryResult<Vec<ActivityLog>> {
    activity_logs::table
        .filter(activity_logs::user_id.eq(user_id))
        .order(activity_logs::created_at.desc())
        .load::<ActivityLog>(conn)
}

pub fn get_recent_activity_logs(conn: &mut PgConnection, limit: i64) -> QueryResult<Vec<ActivityLog>> {
    activity_logs::table
        .order(activity_logs::created_at.desc())
        .limit(limit)
        .load::<ActivityLog>(conn)
}

// Batch operations
pub fn create_multiple_users(conn: &mut PgConnection, new_users: &[NewUser]) -> QueryResult<Vec<User>> {
    diesel::insert_into(users::table)
        .values(new_users)
        .returning(User::as_returning())
        .get_results(conn)
}

pub fn create_multiple_posts(conn: &mut PgConnection, new_posts: &[NewPost]) -> QueryResult<Vec<Post>> {
    diesel::insert_into(posts::table)
        .values(new_posts)
        .returning(Post::as_returning())
        .get_results(conn)
}

pub fn delete_posts_by_user(conn: &mut PgConnection, user_id: Uuid) -> QueryResult<usize> {
    diesel::delete(posts::table.filter(posts::user_id.eq(user_id))).execute(conn)
}

// Utility functions
pub fn user_exists(conn: &mut PgConnection, user_id: Uuid) -> QueryResult<bool> {
    let count: i64 = users::table
        .filter(users::id.eq(user_id))
        .count()
        .get_result(conn)?;
    
    Ok(count > 0)
}

pub fn post_exists(conn: &mut PgConnection, post_id: Uuid) -> QueryResult<bool> {
    let count: i64 = posts::table
        .filter(posts::id.eq(post_id))
        .count()
        .get_result(conn)?;
    
    Ok(count > 0)
}

pub fn comment_exists(conn: &mut PgConnection, comment_id: Uuid) -> QueryResult<bool> {
    let count: i64 = comments::table
        .filter(comments::id.eq(comment_id))
        .count()
        .get_result(conn)?;
    
    Ok(count > 0)
}

pub fn is_username_taken(conn: &mut PgConnection, username: &str) -> QueryResult<bool> {
    let count: i64 = users::table
        .filter(users::username.eq(username))
        .count()
        .get_result(conn)?;
    
    Ok(count > 0)
}

pub fn is_email_taken(conn: &mut PgConnection, email: &str) -> QueryResult<bool> {
    let count: i64 = users::table
        .filter(users::email.eq(email))
        .count()
        .get_result(conn)?;
    
    Ok(count > 0)
}