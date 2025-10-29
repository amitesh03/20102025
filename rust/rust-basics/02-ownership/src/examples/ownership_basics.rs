fn main() {
    println!("=== Ownership Basics ===");
    
    // String is a heap-allocated type
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved to s2
    
    // This would cause a compile error because s1 was moved:
    // println!("{}", s1);
    
    println!("s2 = {}", s2);
    
    // If we want to copy the data, we can use clone()
    let s3 = String::from("world");
    let s4 = s3.clone(); // Deep copy
    
    println!("s3 = {}, s4 = {}", s3, s4);
    
    // For types that implement the Copy trait, assignment doesn't move
    let x = 5;
    let y = x; // x is copied to y
    
    println!("x = {}, y = {}", x, y); // Both are valid
    
    // Ownership and functions
    let s = String::from("hello");
    takes_ownership(s); // s is moved to the function
                         // s is no longer valid here
    
    // This would cause a compile error:
    // println!("{}", s);
    
    let x = 5;
    makes_copy(x); // x is copied to the function
                   // x is still valid here
    
    println!("x = {}", x);
    
    // Return values and scope
    let s1 = gives_ownership(); // gives_ownership moves its return value to s1
    println!("s1 = {}", s1);
    
    let s2 = String::from("hello");
    let s3 = takes_and_gives_back(s2); // s2 is moved to takes_and_gives_back
                                       // which moves its return value to s3
    println!("s3 = {}", s3);
}

fn takes_ownership(some_string: String) {
    println!("Took ownership of: {}", some_string);
} // some_string goes out of scope and is dropped here

fn makes_copy(some_integer: i32) {
    println!("Made a copy of: {}", some_integer);
} // some_integer goes out of scope but nothing special happens

fn gives_ownership() -> String {
    let some_string = String::from("yours");
    some_string // return value is moved to the calling function
}

fn takes_and_gives_back(a_string: String) -> String {
    a_string // return value is moved to the calling function
}