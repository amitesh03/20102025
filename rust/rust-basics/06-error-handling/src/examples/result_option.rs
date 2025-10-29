fn main() {
    println!("=== Result and Option ===");
    
    // Using Result enum
    fn divide(numerator: f64, denominator: f64) -> Result<f64, String> {
        if denominator == 0.0 {
            Err(String::from("Cannot divide by zero"))
        } else {
            Ok(numerator / denominator)
        }
    }
    
    let result = divide(10.0, 2.0);
    match result {
        Ok(value) => println!("Result: {}", value),
        Err(e) => println!("Error: {}", e),
    }
    
    let result = divide(10.0, 0.0);
    match result {
        Ok(value) => println!("Result: {}", value),
        Err(e) => println!("Error: {}", e),
    }
    
    // Using Option enum
    fn find_first_even(numbers: &[i32]) -> Option<i32> {
        for &num in numbers {
            if num % 2 == 0 {
                return Some(num);
            }
        }
        None
    }
    
    let numbers = vec![1, 3, 5, 7, 9];
    match find_first_even(&numbers) {
        Some(even) => println!("First even number: {}", even),
        None => println!("No even numbers found"),
    }
    
    let numbers = vec![1, 3, 4, 7, 9];
    match find_first_even(&numbers) {
        Some(even) => println!("First even number: {}", even),
        None => println!("No even numbers found"),
    }
    
    // Chaining operations with ?
    fn read_file_content() -> Result<String, std::io::Error> {
        use std::fs::File;
        use std::io::Read;
        
        let mut file = File::open("test.txt")?;
        let mut contents = String::new();
        file.read_to_string(&mut contents)?;
        Ok(contents)
    }
    
    // Using unwrap and expect
    let result = divide(10.0, 2.0);
    println!("Unwrapped result: {}", result.unwrap());
    
    let result = divide(10.0, 0.0);
    // println!("This would panic: {}", result.unwrap());
    
    // Using expect for better error messages
    let result = divide(10.0, 2.0);
    println!("Expected result: {}", result.expect("Division should succeed"));
    
    // Using unwrap_or and unwrap_or_else
    let result = divide(10.0, 0.0);
    println!("Default value: {}", result.unwrap_or(0.0));
    
    let result = divide(10.0, 0.0);
    println!("Computed default: {}", result.unwrap_or_else(|e| {
        println!("Error occurred: {}", e);
        0.0
    }));
    
    // Option methods
    let numbers = vec![1, 3, 5, 7, 9];
    let first_even = find_first_even(&numbers);
    println!("First even or default: {}", first_even.unwrap_or(0));
    
    let numbers = vec![1, 3, 4, 7, 9];
    let first_even = find_first_even(&numbers);
    println!("First even or computed: {}", first_even.unwrap_or_else(|| {
        println!("No even number found, using default");
        0
    }));
    
    // map and and_then
    let numbers = vec![1, 3, 4, 7, 9];
    let doubled_even = find_first_even(&numbers).map(|n| n * 2);
    println!("Doubled first even: {:?}", doubled_even);
    
    let numbers = vec![1, 3, 5, 7, 9];
    let doubled_even = find_first_even(&numbers).map(|n| n * 2);
    println!("Doubled first even: {:?}", doubled_even);
    
    // Converting between Result and Option
    let result = Ok(42);
    let option = result.ok();
    println!("Result to Option: {:?}", option);
    
    let result = Err("error");
    let option = result.ok();
    println!("Result to Option: {:?}", option);
    
    let option = Some(42);
    let result = option.ok_or("error");
    println!("Option to Result: {:?}", result);
    
    let option = None;
    let result = option.ok_or("error");
    println!("Option to Result: {:?}", result);
}