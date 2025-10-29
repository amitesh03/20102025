# Blockchain Fundamentals for EVM dApps

This lesson maps to the syllabus sections:
- Blockchain Fundamentals
- Ethereum Specifics

Learning objectives:
- Understand distributed ledger basics and consensus
- Explain accounts (EOA vs Contract) and the transaction lifecycle
- Describe gas, fees, and block structure
- Recognize L1 vs L2 differences

Prerequisites:
- Node.js and a terminal
- An RPC URL (Alchemy/Infura or local Hardhat node)

1. Distributed Ledger Technology (DLT)

A blockchain is an append-only log replicated across many nodes. Each block references the previous block via a hash, forming an immutable chain.

Key data structures:
- Hash functions (keccak256 on Ethereum)
- Merkle trees (efficient inclusion proofs)
- Block headers (metadata such as parentHash, stateRoot, receiptsRoot)

2. Consensus Mechanisms

Ethereum uses Proof of Stake (PoS). Validators propose blocks; others attest. Finality is achieved via Casper FFG and fork-choice rules.

Consequences:
- Lower energy cost vs PoW
- Economic security via stake/slashing

3. Cryptographic Primitives

- ECDSA over secp256k1 for signing
- keccak256 for hashing
- Nonces to prevent replay

4. Transaction Lifecycle

Steps:
- Construct transaction (to, data, value, gasLimit)
- Sign with private key
- Broadcast to mempool via RPC provider
- Miner/validator includes in a block
- Transaction is executed by EVM, updating state
- Receipts and events are generated

5. Block Structure

Important fields:
- parentHash
- number
- timestamp
- gasUsed/gasLimit
- baseFeePerGas

6. Accounts: EOA vs Contract

- EOA: controlled by a private key; can send transactions
- Contract: code + storage; executes on message calls; cannot initiate transactions autonomously

7. Gas and Fees

Gas measures computational work. You pay:
fee = gasUsed * (baseFee + priorityFee)

Optimize by:
- Avoiding redundant storage writes
- Using events for indexing rather than on-chain arrays
- Tight packing of storage

8. State and Storage

Ethereum state is a Merkle-Patricia trie of accounts. Each contract has storage slots (key-value mapping) and code.

9. Network Layers (L1, L2)

- L1: Ethereum main network (security, settlement)
- L2: Rollups (Optimistic, ZK) for scalability; post proofs to L1

Hands-on: Read chain data with Ethers.js

Create lessons/beginner/03-web3-ethers-js/ethers-connect.js and add:

// Read latest block and gas price
// npm i ethers
const { ethers } = require("ethers");
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
(async () => {
  console.log("BlockNumber:", await provider.getBlockNumber());
  console.log("GasPrice:", (await provider.getGasPrice()).toString());
})();

To run:
- Set RPC_URL in .env
- node ethers-connect.js

What you learned

- Relationship between blocks, transactions, and state
- How providers expose chain data
- How baseFee impacts transaction cost

Next

Proceed to Solidity basics: implement a SimpleStorage contract and interact via Ethers.

References

- Ethereum.org Developers
- Solidity docs
- Ethers.js docs
- Hardhat docs