use crate::models::{Product, CustomData};
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use serde_json;
use std::collections::HashMap;

pub fn run() {
    println!("=== Custom Serialization Examples ===");
    println!();
    
    // Example 1: Field renaming and attributes
    field_attributes_example();
    
    // Example 2: Custom serialization for external types
    custom_serialization_example();
    
    // Example 3: Conditional serialization
    conditional_serialization_example();
    
    // Example 4: Default values
    default_values_example();
    
    // Example 5: Flatten and tag attributes
    flatten_and_tag_example();
    
    println!();
}

fn field_attributes_example() {
    println!("1. Field Attributes Example");
    println!("--------------------------");
    
    let product = Product {
        id: uuid::Uuid::new_v4(),
        name: "Laptop".to_string(),
        price: 999.99,
        discount: Some(0.1),
        internal_id: 12345, // This will be skipped during serialization
        tags: vec!["electronics".to_string(), "computer".to_string()],
        created_at: chrono::Utc::now(),
    };
    
    let json = serde_json::to_string_pretty(&product).unwrap();
    println!("Product JSON: {}", json);
    
    // Note: internal_id is not in the JSON because of #[serde(skip)]
    // Fields are renamed because of #[serde(rename = "...")]
    
    println!();
}

fn custom_serialization_example() {
    println!("2. Custom Serialization Example");
    println!("-----------------------------");
    
    // This would require implementing Serialize/Deserialize for CustomData
    // For now, we'll show a simpler example with a custom type
    
    #[derive(Debug)]
    struct Timestamp(chrono::DateTime<chrono::Utc>);
    
    impl Serialize for Timestamp {
        fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: Serializer,
        {
            let timestamp = self.0.timestamp();
            serializer.serialize_i64(timestamp)
        }
    }
    
    impl<'de> Deserialize<'de> for Timestamp {
        fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
        where
            D: Deserializer<'de>,
        {
            let timestamp = i64::deserialize(deserializer)?;
            let datetime = chrono::DateTime::from_timestamp(timestamp, 0)
                .ok_or_else(|| serde::de::Error::custom("invalid timestamp"))?;
            Ok(Timestamp(datetime))
        }
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct Event {
        name: String,
        timestamp: Timestamp,
    }
    
    let event = Event {
        name: "Server Start".to_string(),
        timestamp: Timestamp(chrono::Utc::now()),
    };
    
    let json = serde_json::to_string_pretty(&event).unwrap();
    println!("Event JSON: {}", json);
    
    let deserialized_event: Event = serde_json::from_str(&json).unwrap();
    println!("Deserialized event: {:?}", deserialized_event);
    
    println!();
}

fn conditional_serialization_example() {
    println!("3. Conditional Serialization Example");
    println!("------------------------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct User {
        username: String,
        #[serde(skip_serializing_if = "String::is_empty")]
        email: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        phone: Option<String>,
        #[serde(skip_serializing_if = "Vec::is_empty")]
        roles: Vec<String>,
        #[serde(skip)]
        password: String,
    }
    
    let user_with_data = User {
        username: "john_doe".to_string(),
        email: "john@example.com".to_string(),
        phone: Some("555-1234".to_string()),
        roles: vec!["admin".to_string(), "user".to_string()],
        password: "secret123".to_string(),
    };
    
    let json = serde_json::to_string_pretty(&user_with_data).unwrap();
    println!("User with data: {}", json);
    
    let user_with_empty_fields = User {
        username: "jane_doe".to_string(),
        email: "".to_string(),
        phone: None,
        roles: vec![],
        password: "secret456".to_string(),
    };
    
    let json_empty = serde_json::to_string_pretty(&user_with_empty_fields).unwrap();
    println!("User with empty fields: {}", json_empty);
    
    println!();
}

fn default_values_example() {
    println!("4. Default Values Example");
    println!("-------------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct Config {
        name: String,
        #[serde(default = "default_port")]
        port: u16,
        #[serde(default)]
        debug: bool,
        #[serde(default = "default_hosts")]
        hosts: Vec<String>,
    }
    
    fn default_port() -> u16 {
        8080
    }
    
    fn default_hosts() -> Vec<String> {
        vec!["localhost".to_string()]
    }
    
    let json_with_defaults = r#"
    {
        "name": "MyApp"
    }
    "#;
    
    let config: Config = serde_json::from_str(json_with_defaults).unwrap();
    println!("Config with defaults: {:?}", config);
    
    let json_with_values = r#"
    {
        "name": "MyApp",
        "port": 3000,
        "debug": true,
        "hosts": ["host1", "host2"]
    }
    "#;
    
    let config_with_values: Config = serde_json::from_str(json_with_values).unwrap();
    println!("Config with values: {:?}", config_with_values);
    
    println!();
}

fn flatten_and_tag_example() {
    println!("5. Flatten and Tag Example");
    println!("--------------------------");
    
    use crate::models::{Order, OrderItem, OrderPricing, Status};
    
    let order = Order {
        id: uuid::Uuid::new_v4(),
        customer_id: uuid::Uuid::new_v4(),
        items: crate::models::OrderItems {
            items: vec![
                OrderItem {
                    product_id: uuid::Uuid::new_v4(),
                    quantity: 2,
                    price: 29.99,
                },
                OrderItem {
                    product_id: uuid::Uuid::new_v4(),
                    quantity: 1,
                    price: 49.99,
                },
            ],
        },
        pricing: OrderPricing {
            subtotal: 109.97,
            tax: 8.80,
            shipping: 5.99,
            total: 124.76,
        },
        status: Status::Active,
        created_at: chrono::Utc::now(),
    };
    
    let json = serde_json::to_string_pretty(&order).unwrap();
    println!("Order JSON: {}", json);
    
    // Note how items and pricing fields are flattened into the main object
    
    println!();
}

// Example of remote derive
#[derive(Debug, Serialize, Deserialize)]
#[serde(remote = "Self")]
struct RemoteExample {
    value: i32,
}

impl RemoteExample {
    fn new(value: i32) -> Self {
        Self { value }
    }
}

pub fn remote_derive_example() {
    println!("6. Remote Derive Example");
    println!("------------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct Container {
        #[serde(with = "RemoteExample")]
        data: RemoteExample,
    }
    
    let container = Container {
        data: RemoteExample::new(42),
    };
    
    let json = serde_json::to_string_pretty(&container).unwrap();
    println!("Container JSON: {}", json);
    
    let deserialized: Container = serde_json::from_str(&json).unwrap();
    println!("Deserialized: {:?}", deserialized);
    
    println!();
}

// Example of custom serialization for a map
pub fn custom_map_example() {
    println!("7. Custom Map Example");
    println!("---------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct CustomMap {
        #[serde(with = "custom_map")]
        data: HashMap<String, i32>,
    }
    
    mod custom_map {
        use serde::{Deserialize, Deserializer, Serialize, Serializer};
        use std::collections::HashMap;
        
        pub fn serialize<S>(data: &HashMap<String, i32>, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: Serializer,
        {
            let vec: Vec<_> = data.iter().collect();
            vec.serialize(serializer)
        }
        
        pub fn deserialize<'de, D>(deserializer: D) -> Result<HashMap<String, i32>, D::Error>
        where
            D: Deserializer<'de>,
        {
            let vec: Vec<(String, i32)> = Vec::deserialize(deserializer)?;
            Ok(vec.into_iter().collect())
        }
    }
    
    let mut data = HashMap::new();
    data.insert("key1".to_string(), 1);
    data.insert("key2".to_string(), 2);
    data.insert("key3".to_string(), 3);
    
    let custom_map = CustomMap { data };
    
    let json = serde_json::to_string_pretty(&custom_map).unwrap();
    println!("Custom map JSON: {}", json);
    
    let deserialized: CustomMap = serde_json::from_str(&json).unwrap();
    println!("Deserialized: {:?}", deserialized);
    
    println!();
}