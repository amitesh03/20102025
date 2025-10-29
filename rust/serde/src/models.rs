use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use std::collections::HashMap;
use uuid::Uuid;

// Basic struct for serialization examples
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Person {
    pub name: String,
    pub age: u32,
    pub email: String,
    pub address: Option<Address>,
    pub hobbies: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Address {
    pub street: String,
    pub city: String,
    pub country: String,
    pub postal_code: String,
}

// Enum for serialization examples
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Status {
    Active,
    Inactive,
    Pending,
    Suspended { reason: String, until: DateTime<Utc> },
}

// Struct with custom serialization attributes
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Product {
    #[serde(rename = "product_id")]
    pub id: Uuid,
    #[serde(rename = "product_name")]
    pub name: String,
    #[serde(rename = "product_price")]
    pub price: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub discount: Option<f64>,
    #[serde(skip)]
    pub internal_id: u32,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(with = "custom_date_format")]
    pub created_at: DateTime<Utc>,
}

// Custom date format module
pub mod custom_date_format {
    use serde::{self, Deserialize, Serializer, Deserializer};
    use chrono::{DateTime, Utc, TimeZone};
    
    const FORMAT: &str = "%Y-%m-%d %H:%M:%S";
    
    pub fn serialize<S>(date: &DateTime<Utc>, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let s = date.format(FORMAT).to_string();
        serializer.serialize_str(&s)
    }
    
    pub fn deserialize<'de, D>(deserializer: D) -> Result<DateTime<Utc>, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        Utc.datetime_from_str(&s, FORMAT).map_err(serde::de::Error::custom)
    }
}

// Struct with custom serialization
#[derive(Debug, Clone)]
pub struct CustomData {
    pub values: Vec<i32>,
    pub metadata: HashMap<String, String>,
}

// Struct for advanced features
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<ApiError>,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ApiError {
    pub code: u32,
    pub message: String,
    pub details: Option<Vec<String>>,
}

// Struct for performance testing
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct LargeData {
    pub id: Uuid,
    pub records: Vec<DataRecord>,
    pub metadata: HashMap<String, String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct DataRecord {
    pub id: Uuid,
    pub name: String,
    pub value: f64,
    pub tags: Vec<String>,
    pub active: bool,
}

// Struct for real-world examples
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub profile: UserProfile,
    pub settings: UserSettings,
    pub created_at: DateTime<Utc>,
    pub last_login: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct UserProfile {
    pub first_name: String,
    pub last_name: String,
    pub bio: Option<String>,
    pub avatar_url: Option<String>,
    pub birth_date: Option<chrono::NaiveDate>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct UserSettings {
    pub theme: String,
    pub language: String,
    pub notifications: NotificationSettings,
    pub privacy: PrivacySettings,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct NotificationSettings {
    pub email: bool,
    pub push: bool,
    pub sms: bool,
    pub marketing: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PrivacySettings {
    pub profile_public: bool,
    pub show_email: bool,
    pub show_activity: bool,
}

// Struct for configuration example
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Config {
    pub database: DatabaseConfig,
    pub server: ServerConfig,
    pub logging: LoggingConfig,
    pub features: FeatureFlags,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct DatabaseConfig {
    pub url: String,
    pub max_connections: u32,
    pub timeout_seconds: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
    pub workers: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct LoggingConfig {
    pub level: String,
    pub file: Option<String>,
    pub format: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct FeatureFlags {
    pub new_ui: bool,
    pub beta_features: bool,
    pub debug_mode: bool,
}

// Struct for flattening example
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Order {
    pub id: Uuid,
    pub customer_id: Uuid,
    #[serde(flatten)]
    pub items: OrderItems,
    #[serde(flatten)]
    pub pricing: OrderPricing,
    pub status: Status,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct OrderItems {
    pub items: Vec<OrderItem>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct OrderItem {
    pub product_id: Uuid,
    pub quantity: u32,
    pub price: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct OrderPricing {
    pub subtotal: f64,
    pub tax: f64,
    pub shipping: f64,
    pub total: f64,
}

// Struct for tagging example
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct TaggedData {
    #[serde(tag = "type")]
    pub data: DataType,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type", content = "value")]
pub enum DataType {
    Text(String),
    Number(f64),
    Boolean(bool),
    Array(Vec<DataType>),
    Object(HashMap<String, DataType>),
}

// Struct for remote derive example
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(remote = "Self")]
pub struct SelfReferencing {
    pub id: Uuid,
    pub name: String,
    #[serde(skip)]
    pub parent: Option<Box<SelfReferencing>>,
    pub children: Vec<SelfReferencing>,
}

impl SelfReferencing {
    pub fn new(id: Uuid, name: String) -> Self {
        Self {
            id,
            name,
            parent: None,
            children: Vec::new(),
        }
    }
    
    pub fn add_child(&mut self, child: SelfReferencing) {
        self.children.push(child);
    }
}