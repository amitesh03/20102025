mod models;
mod examples;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::fmt::init();
    
    // Load environment variables
    dotenvy::dotenv().ok();
    
    println!("SQLx Examples");
    println!("===============");
    println!();
    
    // Run all examples
    examples::basic_queries::run().await?;
    examples::transactions::run().await?;
    examples::connection_pool::run().await?;
    examples::migrations::run().await?;
    examples::query_types::run().await?;
    examples::error_handling::run().await?;
    examples::performance::run().await?;
    examples::real_world_examples::run().await?;
    
    println!("All examples completed!");
    Ok(())
}