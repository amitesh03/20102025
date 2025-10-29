// Solution to the Concurrency Exercise

use std::thread;
use std::sync::mpsc;
use std::sync::{Arc, Mutex};
use std::time::Duration;

fn main() {
    println!("=== Concurrency Exercise Solution ===");
    
    // Exercise 1: Fix the thread creation
    let handle = thread::spawn(|| {
        for i in 1..5 {
            println!("Thread: {}", i);
            thread::sleep(Duration::from_millis(100));
        }
    });
    
    for i in 1..3 {
        println!("Main: {}", i);
        thread::sleep(Duration::from_millis(100));
    }
    
    handle.join().unwrap(); // Added unwrap() to handle the Result
    
    // Exercise 2: Fix the channel usage
    let (tx, rx) = mpsc::channel();
    
    thread::spawn(move || {
        tx.send("Hello from thread").unwrap(); // Added unwrap() and converted to String
    });
    
    let received = rx.recv().unwrap(); // Added unwrap()
    println!("Received: {}", received);
    
    // Exercise 3: Fix the shared counter
    let counter = Arc::new(Mutex::new(0)); // Wrap in Arc before creating handles
    let mut handles = vec![];
    
    for _ in 0..5 {
        let counter = Arc::clone(&counter); // Clone the Arc, not create a new one
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }
    
    for handle in handles {
        handle.join().unwrap(); // Added unwrap()
    }
    
    println!("Counter: {}", *counter.lock().unwrap());
    
    // Exercise 4: Fix the multiple producers
    let (tx, rx) = mpsc::channel();
    
    for i in 0..3 {
        let tx = tx.clone();
        thread::spawn(move || {
            tx.send(i).unwrap(); // Added unwrap()
        });
    }
    
    drop(tx); // Drop the original sender
    
    for received in rx {
        println!("Received: {}", received);
    }
    
    // Exercise 5: Fix the move closure
    let data = vec![1, 2, 3, 4, 5];
    
    let handle = thread::spawn(move || { // Added move keyword
        for item in data {
            println!("Item: {}", item);
        }
    });
    
    handle.join().unwrap(); // Added unwrap()
}