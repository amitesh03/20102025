fn main() {
    println!("=== Functions ===");
    
    // Calling functions
    println!("Calling another function:");
    another_function();
    
    // Function with parameters
    print_number(5);
    print_labeled_measurement(5, 'h');
    
    // Expressions vs Statements
    let y = {
        let x = 3;
        x + 1 // Expression (no semicolon)
    };
    
    println!("The value of y is: {}", y);
    
    // Functions with return values
    let x = five();
    println!("The value of x is: {}", x);
    
    let sum = add(1, 2);
    println!("The sum of 1 and 2 is: {}", sum);
    
    // Function pointers
    let operation = add;
    let result = operation(5, 3);
    println!("Using function pointer: {}", result);
}

fn another_function() {
    println!("Another function.");
}

fn print_number(x: i32) {
    println!("The value of x is: {}", x);
}

fn print_labeled_measurement(value: i32, unit_label: char) {
    println!("The measurement is: {}{}", value, unit_label);
}

fn five() -> i32 {
    5 // This is an expression that returns 5
}

fn add(a: i32, b: i32) -> i32 {
    a + b // Expression that returns the sum
}