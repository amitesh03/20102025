use diesel::prelude::*;
use uuid::Uuid;

use crate::models::*;
use crate::schema::*;
use crate::crud_operations::*;

// User with their posts
pub fn get_user_with_posts(conn: &mut PgConnection, user_id: Uuid) -> QueryResult<UserWithPosts> {
    let user = users::table.find(user_id).first::<User>(conn)?;
    let posts = Post::belonging_to(&user)
        .order(posts::created_at.desc())
        .load::<Post>(conn)?;
    
    Ok(UserWithPosts { user, posts })
}

// Post with its user
pub fn get_post_with_user(conn: &mut PgConnection, post_id: Uuid) -> QueryResult<PostWithUser> {
    let post = posts::table.find(post_id).first::<Post>(conn)?;
    let user = User::belonging_to(&post).first::<User>(conn)?;
    
    Ok(PostWithUser { post, user })
}

// Post with its comments
pub fn get_post_with_comments(conn: &mut PgConnection, post_id: Uuid) -> QueryResult<PostWithComments> {
    let post = posts::table.find(post_id).first::<Post>(conn)?;
    let comments = Comment::belonging_to(&post)
        .order(comments::created_at.asc())
        .load::<Comment>(conn)?;
    
    Ok(PostWithComments { post, comments })
}

// All posts with user information
pub fn get_all_posts_with_users(conn: &mut PgConnection) -> QueryResult<Vec<PostWithUser>> {
    posts::table
        .inner_join(users::table)
        .select((Post::as_select(), User::as_select()))
        .order(posts::created_at.desc())
        .load::<PostWithUser>(conn)
}

// Published posts with user information
pub fn get_published_posts_with_users(conn: &mut PgConnection) -> QueryResult<Vec<PostWithUser>> {
    posts::table
        .inner_join(users::table)
        .filter(posts::published.eq(true))
        .select((Post::as_select(), User::as_select()))
        .order(posts::created_at.desc())
        .load::<PostWithUser>(conn)
}

// Posts by user with comments
pub fn get_user_posts_with_comments(conn: &mut PgConnection, user_id: Uuid) -> QueryResult<Vec<PostWithComments>> {
    let user = users::table.find(user_id).first::<User>(conn)?;
    let posts = Post::belonging_to(&user)
        .order(posts::created_at.desc())
        .load::<Post>(conn)?;
    
    let mut posts_with_comments = Vec::new();
    
    for post in posts {
        let comments = Comment::belonging_to(&post)
            .order(comments::created_at.asc())
            .load::<Comment>(conn)?;
        
        posts_with_comments.push(PostWithComments { post, comments });
    }
    
    Ok(posts_with_comments)
}

// Complete user profile with posts and comments
pub fn get_user_profile(conn: &mut PgConnection, user_id: Uuid) -> QueryResult<UserProfile> {
    let user = users::table.find(user_id).first::<User>(conn)?;
    
    // Get post count
    let post_count: i64 = Post::belonging_to(&user).count().get_result(conn)?;
    
    // Get comment count
    let comment_count: i64 = Comment::belonging_to(&user).count().get_result(conn)?;
    
    // Get recent posts
    let recent_posts = Post::belonging_to(&user)
        .order(posts::created_at.desc())
        .limit(5)
        .load::<Post>(conn)?;
    
    // Get recent comments
    let recent_comments = Comment::belonging_to(&user)
        .order(comments::created_at.desc())
        .limit(5)
        .load::<Comment>(conn)?;
    
    Ok(UserProfile {
        user,
        post_count,
        comment_count,
        recent_posts,
        recent_comments,
    })
}

// Post statistics with user information
pub fn get_post_stats(conn: &mut PgConnection) -> QueryResult<Vec<PostStats>> {
    posts::table
        .inner_join(users::table)
        .group_by((users::id, users::username))
        .select((
            users::id,
            users::username,
            diesel::dsl::count(posts::id),
        ))
        .load::<PostStats>(conn)
}

// User statistics with post and comment counts
pub fn get_user_stats(conn: &mut PgConnection) -> QueryResult<Vec<UserStats>> {
    users::table
        .left_join(posts::table.on(users::id.eq(posts::user_id)))
        .left_join(comments::table.on(users::id.eq(comments::user_id)))
        .group_by(users::id)
        .select((
            users::id,
            users::username,
            diesel::dsl::count(posts::id).nullable(),
            diesel::dsl::count(comments::id).nullable(),
        ))
        .load::<UserStats>(conn)
}

// Comments with post and user information
pub fn get_comments_with_post_and_user(conn: &mut PgConnection) -> QueryResult<Vec<(Comment, Post, User)>> {
    comments::table
        .inner_join(posts::table)
        .inner_join(users::table)
        .select((
            Comment::as_select(),
            Post::as_select(),
            User::as_select(),
        ))
        .order(comments::created_at.desc())
        .load::<(Comment, Post, User)>(conn)
}

// Popular posts (with most comments)
pub fn get_popular_posts(conn: &mut PgConnection, limit: i64) -> QueryResult<Vec<(Post, User, i64)>> {
    posts::table
        .inner_join(users::table)
        .left_join(comments::table.on(posts::id.eq(comments::post_id)))
        .group_by((posts::id, users::id))
        .select((
            Post::as_select(),
            User::as_select(),
            diesel::dsl::count(comments::id).nullable(),
        ))
        .order(diesel::dsl::count(comments::id).desc())
        .limit(limit)
        .load::<(Post, User, i64)>(conn)
}

// Recent activity across all tables
pub fn get_recent_activity(conn: &mut PgConnection, limit: i64) -> QueryResult<Vec<serde_json::Value>> {
    // Get recent posts
    let recent_posts: Vec<serde_json::Value> = posts::table
        .inner_join(users::table)
        .filter(posts::published.eq(true))
        .select(diesel::dsl::sql(
            "json_build_object(
                'type', 'post',
                'id', posts.id,
                'title', posts.title,
                'username', users.username,
                'created_at', posts.created_at
            )"
        ))
        .order(posts::created_at.desc())
        .limit(limit)
        .load(conn)?;
    
    // Get recent comments
    let recent_comments: Vec<serde_json::Value> = comments::table
        .inner_join(users::table)
        .inner_join(posts::table)
        .select(diesel::dsl::sql(
            "json_build_object(
                'type', 'comment',
                'id', comments.id,
                'content', comments.content,
                'username', users.username,
                'post_title', posts.title,
                'created_at', comments.created_at
            )"
        ))
        .order(comments::created_at.desc())
        .limit(limit)
        .load(conn)?;
    
    // Combine and sort by date
    let mut all_activity = recent_posts;
    all_activity.extend(recent_comments);
    
    // Sort by created_at (this is a simplified approach)
    all_activity.sort_by(|a, b| {
        let a_time = a.get("created_at").and_then(|v| v.as_str()).unwrap_or("");
        let b_time = b.get("created_at").and_then(|v| v.as_str()).unwrap_or("");
        b_time.cmp(a_time) // Reverse chronological order
    });
    
    Ok(all_activity)
}

// Search across users, posts, and comments
pub fn search_all(conn: &mut PgConnection, query: &str) -> QueryResult<SearchResult> {
    // Search users
    let users = users::table
        .filter(
            users::username.ilike(format!("%{}%", query))
                .or(users::full_name.ilike(format!("%{}%", query)))
        )
        .load::<User>(conn)?;
    
    // Search posts
    let posts = posts::table
        .filter(
            posts::title.ilike(format!("%{}%", query))
                .or(posts::content.ilike(format!("%{}%", query)))
        )
        .load::<Post>(conn)?;
    
    // Search comments
    let comments = comments::table
        .filter(comments::content.ilike(format!("%{}%", query)))
        .load::<Comment>(conn)?;
    
    Ok(SearchResult {
        users,
        posts,
        comments,
    })
}

// Get posts with comment count
pub fn get_posts_with_comment_count(conn: &mut PgConnection) -> QueryResult<Vec<(Post, i64)>> {
    posts::table
        .left_join(comments::table.on(posts::id.eq(comments::post_id)))
        .group_by(posts::id)
        .select((
            Post::as_select(),
            diesel::dsl::count(comments::id).nullable(),
        ))
        .order(posts::created_at.desc())
        .load::<(Post, i64)>(conn)
}

// Get users with post and comment activity
pub fn get_users_with_activity(conn: &mut PgConnection, user_id: Uuid) -> QueryResult<UserWithPostsAndComments> {
    let user = users::table.find(user_id).first::<User>(conn)?;
    
    let posts = Post::belonging_to(&user)
        .order(posts::created_at.desc())
        .load::<Post>(conn)?;
    
    let mut posts_with_comments = Vec::new();
    
    for post in posts {
        let comments = Comment::belonging_to(&post)
            .order(comments::created_at.asc())
            .load::<Comment>(conn)?;
        
        posts_with_comments.push(PostWithComments { post, comments });
    }
    
    Ok(UserWithPostsAndComments {
        user,
        posts: posts_with_comments,
    })
}

// Get dashboard data for a user
pub fn get_user_dashboard(conn: &mut PgConnection, user_id: Uuid) -> QueryResult<DashboardData> {
    let user_stats = get_user_stats(conn)?
        .into_iter()
        .find(|stats| stats.id == user_id)
        .ok_or(diesel::result::Error::NotFound)?;
    
    let recent_activity = get_activity_logs_by_user(conn, user_id)?;
    
    let popular_posts = get_popular_posts(conn, 5)?;
    
    Ok(DashboardData {
        user_stats,
        recent_activity,
        popular_posts,
    })
}