-- Create comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on post_id for foreign key lookups
CREATE INDEX idx_comments_post_id ON comments(post_id);

-- Create index on user_id for foreign key lookups
CREATE INDEX idx_comments_user_id ON comments(user_id);

-- Create index on created_at for sorting
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE
    ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();