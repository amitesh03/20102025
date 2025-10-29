fn main() {
    println!("=== Data Types ===");
    
    // Scalar Types
    
    // Integers
    let decimal = 98_222;        // Decimal
    let hex = 0xff;              // Hexadecimal
    let octal = 0o77;            // Octal
    let binary = 0b1111_0000;    // Binary
    let byte = b'A';             // Byte (u8 only)
    
    println!("Integer values:");
    println!("decimal: {}, hex: {}, octal: {}, binary: {:b}, byte: {}", 
             decimal, hex, octal, binary, byte);
    
    // Floating-point numbers
    let x = 2.0;        // f64 by default
    let y: f32 = 3.0;   // f32 explicitly
    
    println!("Floating-point numbers: {}, {}", x, y);
    
    // Boolean
    let t = true;
    let f: bool = false; // with explicit type annotation
    
    println!("Boolean values: {}, {}", t, f);
    
    // Character
    let c = 'z';
    let z: char = 'ℤ'; // with explicit type annotation
    let heart_eyed_cat = '😻';
    
    println!("Characters: {}, {}, {}", c, z, heart_eyed_cat);
    
    // Compound Types
    
    // Tuples
    let tup: (i32, f64, u8) = (500, 6.4, 1);
    let (x, y, z) = tup; // Destructuring
    
    println!("Tuple values: {}, {}, {}", x, y, z);
    
    let five_hundred = tup.0; // Access by index
    println!("First element of tuple: {}", five_hundred);
    
    // Arrays
    let a = [1, 2, 3, 4, 5];
    let months = ["January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"];
    
    let first = a[0];
    let second = a[1];
    
    println!("Array first two elements: {}, {}", first, second);
    println!("First month: {}", months[0]);
    
    // Array with type and length
    let a: [i32; 5] = [1, 2, 3, 4, 5];
    let a = [3; 5]; // Same as let a = [3, 3, 3, 3, 3];
    
    println!("Array with repeated value: {:?}", a);
}