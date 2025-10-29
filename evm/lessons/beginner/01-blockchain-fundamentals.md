# Blockchain Fundamentals

What you will learn
- The mental model for blockchains and how Ethereum fits in
- Accounts, transactions, gas, and blocks
- The EVM (Ethereum Virtual Machine) at a high level
- Hands-on: read on-chain data using a small Node.js script with Ethers v6

Who is this for
- Developers new to Ethereum and EVM-compatible chains (Polygon, Arbitrum, Base, BSC, etc.)
- Anyone who prefers learning by doing with code

1) What is a blockchain (in practice)
- A replicated, append-only, tamper-evident ledger shared by a network of nodes
- Every node executes the same state transition function (the EVM) and reaches consensus on the resulting state
- Blocks are batches of transactions; each block references the previous block (hash-linked chain)

Key properties
- Integrity: history is linked by cryptographic hashes
- Consensus: nodes agree on valid blocks (PoS on Ethereum mainnet)
- Finality: after enough confirmations, reorg risk becomes negligible
- Censorship resistance: permissionless participation and tx submission

2) Ethereum accounts
- Externally Owned Account (EOA): controlled by a private key (e.g., Metamask, hardware wallets)
- Contract account: code + storage deployed at an address (no private key)
- Both have balances (ETH) and can send/receive value
- EOAs initiate transactions; contracts execute code when invoked by transactions

3) Transactions and gas
- A transaction is a signed instruction from an EOA that changes state (or tries to)
- Gas measures “how much work” a transaction does; you pay ETH per gas unit
- Base fee + priority tip determines inclusion speed; miners/validators earn tips
- Unused gas is refunded; if you run out of gas the EVM reverts state changes

Rough fee math example
- Suppose a tx uses 50,000 gas units
- Base fee = 25 gwei, Tip = 2 gwei, Effective gas price ≈ 27 gwei
- Fee ≈ 50,000 * 27 gwei = 1,350,000 gwei = 0.00135 ETH

4) Blocks
- Contain: header (metadata), list of transactions, ommers (historical), receipts, logs
- Block time: variable; average target on Ethereum Proof of Stake ≈ 12s
- Finality: checkpoints via consensus protocol; more confirmations → more confidence

5) EVM (Ethereum Virtual Machine)
- Deterministic, stack-based VM that executes smart contract bytecode
- Accounts have storage (persistent key-value), memory (ephemeral), and code
- Opcodes perform arithmetic, control flow, storage reads/writes, logging, calls
- Gas is charged per opcode to bound execution and prevent DoS

6) Try it: Read chain data with Ethers v6

Prerequisites
- Node.js 18+ (LTS recommended)
- A public RPC URL (free: Alchemy/Infura or Cloudflare for mainnet)

Project setup (from this directory or any working folder)
- Initialize package.json:
  - npm init -y
- Install deps:
  - npm install ethers dotenv
- Mark the project as ESM (Ethers v6 is ESM-only):
  - Edit package.json: add "type": "module"

Create a .env file
- .env
  - RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your_api_key
  - ADDRESS=0x0000000000000000000000000000000000000000  # any address to inspect

Create block-reader.js
```js
// block-reader.js
// Node 18+ ESM
import { ethers } from "ethers";
import "dotenv/config";

const RPC_URL = process.env.RPC_URL ?? "https://cloudflare-eth.com";
const ADDRESS = process.argv[2] ?? process.env.ADDRESS;

const provider = new ethers.JsonRpcProvider(RPC_URL);

async function readBasics() {
  const network = await provider.getNetwork();
  const latest = await provider.getBlockNumber();
  const fee = await provider.getFeeData();

  console.log("Network:", network.chainId.toString(), network.name);
  console.log("Latest block:", latest);
  console.log("Base fee (wei):", fee.gasPrice?.toString() ?? "n/a");
  console.log("MaxFeePerGas (wei):", fee.maxFeePerGas?.toString() ?? "n/a");
  console.log("MaxPriorityFeePerGas (wei):", fee.maxPriorityFeePerGas?.toString() ?? "n/a");

  const block = await provider.getBlock(latest);
  console.log("Block hash:", block.hash);
  console.log("Tx count:", block.transactions.length);
}

async function readAddress(addr) {
  if (!addr) {
    console.log("No address provided; skipping balance lookup. Pass an address as argv[2] or set ADDRESS in .env");
    return;
  }
  const balance = await provider.getBalance(addr);
  console.log(`Balance of ${addr}:`, ethers.formatEther(balance), "ETH");

  // Optional: estimate cost of a simple value transfer from addr (if signer available)
  // Here we only show how to estimate gas for a call to addr as a recipient placeholder
  const to = addr;
  const estimate = await provider.estimateGas({ to, value: ethers.parseEther("0.001") }).catch(() => null);
  console.log("Estimated gas for 0.001 ETH transfer to address:", estimate?.toString() ?? "n/a");
}

async function main() {
  console.log("RPC:", RPC_URL);
  await readBasics();
  await readAddress(ADDRESS);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

Run it
- node block-reader.js
- With a specific address:
  - node block-reader.js 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
- You should see:
  - Chain id, name, latest block, fee data
  - Block hash and transaction count
  - Address balance (if provided)

Exploring further
- Replace latest with a specific block number (e.g., latest - 100)
- Fetch a transaction by hash: await provider.getTransaction("<tx-hash>")
- Fetch a receipt: await provider.getTransactionReceipt("<tx-hash>")
- Iterate logs with a filter:
```js
const filter = {
  address: ADDRESS, // or a contract address
  fromBlock: "latest", // or a block number
};
provider.on(filter, (log) => {
  console.log("Log:", log);
});
```

7) Exercises
- Explain, in your own words, why gas exists and what problem it solves
- Use your RPC to fetch the last 5 blocks and list their transaction counts
- Find a well-known contract (e.g., a stablecoin) and log its last 3 Transfer events
- Try pointing RPC_URL at a testnet (e.g., Sepolia) and compare base fees vs. mainnet

8) Next lessons (where we’re headed)
- Solidity fundamentals and a simple contract (SimpleStorage)
- Local development with Hardhat and Truffle
- Frontend integration with Wagmi / RainbowKit
- Oracle data with Chainlink

Reference links
- Ethers v6 docs: https://docs.ethers.org/
- Ethereum Developer Portal: https://ethereum.org/en/developers/
- Block explorers: https://etherscan.io/ (mainnet), https://sepolia.etherscan.io/ (testnet)