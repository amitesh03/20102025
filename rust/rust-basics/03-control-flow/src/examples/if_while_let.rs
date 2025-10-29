fn main() {
    println!("=== If Let and While Let ===");
    
    // if let - concise way to handle one pattern
    let favorite_color: Option<&str> = None;
    let is_tuesday = false;
    let age: Result<u8, _> = "34".parse();
    
    if let Some(color) = favorite_color {
        println!("Using your favorite color, {}, as the background", color);
    } else if is_tuesday {
        println!("Tuesday is green day!");
    } else if let Ok(age) = age {
        if age > 30 {
            println!("Using purple as the background color");
        } else {
            println!("Using orange as the background color");
        }
    } else {
        println!("Using blue as the background color");
    }
    
    // while let - concise way to handle pattern in a loop
    println!("\nUsing while let:");
    let mut stack = Vec::new();
    
    stack.push(1);
    stack.push(2);
    stack.push(3);
    
    while let Some(top) = stack.pop() {
        println!("{}", top);
    }
    
    // for loops vs while let
    println!("\nComparing for loop and while let:");
    let v = vec!['a', 'b', 'c'];
    
    println!("Using for loop:");
    for (index, value) in v.iter().enumerate() {
        println!("{}: {}", index, value);
    }
    
    println!("Using while let:");
    let mut iter = v.iter();
    while let Some((index, value)) = iter.next().map(|v| (v.len() - 1, v)) {
        println!("{}: {}", index, value);
    }
    
    // if let with patterns
    println!("\nUsing if let with patterns:");
    let some_option_value = Some(0u8);
    
    match some_option_value {
        Some(3) => println!("three"),
        _ => (),
    }
    
    // More concise with if let
    if let Some(3) = some_option_value {
        println!("three");
    }
    
    // Complex pattern matching with if let
    println!("\nComplex pattern with if let:");
    let x = Some(5);
    
    if let Some(x) = x {
        println!("Got a value: {}", x);
    } else {
        println!("Got nothing");
    }
    
    // Using if let with Result
    println!("\nUsing if let with Result:");
    let result: Result<i32, &str> = Ok(10);
    
    if let Ok(value) = result {
        println!("Got a successful result: {}", value);
    }
    
    let error_result: Result<i32, &str> = Err("Something went wrong");
    
    if let Err(error) = error_result {
        println!("Got an error: {}", error);
    }
}