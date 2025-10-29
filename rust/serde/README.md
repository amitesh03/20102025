# Serde Examples

This directory contains comprehensive examples of using Serde, Rust's premier framework for serializing and deserializing data structures efficiently and generically.

## Features Demonstrated

### Basic Serialization
- Simple struct serialization and deserialization
- Enum serialization with different variants
- Collection types (Vec, HashMap, Option)
- Nested data structures

### Custom Serialization
- Field renaming and attributes
- Custom serialization for external types
- Conditional serialization
- Default values
- Flatten and tag attributes

### Data Formats
- JSON (most common)
- YAML (configuration files)
- TOML (configuration files)
- CBOR (binary format)
- RON (Rusty Object Notation)
- Bincode (compact binary format)

### Advanced Features
- Generic types
- Tagged enums
- Dynamic typing with Value
- Custom deserialization with validation
- Recursive data structures
- Context-aware serialization
- Zero-copy deserialization

### Error Handling
- Basic error handling
- Custom error types
- Graceful degradation
- Error recovery
- Validation errors
- Partial deserialization

### Performance
- Serialization performance comparison
- Deserialization performance
- Memory usage comparison
- Large dataset handling
- Streaming serialization
- Optimization techniques

### Real-World Examples
- API response handling
- Configuration file parsing
- Database record serialization
- Event/message serialization
- Webhook payload handling
- CSV data processing

## Getting Started

1. Install Rust:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. Clone this repository and navigate to the serde directory:
```bash
cd serde
```

3. Run the examples:
```bash
cargo run
```

## Project Structure

```
serde/
├── src/
│   ├── main.rs              # Main entry point
│   ├── models.rs            # Data models used in examples
│   └── examples/            # Example modules
│       ├── mod.rs
│       ├── basic_serialization.rs
│       ├── custom_serialization.rs
│       ├── data_formats.rs
│       ├── advanced_features.rs
│       ├── error_handling.rs
│       ├── performance.rs
│       └── real_world_examples.rs
├── Cargo.toml               # Dependencies
└── README.md                # This file
```

## Dependencies

Key dependencies used in this project:

- `serde` - Core serialization framework
- `serde_json` - JSON serialization/deserialization
- `serde_yaml` - YAML support
- `serde_cbor` - CBOR binary format support
- `toml` - TOML configuration file support
- `ron` - RON format support
- `bincode` - Compact binary format support
- `chrono` - Date/time handling with Serde support
- `uuid` - UUID handling with Serde support

## Example Categories

### 1. Basic Serialization
Learn the fundamentals of Serde:
- Deriving Serialize and Deserialize traits
- Simple struct and enum handling
- Working with collections

### 2. Custom Serialization
Advanced customization techniques:
- Field attributes for renaming and control
- Custom serialization logic
- Conditional serialization based on values

### 3. Data Formats
Different serialization formats:
- JSON for web APIs
- YAML/TOML for configuration
- Binary formats for performance

### 4. Advanced Features
Complex serialization scenarios:
- Generic types with serialization bounds
- Tagged enums for discriminated unions
- Dynamic typing with serde_json::Value

### 5. Error Handling
Robust error management:
- Handling malformed data
- Custom validation during deserialization
- Graceful fallbacks

### 6. Performance
Optimizing serialization:
- Format performance comparison
- Memory usage optimization
- Large dataset handling

### 7. Real-World Examples
Practical applications:
- API response handling
- Configuration management
- Event processing

## Common Patterns

### API Response Pattern
```rust
#[derive(Serialize, Deserialize)]
struct ApiResponse<T> {
    success: bool,
    data: Option<T>,
    error: Option<String>,
    timestamp: DateTime<Utc>,
}
```

### Configuration Pattern
```rust
#[derive(Serialize, Deserialize)]
struct Config {
    database: DatabaseConfig,
    server: ServerConfig,
    #[serde(default)]
    debug: bool,
}
```

### Validation Pattern
```rust
fn validate_email<'de, D>(deserializer: D) -> Result<String, D::Error>
where
    D: Deserializer<'de>,
{
    let email = String::deserialize(deserializer)?;
    if !email.contains('@') {
        return Err(serde::de::Error::custom("Invalid email"));
    }
    Ok(email)
}
```

## Performance Tips

1. **Choose the right format**:
   - JSON for readability and web compatibility
   - Bincode for performance and size
   - CBOR for balance between size and features

2. **Optimize data structures**:
   - Use appropriate numeric types
   - Consider binary data for large blobs
   - Minimize string allocations

3. **Handle large datasets**:
   - Use streaming for very large data
   - Consider partial deserialization
   - Profile memory usage

## Best Practices

1. **Error Handling**: Always handle serialization errors gracefully
2. **Validation**: Validate data during deserialization
3. **Versioning**: Design for backward/forward compatibility
4. **Documentation**: Document custom serialization logic
5. **Testing**: Test with both valid and invalid data

## Additional Resources

- [Serde Documentation](https://serde.rs/)
- [Serde JSON Documentation](https://docs.rs/serde_json/)
- [Serbe Cheat Sheet](https://serde.rs/cheatsheet.html)
- [Rust Book](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)