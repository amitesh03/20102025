// Module 1: Essential Rust for Solana
// This file is a standalone Rust guide with runnable examples.
// To run locally:
//   cargo new rust-essentials && replace src/main.rs with this file content
//   cargo run --release

use std::fmt;

// Section: Ownership and Moves
fn ownership_move_and_clone() {
    let s = String::from("hello");
    let s_moved = s; // move
    let s_clone = s_moved.clone(); // clone
    println!("moved: {}, clone: {}", s_moved, s_clone);
}

// Borrowing
fn borrowing_and_mutability() {
    let mut data = String::from("solana");
    let len = length_readonly(&data);
    {
        let r1 = &data;
        let r2 = &data;
        println!("two immutable borrows ok: {} {}", r1, r2);
    }
    append_exclaim(&mut data);
    println!("len={}, data={}", len, data);
}

fn length_readonly(s: &String) -> usize { s.len() }
fn append_exclaim(s: &mut String) { s.push('!'); }

// Lifetimes
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str { if x.len() >= y.len() { x } else { y } }

fn lifetimes_demo() {
    let a = String::from("sealevel");
    let b = String::from("parallel");
    let res = longest(a.as_str(), b.as_str());
    println!("longest: {}", res);
}

// Pattern matching
#[derive(Debug)]
enum Instruction {
    Init { seed: u8 },
    Deposit(u64),
    Withdraw(u64),
    Close,
}

fn pattern_matching() {
    let ix = Instruction::Deposit(500);
    match ix {
        Instruction::Init { seed } if seed == 0 => println!("init with default seed"),
        Instruction::Deposit(amt) if amt > 0 => println!("deposit {}", amt),
        Instruction::Withdraw(amt) => println!("withdraw {}", amt),
        Instruction::Close => println!("close account"),
        _ => println!("unhandled"),
    }
}

// Traits and generics
trait Balance {
    fn balance(&self) -> u64;
}

#[derive(Debug)]
struct Wallet { lamports: u64 }
#[derive(Debug)]
struct Vault { units: u64 }

impl Balance for Wallet { fn balance(&self) -> u64 { self.lamports } }
impl Balance for Vault { fn balance(&self) -> u64 { self.units } }

fn sum_balances<T: Balance>(items: &[T]) -> u64 {
    items.iter().map(|i| i.balance()).sum()
}

// Error handling without panics
#[derive(Debug)]
enum MathError {
    Overflow,
    Underflow,
    DivideByZero,
}

impl fmt::Display for MathError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            MathError::Overflow => write!(f, "overflow"),
            MathError::Underflow => write!(f, "underflow"),
            MathError::DivideByZero => write!(f, "divide by zero"),
        }
    }
}

fn checked_add(a: u64, b: u64) -> Result<u64, MathError> {
    a.checked_add(b).ok_or(MathError::Overflow)
}

fn checked_sub(a: u64, b: u64) -> Result<u64, MathError> {
    a.checked_sub(b).ok_or(MathError::Underflow)
}

fn checked_div(a: u64, b: u64) -> Result<u64, MathError> {
    if b == 0 { return Err(MathError::DivideByZero); }
    Ok(a / b)
}

fn error_handling_demo() {
    let x = checked_add(u64::MAX - 1, 2);
    println!("checked_add: {:?}", x);
    println!("checked_sub: {:?}", checked_sub(10, 3));
    println!("checked_div: {:?}", checked_div(10, 2));
}

// Serialization notes
#[allow(dead_code)]
mod serialization_notes {
    // On Solana, prefer Borsh or Anchor's account encoding.
    // Example with Borsh (requires borsh dependency and no_std off-chain):
    // use borsh::{BorshDeserialize, BorshSerialize};
    // #[derive(BorshSerialize, BorshDeserialize)]
    // pub struct Position { pub owner: [u8; 32], pub amount: u64 }
    //
    // For zero-copy layouts consider:
    // #[repr(C)]
    // pub struct PositionZc { pub owner: [u8;32], pub amount: u64 }
}

// Determinism tips
fn determinism_tips() {
    // Avoid: system time, randomness, filesystem, network in on-chain code.
    // Prefer: explicit inputs, deterministic state transitions, checked arithmetic.
    println!("determinism: avoid nondeterministic sources in on-chain programs");
}

// Putting it together
fn main() {
    ownership_move_and_clone();
    borrowing_and_mutability();
    lifetimes_demo();
    pattern_matching();
    let wallets = [Wallet { lamports: 3 }, Wallet { lamports: 7 }];
    let vaults = [Vault { units: 5 }, Vault { units: 15 }];
    println!("sum wallets = {}", sum_balances(&wallets));
    println!("sum vaults = {}", sum_balances(&vaults));
    error_handling_demo();
    determinism_tips();
}