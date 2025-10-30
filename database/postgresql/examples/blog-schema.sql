-- PostgreSQL Blog Database Schema

-- Create database (if needed)
-- CREATE DATABASE blog;
-- \c blog;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user roles
CREATE ROLE app_user WITH LOGIN PASSWORD 'secure_password';
CREATE ROLE read_only WITH LOGIN PASSWORD 'read_password';

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    bio TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    featured_image_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0
);

-- Tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Post tags junction table
CREATE TABLE post_tags (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT true
);

-- Likes table
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_comment_id ON comments(parent_comment_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Full-text search index
CREATE INDEX idx_posts_search ON posts USING gin(to_tsvector('english', title || ' ' || content));

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update like_count
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_post_like_count_trigger
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

-- Create view for published posts with author info
CREATE VIEW published_posts AS
SELECT 
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.content,
    p.featured_image_url,
    p.published_at,
    p.view_count,
    p.like_count,
    u.username as author_username,
    u.first_name as author_first_name,
    u.last_name as author_last_name,
    u.avatar_url as author_avatar,
    c.name as category_name,
    c.slug as category_slug
FROM posts p
JOIN users u ON p.author_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'published'
ORDER BY p.published_at DESC;

-- Create function for full-text search
CREATE OR REPLACE FUNCTION search_posts(search_query TEXT)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    excerpt TEXT,
    author_username VARCHAR,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.excerpt,
        u.username,
        ts_rank(to_tsvector('english', p.title || ' ' || p.content), plainto_tsquery('english', search_query)) as rank
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE 
        p.status = 'published' AND
        to_tsvector('english', p.title || ' ' || p.content) @@ plainto_tsquery('english', search_query)
    ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data
INSERT INTO users (username, email, password_hash, first_name, last_name, bio) VALUES
('john_doe', 'john@example.com', 'hashed_password_1', 'John', 'Doe', 'Software developer and tech enthusiast.'),
('jane_smith', 'jane@example.com', 'hashed_password_2', 'Jane', 'Smith', 'Full-stack developer with a passion for design.'),
('bob_wilson', 'bob@example.com', 'hashed_password_3', 'Bob', 'Wilson', 'DevOps engineer and cloud architect.');

INSERT INTO categories (name, description, slug) VALUES
('Technology', 'Latest in tech trends and innovations', 'technology'),
('Programming', 'Coding tutorials and best practices', 'programming'),
('Database', 'Database design and optimization', 'database'),
('Web Development', 'Frontend and backend development', 'web-development');

INSERT INTO tags (name) VALUES
('javascript'), ('python'), ('postgresql'), ('mongodb'), ('react'), ('nodejs'), ('docker'), ('kubernetes');

-- Sample posts
INSERT INTO posts (title, slug, content, excerpt, author_id, category_id, status, published_at) VALUES
('Getting Started with PostgreSQL', 'getting-started-postgresql', 
'PostgreSQL is a powerful open-source relational database system. In this article, we''ll explore the basics of setting up and using PostgreSQL for your applications.',
'Learn the fundamentals of PostgreSQL and how to get started with this powerful database.',
(SELECT id FROM users WHERE username = 'john_doe'),
(SELECT id FROM categories WHERE slug = 'database'),
'published',
CURRENT_TIMESTAMP - INTERVAL '7 days');

INSERT INTO posts (title, slug, content, excerpt, author_id, category_id, status, published_at) VALUES
('Advanced JavaScript Techniques', 'advanced-javascript-techniques',
'JavaScript has evolved significantly over the years. This article covers advanced techniques including closures, promises, async/await, and modern ES6+ features.',
'Master advanced JavaScript concepts and modern development practices.',
(SELECT id FROM users WHERE username = 'jane_smith'),
(SELECT id FROM categories WHERE slug = 'programming'),
'published',
CURRENT_TIMESTAMP - INTERVAL '3 days');

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO read_only;

-- Create read-only view for public access
GRANT SELECT ON published_posts TO read_only;