use crate::models::{ApiResponse, ApiError, TaggedData, DataType};
use serde::{Deserialize, Serialize};
use serde_json::{self, Value};
use std::collections::HashMap;

pub fn run() {
    println!("=== Advanced Features Examples ===");
    println!();
    
    // Example 1: Generic types
    generic_types_example();
    
    // Example 2: Enum with tagged representation
    tagged_enum_example();
    
    // Example 3: Dynamic typing with Value
    dynamic_typing_example();
    
    // Example 4: Custom deserialization with validation
    validation_example();
    
    // Example 5: Recursive data structures
    recursive_structures_example();
    
    // Example 6: Serialization with context
    context_aware_serialization();
    
    // Example 7: Zero-copy deserialization
    zero_copy_example();
    
    println!();
}

fn generic_types_example() {
    println!("1. Generic Types Example");
    println!("------------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct Response<T> {
        success: bool,
        data: T,
        message: String,
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct User {
        id: u32,
        name: String,
        email: String,
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct Product {
        id: u32,
        name: String,
        price: f64,
    }
    
    let user_response = Response {
        success: true,
        data: User {
            id: 1,
            name: "John Doe".to_string(),
            email: "john@example.com".to_string(),
        },
        message: "User retrieved successfully".to_string(),
    };
    
    let product_response = Response {
        success: true,
        data: Product {
            id: 101,
            name: "Laptop".to_string(),
            price: 999.99,
        },
        message: "Product retrieved successfully".to_string(),
    };
    
    let user_json = serde_json::to_string_pretty(&user_response).unwrap();
    println!("User Response JSON:\n{}", user_json);
    
    let product_json = serde_json::to_string_pretty(&product_response).unwrap();
    println!("Product Response JSON:\n{}", product_json);
    
    // Deserialize with specific type
    let deserialized_user: Response<User> = serde_json::from_str(&user_json).unwrap();
    println!("Deserialized User: {:?}", deserialized_user);
    
    println!();
}

fn tagged_enum_example() {
    println!("2. Tagged Enum Example");
    println!("----------------------");
    
    let text_data = TaggedData {
        data: DataType::Text("Hello, World!".to_string()),
    };
    
    let number_data = TaggedData {
        data: DataType::Number(42.5),
    };
    
    let boolean_data = TaggedData {
        data: DataType::Boolean(true),
    };
    
    let array_data = TaggedData {
        data: DataType::Array(vec![
            DataType::Text("item1".to_string()),
            DataType::Number(1),
            DataType::Boolean(false),
        ]),
    };
    
    let object_data = TaggedData {
        data: DataType::Object({
            let mut map = HashMap::new();
            map.insert("key1".to_string(), DataType::Text("value1".to_string()));
            map.insert("key2".to_string(), DataType::Number(2));
            map
        }),
    };
    
    let examples = vec![text_data, number_data, boolean_data, array_data, object_data];
    
    for (i, example) in examples.iter().enumerate() {
        let json = serde_json::to_string_pretty(example).unwrap();
        println!("Example {}:\n{}", i + 1, json);
    }
    
    // Deserialize tagged data
    let json_str = r#"
    {
        "type": "Object",
        "value": {
            "name": "John",
            "age": 30
        }
    }
    "#;
    
    let tagged_data: TaggedData = serde_json::from_str(json_str).unwrap();
    println!("Deserialized tagged data: {:?}", tagged_data);
    
    println!();
}

fn dynamic_typing_example() {
    println!("3. Dynamic Typing Example");
    println!("--------------------------");
    
    // Create JSON with mixed types
    let json_value = serde_json::json!({
        "string": "Hello",
        "number": 42,
        "float": 3.14,
        "boolean": true,
        "null": null,
        "array": [1, 2, 3],
        "object": {
            "nested": "value"
        }
    });
    
    println!("Original JSON: {}", serde_json::to_string_pretty(&json_value).unwrap());
    
    // Extract values dynamically
    if let Value::String(s) = &json_value["string"] {
        println!("String value: {}", s);
    }
    
    if let Value::Number(n) = &json_value["number"] {
        println!("Number value: {}", n);
    }
    
    if let Value::Array(arr) = &json_value["array"] {
        println!("Array length: {}", arr.len());
    }
    
    // Modify values dynamically
    let mut mutable_value = json_value;
    mutable_value["new_field"] = Value::String("Added dynamically".to_string());
    mutable_value["number"] = Value::Number(100.into());
    
    println!("Modified JSON: {}", serde_json::to_string_pretty(&mutable_value).unwrap());
    
    // Type conversion
    let converted: HashMap<String, Value> = serde_json::from_value(mutable_value).unwrap();
    println!("Converted to HashMap: {:?}", converted);
    
    println!();
}

fn validation_example() {
    println!("4. Validation Example");
    println!("---------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct ValidatedEmail {
        #[serde(deserialize_with = "validate_email")]
        email: String,
    }
    
    fn validate_email<'de, D>(deserializer: D) -> Result<String, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let email: String = String::deserialize(deserializer)?;
        
        if !email.contains('@') {
            return Err(serde::de::Error::custom("Invalid email format"));
        }
        
        if email.len() > 100 {
            return Err(serde::de::Error::custom("Email too long"));
        }
        
        Ok(email)
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct ValidatedAge {
        #[serde(deserialize_with = "validate_age")]
        age: u8,
    }
    
    fn validate_age<'de, D>(deserializer: D) -> Result<u8, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let age = u8::deserialize(deserializer)?;
        
        if age < 0 || age > 120 {
            return Err(serde::de::Error::custom("Age must be between 0 and 120"));
        }
        
        Ok(age)
    }
    
    // Valid data
    let valid_json = r#"
    {
        "email": "user@example.com",
        "age": 25
    }
    "#;
    
    #[derive(Debug, Serialize, Deserialize)]
    struct ValidatedUser {
        #[serde(flatten)]
        email: ValidatedEmail,
        #[serde(flatten)]
        age: ValidatedAge,
    }
    
    match serde_json::from_str::<ValidatedUser>(valid_json) {
        Ok(user) => println!("Valid user: {:?}", user),
        Err(e) => println!("Validation error: {}", e),
    }
    
    // Invalid email
    let invalid_email_json = r#"
    {
        "email": "invalid-email",
        "age": 25
    }
    "#;
    
    match serde_json::from_str::<ValidatedUser>(invalid_email_json) {
        Ok(user) => println!("Unexpected success: {:?}", user),
        Err(e) => println!("Expected email validation error: {}", e),
    }
    
    // Invalid age
    let invalid_age_json = r#"
    {
        "email": "user@example.com",
        "age": 150
    }
    "#;
    
    match serde_json::from_str::<ValidatedUser>(invalid_age_json) {
        Ok(user) => println!("Unexpected success: {:?}", user),
        Err(e) => println!("Expected age validation error: {}", e),
    }
    
    println!();
}

fn recursive_structures_example() {
    println!("5. Recursive Structures Example");
    println!("-------------------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct TreeNode {
        value: i32,
        children: Vec<TreeNode>,
    }
    
    impl TreeNode {
        fn new(value: i32) -> Self {
            Self {
                value,
                children: Vec::new(),
            }
        }
        
        fn add_child(&mut self, child: TreeNode) {
            self.children.push(child);
        }
    }
    
    // Build a tree structure
    let mut root = TreeNode::new(1);
    
    let mut child1 = TreeNode::new(2);
    child1.add_child(TreeNode::new(4));
    child1.add_child(TreeNode::new(5));
    
    let mut child2 = TreeNode::new(3);
    child2.add_child(TreeNode::new(6));
    
    root.add_child(child1);
    root.add_child(child2);
    
    // Serialize the tree
    let json = serde_json::to_string_pretty(&root).unwrap();
    println!("Tree JSON:\n{}", json);
    
    // Deserialize the tree
    let deserialized_tree: TreeNode = serde_json::from_str(&json).unwrap();
    println!("Deserialized tree: {:?}", deserialized_tree);
    
    println!();
}

fn context_aware_serialization() {
    println!("6. Context-Aware Serialization");
    println!("--------------------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct ContextualData {
        #[serde(skip_serializing_if = "should_skip_sensitive")]
        sensitive_info: String,
        #[serde(skip_serializing_if = "should_skip_debug")]
        debug_info: String,
        public_info: String,
    }
    
    fn should_skip_sensitive(value: &str) -> bool {
        // In a real application, this might check a context flag
        std::env::var("HIDE_SENSITIVE").is_ok()
    }
    
    fn should_skip_debug(value: &str) -> bool {
        // Skip debug info in production
        std::env::var("ENV").unwrap_or_default() == "production"
    }
    
    let data = ContextualData {
        sensitive_info: "Secret password".to_string(),
        debug_info: "Debug information".to_string(),
        public_info: "Public information".to_string(),
    };
    
    // Normal serialization
    let json = serde_json::to_string_pretty(&data).unwrap();
    println!("Normal serialization:\n{}", json);
    
    // With sensitive data hidden
    std::env::set_var("HIDE_SENSITIVE", "true");
    let json_sensitive = serde_json::to_string_pretty(&data).unwrap();
    println!("With sensitive data hidden:\n{}", json_sensitive);
    
    // With debug info hidden
    std::env::set_var("ENV", "production");
    let json_production = serde_json::to_string_pretty(&data).unwrap();
    println!("Production serialization:\n{}", json_production);
    
    // Clean up
    std::env::remove_var("HIDE_SENSITIVE");
    std::env::remove_var("ENV");
    
    println!();
}

fn zero_copy_example() {
    println!("7. Zero-Copy Example");
    println!("---------------------");
    
    // Note: This is a simplified example of zero-copy deserialization
    // In practice, you might use libraries like serde_json::from_str with Cow<str>
    
    #[derive(Debug, Serialize, Deserialize)]
    struct ZeroCopyData {
        #[serde(borrow)]
        name: String,
        #[serde(borrow)]
        description: String,
    }
    
    let json_str = r#"
    {
        "name": "Example",
        "description": "This is a zero-copy example"
    }
    "#;
    
    // This would normally avoid allocations for string data
    // but in this simple example, we're just demonstrating the concept
    let data: ZeroCopyData = serde_json::from_str(json_str).unwrap();
    println!("Zero-copy data: {:?}", data);
    
    // For true zero-copy with JSON, you would typically use:
    // - serde_json::Value for partial parsing
    // - simd-json for high-performance parsing
    // - Custom deserializers that work with raw bytes
    
    println!();
}

// Example of serialization with versioning
pub fn versioning_example() {
    println!("8. Versioning Example");
    println!("----------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct UserV1 {
        name: String,
        email: String,
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct UserV2 {
        name: String,
        email: String,
        #[serde(default)]
        phone: Option<String>,
        #[serde(default)]
        created_at: Option<String>,
    }
    
    // V1 data
    let v1_json = r#"
    {
        "name": "John Doe",
        "email": "john@example.com"
    }
    "#;
    
    // Parse V1 data as V2 (backward compatibility)
    let user_v2: UserV2 = serde_json::from_str(v1_json).unwrap();
    println!("V1 data parsed as V2: {:?}", user_v2);
    
    // V2 data
    let v2_json = r#"
    {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "555-1234",
        "created_at": "2023-01-01T00:00:00Z"
    }
    "#;
    
    let user_v2_full: UserV2 = serde_json::from_str(v2_json).unwrap();
    println!("V2 data: {:?}", user_v2_full);
    
    // Convert V2 to V1 (forward compatibility by ignoring extra fields)
    let user_v1: UserV1 = serde_json::from_str(v2_json).unwrap();
    println!("V2 data parsed as V1: {:?}", user_v1);
    
    println!();
}