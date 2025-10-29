-- Drop the trigger
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;

-- Drop indexes
DROP INDEX IF EXISTS idx_posts_content_fts;
DROP INDEX IF EXISTS idx_posts_title;
DROP INDEX IF EXISTS idx_posts_created_at;
DROP INDEX IF EXISTS idx_posts_published;
DROP INDEX IF EXISTS idx_posts_user_id;

-- Drop the posts table
DROP TABLE IF EXISTS posts;