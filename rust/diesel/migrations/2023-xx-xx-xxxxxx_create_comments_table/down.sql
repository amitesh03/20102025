-- Drop the trigger
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;

-- Drop indexes
DROP INDEX IF EXISTS idx_comments_created_at;
DROP INDEX IF EXISTS idx_comments_user_id;
DROP INDEX IF EXISTS idx_comments_post_id;

-- Drop the comments table
DROP TABLE IF EXISTS comments;