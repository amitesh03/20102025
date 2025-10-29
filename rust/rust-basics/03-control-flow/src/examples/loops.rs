fn main() {
    println!("=== Loops ===");
    
    // loop - infinite loop until break
    println!("Using loop:");
    let mut counter = 0;
    let result = loop {
        counter += 1;
        
        if counter == 10 {
            break counter * 2; // break can return a value
        }
    };
    
    println!("The result is: {}", result);
    
    // while loop
    println!("\nUsing while:");
    let mut number = 3;
    
    while number != 0 {
        println!("{}!", number);
        number -= 1;
    }
    
    println!("LIFTOFF!!!");
    
    // for loop with range
    println!("\nUsing for with range:");
    for number in (1..4).rev() {
        println!("{}!", number);
    }
    
    println!("LIFTOFF!!!");
    
    // for loop with array
    println!("\nUsing for with array:");
    let a = [10, 20, 30, 40, 50];
    
    for element in a.iter() {
        println!("the value is: {}", element);
    }
    
    // for loop with index
    println!("\nUsing for with index:");
    for (index, value) in a.iter().enumerate() {
        println!("index {}: value {}", index, value);
    }
    
    // Loop labels to disambiguate between multiple loops
    println!("\nUsing loop labels:");
    let mut count = 0;
    'counting_up: loop {
        println!("count = {}", count);
        let mut remaining = 10;
        
        loop {
            println!("remaining = {}", remaining);
            if remaining == 9 {
                break;
            }
            if count == 2 {
                break 'counting_up;
            }
            remaining -= 1;
        }
        
        count += 1;
    }
    println!("End count = {}", count);
    
    // Continuing to the next iteration
    println!("\nUsing continue:");
    for number in 1..10 {
        if number % 2 == 0 {
            continue; // Skip even numbers
        }
        println!("{} is odd", number);
    }
    
    // Looping through strings
    println!("\nLooping through strings:");
    let s = String::from("hello");
    
    for c in s.chars() {
        println!("'{}'", c);
    }
}