use crate::models::{Person, Address};
use serde::{Deserialize, Serialize};
use serde_json::{self, Error};
use std::collections::HashMap;

pub fn run() {
    println!("=== Error Handling Examples ===");
    println!();
    
    // Example 1: Basic error handling
    basic_error_handling();
    
    // Example 2: Custom error types
    custom_error_types();
    
    // Example 3: Graceful degradation
    graceful_degradation();
    
    // Example 4: Error recovery
    error_recovery();
    
    // Example 5: Validation errors
    validation_errors();
    
    // Example 6: Partial deserialization
    partial_deserialization();
    
    println!();
}

fn basic_error_handling() {
    println!("1. Basic Error Handling");
    println!("-----------------------");
    
    // Valid JSON
    let valid_json = r#"
    {
        "name": "John Doe",
        "age": 30,
        "email": "john@example.com",
        "address": null,
        "hobbies": ["reading", "swimming"]
    }
    "#;
    
    match serde_json::from_str::<Person>(valid_json) {
        Ok(person) => println!("Successfully parsed: {:?}", person),
        Err(e) => println!("Error: {}", e),
    }
    
    // Invalid JSON (syntax error)
    let invalid_json_syntax = r#"
    {
        "name": "Jane Doe",
        "age": 25,
        "email": "jane@example.com",
        "address": null,
        "hobbies": ["painting", "hiking",
    }
    "#; // Missing closing bracket
    
    match serde_json::from_str::<Person>(invalid_json_syntax) {
        Ok(person) => println!("Unexpected success: {:?}", person),
        Err(e) => println!("Syntax error: {}", e),
    }
    
    // Invalid JSON (type mismatch)
    let invalid_json_type = r#"
    {
        "name": "Bob Smith",
        "age": "not-a-number",
        "email": "bob@example.com",
        "address": null,
        "hobbies": []
    }
    "#;
    
    match serde_json::from_str::<Person>(invalid_json_type) {
        Ok(person) => println!("Unexpected success: {:?}", person),
        Err(e) => println!("Type error: {}", e),
    }
    
    // Invalid JSON (missing required field)
    let invalid_json_missing = r#"
    {
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "address": null,
        "hobbies": []
    }
    "#; // Missing age field
    
    match serde_json::from_str::<Person>(invalid_json_missing) {
        Ok(person) => println!("Unexpected success: {:?}", person),
        Err(e) => println!("Missing field error: {}", e),
    }
    
    println!();
}

fn custom_error_types() {
    println!("2. Custom Error Types");
    println!("---------------------");
    
    use thiserror::Error;
    
    #[derive(Debug, Error)]
    enum AppError {
        #[error("JSON parsing error: {0}")]
        JsonParse(#[from] serde_json::Error),
        #[error("Validation error: {field} - {message}")]
        Validation { field: String, message: String },
        #[error("IO error: {0}")]
        Io(#[from] std::io::Error),
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct ValidatedUser {
        #[serde(deserialize_with = "validate_username")]
        username: String,
        #[serde(deserialize_with = "validate_email")]
        email: String,
    }
    
    fn validate_username<'de, D>(deserializer: D) -> Result<String, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let username = String::deserialize(deserializer)?;
        
        if username.len() < 3 {
            return Err(serde::de::Error::custom("Username must be at least 3 characters"));
        }
        
        if username.len() > 20 {
            return Err(serde::de::Error::custom("Username must be at most 20 characters"));
        }
        
        Ok(username)
    }
    
    fn validate_email<'de, D>(deserializer: D) -> Result<String, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let email = String::deserialize(deserializer)?;
        
        if !email.contains('@') {
            return Err(serde::de::Error::custom("Invalid email format"));
        }
        
        Ok(email)
    }
    
    let json_str = r#"
    {
        "username": "ab",
        "email": "invalid-email"
    }
    "#;
    
    match serde_json::from_str::<ValidatedUser>(json_str) {
        Ok(user) => println!("Unexpected success: {:?}", user),
        Err(e) => {
            let app_error = AppError::JsonParse(e);
            println!("Custom error: {}", app_error);
        }
    }
    
    println!();
}

fn graceful_degradation() {
    println!("3. Graceful Degradation");
    println!("-----------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct Config {
        name: String,
        #[serde(default = "default_port")]
        port: u16,
        #[serde(default)]
        debug: bool,
        #[serde(default = "default_timeout")]
        timeout: u64,
    }
    
    fn default_port() -> u16 {
        8080
    }
    
    fn default_timeout() -> u64 {
        30
    }
    
    // Complete config
    let complete_json = r#"
    {
        "name": "MyApp",
        "port": 3000,
        "debug": true,
        "timeout": 60
    }
    "#;
    
    match serde_json::from_str::<Config>(complete_json) {
        Ok(config) => println!("Complete config: {:?}", config),
        Err(e) => println!("Error: {}", e),
    }
    
    // Partial config (missing optional fields)
    let partial_json = r#"
    {
        "name": "MyApp"
    }
    "#;
    
    match serde_json::from_str::<Config>(partial_json) {
        Ok(config) => println!("Partial config with defaults: {:?}", config),
        Err(e) => println!("Error: {}", e),
    }
    
    // Config with unknown field (ignored)
    let extra_fields_json = r#"
    {
        "name": "MyApp",
        "port": 3000,
        "unknown_field": "ignored",
        "another_unknown": 42
    }
    "#;
    
    match serde_json::from_str::<Config>(extra_fields_json) {
        Ok(config) => println!("Config with extra fields: {:?}", config),
        Err(e) => println!("Error: {}", e),
    }
    
    println!();
}

fn error_recovery() {
    println!("4. Error Recovery");
    println!("------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct FlexibleData {
        #[serde(deserialize_with = "deserialize_flexible_number")]
        number: f64,
        #[serde(deserialize_with = "deserialize_flexible_string")]
        text: String,
    }
    
    fn deserialize_flexible_number<'de, D>(deserializer: D) -> Result<f64, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        use serde::de::{self, Deserialize, Visitor};
        use std::fmt;
        
        struct FlexibleNumberVisitor;
        
        impl<'de> Visitor<'de> for FlexibleNumberVisitor {
            type Value = f64;
            
            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                formatter.write_str("a number or a string containing a number")
            }
            
            fn visit_f64<E>(self, value: f64) -> Result<Self::Value, E> {
                Ok(value)
            }
            
            fn visit_i64<E>(self, value: i64) -> Result<Self::Value, E> {
                Ok(value as f64)
            }
            
            fn visit_u64<E>(self, value: u64) -> Result<Self::Value, E> {
                Ok(value as f64)
            }
            
            fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
            where
                E: de::Error,
            {
                value.parse::<f64>().map_err(E::custom)
            }
        }
        
        deserializer.deserialize_any(FlexibleNumberVisitor)
    }
    
    fn deserialize_flexible_string<'de, D>(deserializer: D) -> Result<String, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        use serde::de::{self, Deserialize, Visitor};
        use std::fmt;
        
        struct FlexibleStringVisitor;
        
        impl<'de> Visitor<'de> for FlexibleStringVisitor {
            type Value = String;
            
            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                formatter.write_str("a string or a number")
            }
            
            fn visit_str<E>(self, value: &str) -> Result<Self::Value, E> {
                Ok(value.to_string())
            }
            
            fn visit_string<E>(self, value: String) -> Result<Self::Value, E> {
                Ok(value)
            }
            
            fn visit_i64<E>(self, value: i64) -> Result<Self::Value, E> {
                Ok(value.to_string())
            }
            
            fn visit_u64<E>(self, value: u64) -> Result<Self::Value, E> {
                Ok(value.to_string())
            }
            
            fn visit_f64<E>(self, value: f64) -> Result<Self::Value, E> {
                Ok(value.to_string())
            }
        }
        
        deserializer.deserialize_any(FlexibleStringVisitor)
    }
    
    // Various input formats
    let test_cases = vec![
        r#"{"number": 42, "text": "hello"}"#,
        r#"{"number": "3.14", "text": "world"}"#,
        r#"{"number": 100, "text": 123}"#,
        r#"{"number": "invalid", "text": "test"}"#,
    ];
    
    for (i, test_case) in test_cases.iter().enumerate() {
        match serde_json::from_str::<FlexibleData>(test_case) {
            Ok(data) => println!("Test case {}: {:?}", i + 1, data),
            Err(e) => println!("Test case {} failed: {}", i + 1, e),
        }
    }
    
    println!();
}

fn validation_errors() {
    println!("5. Validation Errors");
    println!("--------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct StrictUser {
        #[serde(deserialize_with = "validate_strict_string")]
        name: String,
        #[serde(deserialize_with = "validate_age_range")]
        age: u8,
        #[serde(deserialize_with = "validate_email_strict")]
        email: String,
    }
    
    fn validate_strict_string<'de, D>(deserializer: D) -> Result<String, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        
        if s.trim().is_empty() {
            return Err(serde::de::Error::custom("String cannot be empty or whitespace"));
        }
        
        if s.len() > 100 {
            return Err(serde::de::Error::custom("String too long (max 100 characters)"));
        }
        
        Ok(s)
    }
    
    fn validate_age_range<'de, D>(deserializer: D) -> Result<u8, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let age = u8::deserialize(deserializer)?;
        
        if age < 13 || age > 120 {
            return Err(serde::de::Error::custom("Age must be between 13 and 120"));
        }
        
        Ok(age)
    }
    
    fn validate_email_strict<'de, D>(deserializer: D) -> Result<String, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let email = String::deserialize(deserializer)?;
        
        // Basic email validation
        if !email.contains('@') || !email.contains('.') {
            return Err(serde::de::Error::custom("Invalid email format"));
        }
        
        // More strict validation
        let parts: Vec<&str> = email.split('@').collect();
        if parts.len() != 2 {
            return Err(serde::de::Error::custom("Email must have exactly one @ symbol"));
        }
        
        if parts[0].is_empty() || parts[1].is_empty() {
            return Err(serde::de::Error::custom("Email parts cannot be empty"));
        }
        
        Ok(email)
    }
    
    let test_cases = vec![
        r#"{"name": "John Doe", "age": 25, "email": "john@example.com"}"#, // Valid
        r#"{"name": "", "age": 25, "email": "john@example.com"}"#, // Empty name
        r#"{"name": "Jane Doe", "age": 10, "email": "jane@example.com"}"#, // Age too young
        r#"{"name": "Bob Smith", "age": 130, "email": "bob@example.com"}"#, // Age too old
        r#"{"name": "Alice Johnson", "age": 30, "email": "invalid-email"}"#, // Invalid email
    ];
    
    for (i, test_case) in test_cases.iter().enumerate() {
        match serde_json::from_str::<StrictUser>(test_case) {
            Ok(user) => println!("Test case {}: {:?}", i + 1, user),
            Err(e) => println!("Test case {} failed: {}", i + 1, e),
        }
    }
    
    println!();
}

fn partial_deserialization() {
    println!("6. Partial Deserialization");
    println!("----------------------------");
    
    // Try to extract just a specific field from JSON
    let json_str = r#"
    {
        "user": {
            "id": 123,
            "name": "John Doe",
            "email": "john@example.com",
            "profile": {
                "age": 30,
                "city": "New York"
            }
        },
        "metadata": {
            "created_at": "2023-01-01T00:00:00Z",
            "updated_at": "2023-01-02T00:00:00Z"
        }
    }
    "#;
    
    // Extract just the user name
    match serde_json::from_str::<serde_json::Value>(json_str) {
        Ok(value) => {
            if let Some(name) = value["user"]["name"].as_str() {
                println!("Extracted name: {}", name);
            }
            
            if let Some(age) = value["user"]["profile"]["age"].as_u64() {
                println!("Extracted age: {}", age);
            }
        }
        Err(e) => println!("Error parsing JSON: {}", e),
    }
    
    // Try to deserialize just a part of the structure
    #[derive(Debug, Serialize, Deserialize)]
    struct PartialUser {
        name: String,
        email: String,
    }
    
    match serde_json::from_str::<serde_json::Value>(json_str) {
        Ok(value) => {
            match serde_json::from_value::<PartialUser>(value["user"].clone()) {
                Ok(user) => println!("Partial user: {:?}", user),
                Err(e) => println!("Error extracting partial user: {}", e),
            }
        }
        Err(e) => println!("Error parsing JSON: {}", e),
    }
    
    // Handle missing fields gracefully
    let incomplete_json = r#"
    {
        "user": {
            "id": 123,
            "name": "John Doe"
            // Missing email and profile
        }
    }
    "#;
    
    match serde_json::from_str::<PartialUser>(incomplete_json) {
        Ok(user) => println!("Unexpected success: {:?}", user),
        Err(e) => println!("Expected error for incomplete data: {}", e),
    }
    
    println!();
}

// Example of error context and chaining
pub fn error_context_example() {
    println!("7. Error Context Example");
    println!("------------------------");
    
    use std::error::Error;
    
    fn process_config_file() -> Result<(), Box<dyn Error>> {
        let config_json = r#"
        {
            "database": {
                "url": "postgresql://localhost/mydb",
                "max_connections": "invalid"
            }
        }
        "#;
        
        #[derive(Debug, Deserialize)]
        struct DatabaseConfig {
            url: String,
            max_connections: u32,
        }
        
        #[derive(Debug, Deserialize)]
        struct Config {
            database: DatabaseConfig,
        }
        
        let config: Config = serde_json::from_str(config_json)
            .map_err(|e| {
                format!("Failed to parse configuration: {}", e)
            })?;
        
        if config.database.max_connections > 100 {
            return Err("Too many database connections configured".into());
        }
        
        println!("Configuration loaded successfully");
        Ok(())
    }
    
    match process_config_file() {
        Ok(_) => println!("Success"),
        Err(e) => println!("Error: {}", e),
    }
    
    println!();
}