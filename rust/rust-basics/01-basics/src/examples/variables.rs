fn main() {
    println!("=== Variables and Mutability ===");
    
    // Immutable variable (default)
    let x = 5;
    println!("The value of x is: {}", x);
    
    // This would cause a compile error because x is immutable:
    // x = 6;
    
    // Mutable variable
    let mut y = 10;
    println!("The value of y is: {}", y);
    y = 15;
    println!("Now the value of y is: {}", y);
    
    // Constants
    const MAX_POINTS: u32 = 100_000;
    println!("The constant MAX_POINTS is: {}", MAX_POINTS);
    
    // Shadowing
    let z = 5;
    let z = z + 1;
    {
        let z = z * 2;
        println!("The value of z in the inner scope is: {}", z);
    }
    println!("The value of z is: {}", z);
    
    // Shadowing with different type
    let spaces = "   ";
    println!("spaces as string: '{}'", spaces);
    let spaces = spaces.len();
    println!("spaces as number: {}", spaces);
}