# Diesel ORM Examples

This directory contains practical examples of using Diesel, Rust's most popular ORM for database operations.

## Prerequisites

1. Install Diesel CLI:
```bash
cargo install diesel_cli --no-default-features --features postgres
```

2. Set up a PostgreSQL database:
```bash
createdb diesel_examples
```

3. Set up environment variables:
```bash
export DATABASE_URL=postgres://username:password@localhost/diesel_examples
```

## Setting Up the Database

1. Run the migrations:
```bash
diesel migration run
```

This will create the following tables:
- users
- posts
- comments
- activity_logs

## Running the Examples

1. Build the project:
```bash
cargo build
```

2. Run the main application:
```bash
cargo run
```

This will demonstrate:
- Basic CRUD operations
- Complex queries with joins
- Custom SQL queries
- Transactions
- Migrations

## Example Code Structure

- `src/main.rs`: Entry point and setup
- `src/lib.rs`: Library setup
- `src/models.rs`: Database models
- `src/schema.rs`: Auto-generated database schema
- `src/examples/`: Example implementations
  - `basic_crud.rs`: Basic CRUD operations
  - `complex_queries.rs`: Complex queries with joins
  - `custom_queries.rs`: Custom SQL queries
  - `transactions.rs`: Transaction examples
- `migrations/`: Database migrations

## Learning Path

1. Start with `basic_crud.rs` to understand basic operations
2. Move to `complex_queries.rs` for joins and relationships
3. Try `custom_queries.rs` for raw SQL
4. Finally, explore `transactions.rs` for atomic operations

## Additional Resources

- [Official Diesel Documentation](https://diesel.rs/)
- [Diesel Getting Started Guide](https://diesel.rs/guides/getting-started/)
- [Diesel CLI Guide](https://diesel.rs/guides/diesel-cli/)