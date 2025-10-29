# Solidity Basics – SimpleStorage

Summary
- Learn core Solidity concepts using a minimal contract:
  - State variables, visibility, constructor
  - Modifiers and custom errors
  - Events and indexed parameters
  - Owner-restricted write functions
- Contract file: lessons/beginner/02-solidity-basics/contracts/SimpleStorage.sol
- Next step: interact with it using Ethers.js (see Beginner 03)

What you will build
- A contract that stores a single uint256 value
- Only the owner can set or increment the value
- Events emitted for ownership changes and value updates
- Custom errors for common fail cases

Contract interface (high-level)
- constructor(uint256 initialValue)
- function get() external view returns (uint256)
- function set(uint256 newValue) external onlyOwner
- function increment(uint256 delta) external onlyOwner returns (uint256)
- function transferOwnership(address newOwner) external onlyOwner
- function renounceOwnership() external onlyOwner
- event ValueChanged(uint256 indexed previous, uint256 indexed current)
- event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
- error NotOwner()
- error ValueUnchanged(uint256 attempted)

1) Read the code
- Open lessons/beginner/02-solidity-basics/contracts/SimpleStorage.sol
- Note:
  - _value stores the current number (private)
  - owner tracks who can write
  - onlyOwner modifier reverts with NotOwner() if msg.sender != owner
  - set() reverts with ValueUnchanged(newValue) if the new value equals the old
  - events are emitted on ownership/value changes

2) Compile and deploy with Remix (no local setup)
- Go to https://remix.ethereum.org/
- Create a new file: contracts/SimpleStorage.sol
- Paste the contents of lessons/beginner/02-solidity-basics/contracts/SimpleStorage.sol
- In the Solidity compiler tab:
  - Compiler 0.8.20 (or compatible with ^0.8.20)
  - Enable Auto-compile (optional)
  - Click Compile
- In the Deploy & Run tab:
  - Select Environment: Remix VM (or Injected Provider for testnet)
  - In constructor args, set initialValue (e.g., 42)
  - Click Deploy
- Interact in Remix:
  - get() reads the current value
  - set(100) changes the value (onlyOwner)
  - increment(7) increases the value (onlyOwner)
  - transferOwnership(0x...) moves ownership
  - renounceOwnership() sets owner to the zero address (after this, writes will fail)

3) Compile with Hardhat (local dev)
Option A: Use the Intermediate/Hardhat project in this repo
- Navigate to lessons/intermediate/hardhat
- Ensure Node.js 18+ is installed
- Copy SimpleStorage.sol into contracts/ (optional if you only want to compile this contract)
- npm install
- npx hardhat compile
- You can write a small deploy script in scripts/ to deploy and interact locally

Option B: Minimal fresh Hardhat setup
- mkdir simple-storage && cd simple-storage
- npm init -y
- npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
- npx hardhat init (choose JavaScript)
- Copy SimpleStorage.sol into contracts/
- Update hardhat.config.js solidity version to 0.8.20 and enable optimizer:
  - solidity: { version: "0.8.20", settings: { optimizer: { enabled: true, runs: 200 } } }
- Compile:
  - npx hardhat compile
- Local node:
  - npx hardhat node
- Deploy (example skeleton):
  - Create scripts/deploy-simple-storage.js with a basic deployment using ethers from hardhat runtime
  - Run: npx hardhat run scripts/deploy-simple-storage.js --network localhost

4) Quick Ethers v6 interaction snippet (for reference)
- You can use this after deployment to read/write the contract
- Replace RPC_URL, PRIVATE_KEY, ADDRESS, and ABI as appropriate
```js
// interact-snippet.js (Ethers v6, Node ESM)
// npm i ethers dotenv
import { ethers } from "ethers";
import "dotenv/config";

// .env:
// RPC_URL=...
// PRIVATE_KEY=...
// CONTRACT=0xYourDeployedAddress

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Minimal ABI subset (get, set, ValueChanged)
const abi = [
  "function get() view returns (uint256)",
  "function set(uint256 newValue)",
  "event ValueChanged(uint256 indexed previous, uint256 indexed current)"
];

const address = process.env.CONTRACT;

async function main() {
  const contract = new ethers.Contract(address, abi, wallet);

  const before = await contract.get();
  console.log("Before:", before.toString());

  const tx = await contract.set(before + 1n); // bump by 1
  console.log("Sent tx:", tx.hash);

  const rc = await tx.wait();
  console.log("Mined in block:", rc.blockNumber);

  for (const log of rc.logs) {
    try {
      const parsed = contract.interface.parseLog(log);
      console.log("Event:", parsed.name, parsed.args);
    } catch {}
  }

  const after = await contract.get();
  console.log("After:", after.toString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

5) Common pitfalls
- Not setting the correct Solidity compiler version (use 0.8.20 or compatible)
- Forgetting to pass initialValue in the constructor when deploying
- Attempting to call set() or increment() from a non-owner account (reverts with NotOwner)
- Setting the same value (reverts with ValueUnchanged)
- Renouncing ownership and later trying to call onlyOwner functions (will revert)

6) Exercises
- Deploy with initialValue = 1 and then:
  - set(5), check get() returns 5, then increment(10) → get() should return 15
  - Transfer ownership to a second address and verify onlyOwner functions fail from the old owner
  - Listen for ValueChanged events and print both previous and current values
- Change the contract:
  - Add a decrement(uint256 delta) with similar event logic
  - Add a pause flag that disables writes (set/increment) unless paused == false

7) What’s next
- Beginner 03 will include runnable Node.js scripts to:
  - Connect via Web3.js and Ethers.js
  - Read chain data, account balances, and fees
  - Interact with SimpleStorage using a ready-made script
- Move on to Intermediate for full Hardhat/Truffle projects and testing