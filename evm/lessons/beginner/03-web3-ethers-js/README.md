# Web3.js and Ethers.js – RPC connectivity and contract interaction

Overview
- Learn how to connect to an EVM RPC, read chain data, fees, balances
- Use Web3.js and Ethers.js v6 side-by-side
- Interact with a deployed SimpleStorage contract

Files in this lesson
- Web3 connectivity script: lessons/beginner/03-web3-ethers-js/web3-connect.js
- Ethers connectivity script: lessons/beginner/03-web3-ethers-js/ethers-connect.js
- SimpleStorage interaction: lessons/beginner/03-web3-ethers-js/interact-simple-storage.js
- SimpleStorage contract (from previous lesson): lessons/beginner/02-solidity-basics/contracts/SimpleStorage.sol

Prerequisites
- Node.js 18+ (LTS recommended)
- A public RPC URL (Alchemy/Infura/Ankr/Cloudflare) or a local Hardhat node
- For ESM: ensure your package.json contains "type": "module"

Setup
- Initialize a project (optional if you already have one):
  - npm init -y
- Install dependencies:
  - npm install ethers web3 dotenv
- Create a .env file at the project root:
  - RPC_URL=https://cloudflare-eth.com
  - PRIVATE_KEY=0xabc...        # only if you want wallet actions
  - ADDRESS=0x...               # any address to inspect
  - TOKEN=0x...                 # ERC20 address to inspect (optional)
  - CONTRACT=0x...              # deployed SimpleStorage address
  - NEW_VALUE=123               # optional for interact script
  - NEW_DELTA=7                 # optional increment value

1) Run the Web3.js connectivity demo
- Command:
  - node lessons/beginner/03-web3-ethers-js/web3-connect.js [0xAddress]
- It prints:
  - chainId, latest block, gas price (wei)
  - optional balance for the address
  - block hash and transaction count

2) Run the Ethers v6 connectivity demo
- Command:
  - node lessons/beginner/03-web3-ethers-js/ethers-connect.js [0xAddress]
- It prints:
  - chainId, latest block, EIP-1559 fee fields
  - optional signer address/balance (if PRIVATE_KEY set)
  - optional ERC20 metadata and balance (if TOKEN/ADDRESS set)

3) Deploy SimpleStorage quickly (local)
Option A: Use Hardhat from the Intermediate lesson
- Start a local node:
  - npx hardhat node
- Deploy SimpleStorage with a small script or via Hardhat console
- Put the deployed address into CONTRACT in your .env

Option B: Use Remix
- Open remix.ethereum.org
- Paste the contract from: lessons/beginner/02-solidity-basics/contracts/SimpleStorage.sol
- Compile (0.8.20) and deploy with initialValue (e.g., 42)
- Put the deployed address into CONTRACT in your .env (and set RPC_URL to the network)

4) Interact with SimpleStorage using Ethers v6
- Command (uses CONTRACT and PRIVATE_KEY from .env):
  - node lessons/beginner/03-web3-ethers-js/interact-simple-storage.js [newValue]
- What it does:
  - Reads current value via get()
  - Previews set(newValue) via staticCall to catch reverts (like ValueUnchanged)
  - Estimates gas and sends set(newValue)
  - Waits for receipt and parses ValueChanged events
  - Optionally calls increment(NEW_DELTA) if set

Using a local Hardhat node
- Start a node in another terminal:
  - npx hardhat node
- In .env set:
  - RPC_URL=http://127.0.0.1:8545
  - PRIVATE_KEY=<one of the printed private keys from the node>
- Re-run the scripts; they will use the local chain

Common pitfalls
- Missing "type":"module" in package.json when using ESM imports
- Invalid PRIVATE_KEY format (must be 0x-prefixed hex)
- CONTRACT not set when running the interaction script
- Using an RPC with insufficient permissions (some free endpoints throttle requests)
- Trying to write on a public RPC without funds in the wallet

Exercises
- Compare outputs between Web3.js and Ethers.js on the same RPC
- Fetch gas price and convert to gwei and ETH for a sample transaction
- Deploy SimpleStorage twice (different initial values) and interact with both
- Try a different network (Sepolia) and observe fees vs. mainnet

Next steps
- Continue with Intermediate lessons to learn Hardhat/Truffle workflows
- Explore frontend integration with Wagmi/RainbowKit
- Learn about Chainlink VRF and local mocks for external data

References
- Ethers v6 docs: https://docs.ethers.org/
- Web3.js v4 docs: https://docs.web3js.org/
- The SimpleStorage contract in this repo:
  - lessons/beginner/02-solidity-basics/contracts/SimpleStorage.sol
- Related scripts:
  - lessons/beginner/03-web3-ethers-js/web3-connect.js
  - lessons/beginner/03-web3-ethers-js/ethers-connect.js
  - lessons/beginner/03-web3-ethers-js/interact-simple-storage.js