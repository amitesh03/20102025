fn main() {
    // I'm a comment!
    println!("=== Comments ===");
    
    // This is also a comment
    let x = 5; // This comment is at the end of a line
    
    /*
     * This is a block comment
     * that spans multiple lines
     */
    
    let y = 10; /* This is also a block comment */
    
    // Rust has a special kind of comment for documentation:
    // /// Generate library documentation for the following item
    
    /*
     * Block comments can also be nested, which is useful for commenting out
     * large blocks of code that already contain block comments.
     */
    
    println!("The value of x is: {}", x);
    println!("The value of y is: {}", y);
    
    // Example of doc comments (these would appear in generated documentation)
    
    /// Adds two numbers together
    ///
    /// # Examples
    ///
    /// ```
    /// let result = add(2, 3);
    /// assert_eq!(result, 5);
    /// ```
    ///
    /// # Arguments
    ///
    /// * `a` - The first number
    /// * `b` - The second number
    ///
    /// # Returns
    ///
    /// The sum of `a` and `b`
    fn add(a: i32, b: i32) -> i32 {
        a + b
    }
    
    let result = add(2, 3);
    println!("The result of add(2, 3) is: {}", result);
}