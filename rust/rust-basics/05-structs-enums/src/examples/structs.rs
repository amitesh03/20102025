fn main() {
    println!("=== Structs ===");
    
    // Defining and instantiating structs
    struct User {
        username: String,
        email: String,
        sign_in_count: u64,
        active: bool,
    }
    
    let user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };
    
    println!("User: {} ({})", user1.username, user1.email);
    
    // Accessing and modifying struct fields
    let mut user2 = User {
        email: String::from("another@example.com"),
        username: String::from("anotherusername567"),
        active: true,
        sign_in_count: 1,
    };
    
    user2.email = String::from("anotheremail@example.com");
    println!("Updated email: {}", user2.email);
    
    // Tuple structs
    struct Color(i32, i32, i32);
    struct Point(i32, i32, i32);
    
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
    
    println!("Black: ({}, {}, {})", black.0, black.1, black.2);
    println!("Origin: ({}, {}, {})", origin.0, origin.1, origin.2);
    
    // Unit-like structs
    struct AlwaysEqual;
    
    let subject = AlwaysEqual;
    
    // Method syntax
    #[derive(Debug)]
    struct Rectangle {
        width: u32,
        height: u32,
    }
    
    impl Rectangle {
        fn width(&self) -> bool {
            self.width > 0
        }
        
        fn area(&self) -> u32 {
            self.width * self.height
        }
        
        fn can_hold(&self, other: &Rectangle) -> bool {
            self.width > other.width && self.height > other.height
        }
        
        // Associated function (static method)
        fn square(size: u32) -> Rectangle {
            Rectangle {
                width: size,
                height: size,
            }
        }
    }
    
    let rect1 = Rectangle { width: 30, height: 50 };
    
    println!(
        "The area of the rectangle is {} square pixels.",
        rect1.area()
    );
    
    if rect1.width() {
        println!("The rectangle has a nonzero width; it is {}", rect1.width);
    }
    
    let rect2 = Rectangle { width: 10, height: 40 };
    let rect3 = Rectangle { width: 60, height: 45 };
    
    println!("Can rect1 hold rect2? {}", rect1.can_hold(&rect2));
    println!("Can rect1 hold rect3? {}", rect1.can_hold(&rect3));
    
    let sq = Rectangle::square(3);
    println!("Square area: {}", sq.area());
    
    // Multiple impl blocks
    impl Rectangle {
        fn perimeter(&self) -> u32 {
            2 * (self.width + self.height)
        }
    }
    
    println!("Rectangle perimeter: {}", rect1.perimeter());
}