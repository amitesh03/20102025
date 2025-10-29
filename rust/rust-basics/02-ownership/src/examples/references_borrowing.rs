fn main() {
    println!("=== References and Borrowing ===");
    
    // References allow you to use a value without taking ownership
    let s1 = String::from("hello");
    
    let len = calculate_length(&s1); // Pass a reference to s1
    
    println!("The length of '{}' is {}.", s1, len);
    // s1 is still valid because we only borrowed it
    
    // Mutable references
    let mut s = String::from("hello");
    change(&mut s);
    println!("After change: {}", s);
    
    // You can only have one mutable reference to a particular piece of data
    // in a particular scope. This prevents data races.
    
    let mut s = String::from("hello");
    
    let r1 = &s; // OK
    let r2 = &s; // OK
    println!("r1: {}, r2: {}", r1, r2);
    // r1 and r2 go out of scope here
    
    let r3 = &mut s; // OK
    println!("r3: {}", r3);
    
    // Dangling references
    // let reference_to_nothing = dangle(); // This would cause a compile error
    let valid_reference = no_dangle();
    println!("Valid reference: {}", valid_reference);
    
    // Slice references
    let mut s = String::from("hello world");
    
    let word = first_word(&s);
    println!("First word: {}", word);
    
    s.clear(); // This empties the String, making it ""
    
    // word still contains the value 5, but there's no more string to use it with
    // word is now invalid! This is why lifetimes are important
    
    // String slices
    let s = String::from("hello world");
    
    let hello = &s[0..5];
    let world = &s[6..11];
    
    println!("hello: {}, world: {}", hello, world);
    
    // Array slices
    let a = [1, 2, 3, 4, 5];
    
    let slice = &a[1..3];
    println!("Array slice: {:?}", slice);
}

fn calculate_length(s: &String) -> usize {
    s.len()
} // s goes out of scope, but since it doesn't own what it refers to, nothing happens

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}

// This function would cause a compile error because it returns a reference to a local variable
/*
fn dangle() -> &String {
    let s = String::from("hello");
    &s // returns a reference to s
} // s goes out of scope and is dropped. Its memory goes away.
*/

// This is fine because it returns the String itself
fn no_dangle() -> String {
    let s = String::from("hello");
    s // returns ownership of s
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