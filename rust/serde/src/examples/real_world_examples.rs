use crate::models::{User, Config, ApiResponse, ApiError};
use serde::{Deserialize, Serialize};
use serde_json;
use std::collections::HashMap;

pub fn run() {
    println!("=== Real-World Examples ===");
    println!();
    
    // Example 1: API response handling
    api_response_example();
    
    // Example 2: Configuration file parsing
    config_file_example();
    
    // Example 3: Database record serialization
    database_record_example();
    
    // Example 4: Event/message serialization
    event_serialization_example();
    
    // Example 5: Webhook payload handling
    webhook_payload_example();
    
    // Example 6: CSV data processing
    csv_processing_example();
    
    println!();
}

fn api_response_example() {
    println!("1. API Response Handling");
    println!("------------------------");
    
    // Simulate a successful API response
    let success_response = ApiResponse {
        success: true,
        data: Some(User {
            id: uuid::Uuid::new_v4(),
            username: "john_doe".to_string(),
            email: "john@example.com".to_string(),
            profile: crate::models::UserProfile {
                first_name: "John".to_string(),
                last_name: "Doe".to_string(),
                bio: Some("Software developer".to_string()),
                avatar_url: Some("https://example.com/avatar.jpg".to_string()),
                birth_date: Some(chrono::NaiveDate::from_ymd_opt(1990, 5, 15).unwrap()),
            },
            settings: crate::models::UserSettings {
                theme: "dark".to_string(),
                language: "en".to_string(),
                notifications: crate::models::NotificationSettings {
                    email: true,
                    push: false,
                    sms: false,
                    marketing: false,
                },
                privacy: crate::models::PrivacySettings {
                    profile_public: true,
                    show_email: false,
                    show_activity: true,
                },
            },
            created_at: chrono::Utc::now(),
            last_login: Some(chrono::Utc::now()),
        }),
        error: None,
        timestamp: chrono::Utc::now(),
    };
    
    let json_response = serde_json::to_string_pretty(&success_response).unwrap();
    println!("Success Response JSON:\n{}", json_response);
    
    // Simulate an error response
    let error_response = ApiResponse::<User> {
        success: false,
        data: None,
        error: Some(ApiError {
            code: 404,
            message: "User not found".to_string(),
            details: Some(vec![
                "User ID '123' does not exist".to_string(),
                "Please check the user ID and try again".to_string(),
            ]),
        }),
        timestamp: chrono::Utc::now(),
    };
    
    let json_error = serde_json::to_string_pretty(&error_response).unwrap();
    println!("Error Response JSON:\n{}", json_error);
    
    // Parse and handle API response
    let response_str = r#"
    {
        "success": true,
        "data": {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "username": "jane_doe",
            "email": "jane@example.com",
            "profile": {
                "first_name": "Jane",
                "last_name": "Doe",
                "bio": null,
                "avatar_url": null,
                "birth_date": "1992-08-20"
            },
            "settings": {
                "theme": "light",
                "language": "en",
                "notifications": {
                    "email": true,
                    "push": true,
                    "sms": false,
                    "marketing": false
                },
                "privacy": {
                    "profile_public": false,
                    "show_email": false,
                    "show_activity": false
                }
            },
            "created_at": "2023-01-01T00:00:00Z",
            "last_login": "2023-10-21T12:00:00Z"
        },
        "error": null,
        "timestamp": "2023-10-21T12:30:00Z"
    }
    "#;
    
    match serde_json::from_str::<ApiResponse<User>>(response_str) {
        Ok(response) => {
            if response.success {
                if let Some(user) = response.data {
                    println!("Parsed user: {} ({})", user.username, user.email);
                    println!("Theme: {}", user.settings.theme);
                    println!("Email notifications: {}", user.settings.notifications.email);
                }
            } else {
                println!("API error: {:?}", response.error);
            }
        }
        Err(e) => println!("Failed to parse response: {}", e),
    }
    
    println!();
}

fn config_file_example() {
    println!("2. Configuration File Parsing");
    println!("------------------------------");
    
    // Example configuration in JSON format
    let config_json = r#"
    {
        "database": {
            "url": "postgresql://localhost:5432/myapp",
            "max_connections": 10,
            "timeout_seconds": 30
        },
        "server": {
            "host": "0.0.0.0",
            "port": 8080,
            "workers": 4
        },
        "logging": {
            "level": "info",
            "file": "/var/log/myapp.log",
            "format": "json"
        },
        "features": {
            "new_ui": true,
            "beta_features": false,
            "debug_mode": false
        }
    }
    "#;
    
    match serde_json::from_str::<Config>(config_json) {
        Ok(config) => {
            println!("Configuration loaded successfully:");
            println!("Database URL: {}", config.database.url);
            println!("Server: {}:{}", config.server.host, config.server.port);
            println!("Log level: {}", config.logging.level);
            println!("New UI enabled: {}", config.features.new_ui);
        }
        Err(e) => println!("Failed to parse config: {}", e),
    }
    
    // Example with environment variable substitution
    let config_with_env = r#"
    {
        "database": {
            "url": "${DATABASE_URL:postgresql://localhost:5432/myapp}",
            "max_connections": ${DB_MAX_CONNECTIONS:10},
            "timeout_seconds": 30
        },
        "server": {
            "host": "${HOST:0.0.0.0}",
            "port": ${PORT:8080},
            "workers": ${WORKERS:4}
        }
    }
    "#;
    
    println!("Configuration with environment variables:");
    println!("{}", config_with_env);
    
    // Note: In a real application, you would implement environment variable substitution
    // before parsing the configuration
    
    println!();
}

fn database_record_example() {
    println!("3. Database Record Serialization");
    println!("---------------------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct DatabaseRecord {
        id: i64,
        created_at: chrono::DateTime<chrono::Utc>,
        updated_at: chrono::DateTime<chrono::Utc>,
        data: serde_json::Value,
        metadata: HashMap<String, String>,
    }
    
    // Create a database record
    let record = DatabaseRecord {
        id: 12345,
        created_at: chrono::Utc::now(),
        updated_at: chrono::Utc::now(),
        data: serde_json::json!({
            "user_id": 67890,
            "action": "login",
            "ip_address": "192.168.1.100",
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "session_id": "abc123def456"
        }),
        metadata: {
            let mut meta = HashMap::new();
            meta.insert("table".to_string(), "user_activity".to_string());
            meta.insert("partition".to_string(), "2023-10".to_string());
            meta.insert("version".to_string(), "1".to_string());
            meta
        },
    };
    
    // Serialize for storage
    let serialized = serde_json::to_string(&record).unwrap();
    println!("Serialized record: {}", serialized);
    
    // Deserialize from storage
    let deserialized: DatabaseRecord = serde_json::from_str(&serialized).unwrap();
    println!("Deserialized record: {:?}", deserialized);
    
    // Extract specific data
    if let Some(action) = deserialized.data.get("action").and_then(|v| v.as_str()) {
        println!("Action: {}", action);
    }
    
    if let Some(user_agent) = deserialized.data.get("user_agent").and_then(|v| v.as_str()) {
        println!("User agent: {}", user_agent);
    }
    
    println!();
}

fn event_serialization_example() {
    println!("4. Event/Message Serialization");
    println!("--------------------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    #[serde(tag = "event_type")]
    enum Event {
        UserRegistered {
            user_id: uuid::Uuid,
            username: String,
            email: String,
            timestamp: chrono::DateTime<chrono::Utc>,
        },
        UserLogin {
            user_id: uuid::Uuid,
            ip_address: String,
            success: bool,
            timestamp: chrono::DateTime<chrono::Utc>,
        },
        OrderCreated {
            order_id: uuid::Uuid,
            user_id: uuid::Uuid,
            total_amount: f64,
            items: Vec<OrderItem>,
            timestamp: chrono::DateTime<chrono::Utc>,
        },
        PaymentProcessed {
            payment_id: uuid::Uuid,
            order_id: uuid::Uuid,
            amount: f64,
            status: String,
            timestamp: chrono::DateTime<chrono::Utc>,
        },
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct OrderItem {
        product_id: uuid::Uuid,
        quantity: u32,
        price: f64,
    }
    
    // Create different types of events
    let events = vec![
        Event::UserRegistered {
            user_id: uuid::Uuid::new_v4(),
            username: "new_user".to_string(),
            email: "newuser@example.com".to_string(),
            timestamp: chrono::Utc::now(),
        },
        Event::UserLogin {
            user_id: uuid::Uuid::new_v4(),
            ip_address: "192.168.1.100".to_string(),
            success: true,
            timestamp: chrono::Utc::now(),
        },
        Event::OrderCreated {
            order_id: uuid::Uuid::new_v4(),
            user_id: uuid::Uuid::new_v4(),
            total_amount: 99.99,
            items: vec![
                OrderItem {
                    product_id: uuid::Uuid::new_v4(),
                    quantity: 2,
                    price: 25.00,
                },
                OrderItem {
                    product_id: uuid::Uuid::new_v4(),
                    quantity: 1,
                    price: 49.99,
                },
            ],
            timestamp: chrono::Utc::now(),
        },
    ];
    
    // Serialize events
    for (i, event) in events.iter().enumerate() {
        let json = serde_json::to_string_pretty(event).unwrap();
        println!("Event {}:\n{}", i + 1, json);
    }
    
    // Process events dynamically
    let event_json = r#"
    {
        "event_type": "PaymentProcessed",
        "payment_id": "550e8400-e29b-41d4-a716-446655440000",
        "order_id": "550e8400-e29b-41d4-a716-446655440001",
        "amount": 99.99,
        "status": "completed",
        "timestamp": "2023-10-21T12:00:00Z"
    }
    "#;
    
    match serde_json::from_str::<Event>(event_json) {
        Ok(Event::PaymentProcessed { payment_id, amount, status, .. }) => {
            println!("Payment {} of ${:.2} is {}", payment_id, amount, status);
        }
        Ok(event) => println!("Different event type: {:?}", event),
        Err(e) => println!("Failed to parse event: {}", e),
    }
    
    println!();
}

fn webhook_payload_example() {
    println!("5. Webhook Payload Handling");
    println!("----------------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct WebhookPayload {
        id: uuid::Uuid,
        event: String,
        data: serde_json::Value,
        timestamp: chrono::DateTime<chrono::Utc>,
        signature: String,
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct GitHubPushEvent {
        ref_field: String,
        repository: GitHubRepository,
        commits: Vec<GitHubCommit>,
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct GitHubRepository {
        name: String,
        full_name: String,
        private: bool,
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct GitHubCommit {
        id: String,
        message: String,
        author: GitHubAuthor,
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct GitHubAuthor {
        name: String,
        email: String,
    }
    
    // Simulate a GitHub webhook payload
    let webhook_json = r#"
    {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "event": "push",
        "data": {
            "ref": "refs/heads/main",
            "repository": {
                "name": "my-repo",
                "full_name": "user/my-repo",
                "private": false
            },
            "commits": [
                {
                    "id": "abc123",
                    "message": "Add new feature",
                    "author": {
                        "name": "John Doe",
                        "email": "john@example.com"
                    }
                }
            ]
        },
        "timestamp": "2023-10-21T12:00:00Z",
        "signature": "sha256=abc123def456"
    }
    "#;
    
    match serde_json::from_str::<WebhookPayload>(webhook_json) {
        Ok(webhook) => {
            println!("Webhook received:");
            println!("ID: {}", webhook.id);
            println!("Event: {}", webhook.event);
            println!("Timestamp: {}", webhook.timestamp);
            
            // Parse specific event data
            if webhook.event == "push" {
                match serde_json::from_value::<GitHubPushEvent>(webhook.data) {
                    Ok(push_event) => {
                        println!("Push to {} in {}", push_event.ref_field, push_event.repository.full_name);
                        for commit in push_event.commits {
                            println!("  {}: {}", commit.id, commit.message);
                        }
                    }
                    Err(e) => println!("Failed to parse push event: {}", e),
                }
            }
        }
        Err(e) => println!("Failed to parse webhook: {}", e),
    }
    
    println!();
}

fn csv_processing_example() {
    println!("6. CSV Data Processing");
    println!("------------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct CsvRecord {
        id: u32,
        name: String,
        email: String,
        age: u8,
        active: bool,
        registered: String,
    }
    
    // Simulate CSV data as JSON array
    let csv_data_json = r#"
    [
        {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "age": 30,
            "active": true,
            "registered": "2023-01-15"
        },
        {
            "id": 2,
            "name": "Jane Smith",
            "email": "jane@example.com",
            "age": 25,
            "active": false,
            "registered": "2023-02-20"
        },
        {
            "id": 3,
            "name": "Bob Johnson",
            "email": "bob@example.com",
            "age": 35,
            "active": true,
            "registered": "2023-03-10"
        }
    ]
    "#;
    
    // Parse CSV data
    match serde_json::from_str::<Vec<CsvRecord>>(csv_data_json) {
        Ok(records) => {
            println!("Loaded {} records", records.len());
            
            // Process records
            for record in &records {
                println!("{}: {} ({}) - Active: {}", 
                         record.id, record.name, record.email, record.active);
            }
            
            // Filter active users
            let active_users: Vec<_> = records.iter()
                .filter(|r| r.active)
                .collect();
            
            println!("Active users: {}", active_users.len());
            
            // Calculate average age
            let avg_age = records.iter()
                .map(|r| r.age as f64)
                .sum::<f64>() / records.len() as f64;
            
            println!("Average age: {:.1}", avg_age);
            
            // Convert back to CSV format (simplified)
            let csv_output = records.iter()
                .map(|r| format!("{},{},{},{},{},{}", 
                                r.id, r.name, r.email, r.age, r.active, r.registered))
                .collect::<Vec<_>>()
                .join("\n");
            
            println!("CSV output:\n{}", csv_output);
        }
        Err(e) => println!("Failed to parse CSV data: {}", e),
    }
    
    println!();
}

// Example of real-time data processing
pub fn real_time_processing_example() {
    println!("7. Real-time Data Processing");
    println!("------------------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct SensorReading {
        sensor_id: String,
        timestamp: chrono::DateTime<chrono::Utc>,
        temperature: f64,
        humidity: f64,
        pressure: f64,
    }
    
    #[derive(Debug, Serialize, Deserialize)]
    struct ProcessedData {
        sensor_id: String,
        period_start: chrono::DateTime<chrono::Utc>,
        period_end: chrono::DateTime<chrono::Utc>,
        avg_temperature: f64,
        avg_humidity: f64,
        avg_pressure: f64,
        reading_count: u32,
    }
    
    // Simulate incoming sensor data
    let sensor_data = vec![
        SensorReading {
            sensor_id: "temp-001".to_string(),
            timestamp: chrono::Utc::now(),
            temperature: 23.5,
            humidity: 65.2,
            pressure: 1013.25,
        },
        SensorReading {
            sensor_id: "temp-001".to_string(),
            timestamp: chrono::Utc::now() + chrono::Duration::minutes(5),
            temperature: 23.8,
            humidity: 64.9,
            pressure: 1013.30,
        },
        SensorReading {
            sensor_id: "temp-001".to_string(),
            timestamp: chrono::Utc::now() + chrono::Duration::minutes(10),
            temperature: 24.1,
            humidity: 65.5,
            pressure: 1013.20,
        },
    ];
    
    // Process sensor data
    if !sensor_data.is_empty() {
        let readings = sensor_data.len();
        let avg_temp = sensor_data.iter().map(|r| r.temperature).sum::<f64>() / readings as f64;
        let avg_humidity = sensor_data.iter().map(|r| r.humidity).sum::<f64>() / readings as f64;
        let avg_pressure = sensor_data.iter().map(|r| r.pressure).sum::<f64>() / readings as f64;
        
        let processed = ProcessedData {
            sensor_id: sensor_data[0].sensor_id.clone(),
            period_start: sensor_data[0].timestamp,
            period_end: sensor_data[readings - 1].timestamp,
            avg_temperature: avg_temp,
            avg_humidity: avg_humidity,
            avg_pressure: avg_pressure,
            reading_count: readings as u32,
        };
        
        // Serialize processed data
        let json = serde_json::to_string_pretty(&processed).unwrap();
        println!("Processed sensor data:\n{}", json);
    }
    
    println!();
}

// Example of cache serialization
pub fn cache_serialization_example() {
    println!("8. Cache Serialization");
    println!("------------------------");
    
    #[derive(Debug, Serialize, Deserialize)]
    struct CacheEntry<T> {
        key: String,
        value: T,
        created_at: chrono::DateTime<chrono::Utc>,
        expires_at: chrono::DateTime<chrono::Utc>,
        access_count: u32,
    }
    
    // Create cache entries
    let user_cache = CacheEntry {
        key: "user:123".to_string(),
        value: User {
            id: uuid::Uuid::new_v4(),
            username: "cached_user".to_string(),
            email: "cached@example.com".to_string(),
            profile: crate::models::UserProfile {
                first_name: "Cached".to_string(),
                last_name: "User".to_string(),
                bio: None,
                avatar_url: None,
                birth_date: None,
            },
            settings: crate::models::UserSettings {
                theme: "light".to_string(),
                language: "en".to_string(),
                notifications: crate::models::NotificationSettings {
                    email: true,
                    push: true,
                    sms: false,
                    marketing: false,
                },
                privacy: crate::models::PrivacySettings {
                    profile_public: true,
                    show_email: false,
                    show_activity: true,
                },
            },
            created_at: chrono::Utc::now(),
            last_login: Some(chrono::Utc::now()),
        },
        created_at: chrono::Utc::now(),
        expires_at: chrono::Utc::now() + chrono::Duration::hours(1),
        access_count: 5,
    };
    
    // Serialize cache entry
    let serialized = serde_json::to_string(&user_cache).unwrap();
    println!("Cache entry size: {} bytes", serialized.len());
    
    // Deserialize cache entry
    let deserialized: CacheEntry<User> = serde_json::from_str(&serialized).unwrap();
    println!("Deserialized cache entry: {} (accessed {} times)", 
             deserialized.key, deserialized.access_count);
    
    println!();
}