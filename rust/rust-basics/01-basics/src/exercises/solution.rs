// Solution to the Basics Exercise

fn main() {
    println!("=== Basics Exercise Solution ===");
    
    // Exercise 1: Fix the variable declarations
    let mut x = 5; // Added mut to make x mutable
    println!("The value of x is: {}", x);
    x = 6;
    println!("Now the value of x is: {}", x);
    
    // Exercise 2: Fix the type annotations
    let y = "Hello"; // Removed incorrect type annotation
    println!("The value of y is: {}", y);
    
    // Exercise 3: Fix the function call
    let result = add_numbers(3, 4);
    println!("The result is: {}", result);
    
    // Exercise 4: Fix the tuple access
    let person = ("Alice", 30);
    let name = person.0; // Corrected to get the name (index 0)
    let age = person.1;  // Corrected to get the age (index 1)
    println!("Name: {}, Age: {}", name, age);
    
    // Exercise 5: Fix the array
    let numbers = [1, 2, 3, 4, 5]; // Added 2 more elements
    println!("The fifth element is: {}", numbers[4]); // Corrected comment and accessed last element
}

// Fixed the function implementation with proper type annotations
fn add_numbers(a: i32, b: i32) -> i32 {
    return a + b;
}