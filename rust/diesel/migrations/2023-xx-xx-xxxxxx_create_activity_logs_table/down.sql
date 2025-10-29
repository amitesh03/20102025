-- Drop indexes
DROP INDEX IF EXISTS idx_activity_logs_user_created;
DROP INDEX IF EXISTS idx_activity_logs_created_at;
DROP INDEX IF EXISTS idx_activity_logs_resource_type;
DROP INDEX IF EXISTS idx_activity_logs_action;
DROP INDEX IF EXISTS idx_activity_logs_user_id;

-- Drop the activity_logs table
DROP TABLE IF EXISTS activity_logs;