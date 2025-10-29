fn main() {
    println!("=== Enums ===");
    
    // Defining an enum
    enum IpAddr {
        V4(u8, u8, u8, u8),
        V6(String),
    }
    
    let home = IpAddr::V4(127, 0, 0, 1);
    let loopback = IpAddr::V6(String::from("::1"));
    
    // Enum with data
    enum Message {
        Quit,
        Move { x: i32, y: i32 },
        Write(String),
        ChangeColor(i32, i32, i32),
    }
    
    impl Message {
        fn process(&self) {
            match self {
                Message::Quit => println!("Quit message"),
                Message::Move { x, y } => println!("Move to ({}, {})", x, y),
                Message::Write(text) => println!("Write: {}", text),
                Message::ChangeColor(r, g, b) => println!("Change color to ({}, {}, {})", r, g, b),
            }
        }
    }
    
    let messages = [
        Message::Move { x: 10, y: 30 },
        Message::Write(String::from("Hello")),
        Message::ChangeColor(200, 255, 255),
        Message::Quit,
    ];
    
    for message in &messages {
        message.process();
    }
    
    // Option enum
    let some_number = Some(5);
    let some_string = Some("a string");
    let absent_number: Option<i32> = None;
    
    println!("some_number: {:?}", some_number);
    println!("some_string: {:?}", some_string);
    println!("absent_number: {:?}", absent_number);
    
    // Using Option in a function
    fn plus_one(x: Option<i32>) -> Option<i32> {
        match x {
            None => None,
            Some(i) => Some(i + 1),
        }
    }
    
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);
    
    println!("five: {:?}, six: {:?}, none: {:?}", five, six, none);
    
    // The match control flow operator
    enum Coin {
        Penny,
        Nickel,
        Dime,
        Quarter,
    }
    
    fn value_in_cents(coin: Coin) -> u8 {
        match coin {
            Coin::Penny => 1,
            Coin::Nickel => 5,
            Coin::Dime => 10,
            Coin::Quarter => 25,
        }
    }
    
    println!("Penny: {} cents", value_in_cents(Coin::Penny));
    println!("Quarter: {} cents", value_in_cents(Coin::Quarter));
    
    // Patterns that bind to values
    #[derive(Debug)]
    enum UsState {
        Alabama,
        Alaska,
        // --snip--
    }
    
    enum Coin2 {
        Penny,
        Nickel,
        Dime,
        Quarter(UsState),
    }
    
    fn value_in_cents2(coin: Coin2) -> u8 {
        match coin {
            Coin2::Penny => 1,
            Coin2::Nickel => 5,
            Coin2::Dime => 10,
            Coin2::Quarter(state) => {
                println!("State quarter from {:?}!", state);
                25
            }
        }
    }
    
    value_in_cents2(Coin2::Quarter(UsState::Alaska));
    
    // Matching with Option<T>
    let dice_roll = 9;
    
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        other => move_player(other),
    }
    
    fn add_fancy_hat() {}
    fn remove_fancy_hat() {}
    fn move_player(num_spaces: u8) {}
    
    // Catch-all patterns
    let dice_roll = 9;
    
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        _ => reroll(), // or () to do nothing
    }
    
    fn reroll() {}
    
    // if let concise control flow
    let config_max = Some(3u8);
    
    match config_max {
        Some(max) => println!("The maximum is configured to be {}", max),
        _ => (),
    }
    
    // More concise with if let
    if let Some(max) = config_max {
        println!("The maximum is configured to be {}", max);
    }
    
    // Using if let with else
    let mut count = 0;
    
    let coin = Coin2::Quarter(UsState::Alaska);
    
    if let Coin2::Quarter(state) = coin {
        println!("State quarter from {:?}!", state);
    } else {
        count += 1;
    }
    
    println!("Count: {}", count);
}