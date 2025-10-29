# Solana Development Syllabus — Modular Edition

This syllabus is organized into self-contained modules. Each module includes objectives, topics, hands-on labs, and references. Start at Module 0 and proceed sequentially, or mix-and-match based on your experience.

## Module 0: Environment & Prerequisites
- Objectives:
  - Install and configure the Rust toolchain, Solana CLI, Node.js, and a local validator.
  - Understand accounts, keypairs, and clusters (devnet, testnet, mainnet).
- Topics:
  - Tooling: rustup, cargo, Solana CLI, Node.js/yarn, pnpm, Docker (optional), Git.
  - Local validator basics and airdrops; keypair management; Solana Explorer.
- Lab:
  - Install toolchain and verify: rustc, cargo, solana --version, solana-test-validator.
  - Create a workspace folder and initialize a Git repository.
- References:
  - Official docs, Explorer, and local validator guides (see Resources).

## Module 1: Essential Rust for Solana
- Objectives:
  - Gain fluency with Rust language features required for safe, efficient on-chain programs.
  - Learn project configuration for Solana BPF targets and testing workflows.
- Topics:
  - Ownership, borrowing, lifetimes; zero-cost abstractions and data layout.
  - Enums, pattern matching, Result and error handling without panics.
  - Traits, generics, trait bounds; composing reusable, type-safe APIs.
  - Serialization on Solana: Borsh; Anchor account encoding; padding and alignment.
  - Determinism: avoid time, randomness, filesystem, and network IO on-chain.
  - Cargo structure: workspaces, features, release profiles, LTO, panic = abort.
  - Linting and formatting: clippy, rustfmt.
- Lab:
  - Write a pure-Rust state machine with exhaustive pattern matching and unit tests.
  - Configure Cargo.toml for release profile optimizations and clippy checks.
- References:
  - Rust Book, Rustonomicon; Borsh and Anchor type system notes (see Resources).

## Module 2: Solana Architecture & Core Concepts
- Objectives:
  - Understand Solana’s execution model and account-based state.
- Topics:
  - Proof of History (PoH), Gulf Stream, Turbine, Sealevel parallelism.
  - Accounts, rent-exemption, ownership, account data layout, sysvars.
  - Instructions and transactions, compute unit budgeting.
  - Program Derived Addresses (PDAs) and seeds; canonical PDA derivation.
- Lab:
  - Derive PDAs for a simple application; inspect accounts with Solana CLI and Explorer.
- References:
  - Solana Docs, Solana Cookbook.

## Module 3: Program Development with Anchor
- Objectives:
  - Build secure Solana programs using Anchor framework patterns and constraints.
- Topics:
  - Project structure: programs/, Anchor.toml, IDL generation.
  - Scaffolding: Oxylana (Rust) and Anchor init templates.
  - Seahorse (Python-based smart contracts): author in Python, compile to BPF, interop with Anchor.
  - Accounts context structs, constraints, seeds, bumps; instruction handlers.
  - Errors, events, and logging; CPI to other programs; re-entrancy and signer checks.
  - Zero-copy strategies and account size migrations; upgradeable programs.
  - Security best practices and audits; common pitfalls and invariants.
- Lab:
  - Implement a counter or vault program with PDAs, constraints, and events.
  - Add a CPI call to SPL Token for token transfers.
- References:
  - Anchor Documentation; Solana Program examples; Solana Cookbook patterns.

## Module 4: Testing, Tooling, and Local Development
- Objectives:
  - Create reliable test suites and repeatable local environments.
- Topics:
  - Anchor tests; local validator; account fixtures; log inspection.
  - Amman for local validator orchestration and account snapshots.
  - Rust unit/integration tests; property tests where applicable.
  - Formatting and linting automation with rustfmt & clippy.
- Lab:
  - Write integration tests that spin up a local validator and validate program invariants.
  - Use Amman to seed test accounts and snapshot state between tests.
- References:
  - Anchor testing guide; Amman; Local validator docs.

## Module 5: Clients and Frontend Integration
- Objectives:
  - Integrate programs with TypeScript/React and Python clients.
- Topics:
  - Solana Wallet Adapter: multi-wallet support, connection, signing, and authorization.
  - Solita: generate type-safe TS clients from IDL; interface-first development.
  - AnchorPy: Python client usage for program interactions and testing.
  - Next.js Scaffold: pre-wired React + Solana template and patterns.
- Lab:
  - Build a React page that connects a wallet, fetches an account, and sends a transaction.
  - Generate a Solita client and call your program from the frontend.
- References:
  - Solana Wallet Adapter docs; Solita; AnchorPy; Scaffold tutorials.

## Module 6: Tokens and NFTs
- Objectives:
  - Work with SPL tokens and Metaplex standards to build token/NFT apps.
- Topics:
  - SPL Token standard: mints, token accounts, ATAs, mint/burn, multisig.
  - Metaplex Token Metadata; Candy Machine for drops; collections.
  - Metaboss for metadata updates and bulk ops.
- Lab:
  - Mint an SPL token with a multisig; create and trade NFTs via Candy Machine.
  - Use Metaboss to update metadata and manage collections.
- References:
  - SPL Token docs; Metaplex docs; Metaboss guides.

## Module 7: DeFi Primitives and Protocols
- Objectives:
  - Understand and implement core DeFi mechanisms on Solana.
- Topics:
  - Orderbook DEX (Serum) concepts; AMMs (Raydium, Orca).
  - Staking, rewards, liquidity mining; price oracles.
- Lab:
  - Build a minimal AMM or staking program; integrate with a DEX or oracle.
- References:
  - Serum, Raydium, Orca documentation and examples.

## Module 8: Infrastructure, RPCs, and Observability
- Objectives:
  - Operate production-grade dApps with reliable infrastructure and insights.
- Topics:
  - RPC providers: QuickNode, Chainstack, Helius; rate limits, retries, and fallbacks.
  - WebSockets for real-time subscriptions; historical data access.
  - Priority fees and transaction simulation; error surfaces and retry strategy.
  - Monitoring, analytics, alerting: logs, traces, dashboards.
  - Deployment workflows and CI/CD: devnet/testnet/mainnet, versioning, canary, rollbacks.
  - Enterprise considerations: compliance, institutional key management, private transaction solutions.
- Lab:
  - Compare RPC provider performance; implement robust retry and fee configuration.
  - Set up program logs/metrics and create a basic monitoring dashboard.
- References:
  - Provider docs; monitoring/analytics tools; Explorer and transaction inspector.

## Module 9: Performance, Upgrades, and Security
- Objectives:
  - Optimize compute, maintain upgrade paths, and secure your protocols.
- Topics:
  - Compute unit budgeting and hot-path optimization; account data layout.
  - Zero-copy with careful alignment; minimizing allocations and clones.
  - Program upgrade mechanisms; versioning and migration playbooks.
  - Security reviews, audits, common vulnerability patterns; incident response.
- Lab:
  - Profile compute usage, refactor a hot path, and budget compute units.
  - Plan and execute a program upgrade with data migration.
- References:
  - Performance tuning guides; audit reports and best practices.

## Module 10: Capstone Projects
- Objectives:
  - Ship a production-ready dApp or protocol demonstrating mastery.
- Project tracks:
  - Beginner: token minting dApp, voting system, wallet balance tracker, basic NFT minter.
  - Intermediate: DEX prototype, NFT marketplace with auctions, staking + rewards, multisig wallet.
  - Advanced: lending protocol, AMM, cross-chain bridge, DAO governance platform.
- Deliverables:
  - Code repository with tests, deployment scripts, and documentation.
  - Postmortem report covering security, performance, and future work.

## Resources and References
- Official Documentation
  - Solana: https://docs.solana.com/
  - Anchor: https://www.anchor-lang.com/
  - Solana Cookbook: https://solanacookbook.com/
  - Metaplex: https://docs.metaplex.com/
- Development Tools
  - Solana CLI, Solana Explorer, Solana Playground, Local validator
- Community
  - Discord, Reddit, GitHub orgs, forums, blogs, YouTube tutorials
- Security
  - Best practices, audit reports, common vuln patterns, audit firms

## Appendix A: CLI and Cargo Quick Reference
- Cargo
  - Build: cargo build --release
  - Test: cargo test
  - Lint: cargo clippy -- -D warnings
  - Format: cargo fmt --all
- Solana CLI
  - Localnet: solana-test-validator
  - Airdrop: solana airdrop 2
  - Keygen: solana-keygen new --outfile ~/.config/solana/id.json
  - Config: solana config set --url https://api.devnet.solana.com

## Appendix B: Sample Program Cargo.toml Snippet
[profile.release]
lto = "fat"
codegen-units = 1
panic = "abort"
opt-level = "s"

# Enable this when using nightly or if size is critical
# strip = "symbols"

[workspace]
members = ["programs/*", "clients/ts", "clients/py"]

# Note: Anchor projects will also include Anchor.toml and IDL artifacts.