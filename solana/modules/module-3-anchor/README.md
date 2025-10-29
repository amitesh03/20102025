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