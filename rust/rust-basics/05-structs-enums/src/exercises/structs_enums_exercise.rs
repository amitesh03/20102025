// Exercise: Structs and Enums
//
// Fix the compilation errors in this file by making the appropriate changes.
// Don't change the logic, just fix the syntax and struct/enum issues.

struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
    
    fn can_hold(&self, other: Rectangle) -> bool {
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

enum Option {
    Some(T),
    None,
}

fn main() {
    println!("=== Structs and Enums Exercise ===");
    
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
    
    println!("Can rect1 hold rect2? {}", rect1.can_hold(rect2));
    println!("Can rect1 hold rect3? {}", rect1.can_hold(rect3));
    
    // Exercise 3: Fix the associated function call
    let square = Rectangle.square(5);
    println!("Square area: {}", square.area());
    
    // Exercise 4: Fix the enum usage
    let light = TrafficLight::Red;
    println!("Red light duration: {} seconds", light.duration());
    
    // Exercise 5: Fix the Option usage
    let some_number = Option::Some(5);
    let absent_number = Option::None;
    
    match some_number {
        Option::Some(num) => println!("Got number: {}", num),
        Option::None => println!("Got nothing"),
    }
    
    match absent_number {
        Option::Some(num) => println!("Got number: {}", num),
        Option::None => println!("Got nothing"),
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