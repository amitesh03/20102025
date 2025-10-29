// Exercise: Collections
//
// Fix the compilation errors in this file by making the appropriate changes.
// Don't change the logic, just fix the syntax and collection issues.

fn main() {
    println!("=== Collections Exercise ===");
    
    // Exercise 1: Fix the vector operations
    let mut v = Vec::new();
    v.push(5);
    v.push(6);
    v.push(7);
    v.push(8);
    
    let third = v[2];
    println!("The third element is {}", third);
    
    // Exercise 2: Fix the string operations
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
    scores.insert("Blue", 10);
    scores.insert("Yellow", 50);
    
    let score = scores.get("Blue");
    println!("Blue team score: {}", score);
    
    // Exercise 4: Fix the iteration
    let v = vec![1, 2, 3, 4, 5];
    for i in &v {
        println!("{}", i);
    }
    
    // Exercise 5: Fix the word count
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
        SpreadsheetCell::Text("blue"),
        SpreadsheetCell::Float(10.12),
    ];
    
    println!("Spreadsheet row: {:?}", row);
}