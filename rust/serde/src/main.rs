mod models;
mod examples;

fn main() {
    println!("Serde Examples");
    println!("===============");
    println!();
    
    // Run all examples
    examples::basic_serialization::run();
    examples::custom_serialization::run();
    examples::data_formats::run();
    examples::advanced_features::run();
    examples::error_handling::run();
    examples::performance::run();
    examples::real_world_examples::run();
    
    println!("All examples completed!");
}