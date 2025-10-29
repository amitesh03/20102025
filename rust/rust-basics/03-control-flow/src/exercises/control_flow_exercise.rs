// Exercise: Control Flow
//
// Fix the compilation errors in this file by making the appropriate changes.
// Don't change the logic, just fix the syntax and control flow issues.

fn main() {
    println!("=== Control Flow Exercise ===");
    
    // Exercise 1: Fix the if expression
    let number = 3;
    if number = 3 {
        println!("Number is three");
    }
    
    // Exercise 2: Fix the loop to return the correct value
    let mut counter = 0;
    let result = loop {
        counter += 1;
        if counter == 5 {
            return counter;
        }
    };
    println!("Result: {}", result);
    
    // Exercise 3: Fix the match expression to handle all cases
    let x = 4;
    match x {
        1 => println!("one"),
        2 => println!("two"),
        3 => println!("three"),
    }
    
    // Exercise 4: Fix the if let expression
    let some_value = Some(5);
    if let x = some_value {
        println!("Got value: {}", x);
    }
    
    // Exercise 5: Fix the while loop condition
    let mut number = 5;
    while number > 0 {
        println!("{}", number);
        number = number - 1;
    }
    
    // Exercise 6: Fix the for loop to iterate correctly
    let numbers = [1, 2, 3, 4, 5];
    for i in numbers {
        println!("Number: {}", i);
    }
    
    // Exercise 7: Fix the function to return the correct type
    let result = get_max(5, 10);
    println!("Max value: {}", result);
}

fn get_max(a, b) {
    if a > b {
        return a;
    } else {
        return b;
    }
}