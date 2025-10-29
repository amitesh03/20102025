use std::thread;
use std::sync::mpsc;
use std::sync::{Arc, Mutex};
use std::time::Duration;

fn main() {
    println!("=== Threads, Channels, and Shared State ===");
    
    // CREATING THREADS
    println!("\n--- Creating Threads ---");
    
    let handle = thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(Duration::from_millis(1));
        }
    });
    
    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(Duration::from_millis(1));
    }
    
    handle.join().unwrap();
    
    // USING MOVE CLOSURES WITH THREADS
    println!("\n--- Using Move Closures ---");
    
    let v = vec![1, 2, 3];
    
    let handle = thread::spawn(move || {
        println!("Here's a vector: {:?}", v);
    });
    
    handle.join().unwrap();
    
    // USING CHANNELS
    println!("\n--- Using Channels ---");
    
    let (tx, rx) = mpsc::channel();
    
    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
        println!("Sent a message");
    });
    
    let received = rx.recv().unwrap();
    println!("Got: {}", received);
    
    // SENDING MULTIPLE VALUES
    println!("\n--- Sending Multiple Values ---");
    
    let (tx, rx) = mpsc::channel();
    
    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];
        
        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_millis(100));
        }
    });
    
    for received in rx {
        println!("Got: {}", received);
    }
    
    // MULTIPLE PRODUCERS
    println!("\n--- Multiple Producers ---");
    
    let (tx, rx) = mpsc::channel();
    
    let tx1 = tx.clone();
    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];
        
        for val in vals {
            tx1.send(val).unwrap();
            thread::sleep(Duration::from_millis(100));
        }
    });
    
    thread::spawn(move || {
        let vals = vec![
            String::from("more"),
            String::from("messages"),
            String::from("for"),
            String::from("you"),
        ];
        
        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_millis(100));
        }
    });
    
    for received in rx {
        println!("Got: {}", received);
    }
    
    // USING MUTEX FOR SHARED STATE
    println!("\n--- Using Mutex for Shared State ---");
    
    let counter = Mutex::new(0);
    {
        let mut num = counter.lock().unwrap();
        *num = 6;
    }
    
    println!("Counter: {:?}", *counter.lock().unwrap());
    
    // MULTIPLE THREADS WITH MUTEX
    println!("\n--- Multiple Threads with Mutex ---");
    
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    
    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }
    
    for handle in handles {
        handle.join().unwrap();
    }
    
    println!("Result: {}", *counter.lock().unwrap());
}