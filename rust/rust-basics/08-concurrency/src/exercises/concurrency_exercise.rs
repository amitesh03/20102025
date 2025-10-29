// Exercise: Concurrency
//
// Fix the compilation errors in this file by making the appropriate changes.
// Don't change the logic, just fix the syntax and concurrency issues.

use std::thread;
use std::sync::mpsc;
use std::sync::{Arc, Mutex};
use std::time::Duration;

fn main() {
    println!("=== Concurrency Exercise ===");
    
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
    
    handle.join();
    
    // Exercise 2: Fix the channel usage
    let (tx, rx) = mpsc::channel();
    
    thread::spawn(move || {
        tx.send("Hello from thread");
    });
    
    let received = rx.recv();
    println!("Received: {}", received);
    
    // Exercise 3: Fix the shared counter
    let counter = Mutex::new(0);
    let mut handles = vec![];
    
    for _ in 0..5 {
        let counter = Arc::new(counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }
    
    for handle in handles {
        handle.join();
    }
    
    println!("Counter: {}", *counter.lock().unwrap());
    
    // Exercise 4: Fix the multiple producers
    let (tx, rx) = mpsc::channel();
    
    for i in 0..3 {
        let tx = tx.clone();
        thread::spawn(move || {
            tx.send(i);
        });
    }
    
    drop(tx); // Drop the original sender
    
    for received in rx {
        println!("Received: {}", received);
    }
    
    // Exercise 5: Fix the move closure
    let data = vec![1, 2, 3, 4, 5];
    
    let handle = thread::spawn(|| {
        for item in data {
            println!("Item: {}", item);
        }
    });
    
    handle.join();
}