// Exercise: Functions and Modules
//
// Fix the compilation errors in this file by making the appropriate changes.
// Don't change the logic, just fix the syntax and module issues.

mod calculator {
    pub fn add(a, b) {
        a + b
    }
    
    pub fn multiply(a, b) {
        a * b
    }
    
    fn divide(a, b) {
        a / b
    }
}

fn main() {
    println!("=== Functions and Modules Exercise ===");
    
    // Exercise 1: Fix the function call
    let result = calculator::add(5, 3);
    println!("5 + 3 = {}", result);
    
    // Exercise 2: Fix the closure
    let numbers = vec![1, 2, 3, 4, 5];
    let doubled = numbers.iter().map(|x| x * 2);
    println!("Doubled numbers: {:?}", doubled);
    
    // Exercise 3: Fix the function pointer usage
    fn apply_operation(f, a, b) {
        f(a, b)
    }
    
    let result = apply_operation(calculator::multiply, 4, 5);
    println!("4 * 5 = {}", result);
    
    // Exercise 4: Fix the module path
    let division_result = calculator::divide(10, 2);
    println!("10 / 2 = {}", division_result);
    
    // Exercise 5: Fix the closure that captures environment
    let x = 10;
    let add_x = |y| y + x;
    println!("5 + x = {}", add_x(5));
    
    // Exercise 6: Fix the function that returns a closure
    fn make_adder(n) {
        |x| x + n
    }
    
    let add_5 = make_adder(5);
    println!("3 + 5 = {}", add_5(3));
}