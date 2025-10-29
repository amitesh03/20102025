# 03. Control Flow

This section covers the various control flow constructs in Rust.

## Topics Covered

1. **if/else expressions**
2. **loops**
   - `loop`
   - `while`
   - `for`
3. **match expressions**
4. **if let** and **while let** constructs

## Key Concepts

### if Expressions

In Rust, `if` is an expression, meaning it can be used to return values. This allows for concise conditional assignments.

### Loops

Rust provides three types of loops:
- `loop`: An infinite loop that must be explicitly broken
- `while`: A conditional loop that continues while a condition is true
- `for`: A loop that iterates over a collection

### Match

The `match` control flow operator allows you to compare a value against a series of patterns and execute code based on which pattern matches. It's similar to a switch statement in other languages but more powerful.

## Examples

Each example in the `examples/` folder demonstrates a specific concept. Run them with:

```bash
cargo run --bin example_name
```

## Exercises

Test your understanding with the exercises in the `exercises/` folder.