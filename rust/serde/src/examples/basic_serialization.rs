use crate::models::{Person, Address, Status};
use serde::{Deserialize, Serialize};
use serde_json;

pub fn run() {
    println!("=== Basic Serialization Examples ===");
    println!();
    
    // Example 1: Simple struct serialization
    simple_struct_serialization();
    
    // Example 2: Enum serialization
    enum_serialization();
    
    // Example 3: Option and Vec serialization
    collection_serialization();
    
    // Example 4: Nested struct serialization
    nested_struct_serialization();
    
    // Example 5: Deserialization
    deserialization_examples();
    
    println!();
}

fn simple_struct_serialization() {
    println!("1. Simple Struct Serialization");
    println!("----------------------------");
    
    let person = Person {
        name: "John Doe".to_string(),
        age: 30,
        email: "john.doe@example.com".to_string(),
        address: None,
        hobbies: vec!["reading".to_string(), "swimming".to_string()],
    };
    
    // Serialize to JSON string
    let json_str = serde_json::to_string(&person).unwrap();
    println!("Serialized JSON: {}", json_str);
    
    // Serialize to pretty JSON
    let pretty_json = serde_json::to_string_pretty(&person).unwrap();
    println!("Pretty JSON: {}", pretty_json);
    
    println!();
}

fn enum_serialization() {
    println!("2. Enum Serialization");
    println!("--------------------");
    
    let statuses = vec![
        Status::Active,
        Status::Inactive,
        Status::Pending,
        Status::Suspended {
            reason: "Policy violation".to_string(),
            until: chrono::Utc::now(),
        },
    ];
    
    for status in statuses {
        let json = serde_json::to_string(&status).unwrap();
        println!("Status: {:?} -> JSON: {}", status, json);
    }
    
    println!();
}

fn collection_serialization() {
    println!("3. Collection Serialization");
    println!("--------------------------");
    
    let data = serde_json::json!({
        "optional_value": Some(42),
        "none_value": None::<i32>,
        "numbers": vec![1, 2, 3, 4, 5],
        "nested": {
            "inner": "value"
        }
    });
    
    let json = serde_json::to_string_pretty(&data).unwrap();
    println!("Collections JSON: {}", json);
    
    println!();
}

fn nested_struct_serialization() {
    println!("4. Nested Struct Serialization");
    println!("------------------------------");
    
    let address = Address {
        street: "123 Main St".to_string(),
        city: "New York".to_string(),
        country: "USA".to_string(),
        postal_code: "10001".to_string(),
    };
    
    let person = Person {
        name: "Jane Smith".to_string(),
        age: 25,
        email: "jane.smith@example.com".to_string(),
        address: Some(address),
        hobbies: vec!["coding".to_string(), "gaming".to_string()],
    };
    
    let json = serde_json::to_string_pretty(&person).unwrap();
    println!("Nested struct JSON: {}", json);
    
    println!();
}

fn deserialization_examples() {
    println!("5. Deserialization Examples");
    println!("--------------------------");
    
    // Example 1: Deserialize from JSON string
    let json_str = r#"
    {
        "name": "Alice Johnson",
        "age": 28,
        "email": "alice@example.com",
        "address": null,
        "hobbies": ["painting", "hiking"]
    }
    "#;
    
    let person: Person = serde_json::from_str(json_str).unwrap();
    println!("Deserialized person: {:?}", person);
    
    // Example 2: Deserialize with address
    let json_with_address = r#"
    {
        "name": "Bob Wilson",
        "age": 35,
        "email": "bob@example.com",
        "address": {
            "street": "456 Oak Ave",
            "city": "Los Angeles",
            "country": "USA",
            "postal_code": "90001"
        },
        "hobbies": ["cooking", "traveling"]
    }
    "#;
    
    let person_with_address: Person = serde_json::from_str(json_with_address).unwrap();
    println!("Deserialized person with address: {:?}", person_with_address);
    
    // Example 3: Deserialize enum
    let status_json = r#""Active""#;
    let status: Status = serde_json::from_str(status_json).unwrap();
    println!("Deserialized status: {:?}", status);
    
    // Example 4: Deserialize complex enum
    let complex_status_json = r#"
    {
        "Suspended": {
            "reason": "Security review",
            "until": "2023-12-31T23:59:59Z"
        }
    }
    "#;
    
    let complex_status: Status = serde_json::from_str(complex_status_json).unwrap();
    println!("Deserialized complex status: {:?}", complex_status);
    
    // Example 5: Handle deserialization errors
    let invalid_json = r#"
    {
        "name": "Invalid Person",
        "age": "not-a-number",
        "email": "invalid-email",
        "address": null,
        "hobbies": []
    }
    "#;
    
    match serde_json::from_str::<Person>(invalid_json) {
        Ok(person) => println!("Unexpected success: {:?}", person),
        Err(e) => println!("Expected deserialization error: {}", e),
    }
    
    println!();
}

// Example of custom struct for demonstration
#[derive(Debug, Serialize, Deserialize)]
struct Point {
    x: f64,
    y: f64,
}

#[derive(Debug, Serialize, Deserialize)]
struct Circle {
    center: Point,
    radius: f64,
    color: Option<String>,
}

pub fn geometry_example() {
    println!("6. Geometry Example");
    println!("-------------------");
    
    let circle = Circle {
        center: Point { x: 0.0, y: 0.0 },
        radius: 5.0,
        color: Some("red".to_string()),
    };
    
    let json = serde_json::to_string_pretty(&circle).unwrap();
    println!("Circle JSON: {}", json);
    
    let deserialized_circle: Circle = serde_json::from_str(&json).unwrap();
    println!("Deserialized circle: {:?}", deserialized_circle);
    
    println!();
}