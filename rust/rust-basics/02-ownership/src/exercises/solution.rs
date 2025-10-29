// Solution to the Ownership Exercise

fn main() {
    println!("=== Ownership Exercise Solution ===");
    
    // Exercise 1: Fix the ownership issue
    let s1 = String::from("hello");
    let s2 = s1.clone(); // Use clone() to create a deep copy
    println!("s1: {}, s2: {}", s1, s2);
    
    // Exercise 2: Fix the function call
    let s3 = String::from("world");
    let len = get_length(&s3); // Pass a reference instead of taking ownership
    println!("Length of '{}': {}", s3, len);
    
    // Exercise 3: Fix the mutable reference issue
    let mut s4 = String::from("rust");
    {
        let r1 = &mut s4;
        println!("r1: {}", r1);
    } // r1 goes out of scope here
    
    let r2 = &mut s4; // Now we can create a new mutable reference
    println!("r2: {}", r2);
    
    // Exercise 4: Fix the string slice issue
    let s5 = String::from("hello world");
    let word = first_word(&s5);
    println!("First word: {}", word);
    // Move s5.clear() after we're done using the slice
    s5.clear();
    println!("String after clearing: '{}'", s5);
    
    // Exercise 5: Fix the dangling reference
    let reference = get_reference();
    println!("Reference: {}", reference);
}

// Fixed the function signature to take a reference instead of ownership
fn get_length(s: &String) -> usize {
    s.len()
}

// Fixed the function to return the String itself, not a reference
fn get_reference() -> String {
    let s = String::from("reference");
    s // Return the String, transferring ownership
}

fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();
    
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    
    &s[..]
}