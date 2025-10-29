// Exercise 1: Variables and Mutability
//
// Fix the compilation errors in this file by making the appropriate changes.
// Don't change the logic, just fix the syntax and type issues.

fn main() {
    println!("=== Basics Exercise ===");
    
    // Exercise 1: Fix the variable declarations
    let x = 5;
    println!("The value of x is: {}", x);
    x = 6; // This should work after your fix
    println!("Now the value of x is: {}", x);
    
    // Exercise 2: Fix the type annotations
    let y: i32 = "Hello"; // This should be a string
    println!("The value of y is: {}", y);
    
    // Exercise 3: Fix the function call
    let result = add_numbers(3, 4);
    println!("The result is: {}", result);
    
    // Exercise 4: Fix the tuple access
    let person = ("Alice", 30);
    let name = person.1; // This should get the name
    let age = person.0;  // This should get the age
    println!("Name: {}, Age: {}", name, age);
    
    // Exercise 5: Fix the array
    let numbers = [1, 2, 3]; // This array should have 5 elements
    println!("The third element is: {}", numbers[4]); // This should access the last element
}

// Add the missing function implementation
fn add_numbers(a, b) {
    return a + b;
}