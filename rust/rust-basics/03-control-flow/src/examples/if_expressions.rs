fn main() {
    println!("=== If Expressions ===");
    
    let number = 3;
    
    // Basic if statement
    if number < 5 {
        println!("condition was true");
    } else {
        println!("condition was false");
    }
    
    // Multiple conditions with else if
    let number = 6;
    
    if number % 4 == 0 {
        println!("number is divisible by 4");
    } else if number % 3 == 0 {
        println!("number is divisible by 3");
    } else if number % 2 == 0 {
        println!("number is divisible by 2");
    } else {
        println!("number is not divisible by 4, 3, or 2");
    }
    
    // Using if in a let statement
    let condition = true;
    let number = if condition { 5 } else { 6 };
    
    println!("The value of number is: {}", number);
    
    // Note: The types that can be returned from each arm must be the same
    // This would cause a compile error:
    // let number = if condition { 5 } else { "six" };
    
    // Complex conditions
    let temperature = 25;
    
    if temperature > 30 {
        println!("It's hot outside!");
    } else if temperature < 10 {
        println!("It's cold outside!");
    } else if temperature >= 20 && temperature <= 25 {
        println!("It's a perfect day!");
    } else {
        println!("It's a normal day.");
    }
    
    // Nested if statements
    let age = 18;
    let has_permission = true;
    
    if age >= 18 {
        if has_permission {
            println!("You can enter.");
        } else {
            println!("You need permission to enter.");
        }
    } else {
        println!("You are too young to enter.");
    }
}