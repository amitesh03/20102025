// Solution to the Control Flow Exercise

fn main() {
    println!("=== Control Flow Exercise Solution ===");
    
    // Exercise 1: Fix the if expression
    let number = 3;
    if number == 3 { // Changed = to == for comparison
        println!("Number is three");
    }
    
    // Exercise 2: Fix the loop to return the correct value
    let mut counter = 0;
    let result = loop {
        counter += 1;
        if counter == 5 {
            break counter; // Changed return to break to exit loop and return value
        }
    };
    println!("Result: {}", result);
    
    // Exercise 3: Fix the match expression to handle all cases
    let x = 4;
    match x {
        1 => println!("one"),
        2 => println!("two"),
        3 => println!("three"),
        _ => println!("other"), // Added catch-all arm
    }
    
    // Exercise 4: Fix the if let expression
    let some_value = Some(5);
    if let Some(x) = some_value { // Added Some() pattern to match the Option
        println!("Got value: {}", x);
    }
    
    // Exercise 5: Fix the while loop condition
    let mut number = 5;
    while number > 0 {
        println!("{}", number);
        number -= 1; // Changed to compound assignment operator
    }
    
    // Exercise 6: Fix the for loop to iterate correctly
    let numbers = [1, 2, 3, 4, 5];
    for i in &numbers { // Added & to create a reference to the array
        println!("Number: {}", i);
    }
    
    // Exercise 7: Fix the function to return the correct type
    let result = get_max(5, 10);
    println!("Max value: {}", result);
}

fn get_max(a: i32, b: i32) -> i32 { // Added type annotations and return type
    if a > b {
        a // Removed return statement, using implicit return
    } else {
        b // Removed return statement, using implicit return
    }
}