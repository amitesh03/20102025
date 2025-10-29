# Security Best Practices – Reentrancy

This folder contains runnable examples demonstrating reentrancy vulnerabilities and fixes, mapping to the syllabus "Security Best Practices".

Contracts
- Vulnerable example: [`lessons/advanced/security/Reentrancy.sol`](lessons/advanced/security/Reentrancy.sol)
- Fixed example with CEI + ReentrancyGuard: [`lessons/advanced/security/ReentrancyFixed.sol`](lessons/advanced/security/ReentrancyFixed.sol)

What you will learn
- Why calling external addresses before updating state enables reentrancy
- How to apply Checks-Effects-Interactions (CEI)
- How `ReentrancyGuard` prevents re-entry to functions
- How to structure tests and demo scripts to observe the issue safely

Running a local demo with Hardhat
1) Ensure a Hardhat project (use the Intermediate lesson):
   - [`lessons/intermediate/hardhat/README.md`](lessons/intermediate/hardhat/README.md)
2) Copy contracts into the Hardhat project's `contracts/` folder:
   - [`lessons/advanced/security/Reentrancy.sol`](lessons/advanced/security/Reentrancy.sol)
   - [`lessons/advanced/security/ReentrancyFixed.sol`](lessons/advanced/security/ReentrancyFixed.sol)
3) Compile:
   - `npx hardhat compile`
4) Create a deploy script to deploy `VulnerableBank` and fund it:
   - Start node: `npx hardhat node`
   - In another terminal, write and run a simple deploy script that:
     - Deploys `VulnerableBank`
     - Sends a small amount of ETH to it (via `deposit()`)
     - Deploys `Attacker` with the bank address
     - Calls `attack()` from the owner with a small seed value
5) Observe output:
   - The attacker receives ETH via `receive()` and re-enters the bank
   - The bank's internal balance of the attacker is not yet zero during the external call
   - Funds can be drained in the vulnerable case

Switch to the fixed contract
- Replace `VulnerableBank` with `SafeBank` from [`lessons/advanced/security/ReentrancyFixed.sol`](lessons/advanced/security/ReentrancyFixed.sol)
- Re-run the same script and verify:
  - Re-entrance is prevented (nonReentrant)
  - State is updated before external calls (CEI)
  - Draining behavior is no longer possible

Key patterns to apply in production
- Keep external calls last; update your internal state before interacting with external addresses
- Use `ReentrancyGuard` on state-changing functions receiving or sending ETH
- Prefer pull payments (users withdraw) over push payments
- Limit gas forwarding when possible and ensure it is not relied upon for security
- Add monitoring/alerting for large transfers and admin actions:
  - See Ops monitor template: [`lessons/ops/monitor-events.js`](lessons/ops/monitor-events.js)

References
- Vulnerable example: [`Reentrancy.sol`](lessons/advanced/security/Reentrancy.sol)
- Fixed example: [`ReentrancyFixed.sol`](lessons/advanced/security/ReentrancyFixed.sol)
- Hardhat setup: [`lessons/intermediate/hardhat/README.md`](lessons/intermediate/hardhat/README.md)
- OpenZeppelin Contracts (ReentrancyGuard)