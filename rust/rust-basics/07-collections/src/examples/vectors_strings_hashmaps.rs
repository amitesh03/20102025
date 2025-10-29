fn main() {
    println!("=== Vectors, Strings, and Hash Maps ===");
    
    // VECTORS
    println!("\n--- Vectors ---");
    
    // Creating a new vector
    let v: Vec<i32> = Vec::new();
    println!("Empty vector: {:?}", v);
    
    // Using vec! macro
    let v = vec![1, 2, 3, 4, 5];
    println!("Vector with values: {:?}", v);
    
    // Updating a vector
    let mut v = Vec::new();
    v.push(5);
    v.push(6);
    v.push(7);
    v.push(8);
    println!("Updated vector: {:?}", v);
    
    // Reading elements of a vector
    let v = vec![1, 2, 3, 4, 5];
    
    // Using indexing
    let third: &i32 = &v[2];
    println!("The third element is {}", third);
    
    // Using get method
    let third: Option<&i32> = v.get(2);
    match third {
        Some(third) => println!("The third element is {}", third),
        None => println!("There is no third element."),
    }
    
    // Iterating over a vector
    let v = vec![100, 32, 57];
    for i in &v {
        println!("{}", i);
    }
    
    // Modifying elements while iterating
    let mut v = vec![100, 32, 57];
    for i in &mut v {
        *i += 50;
    }
    println!("Modified vector: {:?}", v);
    
    // Using an enum to store multiple types
    #[derive(Debug)]
    enum SpreadsheetCell {
        Int(i32),
        Float(f64),
        Text(String),
    }
    
    let row = vec![
        SpreadsheetCell::Int(3),
        SpreadsheetCell::Text(String::from("blue")),
        SpreadsheetCell::Float(10.12),
    ];
    
    println!("Spreadsheet row: {:?}", row);
    
    // STRINGS
    println!("\n--- Strings ---");
    
    // Creating new strings
    let mut s = String::new();
    s.push_str("hello");
    println!("String: {}", s);
    
    // Using to_string method
    let data = "initial contents";
    let s = data.to_string();
    println!("String from &str: {}", s);
    
    // Using String::from
    let s = String::from("initial contents");
    println!("String from from: {}", s);
    
    // Updating strings
    let mut s = String::from("foo");
    s.push_str("bar");
    println!("Pushed string: {}", s);
    
    let mut s1 = String::from("foo");
    let s2 = "bar";
    s1.push_str(s2);
    println!("Pushed string slice: {}", s1);
    
    // Pushing a single character
    let mut s = String::from("lo");
    s.push('l');
    println!("Pushed char: {}", s);
    
    // Concatenation with + operator
    let s1 = String::from("Hello, ");
    let s2 = String::from("world!");
    let s3 = s1 + &s2; // s1 has been moved here and can no longer be used
    println!("Concatenated: {}", s3);
    
    // Using format! macro
    let s1 = String::from("tic");
    let s2 = String::from("tac");
    let s3 = String::from("toe");
    let s = format!("{}-{}-{}", s1, s2, s3);
    println!("Formatted: {}", s);
    
    // Slicing strings
    let hello = "Здравствуйте";
    let s = &hello[0..4];
    println!("Slice: {}", s);
    
    // Iterating over strings
    for c in "नमस्ते".chars() {
        println!("{}", c);
    }
    
    for b in "नमस्ते".bytes() {
        println!("{}", b);
    }
    
    // HASH MAPS
    println!("\n--- Hash Maps ---");
    
    use std::collections::HashMap;
    
    // Creating a new hash map
    let scores = HashMap::new();
    println!("Empty hash map: {:?}", scores);
    
    // Inserting values
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);
    println!("Hash map: {:?}", scores);
    
    // Accessing values in a hash map
    let team_name = String::from("Blue");
    let score = scores.get(&team_name);
    match score {
        Some(score) => println!("Blue team score: {}", score),
        None => println!("Blue team not found"),
    }
    
    // Iterating over a hash map
    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }
    
    // Overwriting a value
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Blue"), 25);
    println!("Updated hash map: {:?}", scores);
    
    // Only inserting if the key has no value
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    
    scores.entry(String::from("Yellow")).or_insert(50);
    scores.entry(String::from("Blue")).or_insert(50);
    println!("Conditional insert: {:?}", scores);
    
    // Updating a value based on the old value
    let text = "hello world wonderful world";
    let mut map = HashMap::new();
    
    for word in text.split_whitespace() {
        let count = map.entry(word).or_insert(0);
        *count += 1;
    }
    
    println!("Word count: {:?}", map);
}