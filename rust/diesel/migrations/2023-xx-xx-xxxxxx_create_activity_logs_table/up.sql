-- Create activity_logs table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(255) NOT NULL,
    resource_id UUID,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on user_id for foreign key lookups
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);

-- Create index on action for filtering
CREATE INDEX idx_activity_logs_action ON activity_logs(action);

-- Create index on resource_type for filtering
CREATE INDEX idx_activity_logs_resource_type ON activity_logs(resource_type);

-- Create index on created_at for sorting
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Create composite index for common queries
CREATE INDEX idx_activity_logs_user_created ON activity_logs(user_id, created_at DESC);