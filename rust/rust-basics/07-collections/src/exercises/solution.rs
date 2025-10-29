// Solution to the Collections Exercise

fn main() {
    println!("=== Collections Exercise Solution ===");
    
    // Exercise 1: Fix the vector operations - this is already correct
    let mut v = Vec::new();
    v.push(5);
    v.push(6);
    v.push(7);
    v.push(8);
    
    let third = v[2];
    println!("The third element is {}", third);
    
    // Exercise 2: Fix the string operations - this is already correct
    let mut s = String::from("hello");
    s.push_str(" world");
    s.push('!');
    println!("String: {}", s);
    
    let s1 = String::from("Hello, ");
    let s2 = String::from("world!");
    let s3 = s1 + &s2;
    println!("Concatenated: {}", s3);
    
    // Exercise 3: Fix the hash map operations
    use std::collections::HashMap;
    
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10); // Convert &str to String
    scores.insert(String::from("Yellow"), 50); // Convert &str to String
    
    let score = scores.get(&String::from("Blue")); // Use String for key lookup
    println!("Blue team score: {:?}", score); // Use {:?} to print Option<i32>
    
    // Exercise 4: Fix the iteration - this is already correct
    let v = vec![1, 2, 3, 4, 5];
    for i in &v {
        println!("{}", i);
    }
    
    // Exercise 5: Fix the word count - this is already correct
    let text = "hello world hello world";
    let mut map = HashMap::new();
    
    for word in text.split_whitespace() {
        let count = map.entry(word).or_insert(0);
        *count += 1;
    }
    
    println!("Word count: {:?}", map);
    
    // Exercise 6: Fix the vector of different types
    #[derive(Debug)]
    enum SpreadsheetCell {
        Int(i32),
        Float(f64),
        Text(String),
    }
    
    let row = vec![
        SpreadsheetCell::Int(3),
        SpreadsheetCell::Text(String::from("blue")), // Convert &str to String
        SpreadsheetCell::Float(10.12),
    ];
    
    println!("Spreadsheet row: {:?}", row);
}