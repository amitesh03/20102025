fn main() {
    println!("=== Advanced Functions ===");
    
    // Function pointers
    fn add_one(x: i32) -> i32 {
        x + 1
    }
    
    fn do_twice(f: fn(i32) -> i32, arg: i32) -> i32 {
        f(arg) + f(arg)
    }
    
    let answer = do_twice(add_one, 5);
    println!("The answer is: {}", answer);
    
    // Returning closures
    fn returns_closure() -> Box<dyn Fn(i32) -> i32> {
        Box::new(|x| x + 1)
    }
    
    let f = returns_closure();
    println!("Closure result: {}", f(1));
    
    // Closures as input parameters
    fn apply<F>(f: F, value: i32) -> i32
    where
        F: Fn(i32) -> i32,
    {
        f(value)
    }
    
    let double = |x| x * 2;
    println!("Double of 3: {}", apply(double, 3));
    
    // Closures that capture their environment
    let x = 4;
    let equal_to_x = |z| z == x;
    let y = 4;
    
    assert!(equal_to_x(y));
    println!("Closure captured environment successfully!");
    
    // Function types and traits
    trait Summary {
        fn summarize(&self) -> String;
    }
    
    struct NewsArticle {
        headline: String,
        location: String,
        author: String,
        content: String,
    }
    
    impl Summary for NewsArticle {
        fn summarize(&self) -> String {
            format!("{}, by {} ({})", self.headline, self.author, self.location)
        }
    }
    
    fn notify(item: &impl Summary) {
        println!("Breaking news! {}", item.summarize());
    }
    
    let article = NewsArticle {
        headline: String::from("Penguins win the Stanley Cup Championship!"),
        location: String::from("Pittsburgh, PA, USA"),
        author: String::from("Iceburgh"),
        content: String::from("The Pittsburgh Penguins once again are the best hockey team in the NHL."),
    };
    
    notify(&article);
}