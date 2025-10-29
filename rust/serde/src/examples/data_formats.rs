use crate::models::{Person, Address};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub fn run() {
    println!("=== Data Formats Examples ===");
    println!();
    
    // Example 1: JSON
    json_example();
    
    // Example 2: YAML
    yaml_example();
    
    // Example 3: TOML
    toml_example();
    
    // Example 4: CBOR
    cbor_example();
    
    // Example 5: RON (Rusty Object Notation)
    ron_example();
    
    // Example 6: Bincode (binary format)
    bincode_example();
    
    println!();
}

fn json_example() {
    println!("1. JSON Format");
    println!("--------------");
    
    let person = Person {
        name: "John Doe".to_string(),
        age: 30,
        email: "john.doe@example.com".to_string(),
        address: Some(Address {
            street: "123 Main St".to_string(),
            city: "New York".to_string(),
            country: "USA".to_string(),
            postal_code: "10001".to_string(),
        }),
        hobbies: vec!["reading".to_string(), "swimming".to_string()],
    };
    
    // Serialize to JSON
    let json_str = serde_json::to_string_pretty(&person).unwrap();
    println!("JSON:\n{}", json_str);
    
    // Deserialize from JSON
    let deserialized: Person = serde_json::from_str(&json_str).unwrap();
    println!("Deserialized: {:?}", deserialized);
    
    // JSON value manipulation
    let mut json_value = serde_json::to_value(&person).unwrap();
    json_value["age"] = serde_json::Value::Number(31.into());
    json_value["hobbies"].as_array_mut().unwrap().push("coding".to_string().into());
    
    println!("Modified JSON: {}", serde_json::to_string_pretty(&json_value).unwrap());
    
    println!();
}

fn yaml_example() {
    println!("2. YAML Format");
    println!("---------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct Config {
        database: DatabaseConfig,
        server: ServerConfig,
        features: HashMap<String, bool>,
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct DatabaseConfig {
        url: String,
        max_connections: u32,
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct ServerConfig {
        host: String,
        port: u16,
    }
    
    let config = Config {
        database: DatabaseConfig {
            url: "postgresql://localhost/mydb".to_string(),
            max_connections: 10,
        },
        server: ServerConfig {
            host: "0.0.0.0".to_string(),
            port: 8080,
        },
        features: {
            let mut features = HashMap::new();
            features.insert("auth".to_string(), true);
            features.insert("logging".to_string(), true);
            features.insert("debug".to_string(), false);
            features
        },
    };
    
    // Serialize to YAML
    let yaml_str = serde_yaml::to_string(&config).unwrap();
    println!("YAML:\n{}", yaml_str);
    
    // Deserialize from YAML
    let deserialized: Config = serde_yaml::from_str(&yaml_str).unwrap();
    println!("Deserialized: {:?}", deserialized);
    
    println!();
}

fn toml_example() {
    println!("3. TOML Format");
    println!("---------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct Package {
        name: String,
        version: String,
        authors: Vec<String>,
        dependencies: HashMap<String, String>,
    }
    
    let package = Package {
        name: "my-app".to_string(),
        version: "1.0.0".to_string(),
        authors: vec![
            "John Doe <john@example.com>".to_string(),
            "Jane Smith <jane@example.com>".to_string(),
        ],
        dependencies: {
            let mut deps = HashMap::new();
            deps.insert("serde".to_string(), "1.0".to_string());
            deps.insert("serde_json".to_string(), "1.0".to_string());
            deps.insert("tokio".to_string(), "1.0".to_string());
            deps
        },
    };
    
    // Serialize to TOML
    let toml_str = toml::to_string_pretty(&package).unwrap();
    println!("TOML:\n{}", toml_str);
    
    // Deserialize from TOML
    let deserialized: Package = toml::from_str(&toml_str).unwrap();
    println!("Deserialized: {:?}", deserialized);
    
    println!();
}

fn cbor_example() {
    println!("4. CBOR Format");
    println!("---------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct SensorData {
        sensor_id: String,
        timestamp: i64,
        temperature: f64,
        humidity: f64,
        pressure: f64,
    }
    
    let sensor_data = SensorData {
        sensor_id: "temp-001".to_string(),
        timestamp: chrono::Utc::now().timestamp(),
        temperature: 23.5,
        humidity: 65.2,
        pressure: 1013.25,
    };
    
    // Serialize to CBOR
    let cbor_bytes = serde_cbor::to_vec(&sensor_data).unwrap();
    println!("CBOR bytes: {:?}", cbor_bytes);
    println!("CBOR hex: {:x?}", cbor_bytes);
    
    // Deserialize from CBOR
    let deserialized: SensorData = serde_cbor::from_slice(&cbor_bytes).unwrap();
    println!("Deserialized: {:?}", deserialized);
    
    println!();
}

fn ron_example() {
    println!("5. RON Format");
    println!("--------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct GameConfig {
        window_size: (u32, u32),
        fullscreen: bool,
        vsync: bool,
        max_fps: Option<u32>,
        resources: Vec<String>,
    }
    
    let config = GameConfig {
        window_size: (1920, 1080),
        fullscreen: false,
        vsync: true,
        max_fps: Some(60),
        resources: vec![
            "textures/player.png".to_string(),
            "textures/enemy.png".to_string(),
            "sounds/jump.wav".to_string(),
        ],
    };
    
    // Serialize to RON
    let ron_str = ron::to_string_pretty(&config, ron::PrettyConfig::default()).unwrap();
    println!("RON:\n{}", ron_str);
    
    // Deserialize from RON
    let deserialized: GameConfig = ron::from_str(&ron_str).unwrap();
    println!("Deserialized: {:?}", deserialized);
    
    println!();
}

fn bincode_example() {
    println!("6. Bincode Format");
    println!("------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct Message {
        id: u64,
        timestamp: i64,
        payload: Vec<u8>,
        metadata: HashMap<String, String>,
    }
    
    let message = Message {
        id: 12345,
        timestamp: chrono::Utc::now().timestamp(),
        payload: b"Hello, binary world!".to_vec(),
        metadata: {
            let mut meta = HashMap::new();
            meta.insert("type".to_string(), "greeting".to_string());
            meta.insert("priority".to_string(), "high".to_string());
            meta
        },
    };
    
    // Serialize to Bincode
    let bincode_bytes = bincode::serialize(&message).unwrap();
    println!("Bincode bytes: {:?}", bincode_bytes);
    println!("Bincode size: {} bytes", bincode_bytes.len());
    
    // Deserialize from Bincode
    let deserialized: Message = bincode::deserialize(&bincode_bytes).unwrap();
    println!("Deserialized: {:?}", deserialized);
    
    // Compare sizes
    let json_bytes = serde_json::to_vec(&message).unwrap();
    println!("JSON size: {} bytes", json_bytes.len());
    println!("Size reduction: {:.1}%", 
             (1.0 - bincode_bytes.len() as f64 / json_bytes.len() as f64) * 100.0);
    
    println!();
}

// Example of format conversion
pub fn format_conversion_example() {
    println!("7. Format Conversion Example");
    println!("----------------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct Data {
        id: u32,
        name: String,
        values: Vec<f64>,
    }
    
    let data = Data {
        id: 1,
        name: "Test Data".to_string(),
        values: vec![1.0, 2.0, 3.0, 4.0, 5.0],
    };
    
    // JSON to YAML
    let json_str = serde_json::to_string(&data).unwrap();
    let json_value: serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let yaml_str = serde_yaml::to_string(&json_value).unwrap();
    println!("JSON to YAML:\n{}", yaml_str);
    
    // YAML to TOML
    let yaml_value: serde_yaml::Value = serde_yaml::from_str(&yaml_str).unwrap();
    let toml_str = toml::to_string_pretty(&yaml_value).unwrap();
    println!("YAML to TOML:\n{}", toml_str);
    
    // TOML to RON
    let toml_value: toml::Value = toml::from_str(&toml_str).unwrap();
    let ron_str = ron::to_string_pretty(&toml_value, ron::PrettyConfig::default()).unwrap();
    println!("TOML to RON:\n{}", ron_str);
    
    println!();
}

// Example of streaming large data
pub fn streaming_example() {
    println!("8. Streaming Example");
    println!("---------------------");
    
    use serde_json::{json, Value};
    
    // Create a large JSON array
    let mut large_data = Vec::new();
    for i in 0..1000 {
        large_data.push(json!({
            "id": i,
            "name": format!("Item {}", i),
            "value": i as f64 * 1.5,
            "active": i % 2 == 0
        }));
    }
    
    let large_json = json!(large_data);
    
    // Write to string
    let json_str = serde_json::to_string_pretty(&large_json).unwrap();
    println!("Large JSON size: {} bytes", json_str.len());
    
    // Stream processing example (simplified)
    let parsed: Value = serde_json::from_str(&json_str).unwrap();
    if let Value::Array(items) = parsed {
        let active_count = items.iter()
            .filter(|item| item["active"].as_bool().unwrap_or(false))
            .count();
        println!("Active items: {}", active_count);
    }
    
    println!();
}