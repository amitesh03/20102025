// Solution to the Functions and Modules Exercise

mod calculator {
    pub fn add(a: i32, b: i32) -> i32 { // Added type annotations and return type
        a + b
    }
    
    pub fn multiply(a: i32, b: i32) -> i32 { // Added type annotations and return type
        a * b
    }
    
    pub fn divide(a: i32, b: i32) -> i32 { // Made public and added type annotations
        a / b
    }
}

fn main() {
    println!("=== Functions and Modules Exercise Solution ===");
    
    // Exercise 1: Fix the function call
    let result = calculator::add(5, 3);
    println!("5 + 3 = {}", result);
    
    // Exercise 2: Fix the closure
    let numbers = vec![1, 2, 3, 4, 5];
    let doubled: Vec<i32> = numbers.iter().map(|x| x * 2).collect(); // Added type annotation and collect()
    println!("Doubled numbers: {:?}", doubled);
    
    // Exercise 3: Fix the function pointer usage
    fn apply_operation<F>(f: F, a: i32, b: i32) -> i32 // Added generic type parameter and type annotations
    where
        F: Fn(i32, i32) -> i32,
    {
        f(a, b)
    }
    
    let result = apply_operation(calculator::multiply, 4, 5);
    println!("4 * 5 = {}", result);
    
    // Exercise 4: Fix the module path
    let division_result = calculator::divide(10, 2);
    println!("10 / 2 = {}", division_result);
    
    // Exercise 5: Fix the closure that captures environment
    let x = 10;
    let add_x = |y: i32| y + x; // Added type annotation for closure parameter
    println!("5 + x = {}", add_x(5));
    
    // Exercise 6: Fix the function that returns a closure
    fn make_adder(n: i32) -> impl Fn(i32) -> i32 { // Added type annotations and return type
        move |x: i32| x + n // Added move and type annotation
    }
    
    let add_5 = make_adder(5);
    println!("3 + 5 = {}", add_5(3));
}