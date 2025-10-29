// Exercise: Error Handling
//
// Fix the compilation errors in this file by making the appropriate changes.
// Don't change the logic, just fix the syntax and error handling issues.

fn divide(numerator: f64, denominator: f64) -> Result<f64, String> {
    if denominator == 0.0 {
        Err("Cannot divide by zero")
    } else {
        Ok(numerator / denominator)
    }
}

fn find_first_even(numbers: &[i32]) -> Option<i32> {
    for &num in numbers {
        if num % 2 == 0 {
            return Some(num);
        }
    }
    None
}

fn main() {
    println!("=== Error Handling Exercise ===");
    
    // Exercise 1: Fix the Result handling
    let result = divide(10.0, 2.0);
    match result {
        Ok(value) => println!("Result: {}", value),
        Err(e) => println!("Error: {}", e),
    }
    
    // Exercise 2: Fix the unwrap usage
    let result = divide(10.0, 2.0);
    println!("Unwrapped: {}", result.unwrap());
    
    // Exercise 3: Fix the Option handling
    let numbers = vec![1, 3, 5, 7, 9];
    let first_even = find_first_even(&numbers);
    match first_even {
        Some(even) => println!("First even: {}", even),
        None => println!("No even numbers"),
    }
    
    // Exercise 4: Fix the map usage
    let numbers = vec![1, 3, 4, 7, 9];
    let doubled_even = find_first_even(&numbers).map(|n| n * 2);
    println!("Doubled even: {:?}", doubled_even);
    
    // Exercise 5: Fix the error propagation
    fn compute() -> Result<f64, String> {
        let result1 = divide(10.0, 2.0)?;
        let result2 = divide(result1, 2.0)?;
        Ok(result2)
    }
    
    match compute() {
        Ok(value) => println!("Computed: {}", value),
        Err(e) => println!("Error: {}", e),
    }
}