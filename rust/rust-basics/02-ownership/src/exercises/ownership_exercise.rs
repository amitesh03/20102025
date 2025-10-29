// Exercise: Ownership and Borrowing
//
// Fix the compilation errors in this file by making the appropriate changes.
// Don't change the logic, just fix the ownership and borrowing issues.

fn main() {
    println!("=== Ownership Exercise ===");
    
    // Exercise 1: Fix the ownership issue
    let s1 = String::from("hello");
    let s2 = s1;
    println!("s1: {}, s2: {}", s1, s2);
    
    // Exercise 2: Fix the function call
    let s3 = String::from("world");
    let len = get_length(s3);
    println!("Length of '{}': {}", s3, len);
    
    // Exercise 3: Fix the mutable reference issue
    let mut s4 = String::from("rust");
    let r1 = &mut s4;
    let r2 = &mut s4;
    println!("r1: {}, r2: {}", r1, r2);
    
    // Exercise 4: Fix the string slice issue
    let s5 = String::from("hello world");
    let word = first_word(&s5);
    s5.clear();
    println!("First word: {}", word);
    
    // Exercise 5: Fix the dangling reference
    let reference = get_reference();
    println!("Reference: {}", reference);
}

// Fix the function signature to avoid taking ownership
fn get_length(s: String) -> usize {
    s.len()
}

// Fix the function to return a valid reference
fn get_reference() -> &String {
    let s = String::from("reference");
    &s
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