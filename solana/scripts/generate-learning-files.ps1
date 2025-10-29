$ErrorActionPreference = 'Stop'

function Ensure-Dir {
  param([Parameter(Mandatory=$true)][string]$Path)
  if (-not (Test-Path -Path $Path -PathType Container)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

$items = @()

# Module 0: Environment setup script (educational)
$items += @{
  Path = "modules\module-0-environment\ps-setup.ps1";
  Content = @'
# Module 0: Environment & Prerequisites (Windows PowerShell)
# This script shows commands to install core toolchains.
# Review before running; some commands require admin or user confirmation.

Write-Host "=== Rust (MSVC toolchain) via winget ==="
# winget install -e --id Rustlang.Rust.MSVC
# rustup default stable
# rustc --version
# cargo --version

Write-Host "=== Solana CLI (Windows) ==="
# Installer: https://release.solana.com/stable/solana-install-init.exe
# Example (download & run):
# $installer = Join-Path $env:TEMP "solana-install-init.exe"
# Invoke-WebRequest -Uri "https://release.solana.com/stable/solana-install-init.exe" -OutFile $installer
# Start-Process -FilePath $installer -Wait
# solana --version
# solana config set --url https://api.devnet.solana.com
# solana airdrop 2

Write-Host "=== Node.js LTS via winget ==="
# winget install -e --id OpenJS.NodeJS.LTS
# node -v
# npm -v
# npm i -g pnpm

Write-Host "=== VSCode extensions (optional) ==="
# code --install-extension rust-lang.rust-analyzer
# code --install-extension tamasfe.even-better-toml
# code --install-extension esbenp.prettier-vscode

Write-Host "=== Local validator (example) ==="
# solana-test-validator
# In another terminal:
# solana config set --url http://127.0.0.1:8899
# solana airdrop 5
'@
}

# Module 2: PDA derivation demo (TypeScript)
$items += @{
  Path = "modules\module-2-architecture\pda_demo.ts";
  Content = @'
/*
Module 2: Solana Architecture - PDA derivation demo (TypeScript)

How to run:
  npm init -y
  npm i @solana/web3.js
  node pda_demo.ts  (with ts-node) or transpile via tsc then node
*/

import { PublicKey } from "@solana/web3.js";

// Replace with your on-chain program id
const PROGRAM_ID = new PublicKey("11111111111111111111111111111111");

function pdaFromSeed(seed: string) {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(seed)],
    PROGRAM_ID
  );
  console.log(`seed="${seed}" -> PDA=${pda.toBase58()} bump=${bump}`);
}

function pdaFromUserSeed(user: PublicKey, seed: string) {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("state"), user.toBuffer(), Buffer.from(seed)],
    PROGRAM_ID
  );
  console.log(`user+seed -> PDA=${pda.toBase58()} bump=${bump}`);
}

function main() {
  const user = new PublicKey("11111111111111111111111111111111");
  pdaFromSeed("counter");
  pdaFromUserSeed(user, "position");
}

main();
'@
}

# Module 3: Anchor counter program (Rust)
$items += @{
  Path = "modules\module-3-anchor\programs\counter\src\lib.rs";
  Content = @'
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111"); // Replace with your program id

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        counter.bump = *ctx.bumps.get("counter").unwrap();
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        // Example of checked math to avoid overflow
        counter.count = counter.count.checked_add(1).ok_or(ErrorCode::MathOverflow)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        seeds = [b"counter", payer.key().as_ref()],
        bump,
        space = 8 + Counter::SIZE
    )]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(
        mut,
        seeds = [b"counter", payer.key().as_ref()],
        bump = counter.bump,
        has_one = owner @ ErrorCode::InvalidOwner
    )]
    pub counter: Account<'info, Counter>,
    pub payer: Signer<'info>,
    /// The account that owns the counter state
    pub owner: UncheckedAccount<'info>,
}

#[account]
pub struct Counter {
    pub count: u64,
    pub bump: u8,
    pub owner: Pubkey,
}

impl Counter {
    // 8 bytes discriminator handled by Anchor. Size for fields below:
    // count (8) + bump (1) + owner (32) = 41 bytes
    pub const SIZE: usize = 8 + 1 + 32;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Invalid owner")]
    InvalidOwner,
}
'@
}

# Module 3: Anchor program Cargo.toml
$items += @{
  Path = "modules\module-3-anchor\programs\counter\Cargo.toml";
  Content = @'
[package]
name = "counter"
version = "0.1.0"
edition = "2021"

[lib]
name = "counter"
crate-type = ["cdylib", "lib"]

[features]
no-entrypoint = []

[dependencies]
anchor-lang = "0.30.1"

[profile.release]
lto = "fat"
codegen-units = 1
panic = "abort"
opt-level = "s"
'@
}

# Module 3: Anchor workspace top-level Anchor.toml (educational template)
$items += @{
  Path = "modules\module-3-anchor\Anchor.toml";
  Content = @'
[programs.localnet]
counter = "YourProgramId1111111111111111111111111111111"

[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "anchor test"
'@
}

# Module 5: Client basic transaction (TypeScript)
$items += @{
  Path = "modules\module-5-clients-frontend\ts\basic_tx.ts";
  Content = @'
/*
Module 5: Clients & Frontend - basic transaction with priority fees (TypeScript)

Setup:
  npm init -y
  npm i @solana/web3.js
  npm i -D ts-node typescript @types/node
Run:
  npx ts-node basic_tx.ts
*/

import {
  Connection, Keypair, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction,
  Transaction, clusterApiUrl, ComputeBudgetProgram, PublicKey
} from "@solana/web3.js";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const payer = Keypair.generate();
  const to = Keypair.generate();

  console.log("Airdropping 2 SOL to payer...");
  const sig = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(sig, "confirmed");

  // Priority fees + CU limit
  const cuPriceMicroLamports = 10_000; // 0.00001 SOL per 1M CU
  const cuLimit = 200_000;

  const ix1 = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: cuPriceMicroLamports });
  const ix2 = ComputeBudgetProgram.setComputeUnitLimit({ units: cuLimit });

  const transferIx = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: to.publicKey,
    lamports: 0.1 * LAMPORTS_PER_SOL,
  });

  const tx = new Transaction().add(ix1, ix2, transferIx);
  const signature = await sendAndConfirmTransaction(connection, tx, [payer]);
  console.log("Transfer signature:", signature);

  const bal = await connection.getBalance(to.publicKey);
  console.log("Recipient balance:", bal / LAMPORTS_PER_SOL, "SOL");
}

main().catch(console.error);
'@
}

# Module 6: SPL Token mint demo (TypeScript)
$items += @{
  Path = "modules\module-6-tokens-nfts\ts\spl_mint_demo.ts";
  Content = @'
/*
Module 6: SPL Token - create mint and mint to ATA (TypeScript)

Setup:
  npm init -y
  npm i @solana/web3.js @solana/spl-token
  npm i -D ts-node typescript @types/node
Run:
  npx ts-node spl_mint_demo.ts
*/

import {
  Connection, Keypair, LAMPORTS_PER_SOL, clusterApiUrl, sendAndConfirmTransaction, PublicKey
} from "@solana/web3.js";
import {
  createMint, getOrCreateAssociatedTokenAccount, mintTo, getMint, getAccount, TOKEN_PROGRAM_ID
} from "@solana/spl-token";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const payer = Keypair.generate();
  const mintAuthority = payer;
  const freezeAuthority: PublicKey | null = null;

  console.log("Airdropping 2 SOL to payer...");
  const sig = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(sig, "confirmed");

  console.log("Creating mint...");
  const mint = await createMint(
    connection,
    payer,
    mintAuthority.publicKey,
    freezeAuthority,
    9 // decimals
  );
  console.log("Mint pubkey:", mint.toBase58());

  console.log("Getting ATA for payer...");
  const ata = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );
  console.log("ATA:", ata.address.toBase58());

  console.log("Minting tokens...");
  await mintTo(
    connection,
    payer,
    mint,
    ata.address,
    mintAuthority,
    1_000_000_000n // 1 token with 9 decimals
  );

  const mintInfo = await getMint(connection, mint);
  const ataInfo = await getAccount(connection, ata.address);
  console.log("Mint supply:", mintInfo.supply.toString());
  console.log("ATA amount:", ataInfo.amount.toString());
}

main().catch(console.error);
'@
}

# Module 8: Logs subscription and observability (TypeScript)
$items += @{
  Path = "modules\module-8-infrastructure-observability\ts\log_subscribe.ts";
  Content = @'
/*
Module 8: Observability - Subscribe to logs (TypeScript)

Setup:
  npm init -y
  npm i @solana/web3.js
  npm i -D ts-node typescript @types/node
Run:
  npx ts-node log_subscribe.ts
Notes:
  For best results, use a WebSocket-enabled RPC (e.g., wss://) from a provider like Helius.
*/

import { Connection, clusterApiUrl, Logs, LogsCallback } from "@solana/web3.js";

async function main() {
  const url = clusterApiUrl("devnet");
  const connection = new Connection(url, "confirmed");

  const subId = connection.onLogs("all", (log: Logs) => {
    console.log("Slot:", log.slot);
    console.log("Signature:", log.signature);
    console.log("Logs:", log.logs);
    console.log("=====================================");
  });

  console.log("Subscribed to logs. Press Ctrl+C to exit.");
  // Keep process alive
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = await new Promise((_resolve) => setTimeout(_resolve, 60 * 60 * 1000));
  await connection.removeOnLogsListener(await subId);
}

main().catch(console.error);
'@
}

# Module 9: Compute budget usage (TypeScript)
$items += @{
  Path = "modules\module-9-performance-security-upgrades\ts\compute_budget_demo.ts";
  Content = @'
/*
Module 9: Performance - Compute budget example (TypeScript)

Setup:
  npm init -y
  npm i @solana/web3.js
  npm i -D ts-node typescript @types/node
Run:
  npx ts-node compute_budget_demo.ts
*/

import {
  Connection, Keypair, LAMPORTS_PER_SOL, clusterApiUrl, ComputeBudgetProgram,
  SystemProgram, Transaction, sendAndConfirmTransaction
} from "@solana/web3.js";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const payer = Keypair.generate();
  const to = Keypair.generate();

  console.log("Airdropping 2 SOL to payer...");
  const sig = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(sig, "confirmed");

  const cuPriceMicroLamports = 50_000; // prioritize
  const cuLimit = 1_000_000; // cap

  const setPrice = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: cuPriceMicroLamports });
  const setLimit = ComputeBudgetProgram.setComputeUnitLimit({ units: cuLimit });

  const transferIx = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: to.publicKey,
    lamports: 0.01 * LAMPORTS_PER_SOL,
  });

  const tx = new Transaction().add(setPrice, setLimit, transferIx);
  const signature = await sendAndConfirmTransaction(connection, tx, [payer]);
  console.log("Tx signature:", signature);
}

main().catch(console.error);
'@
}

foreach ($it in $items) {
  $dir = Split-Path -Parent $it.Path
  Ensure-Dir -Path $dir
  Set-Content -Path $it.Path -Value $it.Content -Encoding UTF8
}

Write-Output "Generated learning code files."

# Additional generators for all module folders
$items2 = @()

# Module 0: README and localnet helper
$items2 += @{
  Path = "modules\module-0-environment\README.md";
  Content = @'
# Module 0: Environment & Prerequisites

Objectives:
- Install Rust, Solana CLI, Node.js, and setup local validator.
- Understand clusters and keypairs.

Files:
- ps-setup.ps1: PowerShell commands for installing toolchains.
- localnet.ps1: Convenience script to start local validator.

How to use:
- Review ps-setup.ps1 and run selected lines based on your environment.
- Start local validator:
  powershell -File .\localnet.ps1
'@
}
$items2 += @{
  Path = "modules\module-0-environment\localnet.ps1";
  Content = @'
# Start a local validator with common flags
Write-Host "Starting solana-test-validator..."
Start-Process -NoNewWindow -FilePath "solana-test-validator" -ArgumentList @(
  "--reset",
  "--quiet",
  "--limit-ledger-size",
  "--bpf-programs"
) -PassThru | Out-Null
Write-Host "Use: solana config set --url http://127.0.0.1:8899"
'@
}

# Module 1: README (Rust essentials)
$items2 += @{
  Path = "modules\module-1-essential-rust\README.md";
  Content = @'
# Module 1: Essential Rust for Solana

Run:
- cargo new rust-essentials
- Replace src/main.rs with examples.rs
- cargo run --release

Topics:
- Ownership/borrowing/lifetimes, traits/generics, pattern matching
- Determinism and error handling without panics
- Checked arithmetic, serialization notes
'@
}

# Module 2: README and transaction structure demo
$items2 += @{
  Path = "modules\module-2-architecture\README.md";
  Content = @'
# Module 2: Solana Architecture & Core Concepts

Files:
- pda_demo.ts: PDA derivation examples.
- tx_structure.ts: Build transactions with multiple instructions.

Run:
- npm init -y
- npm i @solana/web3.js
- npx ts-node pda_demo.ts
- npx ts-node tx_structure.ts
'@
}
$items2 += @{
  Path = "modules\module-2-architecture\tx_structure.ts";
  Content = @'
/*
Module 2: Transaction structure demo (TypeScript)

Setup:
  npm init -y
  npm i @solana/web3.js
  npm i -D ts-node typescript @types/node
Run:
  npx ts-node tx_structure.ts
*/
import {
  Connection, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction,
  LAMPORTS_PER_SOL, clusterApiUrl, ComputeBudgetProgram
} from "@solana/web3.js";

async function main() {
  const conn = new Connection(clusterApiUrl("devnet"), "confirmed");
  const payer = Keypair.generate();
  const recipient = Keypair.generate();

  console.log("Airdropping 1 SOL to payer...");
  const sig = await conn.requestAirdrop(payer.publicKey, 1 * LAMPORTS_PER_SOL);
  await conn.confirmTransaction(sig, "confirmed");

  const setLimit = ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 });
  const setPrice = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 10_000 });

  const transfer = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: recipient.publicKey,
    lamports: 0.05 * LAMPORTS_PER_SOL,
  });

  const tx = new Transaction().add(setLimit, setPrice, transfer);
  const signature = await sendAndConfirmTransaction(conn, tx, [payer]);
  console.log("Transaction signature:", signature);

  const bal = await conn.getBalance(recipient.publicKey);
  console.log("Recipient balance:", bal / LAMPORTS_PER_SOL, "SOL");
}
main().catch(console.error);
'@
}

# Module 3: Anchor README, test, package.json, tsconfig
$items2 += @{
  Path = "modules\module-3-anchor\README.md";
  Content = @'
# Module 3: Program Development with Anchor

Files:
- programs/counter/src/lib.rs: Counter program example.
- programs/counter/Cargo.toml: Program crate configuration.
- Anchor.toml: Workspace settings for localnet.
- tests/counter.ts: Anchor client test.
- package.json, tsconfig.json: Test tooling.

Instructions:
- Ensure Anchor is installed.
- anchor build
- anchor test (or npx ts-mocha -p tsconfig.json tests/counter.ts)
'@
}
$items2 += @{
  Path = "modules\module-3-anchor\tests\counter.ts";
  Content = @'
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

describe("counter program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter as Program<any>;

  it("initializes and increments", async () => {
    const payer = provider.wallet.publicKey;
    const [counterPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("counter"), payer.toBuffer()],
      program.programId
    );

    // Initialize
    await program.methods.initialize().accounts({
      counter: counterPda,
      payer,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).rpc();

    // Increment
    await program.methods.increment().accounts({
      counter: counterPda,
      payer,
      owner: payer, // demo: owner check
    }).rpc();

    // Fetch
    const acc = await program.account.counter.fetch(counterPda);
    console.log("count =", acc.count.toString(), "bump =", acc.bump);
  });
});
'@
}
$items2 += @{
  Path = "modules\module-3-anchor\package.json";
  Content = @'
{
  "name": "module-3-anchor",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "test": "ts-mocha -p tsconfig.json tests/**/*.ts"
  },
  "devDependencies": {
    "@coral-xyz/anchor": "^0.30.1",
    "@types/mocha": "^10.0.6",
    "@types/node": "^20.12.7",
    "mocha": "^10.4.0",
    "ts-mocha": "^10.0.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.2"
  }
}
'@
}
$items2 += @{
  Path = "modules\module-3-anchor\tsconfig.json";
  Content = @'
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "types": ["node", "mocha"]
  }
}
'@
}

# Module 4: Testing & Tooling README and Rust testable example
$items2 += @{
  Path = "modules\module-4-testing-tooling\README.md";
  Content = @'
# Module 4: Testing, Tooling, and Local Development

Files:
- pure_logic_example.rs: Unit tests for pure Rust logic.

Run:
- cargo new testing-demo
- Copy pure_logic_example.rs into src/lib.rs
- cargo test
'@
}
$items2 += @{
  Path = "modules\module-4-testing-tooling\pure_logic_example.rs";
  Content = @'
pub fn add_checked(a: u64, b: u64) -> Option<u64> {
    a.checked_add(b)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn adds_ok() {
        assert_eq!(add_checked(2, 3), Some(5));
    }
    #[test]
    fn detects_overflow() {
        assert_eq!(add_checked(u64::MAX, 1), None);
    }
}
'@
}

# Module 5: Clients & Frontend README, config, and account read demo
$items2 += @{
  Path = "modules\module-5-clients-frontend\README.md";
  Content = @'
# Module 5: Clients and Frontend Integration

Files:
- ts/basic_tx.ts: Transfer with compute budget.
- ts/read_account.ts: Read account info.
- package.json, tsconfig.json: Node/TS tooling.

Run:
- npm install
- npx ts-node ts/basic_tx.ts
- npx ts-node ts/read_account.ts
'@
}
$items2 += @{
  Path = "modules\module-5-clients-frontend\ts\read_account.ts";
  Content = @'
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

async function main() {
  const conn = new Connection(clusterApiUrl("devnet"), "confirmed");
  const pubkey = new PublicKey("11111111111111111111111111111111"); // replace
  const info = await conn.getAccountInfo(pubkey);
  console.log("Account info:", info);
}
main().catch(console.error);
'@
}
$items2 += @{
  Path = "modules\module-5-clients-frontend\package.json";
  Content = @'
{
  "name": "module-5-clients-frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "basic": "ts-node ts/basic_tx.ts",
    "read": "ts-node ts/read_account.ts"
  },
  "dependencies": {
    "@solana/web3.js": "^1.95.6"
  },
  "devDependencies": {
    "@types/node": "^20.12.7",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.2"
  }
}
'@
}
$items2 += @{
  Path = "modules\module-5-clients-frontend\tsconfig.json";
  Content = @'
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
'@
}

# Module 6: Tokens & NFTs README, config
$items2 += @{
  Path = "modules\module-6-tokens-nfts\README.md";
  Content = @'
# Module 6: Tokens and NFTs

Files:
- ts/spl_mint_demo.ts: Create mint, ATA, and mint tokens.
- package.json, tsconfig.json: Node/TS tooling.

Run:
- npm install
- npx ts-node ts/spl_mint_demo.ts
'@
}
$items2 += @{
  Path = "modules\module-6-tokens-nfts\package.json";
  Content = @'
{
  "name": "module-6-tokens-nfts",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "mint": "ts-node ts/spl_mint_demo.ts"
  },
  "dependencies": {
    "@solana/spl-token": "^0.4.8",
    "@solana/web3.js": "^1.95.6"
  },
  "devDependencies": {
    "@types/node": "^20.12.7",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.2"
  }
}
'@
}
$items2 += @{
  Path = "modules\module-6-tokens-nfts\tsconfig.json";
  Content = @'
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
'@
}

# Module 7: DeFi README and AMM math example (Rust)
$items2 += @{
  Path = "modules\module-7-defi\README.md";
  Content = @'
# Module 7: DeFi Primitives and Protocols

Files:
- amm_math.rs: Constant product AMM math with tests.

Run:
- cargo new defi-math
- Copy amm_math.rs into src/lib.rs
- cargo test
'@
}
$items2 += @{
  Path = "modules\module-7-defi\amm_math.rs";
  Content = @'
pub fn k(x: u128, y: u128) -> u128 { x.saturating_mul(y) }

// Amount out for swap given input and reserves (x -> y), with 0.3% fee
pub fn amount_out(x_reserve: u128, y_reserve: u128, dx: u128) -> Option<u128> {
    if x_reserve == 0 || y_reserve == 0 { return None; }
    // apply fee
    let dx_fee = dx.saturating_mul(997) / 1000;
    let numerator = dx_fee.saturating_mul(y_reserve);
    let denominator = x_reserve.saturating_add(dx_fee);
    Some(numerator / denominator)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn cp_invariant() {
        assert_eq!(k(10, 20), 200);
    }
    #[test]
    fn swap_out_ok() {
        let out = amount_out(10_000, 20_000, 1_000).unwrap();
        assert!(out > 0);
    }
}
'@
}

# Module 8: Infrastructure & Observability README, config
$items2 += @{
  Path = "modules\module-8-infrastructure-observability\README.md";
  Content = @'
# Module 8: Infrastructure, RPCs, and Observability

Files:
- ts/log_subscribe.ts: Subscribe to network logs.
- package.json, tsconfig.json: Node/TS tooling.

Run:
- npm install
- npx ts-node ts/log_subscribe.ts
'@
}
$items2 += @{
  Path = "modules\module-8-infrastructure-observability\package.json";
  Content = @'
{
  "name": "module-8-infrastructure-observability",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "logs": "ts-node ts/log_subscribe.ts"
  },
  "dependencies": {
    "@solana/web3.js": "^1.95.6"
  },
  "devDependencies": {
    "@types/node": "^20.12.7",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.2"
  }
}
'@
}
$items2 += @{
  Path = "modules\module-8-infrastructure-observability\tsconfig.json";
  Content = @'
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
'@
}

# Module 9: Performance & Security README, config
$items2 += @{
  Path = "modules\module-9-performance-security-upgrades\README.md";
  Content = @'
# Module 9: Performance, Upgrades, and Security

Files:
- ts/compute_budget_demo.ts: Configure compute unit price and limit.
- package.json, tsconfig.json: Node/TS tooling.

Run:
- npm install
- npx ts-node ts/compute_budget_demo.ts
'@
}
$items2 += @{
  Path = "modules\module-9-performance-security-upgrades\package.json";
  Content = @'
{
  "name": "module-9-performance-security-upgrades",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "compute": "ts-node ts/compute_budget_demo.ts"
  },
  "dependencies": {
    "@solana/web3.js": "^1.95.6"
  },
  "devDependencies": {
    "@types/node": "^20.12.7",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.2"
  }
}
'@
}
$items2 += @{
  Path = "modules\module-9-performance-security-upgrades\tsconfig.json";
  Content = @'
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
'@
}

# Module 10: Capstone README
$items2 += @{
  Path = "modules\module-10-capstone\README.md";
  Content = @'
# Module 10: Capstone Projects

Deliverables:
- Production-ready dApp or protocol
- Tests, deployment scripts, documentation
- Postmortem on security, performance, future work

Project tracks:
- Beginner: token minting dApp, voting system, wallet balance tracker, NFT minter
- Intermediate: DEX prototype, NFT marketplace with auctions, staking + rewards, multisig wallet
- Advanced: lending protocol, AMM, cross-chain bridge, DAO governance
'@
}

foreach ($it in $items2) {
  $dir = Split-Path -Parent $it.Path
  if ($dir -and $dir -ne "") { if (-not (Test-Path -Path $dir -PathType Container)) { New-Item -ItemType Directory -Path $dir | Out-Null } }
  Set-Content -Path $it.Path -Value $it.Content -Encoding UTF8
}

Write-Output "Generated additional module files."