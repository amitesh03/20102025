use diesel::prelude::*;
use diesel::sql_types::*;
use uuid::Uuid;
use chrono::{Utc, Duration};

use crate::models::*;
use crate::schema::*;

// Count operations
pub fn count_users(conn: &mut PgConnection) -> QueryResult<i64> {
    users::table.count().get_result(conn)
}

pub fn count_posts(conn: &mut PgConnection) -> QueryResult<i64> {
    posts::table.count().get_result(conn)
}

pub fn count_comments(conn: &mut PgConnection) -> QueryResult<i64> {
    comments::table.count().get_result(conn)
}

pub fn count_posts_by_user(conn: &mut PgConnection) -> QueryResult<Vec<(String, i64)>> {
    posts::table
        .inner_join(users::table)
        .group_by(users::username)
        .select((users::username, diesel::dsl::count(posts::id)))
        .load::<(String, i64)>(conn)
}

pub fn count_comments_by_post(conn: &mut PgConnection) -> QueryResult<Vec<(String, i64)>> {
    posts::table
        .left_join(comments::table.on(posts::id.eq(comments::post_id)))
        .group_by(posts::title)
        .select((posts::title, diesel::dsl::count(comments::id).nullable()))
        .load::<(String, i64)>(conn)
}

// Aggregation queries
pub fn get_aggregate_stats(conn: &mut PgConnection) -> QueryResult<AggregateResult> {
    let stats = users::table
        .select((
            diesel::dsl::count(users::id),
            diesel::dsl::sql::<BigInt>("(SELECT COUNT(*) FROM posts)"),
            diesel::dsl::sql::<BigInt>("(SELECT COUNT(*) FROM comments)"),
            diesel::dsl::sql::<BigInt>("(SELECT COUNT(*) FROM posts WHERE published = true)"),
            diesel::dsl::sql::<BigInt>("(SELECT COUNT(*) FROM posts WHERE published = false)"),
        ))
        .first::<(i64, i64, i64, i64, i64)>(conn)?;
    
    Ok(AggregateResult {
        total_users: stats.0,
        total_posts: stats.1,
        total_comments: stats.2,
        published_posts: stats.3,
        unpublished_posts: stats.4,
    })
}

// Date-based queries
pub fn get_posts_created_in_last_days(conn: &mut PgConnection, days: i64) -> QueryResult<Vec<Post>> {
    let cutoff_date = Utc::now() - Duration::days(days);
    
    posts::table
        .filter(posts::created_at.ge(cutoff_date))
        .order(posts::created_at.desc())
        .load::<Post>(conn)
}

pub fn get_users_created_in_date_range(
    conn: &mut PgConnection,
    start_date: chrono::DateTime<Utc>,
    end_date: chrono::DateTime<Utc>,
) -> QueryResult<Vec<User>> {
    users::table
        .filter(users::created_at.between(start_date, end_date))
        .order(users::created_at.desc())
        .load::<User>(conn)
}

pub fn get_post_activity_by_month(conn: &mut PgConnection) -> QueryResult<Vec<(String, i64)>> {
    diesel::sql_query(
        r#"
        SELECT 
            TO_CHAR(created_at, 'YYYY-MM') as month,
            COUNT(*) as post_count
        FROM posts
        GROUP BY TO_CHAR(created_at, 'YYYY-MM')
        ORDER BY month DESC
        "#
    )
    .load::<(String, i64)>(conn)
}

// Search queries
pub fn search_users_by_username(conn: &mut PgConnection, username: &str) -> QueryResult<Vec<User>> {
    users::table
        .filter(users::username.ilike(format!("%{}%", username)))
        .order(users::username.asc())
        .load::<User>(conn)
}

pub fn search_posts_by_content(conn: &mut PgConnection, content: &str) -> QueryResult<Vec<Post>> {
    posts::table
        .filter(posts::content.ilike(format!("%{}%", content)))
        .order(posts::created_at.desc())
        .load::<Post>(conn)
}

pub fn search_posts_by_title(conn: &mut PgConnection, title: &str) -> QueryResult<Vec<Post>> {
    posts::table
        .filter(posts::title.ilike(format!("%{}%", title)))
        .order(posts::created_at.desc())
        .load::<Post>(conn)
}

// Pagination queries
pub fn get_users_paginated(
    conn: &mut PgConnection,
    page: i64,
    per_page: i64,
) -> QueryResult<(Vec<User>, i64)> {
    let offset = (page - 1) * per_page;
    
    let users = users::table
        .order(users::created_at.desc())
        .limit(per_page)
        .offset(offset)
        .load::<User>(conn)?;
    
    let total_count = users::table.count().get_result(conn)?;
    
    Ok((users, total_count))
}

pub fn get_posts_paginated(
    conn: &mut PgConnection,
    page: i64,
    per_page: i64,
    published_only: bool,
) -> QueryResult<(Vec<Post>, i64)> {
    let offset = (page - 1) * per_page;
    
    let mut query = posts::table.into_boxed();
    
    if published_only {
        query = query.filter(posts::published.eq(true));
    }
    
    let posts = query
        .order(posts::created_at.desc())
        .limit(per_page)
        .offset(offset)
        .load::<Post>(conn)?;
    
    let total_count = if published_only {
        posts::table.filter(posts::published.eq(true)).count().get_result(conn)?
    } else {
        posts::table.count().get_result(conn)?
    };
    
    Ok((posts, total_count))
}

// Complex JOIN queries
pub fn get_users_with_post_counts(conn: &mut PgConnection) -> QueryResult<Vec<(User, i64)>> {
    users::table
        .left_join(posts::table.on(users::id.eq(posts::user_id)))
        .group_by(users::id)
        .select((
            User::as_select(),
            diesel::dsl::count(posts::id).nullable(),
        ))
        .order(diesel::dsl::count(posts::id).desc())
        .load::<(User, i64)>(conn)
}

pub fn get_top_users_by_comments(conn: &mut PgConnection, limit: i64) -> QueryResult<Vec<(User, i64)>> {
    users::table
        .inner_join(comments::table.on(users::id.eq(comments::user_id)))
        .group_by(users::id)
        .select((
            User::as_select(),
            diesel::dsl::count(comments::id),
        ))
        .order(diesel::dsl::count(comments::id).desc())
        .limit(limit)
        .load::<(User, i64)>(conn)
}

// Subquery examples
pub fn get_users_with_more_than_n_posts(conn: &mut PgConnection, n: i64) -> QueryResult<Vec<User>> {
    users::table
        .filter(
            diesel::dsl::exists(
                posts::table
                    .filter(posts::user_id.eq(users::id))
                    .group_by(posts::user_id)
                    .having(diesel::dsl::count(posts::id).gt(n))
            )
        )
        .load::<User>(conn)
}

pub fn get_posts_without_comments(conn: &mut PgConnection) -> QueryResult<Vec<Post>> {
    posts::table
        .filter(
            diesel::dsl::not_exists(
                comments::table.filter(comments::post_id.eq(posts::id))
            )
        )
        .load::<Post>(conn)
}

// Window function examples
pub fn get_post_rankings_by_user(conn: &mut PgConnection) -> QueryResult<Vec<(Post, String, i64)>> {
    diesel::sql_query(
        r#"
        SELECT 
            p.*,
            u.username,
            ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at DESC) as post_rank
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY u.username, post_rank
        "#
    )
    .load::<(Post, String, i64)>(conn)
}

// CTE (Common Table Expression) examples
pub fn get_user_activity_summary(conn: &mut PgConnection) -> QueryResult<Vec<(String, i64, i64)>> {
    diesel::sql_query(
        r#"
        WITH user_activity AS (
            SELECT 
                u.id,
                u.username,
                COUNT(DISTINCT p.id) as post_count,
                COUNT(DISTINCT c.id) as comment_count
            FROM users u
            LEFT JOIN posts p ON u.id = p.user_id
            LEFT JOIN comments c ON u.id = c.user_id
            GROUP BY u.id, u.username
        )
        SELECT username, post_count, comment_count
        FROM user_activity
        ORDER BY (post_count + comment_count) DESC
        "#
    )
    .load::<(String, i64, i64)>(conn)
}

// Custom SQL queries
pub fn get_longest_posts(conn: &mut PgConnection, limit: i64) -> QueryResult<Vec<(Post, i64)>> {
    diesel::sql_query(
        r#"
        SELECT 
            p.*,
            LENGTH(p.content) as content_length
        FROM posts p
        ORDER BY LENGTH(p.content) DESC
        LIMIT $1
        "#
    )
    .bind::<BigInt, _>(limit)
    .load::<(Post, i64)>(conn)
}

pub fn get_most_active_users(conn: &mut PgConnection, days: i64) -> QueryResult<Vec<(User, i64)>> {
    let cutoff_date = Utc::now() - Duration::days(days);
    
    diesel::sql_query(
        r#"
        SELECT 
            u.*,
            activity_count
        FROM users u
        JOIN (
            SELECT user_id, COUNT(*) as activity_count
            FROM (
                SELECT user_id, created_at FROM posts
                UNION ALL
                SELECT user_id, created_at FROM comments
            ) activities
            WHERE created_at > $1
            GROUP BY user_id
        ) activity ON u.id = activity.user_id
        ORDER BY activity_count DESC
        "#
    )
    .bind::<Timestamp, _>(cutoff_date)
    .load::<(User, i64)>(conn)
}

// Performance optimization examples
pub fn get_recent_posts_optimized(conn: &mut PgConnection, limit: i64) -> QueryResult<Vec<Post>> {
    // Using a specific index hint (PostgreSQL specific)
    diesel::sql_query(
        r#"
        SELECT * FROM posts 
        WHERE published = true 
        ORDER BY created_at DESC 
        LIMIT $1
        "#
    )
    .bind::<BigInt, _>(limit)
    .load::<Post>(conn)
}

// Batch operations
pub fn update_all_users_last_activity(conn: &mut PgConnection) -> QueryResult<usize> {
    diesel::update(users::table)
        .set(users::updated_at.eq(Utc::now()))
        .execute(conn)
}

pub fn delete_old_activity_logs(conn: &mut PgConnection, days: i64) -> QueryResult<usize> {
    let cutoff_date = Utc::now() - Duration::days(days);
    
    diesel::delete(activity_logs::table.filter(activity_logs::created_at.lt(cutoff_date)))
        .execute(conn)
}

// Complex filtering
pub fn get_filtered_posts(
    conn: &mut PgConnection,
    user_id: Option<Uuid>,
    published: Option<bool>,
    date_from: Option<chrono::DateTime<Utc>>,
    date_to: Option<chrono::DateTime<Utc>>,
) -> QueryResult<Vec<Post>> {
    let mut query = posts::table.into_boxed();
    
    if let Some(user_id) = user_id {
        query = query.filter(posts::user_id.eq(user_id));
    }
    
    if let Some(published) = published {
        query = query.filter(posts::published.eq(published));
    }
    
    if let Some(date_from) = date_from {
        query = query.filter(posts::created_at.ge(date_from));
    }
    
    if let Some(date_to) = date_to {
        query = query.filter(posts::created_at.le(date_to));
    }
    
    query.order(posts::created_at.desc()).load::<Post>(conn)
}

// Recent posts with user info (optimized)
pub fn get_recent_posts(conn: &mut PgConnection, limit: i64) -> QueryResult<Vec<PostWithUser>> {
    posts::table
        .inner_join(users::table)
        .filter(posts::published.eq(true))
        .select((Post::as_select(), User::as_select()))
        .order(posts::created_at.desc())
        .limit(limit)
        .load::<PostWithUser>(conn)
}