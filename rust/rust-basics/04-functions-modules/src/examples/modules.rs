mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
        
        fn seat_at_table() {}
    }
    
    mod serving {
        fn take_order() {}
        
        fn serve_order() {}
        
        fn take_payment() {}
        
        pub mod back_of_house {
            pub struct Breakfast {
                pub toast: String,
                seasonal_fruit: String,
            }
            
            impl Breakfast {
                pub fn summer(toast: &str) -> Breakfast {
                    Breakfast {
                        toast: String::from(toast),
                        seasonal_fruit: String::from("peaches"),
                    }
                }
            }
            
            fn fix_incorrect_order() {
                cook_order();
                super::serve_order();
            }
            
            fn cook_order() {}
            
            pub enum Appetizer {
                Soup,
                Salad,
            }
        }
    }
}

use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    // Absolute path
    crate::front_of_house::hosting::add_to_waitlist();
    
    // Relative path
    front_of_house::hosting::add_to_waitlist();
    
    // Use path
    hosting::add_to_waitlist();
    
    // Order a breakfast in the summer with Rye toast
    let mut meal = front_of_house::serving::back_of_house::Breakfast::summer("Rye");
    // Change our mind about what bread we'd like
    meal.toast = String::from("Wheat");
    println!("I'd like {} toast please", meal.toast);
    
    // The next line won't compile if we uncomment it; we're not allowed
    // to see or modify the seasonal fruit that comes with the meal
    // meal.seasonal_fruit = String::from("blueberries");
    
    // Using enum
    let order1 = front_of_house::serving::back_of_house::Appetizer::Soup;
    let order2 = front_of_house::serving::back_of_house::Appetizer::Salad;
    
    println!("Order 1: {:?}", order1);
    println!("Order 2: {:?}", order2);
}

// Bringing all types into scope with glob operator
use std::collections::*;

fn main() {
    println!("=== Modules ===");
    
    eat_at_restaurant();
    
    // Using HashMap from the glob import
    let mut map = HashMap::new();
    map.insert(1, "one");
    map.insert(2, "two");
    
    println!("HashMap: {:?}", map);
    
    // Using different names for the same type
    use std::fmt::Result;
    use std::io::Result as IoResult;
    
    fn function1() -> Result {
        Ok(())
    }
    
    fn function2() -> IoResult<()> {
        Ok(())
    }
    
    println!("Functions with different Result types work!");
    
    // Re-exporting names
    pub use crate::front_of_house::hosting;
    
    // Using external packages
    use rand::Rng;
    
    let mut rng = rand::thread_rng();
    let n1: u32 = rng.gen();
    let n2: u32 = rng.gen_range(1..=100);
    
    println!("Random numbers: {} and {}", n1, n2);
}