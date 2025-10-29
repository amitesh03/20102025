-- Create posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on user_id for foreign key lookups
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- Create index on published for filtering
CREATE INDEX idx_posts_published ON posts(published);

-- Create index on created_at for sorting
CREATE INDEX idx_posts_created_at ON posts(created_at);

-- Create index on title for searching
CREATE INDEX idx_posts_title ON posts(title);

-- Create full-text search index
CREATE INDEX idx_posts_content_fts ON posts USING gin(to_tsvector('english', content));

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE
    ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();