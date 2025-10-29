# 02. Ownership and Borrowing

This section covers one of Rust's most unique and powerful features: the ownership system.

## Topics Covered

1. **Ownership Rules**
2. **Move Semantics**
3. **Borrowing**
   - Immutable references
   - Mutable references
4. **Slices**
5. **Lifetimes** (introduction)

## Key Concepts

### The Three Rules of Ownership

1. Each value in Rust has an owner.
2. There can only be one owner at a time.
3. When the owner goes out of scope, the value will be dropped.

### Borrowing

Borrowing allows you to use a value without taking ownership of it. References come in two forms:
- Immutable references (`&T`)
- Mutable references (`&mut T`)

### Slices

Slices let you reference a contiguous sequence of elements in a collection rather than the whole collection.

## Examples

Each example in the `examples/` folder demonstrates a specific concept. Run them with:

```bash
cargo run --bin example_name
```

## Exercises

Test your understanding with the exercises in the `exercises/` folder.