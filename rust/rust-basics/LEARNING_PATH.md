# Complete Rust Learning Path

Welcome to your comprehensive Rust programming journey! This repository is organized into different topic folders to help you learn Rust from scratch with practical code examples.

## 🎯 Learning Objectives

By the end of this course, you will:
- Understand Rust's syntax and basic concepts
- Master Rust's unique ownership system
- Be able to write safe and concurrent Rust programs
- Know how to handle errors effectively in Rust
- Be comfortable with Rust's collection types
- Understand how to organize code with modules and crates

## 📚 Course Structure

### Module 1: [Basics](./01-basics)
**Duration: 1-2 days**
- Variables and mutability
- Data types (scalar and compound)
- Functions
- Comments

**Key Exercises:**
- Fix variable declaration issues
- Practice with different data types
- Create simple functions

### Module 2: [Ownership and Borrowing](./02-ownership)
**Duration: 2-3 days**
- Ownership rules
- Move semantics
- References and borrowing
- Slices

**Key Exercises:**
- Fix ownership transfer issues
- Practice with mutable and immutable references
- Work with string slices

### Module 3: [Control Flow](./03-control-flow)
**Duration: 1-2 days**
- if/else expressions
- Loops (loop, while, for)
- Match expressions
- if let and while let

**Key Exercises:**
- Practice conditional logic
- Create different types of loops
- Use pattern matching

### Module 4: [Functions and Modules](./04-functions-modules)
**Duration: 2-3 days**
- Advanced functions
- Closures
- Module system
- Crates and paths

**Key Exercises:**
- Create closures
- Organize code with modules
- Use external crates

### Module 5: [Structs and Enums](./05-structs-enums)
**Duration: 2-3 days**
- Defining structs
- Methods and associated functions
- Enums with data
- Pattern matching

**Key Exercises:**
- Create custom data types
- Implement methods
- Use enums for state management

### Module 6: [Error Handling](./06-error-handling)
**Duration: 1-2 days**
- panic! macro
- Result type
- Option type
- Error propagation

**Key Exercises:**
- Handle recoverable errors
- Use Option for nullable values
- Propagate errors properly

### Module 7: [Collections](./07-collections)
**Duration: 2-3 days**
- Vectors
- Strings
- Hash maps

**Key Exercises:**
- Manipulate vectors
- Work with string operations
- Use hash maps for key-value data

### Module 8: [Concurrency](./08-concurrency)
**Duration: 3-4 days**
- Threads
- Channels
- Shared state (Mutex, Arc)
- Introduction to async/await

**Key Exercises:**
- Create concurrent programs
- Use channels for communication
- Safely share data between threads

## 🚀 How to Use This Repository

### Prerequisites
- Install Rust from [rustup.rs](https://rustup.rs/)
- A text editor or IDE (VS Code with Rust extension recommended)

### Working with Examples
Each module contains:
- `README.md` - Detailed explanations of concepts
- `examples/` - Practical code examples
- `exercises/` - Practice problems with solutions

To run an example:
```bash
cd module-folder
cargo run --bin example_name
```

To solve an exercise:
1. Try to fix the issues in the exercise file
2. Check your solution against the provided solution
3. Run with `cargo run --bin exercise_name` or `cargo run --bin solution`

### Learning Tips
1. **Type along** - Don't just read the code, type it yourself
2. **Experiment** - Modify the examples and see what happens
3. **Solve exercises** - They reinforce the concepts
4. **Build projects** - Apply what you learn to small projects
5. **Read the docs** - Get comfortable with Rust's official documentation

## 📖 Additional Resources

### Official Documentation
- [The Rust Book](https://doc.rust-lang.org/book/) - Comprehensive guide
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/) - Practical examples
- [Rustlings](https://github.com/rust-lang/rustlings) - Small exercises to get you used to reading and writing Rust code

### Community
- [Rust Users Forum](https://users.rust-lang.org/)
- [Rust Discord Server](https://discord.gg/rust-lang)
- [Reddit r/rust](https://www.reddit.com/r/rust/)

## 🎉 Next Steps

After completing this course:
1. Build a small project (CLI tool, web server, etc.)
2. Contribute to open source Rust projects
3. Explore advanced topics (macros, async programming, etc.)
4. Read the Rust source code to understand implementation details

## 📝 Feedback

This is a living document. If you find errors or have suggestions for improvement, please contribute!

Happy learning! 🦀