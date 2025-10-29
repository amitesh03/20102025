mod basics;
mod tasks;
mod async_primitives;
mod io;
mod networking;
mod time;
mod sync;
mod channels;
mod streams;
mod error_handling;

use tracing::{info, Level};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_max_level(Level::INFO)
        .init();
    
    info!("Tokio Examples");
    info!("================");
    info!();
    
    // Run all examples
    basics::run().await?;
    tasks::run().await?;
    async_primitives::run().await?;
    io::run().await?;
    networking::run().await?;
    time::run().await?;
    sync::run().await?;
    channels::run().await?;
    streams::run().await?;
    error_handling::run().await?;
    
    info!("All examples completed successfully!");
    Ok(())
}