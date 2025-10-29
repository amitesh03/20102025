fn main() {
    println!("=== Match Expressions ===");
    
    // Basic match
    let number = 13;
    
    println!("Telling about {}", number);
    match number {
        1 => println!("One!"),
        2 => println!("Two!"),
        3 => println!("Three!"),
        4 => println!("Four!"),
        5 => println!("Five!"),
        _ => println!("Something else!"), // Catch-all
    }
    
    // Match that returns a value
    let boolean = true;
    
    let binary = match boolean {
        false => 0,
        true => 1,
    };
    
    println!("{} -> {}", boolean, binary);
    
    // Matching with multiple patterns
    let x = 1;
    
    match x {
        1 | 2 => println!("one or two"),
        3 => println!("three"),
        _ => println!("anything"),
    }
    
    // Matching ranges
    let x = 5;
    
    match x {
        1..=5 => println!("one through five"),
        _ => println!("something else"),
    }
    
    // Matching with conditions (guards)
    let x = Some(5);
    let y = 10;
    
    match x {
        Some(50) => println!("Got 50"),
        Some(n) if n == y => println!("Matched, n = {}", n),
        Some(n) => println!("Matched some other value: {}", n),
        None => println!("Got nothing"),
    }
    
    // Destructuring structs
    struct Point {
        x: i32,
        y: i32,
    }
    
    let p = Point { x: 0, y: 7 };
    
    match p {
        Point { x, y: 0 } => println!("On the x axis at {}", x),
        Point { x: 0, y } => println!("On the y axis at {}", y),
        Point { x, y } => println!("On neither axis: ({}, {})", x, y),
    }
    
    // Destructuring enums
    enum Message {
        Quit,
        Move { x: i32, y: i32 },
        Write(String),
        ChangeColor(i32, i32, i32),
    }
    
    let msg = Message::ChangeColor(0, 160, 255);
    
    match msg {
        Message::Quit => println!("The Quit variant has no data to destructure."),
        Message::Move { x, y } => println!("Move in the x direction {} and in the y direction {}", x, y),
        Message::Write(text) => println!("Text message: {}", text),
        Message::ChangeColor(r, g, b) => println!("Change the color to red {}, green {}, and blue {}", r, g, b),
    }
    
    // Destructuring with patterns
    let numbers = (2, 4, 8);
    
    match numbers {
        (first, _, third) => println!("First is {}, third is {}", first, third),
    }
    
    // Ignoring remaining parts of a value
    let origin = Point { x: 0, y: 0 };
    
    match origin {
        Point { x, .. } => println!("x is {}", x),
    }
    
    // Match with references
    let mut setting_value = Some(5);
    let new_setting_value = Some(10);
    
    match (setting_value, new_setting_value) {
        (Some(_), Some(_)) => {
            println!("Can't overwrite an existing customized value");
        }
        _ => {
            setting_value = new_setting_value;
            println!("Setting is now {:?}", setting_value);
        }
    }
}