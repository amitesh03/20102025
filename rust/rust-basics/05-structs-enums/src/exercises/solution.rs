// Solution to the Structs and Enums Exercise

struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
    
    fn can_hold(&self, other: &Rectangle) -> bool { // Changed to take a reference
        self.width > other.width && self.height > other.height
    }
    
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            height: size,
        }
    }
}

enum TrafficLight {
    Red,
    Yellow,
    Green,
}

impl TrafficLight {
    fn duration(&self) -> u8 {
        match self {
            TrafficLight::Red => 30,
            TrafficLight::Yellow => 3,
            TrafficLight::Green => 45,
        }
    }
}

fn main() {
    println!("=== Structs and Enums Exercise Solution ===");
    
    // Exercise 1: Fix the struct instantiation
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };
    
    println!("Area: {}", rect1.area());
    
    // Exercise 2: Fix the method call
    let rect2 = Rectangle {
        width: 10,
        height: 40,
    };
    let rect3 = Rectangle {
        width: 60,
        height: 45,
    };
    
    println!("Can rect1 hold rect2? {}", rect1.can_hold(&rect2)); // Added & to pass reference
    println!("Can rect1 hold rect3? {}", rect1.can_hold(&rect3)); // Added & to pass reference
    
    // Exercise 3: Fix the associated function call
    let square = Rectangle::square(5); // Used :: for associated function
    println!("Square area: {}", square.area());
    
    // Exercise 4: Fix the enum usage
    let light = TrafficLight::Red;
    println!("Red light duration: {} seconds", light.duration());
    
    // Exercise 5: Fix the Option usage - using the built-in Option instead of custom one
    let some_number = Some(5u32); // Used built-in Option with explicit type
    let absent_number: Option<u32> = None; // Used built-in Option with explicit type
    
    match some_number {
        Some(num) => println!("Got number: {}", num), // Used built-in Some
        None => println!("Got nothing"), // Used built-in None
    }
    
    match absent_number {
        Some(num) => println!("Got number: {}", num), // Used built-in Some
        None => println!("Got nothing"), // Used built-in None
    }
    
    // Exercise 6: Fix the pattern matching
    let number = 5;
    
    match number {
        0 => println!("Zero"),
        1 => println!("One"),
        2 => println!("Two"),
        _ => println!("Other"),
    }
}