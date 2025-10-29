# Rust Programming Fundamentals Syllabus

## Course Overview
This comprehensive course covers the fundamentals of Rust programming language, from basic syntax to advanced concepts like concurrency. Each module builds upon the previous one, providing a solid foundation for writing safe, concurrent, and efficient Rust code.

## Prerequisites
- Basic programming knowledge (any language)
- Familiarity with command line tools
- Rust toolchain installed (rustup.rs)

## Course Structure

### Module 1: Basics (1-2 days)
**Folder:** `01-basics`

**Learning Objectives:**
- Understand Rust's variable system and mutability
- Learn Rust's data types (scalar and compound)
- Write basic functions in Rust
- Use comments effectively

**Topics:**
- Variables and mutability (`mut` keyword)
- Scalar types (integers, floats, booleans, characters)
- Compound types (tuples, arrays)
- Functions (parameters, return values, expressions vs statements)
- Comments (single-line, multi-line, doc comments)

**Practical Exercises:**
- Fix variable declaration issues
- Practice with different data types
- Create simple functions with various return types
- Document code with comments

**Assessment:**
- Complete all exercises in the `exercises/` folder
- Modify examples to experiment with different concepts

### Module 2: Ownership and Borrowing (2-3 days)
**Folder:** `02-ownership`

**Learning Objectives:**
- Master Rust's ownership system
- Understand move semantics
- Work with references and borrowing
- Use slices effectively

**Topics:**
- The three rules of ownership
- Move semantics and copy semantics
- Immutable and mutable references
- Borrowing rules and lifetimes (introduction)
- String slices and other slice types

**Practical Exercises:**
- Fix ownership transfer issues
- Practice with mutable and immutable references
- Work with string slices
- Understand when data is copied vs moved

**Assessment:**
- Complete all exercises in the `exercises/` folder
- Analyze ownership in example code

### Module 3: Control Flow (1-2 days)
**Folder:** `03-control-flow`

**Learning Objectives:**
- Use conditional expressions in Rust
- Implement different types of loops
- Master pattern matching with match expressions
- Use if let and while let constructs

**Topics:**
- if/else expressions (as expressions, not just statements)
- Loops (loop, while, for)
- Match expressions (exhaustive patterns, guards)
- if let and while let constructs
- Breaking out of loops and returning values

**Practical Exercises:**
- Practice conditional logic
- Create different types of loops
- Use pattern matching for complex conditions
- Implement if let and while let for concise code

**Assessment:**
- Complete all exercises in the `exercises/` folder
- Refactor code using appropriate control flow constructs

### Module 4: Functions and Modules (2-3 days)
**Folder:** `04-functions-modules`

**Learning Objectives:**
- Write advanced functions with closures
- Organize code with modules
- Use external crates
- Understand paths and visibility

**Topics:**
- Advanced function concepts
- Closures and their capture modes
- Higher-order functions
- Module system and visibility
- Crates and package management
- Absolute and relative paths

**Practical Exercises:**
- Create closures for different use cases
- Organize code with modules
- Use external crates in projects
- Practice with different path types

**Assessment:**
- Complete all exercises in the `exercises/` folder
- Create a well-organized module structure

### Module 5: Structs and Enums (2-3 days)
**Folder:** `05-structs-enums`

**Learning Objectives:**
- Define custom data types with structs
- Create enums with associated data
- Implement methods and associated functions
- Use pattern matching with custom types

**Topics:**
- Defining and instantiating structs
- Tuple structs and unit-like structs
- Methods and associated functions
- Defining enums with data
- The Option enum and its usage
- Pattern matching on structs and enums

**Practical Exercises:**
- Create custom data types
- Implement methods for structs
- Use enums for state management
- Practice pattern matching

**Assessment:**
- Complete all exercises in the `exercises/` folder
- Design appropriate data structures for given problems

### Module 6: Error Handling (1-2 days)
**Folder:** `06-error-handling`

**Learning Objectives:**
- Handle unrecoverable errors with panic!
- Use Result type for recoverable errors
- Work with Option for nullable values
- Propagate errors properly

**Topics:**
- The panic! macro and when to use it
- Result enum and its variants
- Option enum for handling absence of values
- Error propagation with the ? operator
- Creating custom error types

**Practical Exercises:**
- Handle recoverable errors
- Use Option for nullable values
- Propagate errors properly
- Create basic error handling strategies

**Assessment:**
- Complete all exercises in the `exercises/` folder
- Implement robust error handling in example programs

### Module 7: Collections (2-3 days)
**Folder:** `07-collections`

**Learning Objectives:**
- Work with vectors for dynamic arrays
- Manipulate strings effectively
- Use hash maps for key-value data
- Choose appropriate collection types

**Topics:**
- Vectors (creating, updating, reading elements)
- Strings (String vs &str, slicing, operations)
- Hash maps (creating, accessing, updating)
- Performance considerations for different collections

**Practical Exercises:**
- Manipulate vectors
- Work with string operations
- Use hash maps for key-value data
- Choose appropriate collections for different scenarios

**Assessment:**
- Complete all exercises in the `exercises/` folder
- Solve problems using appropriate collection types

### Module 8: Concurrency (3-4 days)
**Folder:** `08-concurrency`

**Learning Objectives:**
- Create and manage threads
- Use channels for communication
- Safely share data between threads
- Introduction to async/await

**Topics:**
- Creating and joining threads
- Using move closures with threads
- Channels for message passing
- Shared state with Mutex and Arc
- Introduction to async/await syntax

**Practical Exercises:**
- Create concurrent programs
- Use channels for communication
- Safely share data between threads
- Basic async/await patterns

**Assessment:**
- Complete all exercises in the `exercises/` folder
- Implement a simple concurrent application

## Learning Resources

### Required Materials
- Rust toolchain (latest stable)
- Text editor or IDE with Rust support
- Access to the examples and exercises in this repository

### Recommended Reading
- [The Rust Book](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Rustlings](https://github.com/rust-lang/rustlings)

### Community Resources
- [Rust Users Forum](https://users.rust-lang.org/)
- [Rust Discord Server](https://discord.gg/rust-lang)
- [Reddit r/rust](https://www.reddit.com/r/rust/)

## Assessment and Evaluation

### Course Completion Requirements
- Complete all exercises in each module
- Experiment with modifying examples
- Build a small project that demonstrates learned concepts

### Final Project
Create a command-line application that:
- Uses custom structs and enums
- Implements proper error handling
- Utilizes appropriate collections
- Includes at least one concurrent feature

## Next Steps After Completion

1. Explore web frameworks (Actix, Axum, Rocket, etc.)
2. Learn database integration (Diesel, SQLx)
3. Dive deeper into async programming (Tokio)
4. Study serialization (Serde)
5. Build larger projects and contribute to open source

## Estimated Timeline
- Total Duration: 15-22 days
- Recommended Pace: 1-2 hours per day
- Intensive Pace: Complete in 1-2 weeks
- Casual Pace: Spread over 1-2 months

Happy learning! 🦀