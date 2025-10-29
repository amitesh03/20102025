use crate::models::{LargeData, DataRecord};
use serde::{Deserialize, Serialize};
use serde_json;
use std::time::Instant;

pub fn run() {
    println!("=== Performance Examples ===");
    println!();
    
    // Example 1: Serialization performance comparison
    serialization_performance();
    
    // Example 2: Deserialization performance
    deserialization_performance();
    
    // Example 3: Memory usage comparison
    memory_usage_comparison();
    
    // Example 4: Large dataset handling
    large_dataset_handling();
    
    // Example 5: Streaming serialization
    streaming_serialization();
    
    // Example 6: Optimization techniques
    optimization_techniques();
    
    println!();
}

fn serialization_performance() {
    println!("1. Serialization Performance");
    println!("----------------------------");
    
    // Create test data
    let large_data = create_test_data(1000);
    
    // Test JSON serialization
    let start = Instant::now();
    let json_result = serde_json::to_string(&large_data);
    let json_duration = start.elapsed();
    
    match json_result {
        Ok(json_str) => {
            println!("JSON serialization: {:?}", json_duration);
            println!("JSON size: {} bytes", json_str.len());
            
            // Test pretty JSON
            let start = Instant::now();
            let pretty_json = serde_json::to_string_pretty(&large_data);
            let pretty_duration = start.elapsed();
            
            match pretty_json {
                Ok(pretty_str) => {
                    println!("Pretty JSON serialization: {:?}", pretty_duration);
                    println!("Pretty JSON size: {} bytes", pretty_str.len());
                    println!("Size overhead: {:.1}%", 
                             (pretty_str.len() as f64 / json_str.len() as f64 - 1.0) * 100.0);
                }
                Err(e) => println!("Error creating pretty JSON: {}", e),
            }
            
            // Test CBOR serialization
            let start = Instant::now();
            let cbor_result = serde_cbor::to_vec(&large_data);
            let cbor_duration = start.elapsed();
            
            match cbor_result {
                Ok(cbor_bytes) => {
                    println!("CBOR serialization: {:?}", cbor_duration);
                    println!("CBOR size: {} bytes", cbor_bytes.len());
                    println!("Size reduction vs JSON: {:.1}%", 
                             (1.0 - cbor_bytes.len() as f64 / json_str.len() as f64) * 100.0);
                }
                Err(e) => println!("Error creating CBOR: {}", e),
            }
            
            // Test Bincode serialization
            let start = Instant::now();
            let bincode_result = bincode::serialize(&large_data);
            let bincode_duration = start.elapsed();
            
            match bincode_result {
                Ok(bincode_bytes) => {
                    println!("Bincode serialization: {:?}", bincode_duration);
                    println!("Bincode size: {} bytes", bincode_bytes.len());
                    println!("Size reduction vs JSON: {:.1}%", 
                             (1.0 - bincode_bytes.len() as f64 / json_str.len() as f64) * 100.0);
                }
                Err(e) => println!("Error creating Bincode: {}", e),
            }
        }
        Err(e) => println!("Error creating JSON: {}", e),
    }
    
    println!();
}

fn deserialization_performance() {
    println!("2. Deserialization Performance");
    println!("------------------------------");
    
    // Create and serialize test data
    let large_data = create_test_data(1000);
    let json_str = serde_json::to_string(&large_data).unwrap();
    let cbor_bytes = serde_cbor::to_vec(&large_data).unwrap();
    let bincode_bytes = bincode::serialize(&large_data).unwrap();
    
    // Test JSON deserialization
    let start = Instant::now();
    let json_result: Result<LargeData, _> = serde_json::from_str(&json_str);
    let json_duration = start.elapsed();
    
    match json_result {
        Ok(_) => println!("JSON deserialization: {:?}", json_duration),
        Err(e) => println!("JSON deserialization error: {}", e),
    }
    
    // Test CBOR deserialization
    let start = Instant::now();
    let cbor_result: Result<LargeData, _> = serde_cbor::from_slice(&cbor_bytes);
    let cbor_duration = start.elapsed();
    
    match cbor_result {
        Ok(_) => println!("CBOR deserialization: {:?}", cbor_duration),
        Err(e) => println!("CBOR deserialization error: {}", e),
    }
    
    // Test Bincode deserialization
    let start = Instant::now();
    let bincode_result: Result<LargeData, _> = bincode::deserialize(&bincode_bytes);
    let bincode_duration = start.elapsed();
    
    match bincode_result {
        Ok(_) => println!("Bincode deserialization: {:?}", bincode_duration),
        Err(e) => println!("Bincode deserialization error: {}", e),
    }
    
    println!();
}

fn memory_usage_comparison() {
    println!("3. Memory Usage Comparison");
    println!("--------------------------");
    
    let large_data = create_test_data(1000);
    
    // Measure memory usage for different formats
    let json_str = serde_json::to_string(&large_data).unwrap();
    let cbor_bytes = serde_cbor::to_vec(&large_data).unwrap();
    let bincode_bytes = bincode::serialize(&large_data).unwrap();
    
    println!("Format comparison for 1000 records:");
    println!("JSON: {} bytes", json_str.len());
    println!("CBOR: {} bytes", cbor_bytes.len());
    println!("Bincode: {} bytes", bincode_bytes.len());
    
    // Calculate efficiency
    let json_size = json_str.len() as f64;
    println!("CBOR efficiency: {:.1}% of JSON", (cbor_bytes.len() as f64 / json_size) * 100.0);
    println!("Bincode efficiency: {:.1}% of JSON", (bincode_bytes.len() as f64 / json_size) * 100.0);
    
    // Test with different data sizes
    println!("\nScaling test:");
    for size in [100, 500, 1000, 5000] {
        let data = create_test_data(size);
        let json_size = serde_json::to_string(&data).unwrap().len();
        let bincode_size = bincode::serialize(&data).unwrap().len();
        println!("{} records: JSON={}, Bincode={} ({:.1}% efficiency)", 
                 size, json_size, bincode_size, 
                 (bincode_size as f64 / json_size as f64) * 100.0);
    }
    
    println!();
}

fn large_dataset_handling() {
    println!("4. Large Dataset Handling");
    println!("--------------------------");
    
    // Test with progressively larger datasets
    let sizes = [100, 1000, 5000, 10000];
    
    for size in sizes {
        println!("Testing with {} records:", size);
        
        let data = create_test_data(size);
        
        // Serialization
        let start = Instant::now();
        let json_str = serde_json::to_string(&data).unwrap();
        let serialize_time = start.elapsed();
        
        // Deserialization
        let start = Instant::now();
        let _: LargeData = serde_json::from_str(&json_str).unwrap();
        let deserialize_time = start.elapsed();
        
        println!("  Serialization: {:?} ({:.2} MB/s)", 
                 serialize_time, 
                 (json_str.len() as f64 / 1024.0 / 1024.0) / serialize_time.as_secs_f64());
        println!("  Deserialization: {:?} ({:.2} MB/s)", 
                 deserialize_time, 
                 (json_str.len() as f64 / 1024.0 / 1024.0) / deserialize_time.as_secs_f64());
        println!("  Data size: {:.2} MB", json_str.len() as f64 / 1024.0 / 1024.0);
        println!();
    }
}

fn streaming_serialization() {
    println!("5. Streaming Serialization");
    println!("----------------------------");
    
    use serde_json::{json, Value};
    
    // Create a large array incrementally
    let mut large_array = Vec::new();
    
    let start = Instant::now();
    
    // Build array incrementally
    for i in 0..10000 {
        large_array.push(json!({
            "id": i,
            "name": format!("Item {}", i),
            "value": i as f64 * 1.5,
            "active": i % 2 == 0,
            "tags": ["tag1", "tag2", "tag3"]
        }));
    }
    
    let large_data = json!(large_array);
    let build_time = start.elapsed();
    
    // Serialize the large array
    let start = Instant::now();
    let json_str = serde_json::to_string(&large_data).unwrap();
    let serialize_time = start.elapsed();
    
    println!("Building large array: {:?}", build_time);
    println!("Serializing large array: {:?}", serialize_time);
    println!("Total size: {} bytes", json_str.len());
    
    // Parse incrementally (simplified example)
    let start = Instant::now();
    let parsed: Value = serde_json::from_str(&json_str).unwrap();
    let parse_time = start.elapsed();
    
    if let Value::Array(items) = parsed {
        println!("Parsed {} items", items.len());
        
        // Process items without full deserialization
        let start = Instant::now();
        let active_count = items.iter()
            .filter(|item| item["active"].as_bool().unwrap_or(false))
            .count();
        let process_time = start.elapsed();
        
        println!("Active items: {} (processed in {:?})", active_count, process_time);
    }
    
    println!();
}

fn optimization_techniques() {
    println!("6. Optimization Techniques");
    println!("---------------------------");
    
    // Technique 1: Use appropriate data types
    #[derive(Serialize, Deserialize, Debug)]
    struct OptimizedData {
        #[serde(with = "serde_bytes")]
        binary_data: Vec<u8>,
        timestamps: Vec<i64>, // Use i64 instead of DateTime for faster serialization
        flags: u8, // Use bit flags instead of multiple bools
    }
    
    let optimized = OptimizedData {
        binary_data: vec![0u8; 1000],
        timestamps: vec![1620000000, 1620000001, 1620000002],
        flags: 0b10101010,
    };
    
    let start = Instant::now();
    let json_optimized = serde_json::to_string(&optimized).unwrap();
    let optimized_time = start.elapsed();
    
    println!("Optimized serialization: {:?}", optimized_time);
    println!("Optimized size: {} bytes", json_optimized.len());
    
    // Technique 2: Minimize string allocations
    #[derive(Serialize, Deserialize, Debug)]
    struct StringOptimized {
        #[serde(borrow)]
        text: String,
        numbers: Vec<u32>, // Numbers are faster than strings
    }
    
    let string_opt = StringOptimized {
        text: "Some text that might be reused".to_string(),
        numbers: vec![1, 2, 3, 4, 5],
    };
    
    let start = Instant::now();
    let json_string_opt = serde_json::to_string(&string_opt).unwrap();
    let string_opt_time = start.elapsed();
    
    println!("String-optimized serialization: {:?}", string_opt_time);
    println!("String-optimized size: {} bytes", json_string_opt.len());
    
    // Technique 3: Use raw bytes for binary data
    let binary_data = vec![0u8; 10000];
    
    // As base64 string (inefficient)
    let start = Instant::now();
    let base64_data = base64::encode(&binary_data);
    let json_with_base64 = serde_json::json!({
        "data": base64_data
    });
    let base64_str = serde_json::to_string(&json_with_base64).unwrap();
    let base64_time = start.elapsed();
    
    println!("Base64 serialization: {:?}", base64_time);
    println!("Base64 size: {} bytes", base64_str.len());
    
    // As raw bytes in binary format
    let start = Instant::now();
    let binary_serialized = bincode::serialize(&binary_data).unwrap();
    let binary_time = start.elapsed();
    
    println!("Binary serialization: {:?}", binary_time);
    println!("Binary size: {} bytes", binary_serialized.len());
    
    println!("Binary efficiency: {:.1}% of base64", 
             (binary_serialized.len() as f64 / base64_str.len() as f64) * 100.0);
    
    println!();
}

// Helper function to create test data
fn create_test_data(record_count: usize) -> LargeData {
    let mut records = Vec::with_capacity(record_count);
    
    for i in 0..record_count {
        let record = DataRecord {
            id: uuid::Uuid::new_v4(),
            name: format!("Record {}", i),
            value: i as f64 * 1.5,
            tags: vec![
                format!("tag{}", i % 10),
                format!("category{}", i % 5),
                "common".to_string(),
            ],
            active: i % 2 == 0,
        };
        records.push(record);
    }
    
    let mut metadata = std::collections::HashMap::new();
    metadata.insert("created_by".to_string(), "performance_test".to_string());
    metadata.insert("record_count".to_string(), record_count.to_string());
    metadata.insert("version".to_string(), "1.0".to_string());
    
    LargeData {
        id: uuid::Uuid::new_v4(),
        records,
        metadata,
        created_at: chrono::Utc::now(),
    }
}

// Example of zero-copy optimization
pub fn zero_copy_optimization() {
    println!("7. Zero-Copy Optimization");
    println!("--------------------------");
    
    // This is a simplified example of zero-copy concepts
    // In practice, you might use libraries like:
    // - simd-json for high-performance JSON parsing
    // - serde_json::value::RawValue for zero-copy JSON values
    // - Custom deserializers that work with borrowed data
    
    #[derive(Serialize, Deserialize, Debug)]
    struct ZeroCopyExample {
        #[serde(borrow)]
        text: String,
        numbers: Vec<u32>,
    }
    
    let json_str = r#"
    {
        "text": "Hello, world!",
        "numbers": [1, 2, 3, 4, 5]
    }
    "#;
    
    // Normal deserialization (allocates new strings)
    let start = Instant::now();
    let normal: ZeroCopyExample = serde_json::from_str(json_str).unwrap();
    let normal_time = start.elapsed();
    
    println!("Normal deserialization: {:?}", normal_time);
    println!("Normal result: {:?}", normal);
    
    // For true zero-copy, you would typically use:
    // - RawValue to parse without allocating strings
    // - Custom deserializers with Cow<str>
    // - Libraries designed for zero-copy parsing
    
    println!();
}

// Example of serialization benchmarking
pub fn benchmark_serialization() {
    println!("8. Serialization Benchmarking");
    println!("-------------------------------");
    
    use std::collections::HashMap;
    
    // Define test structures
    #[derive(Serialize, Deserialize)]
    struct TestStruct {
        id: u32,
        name: String,
        values: Vec<f64>,
        metadata: HashMap<String, String>,
    }
    
    // Create test data
    let mut metadata = HashMap::new();
    metadata.insert("key1".to_string(), "value1".to_string());
    metadata.insert("key2".to_string(), "value2".to_string());
    
    let test_data = TestStruct {
        id: 42,
        name: "Test Data".to_string(),
        values: vec![1.0, 2.0, 3.0, 4.0, 5.0],
        metadata,
    };
    
    // Benchmark multiple iterations
    let iterations = 10000;
    
    // JSON benchmark
    let start = Instant::now();
    for _ in 0..iterations {
        let _json = serde_json::to_string(&test_data).unwrap();
    }
    let json_total = start.elapsed();
    
    // Bincode benchmark
    let start = Instant::now();
    for _ in 0..iterations {
        let _binary = bincode::serialize(&test_data).unwrap();
    }
    let binary_total = start.elapsed();
    
    println!("Benchmark results ({} iterations):", iterations);
    println!("JSON total: {:?} (avg: {:?})", 
             json_total, json_total / iterations);
    println!("Bincode total: {:?} (avg: {:?})", 
             binary_total, binary_total / iterations);
    println!("Bincode speedup: {:.2}x", 
             json_total.as_secs_f64() / binary_total.as_secs_f64());
    
    println!();
}