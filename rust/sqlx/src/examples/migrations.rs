use sqlx::{PgPool, migrate::MigrateDatabase, postgres::PgPoolOptions};
use std::time::Duration;
use uuid::Uuid;

pub async fn run() -> anyhow::Result<()> {
    println!("=== Database Migrations Examples ===");
    println!();
    
    // Get database URL from environment or use default
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:password@localhost/sqlx_examples".to_string());
    
    // Create a separate database for migration testing
    let migration_db_url = "postgres://postgres:password@localhost/sqlx_migration_test";
    
    // Run examples
    database_creation(&migration_db_url).await?;
    manual_migrations(&migration_db_url).await?;
    sqlx_migrations(&migration_db_url).await?;
    migration_rollback(&migration_db_url).await?;
    complex_migrations(&migration_db_url).await?;
    
    // Clean up test database
    if sqlx::Postgres::database_exists(&migration_db_url).await? {
        sqlx::Postgres::drop_database(&migration_db_url).await?;
        println!("Dropped test database: {}", migration_db_url);
    }
    
    println!();
    Ok(())
}

async fn database_creation(database_url: &str) -> anyhow::Result<()> {
    println!("1. Database Creation");
    println!("--------------------");
    
    // Check if database exists
    let db_exists = sqlx::Postgres::database_exists(database_url).await?;
    println!("Database exists: {}", db_exists);
    
    // Create database if it doesn't exist
    if !db_exists {
        println!("Creating database...");
        sqlx::Postgres::create_database(database_url).await?;
        println!("Database created successfully");
    } else {
        println!("Database already exists");
    }
    
    // Connect to the database
    let pool = PgPool::connect(database_url).await?;
    
    // Test connection
    let result: i64 = sqlx::query_scalar("SELECT 1")
        .fetch_one(&pool)
        .await?;
    
    println!("Test query result: {}", result);
    
    pool.close().await;
    println!();
    Ok(())
}

async fn manual_migrations(database_url: &str) -> anyhow::Result<()> {
    println!("2. Manual Migrations");
    println!("---------------------");
    
    let pool = PgPool::connect(database_url).await?;
    
    // Create a migrations table to track applied migrations
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS _migrations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(&pool)
    .await?;
    
    println!("Created migrations table");
    
    // Check if a migration has been applied
    let migration_name = "create_users_table";
    let is_applied: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM _migrations WHERE name = $1)"
    )
    .bind(migration_name)
    .fetch_one(&pool)
    .await?;
    
    if !is_applied {
        println!("Applying migration: {}", migration_name);
        
        // Apply the migration
        sqlx::query(r#"
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        "#)
        .execute(&pool)
        .await?;
        
        // Record the migration
        sqlx::query("INSERT INTO _migrations (name) VALUES ($1)")
            .bind(migration_name)
            .execute(&pool)
            .await?;
        
        println!("Migration applied successfully");
    } else {
        println!("Migration already applied: {}", migration_name);
    }
    
    // Apply another migration
    let migration_name = "create_posts_table";
    let is_applied: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM _migrations WHERE name = $1)"
    )
    .bind(migration_name)
    .fetch_one(&pool)
    .await?;
    
    if !is_applied {
        println!("Applying migration: {}", migration_name);
        
        sqlx::query(r#"
            CREATE TABLE posts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(255) NOT NULL,
                content TEXT,
                author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                is_published BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        "#)
        .execute(&pool)
        .await?;
        
        // Add indexes
        sqlx::query("CREATE INDEX idx_posts_author_id ON posts(author_id)")
            .execute(&pool)
            .await?;
        
        sqlx::query("CREATE INDEX idx_posts_published ON posts(is_published)")
            .execute(&pool)
            .await?;
        
        sqlx::query("INSERT INTO _migrations (name) VALUES ($1)")
            .bind(migration_name)
            .execute(&pool)
            .await?;
        
        println!("Migration applied successfully");
    } else {
        println!("Migration already applied: {}", migration_name);
    }
    
    // List applied migrations
    let migrations = sqlx::query!("SELECT name, executed_at FROM _migrations ORDER BY id")
        .fetch_all(&pool)
        .await?;
    
    println!("Applied migrations:");
    for migration in migrations {
        println!("  - {} at {}", migration.name, migration.executed_at);
    }
    
    pool.close().await;
    println!();
    Ok(())
}

async fn sqlx_migrations(database_url: &str) -> anyhow::Result<()> {
    println!("3. SQLx Migration System");
    println!("--------------------------");
    
    // Note: This example shows how to use SQLx's built-in migration system
    // In a real project, you would use sqlx migrate create <name> to create migration files
    
    let pool = PgPool::connect(database_url).await?;
    
    // Create a simple migration in memory (normally these would be files)
    let migration_sql = r#"
        CREATE TABLE products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            in_stock BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE TABLE orders (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            total_amount DECIMAL(10, 2) NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE TABLE order_items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
            product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
            quantity INTEGER NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    "#;
    
    // Apply the migration
    println!("Applying e-commerce migration...");
    sqlx::query(migration_sql).execute(&pool).await?;
    println!("Migration applied successfully");
    
    // Insert some sample data
    let product_id = Uuid::new_v4();
    sqlx::query(r#"
        INSERT INTO products (id, name, description, price, in_stock)
        VALUES ($1, $2, $3, $4, $5)
    "#)
    .bind(product_id)
    .bind("Sample Product")
    .bind("This is a sample product for demonstration")
    .bind(29.99)
    .bind(true)
    .execute(&pool)
    .await?;
    
    let user_id = Uuid::new_v4();
    sqlx::query(r#"
        INSERT INTO users (id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
    "#)
    .bind(user_id)
    .bind("testuser")
    .bind("test@example.com")
    .bind("password123")
    .execute(&pool)
    .await?;
    
    let order_id = Uuid::new_v4();
    sqlx::query(r#"
        INSERT INTO orders (id, user_id, total_amount, status)
        VALUES ($1, $2, $3, $4)
    "#)
    .bind(order_id)
    .bind(user_id)
    .bind(29.99)
    .bind("completed")
    .execute(&pool)
    .await?;
    
    sqlx::query(r#"
        INSERT INTO order_items (id, order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4, $5)
    "#)
    .bind(Uuid::new_v4())
    .bind(order_id)
    .bind(product_id)
    .bind(1)
    .bind(29.99)
    .execute(&pool)
    .await?;
    
    println!("Sample data inserted successfully");
    
    // Verify the migration
    let product_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM products")
        .fetch_one(&pool)
        .await?;
    
    let order_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM orders")
        .fetch_one(&pool)
        .await?;
    
    println!("Products: {}, Orders: {}", product_count, order_count);
    
    pool.close().await;
    println!();
    Ok(())
}

async fn migration_rollback(database_url: &str) -> anyhow::Result<()> {
    println!("4. Migration Rollback");
    println!("----------------------");
    
    let pool = PgPool::connect(database_url).await?;
    
    // Create a rollback migration table
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS _migration_rollback (
            id SERIAL PRIMARY KEY,
            migration_name VARCHAR(255) NOT NULL,
            rollback_sql TEXT NOT NULL,
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(&pool)
    .await?;
    
    // Define a migration and its rollback
    let migration_name = "add_user_profile";
    let migration_sql = r#"
        ALTER TABLE users ADD COLUMN bio TEXT;
        ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500);
        ALTER TABLE users ADD COLUMN birth_date DATE;
    "#;
    
    let rollback_sql = r#"
        ALTER TABLE_users DROP COLUMN birth_date;
        ALTER TABLE users DROP COLUMN avatar_url;
        ALTER TABLE users DROP COLUMN bio;
    "#;
    
    // Check if migration is already applied
    let is_applied: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM _migration_rollback WHERE migration_name = $1)"
    )
    .bind(migration_name)
    .fetch_one(&pool)
    .await?;
    
    if !is_applied {
        println!("Applying migration: {}", migration_name);
        
        // Apply migration
        sqlx::query(migration_sql).execute(&pool).await?;
        
        // Record for potential rollback
        sqlx::query(r#"
            INSERT INTO _migration_rollback (migration_name, rollback_sql)
            VALUES ($1, $2)
        "#)
        .bind(migration_name)
        .bind(rollback_sql)
        .execute(&pool)
        .await?;
        
        println!("Migration applied successfully");
        
        // Verify the migration
        let columns: Vec<String> = sqlx::query_scalar(
            "SELECT column_name FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position"
        )
        .fetch_all(&pool)
        .await?;
        
        println!("Users table columns: {:?}", columns);
        
        // Now rollback the migration
        println!("Rolling back migration: {}", migration_name);
        
        let rollback_sql: String = sqlx::query_scalar(
            "SELECT rollback_sql FROM _migration_rollback WHERE migration_name = $1"
        )
        .bind(migration_name)
        .fetch_one(&pool)
        .await?;
        
        // Fix the SQL syntax error in rollback_sql
        let fixed_rollback_sql = rollback_sql.replace("ALTER TABLE_users", "ALTER TABLE users");
        
        sqlx::query(&fixed_rollback_sql).execute(&pool).await?;
        
        // Remove from rollback table
        sqlx::query("DELETE FROM _migration_rollback WHERE migration_name = $1")
            .bind(migration_name)
            .execute(&pool)
            .await?;
        
        println!("Migration rolled back successfully");
        
        // Verify the rollback
        let columns: Vec<String> = sqlx::query_scalar(
            "SELECT column_name FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position"
        )
        .fetch_all(&pool)
        .await?;
        
        println!("Users table columns after rollback: {:?}", columns);
    } else {
        println!("Migration not found: {}", migration_name);
    }
    
    pool.close().await;
    println!();
    Ok(())
}

async fn complex_migrations(database_url: &str) -> anyhow::Result<()> {
    println!("5. Complex Migrations");
    println!("---------------------");
    
    let pool = PgPool::connect(database_url).await?;
    
    // Migration 1: Add a new table with foreign key constraints
    println!("Migration 1: Adding categories table");
    sqlx::query(r#"
        CREATE TABLE categories (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(100) NOT NULL UNIQUE,
            description TEXT,
            parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    "#)
    .execute(&pool)
    .await?;
    
    // Insert root categories
    let tech_id = Uuid::new_v4();
    let books_id = Uuid::new_v4();
    
    sqlx::query(r#"
        INSERT INTO categories (id, name, description) VALUES 
        ($1, $2, $3),
        ($4, $5, $6)
    "#)
    .bind(tech_id)
    .bind("Technology")
    .bind("Technology related products")
    .bind(books_id)
    .bind("Books")
    .bind("Books and literature")
    .execute(&pool)
    .await?;
    
    // Migration 2: Add category relationship to products
    println!("Migration 2: Adding category relationship to products");
    sqlx::query("ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id)")
        .execute(&pool)
        .await?;
    
    // Update existing products
    sqlx::query("UPDATE products SET category_id = $1 WHERE name = 'Sample Product'")
        .bind(tech_id)
        .execute(&pool)
        .await?;
    
    // Migration 3: Create a view for complex queries
    println!("Migration 3: Creating product summary view");
    sqlx::query(r#"
        CREATE VIEW product_summary AS
        SELECT 
            p.id,
            p.name,
            p.price,
            p.in_stock,
            c.name as category_name,
            COALESCE(SUM(oi.quantity), 0) as total_sold,
            COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN order_items oi ON p.id = oi.product_id
        GROUP BY p.id, p.name, p.price, p.in_stock, c.name
    "#)
    .execute(&pool)
    .await?;
    
    // Migration 4: Add triggers for automatic timestamp updates
    println!("Migration 4: Adding update timestamp triggers");
    sqlx::query(r#"
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    "#)
    .execute(&pool)
    .await?;
    
    sqlx::query(r#"
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    "#)
    .execute(&pool)
    .await?;
    
    sqlx::query(r#"
        CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    "#)
    .execute(&pool)
    .await?;
    
    // Migration 5: Add computed columns
    println!("Migration 5: Adding computed columns");
    sqlx::query(r#"
        ALTER TABLE orders ADD COLUMN shipping_cost DECIMAL(10, 2) GENERATED ALWAYS AS (
            CASE 
                WHEN total_amount < 50 THEN 5.99
                WHEN total_amount < 100 THEN 3.99
                ELSE 0.00
            END
        ) STORED
    "#)
    .execute(&pool)
    .await?;
    
    sqlx::query(r#"
        ALTER TABLE orders ADD COLUMN final_total DECIMAL(10, 2) GENERATED ALWAYS AS (
            total_amount + shipping_cost
        ) STORED
    "#)
    .execute(&pool)
    .await?;
    
    // Test the migrations
    println!("Testing migrations...");
    
    // Create a test user
    let user_id = Uuid::new_v4();
    sqlx::query(r#"
        INSERT INTO users (id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
    "#)
    .bind(user_id)
    .bind("migration_test")
    .bind("migration@example.com")
    .bind("password123")
    .execute(&pool)
    .await?;
    
    // Create a test post
    let post_id = Uuid::new_v4();
    sqlx::query(r#"
        INSERT INTO posts (id, title, content, author_id, is_published)
        VALUES ($1, $2, $3, $4, $5)
    "#)
    .bind(post_id)
    .bind("Migration Test Post")
    .bind("This post was created to test migrations")
    .bind(user_id)
    .bind(true)
    .execute(&pool)
    .await?;
    
    // Update the post to test the trigger
    sqlx::query("UPDATE posts SET title = $1 WHERE id = $2")
        .bind("Updated Migration Test Post")
        .bind(post_id)
        .execute(&pool)
        .await?;
    
    // Query the view
    let summaries = sqlx::query!("SELECT * FROM product_summary")
        .fetch_all(&pool)
        .await?;
    
    println!("Product summaries:");
    for summary in summaries {
        println!("  - {}: ${} (Sold: {}, Revenue: ${})", 
                summary.name, 
                summary.price, 
                summary.total_sold.unwrap_or(0), 
                summary.total_revenue.unwrap_or(0.0));
    }
    
    // Query the computed columns
    let orders = sqlx::query!("SELECT total_amount, shipping_cost, final_total FROM orders")
        .fetch_all(&pool)
        .await?;
    
    println!("Order totals:");
    for order in orders {
        println!("  - Amount: ${}, Shipping: ${}, Final: ${}", 
                order.total_amount, 
                order.shipping_cost.unwrap_or(0.0), 
                order.final_total.unwrap_or(0.0));
    }
    
    pool.close().await;
    println!();
    Ok(())
}

// Example of migration validation
pub async fn migration_validation(database_url: &str) -> anyhow::Result<()> {
    println!("6. Migration Validation");
    println!("------------------------");
    
    let pool = PgPool::connect(database_url).await?;
    
    // Validate expected tables exist
    let expected_tables = vec!["users", "posts", "products", "orders", "order_items", "categories"];
    
    for table in expected_tables {
        let exists: bool = sqlx::query_scalar(
            "SELECT EXISTS(SELECT FROM information_schema.tables WHERE table_name = $1)"
        )
        .bind(table)
        .fetch_one(&pool)
        .await?;
        
        if exists {
            println!("✓ Table '{}' exists", table);
            
            // Check column count
            let column_count: i64 = sqlx::query_scalar(
                "SELECT COUNT(*) FROM information_schema.columns WHERE table_name = $1"
            )
            .bind(table)
            .fetch_one(&pool)
            .await?;
            
            println!("  - Columns: {}", column_count);
        } else {
            println!("✗ Table '{}' missing", table);
        }
    }
    
    // Validate expected indexes
    let expected_indexes = vec![
        ("posts", "idx_posts_author_id"),
        ("posts", "idx_posts_published"),
    ];
    
    for (table, index) in expected_indexes {
        let exists: bool = sqlx::query_scalar(
            "SELECT EXISTS(SELECT FROM pg_indexes WHERE tablename = $1 AND indexname = $2)"
        )
        .bind(table)
        .bind(index)
        .fetch_one(&pool)
        .await?;
        
        if exists {
            println!("✓ Index '{}' on table '{}' exists", index, table);
        } else {
            println!("✗ Index '{}' on table '{}' missing", index, table);
        }
    }
    
    // Validate foreign key constraints
    let constraints = sqlx::query!(
        r#"
        SELECT 
            tc.table_name, 
            kcu.column_name, 
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name 
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
        ORDER BY tc.table_name
        "#
    )
    .fetch_all(&pool)
    .await?;
    
    println!("Foreign key constraints:");
    for constraint in constraints {
        println!("  - {}.{} -> {}.{}", 
                constraint.table_name, 
                constraint.column_name,
                constraint.foreign_table_name, 
                constraint.foreign_column_name);
    }
    
    pool.close().await;
    println!();
    Ok(())
}