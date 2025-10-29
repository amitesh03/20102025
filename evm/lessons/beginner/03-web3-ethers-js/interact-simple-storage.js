// interact-simple-storage.js
// Ethers v6 ESM script to interact with SimpleStorage:
// - Reads current value
// - Optionally previews set(newValue) via staticCall to catch custom errors
// - Sends transaction to set or increment value
// - Parses emitted events from the receipt
//
// Prerequisites:
//   npm i ethers dotenv
//   Ensure package.json contains: { "type": "module" }
//
// .env variables:
//   RPC_URL=...            // e.g. Sepolia or local Hardhat node
//   PRIVATE_KEY=...        // funded test wallet
//   CONTRACT=0x...         // deployed SimpleStorage address
//   NEW_VALUE=123          // optional target value to set
//
// Usage:
//   node lessons/beginner/03-web3-ethers-js/interact-simple-storage.js [newValue]
//
// Contract reference: [`lessons/beginner/02-solidity-basics/contracts/SimpleStorage.sol`](lessons/beginner/02-solidity-basics/contracts/SimpleStorage.sol)
import { ethers } from "ethers";
import "dotenv/config";

const RPC_URL = process.env.RPC_URL ?? "http://127.0.0.1:8545"; // use local Hardhat node by default
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT = process.env.CONTRACT;
const ARG_VALUE = process.argv[2];
const NEW_VALUE = ARG_VALUE ?? process.env.NEW_VALUE;

// Minimal ABI subset for interaction
const ABI = [
  "function get() view returns (uint256)",
  "function set(uint256 newValue)",
  "function increment(uint256 delta) returns (uint256)",
  "event ValueChanged(uint256 indexed previous, uint256 indexed current)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"
];

async function main() {
  if (!PRIVATE_KEY) {
    console.error("Missing PRIVATE_KEY in environment.");
    process.exit(1);
  }
  if (!CONTRACT) {
    console.error("Missing CONTRACT address in environment.");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT, ABI, wallet);

  console.log("RPC:", RPC_URL);
  console.log("Contract:", CONTRACT);
  console.log("Signer:", await wallet.getAddress());

  // Read current value
  const current = await contract.get();
  console.log("Current value:", current.toString());

  // Determine target new value:
  let targetValue;
  if (NEW_VALUE !== undefined) {
    // If provided, use it
    targetValue = BigInt(NEW_VALUE);
    console.log("Target new value (from input/env):", targetValue.toString());
  } else {
    // Otherwise, increment by 1
    targetValue = current + 1n;
    console.log("No NEW_VALUE provided; will set to current+1 =", targetValue.toString());
  }

  // Optional: preview with staticCall (catches ValueUnchanged and other reverts)
  try {
    // Static call doesn't change chain state; good for validating newValue
    await contract.set.staticCall(targetValue);
    console.log("staticCall preview: set(newValue) would succeed");
  } catch (err) {
    console.log("staticCall preview: set(newValue) would REVERT");
    console.log("Error:", err?.message ?? String(err));
    // You can choose to exit here if preview fails:
    // process.exit(1);
  }

  // Gas estimate for set(newValue)
  const gasEstimate = await contract.set.estimateGas(targetValue).catch(() => null);
  console.log("Estimated gas for set(newValue):", gasEstimate ? gasEstimate.toString() : "n/a");

  // Send transaction
  const tx = await contract.set(targetValue);
  console.log("Sent tx:", tx.hash);

  // Wait for receipt
  const receipt = await tx.wait();
  console.log("Mined in block:", receipt.blockNumber);
  console.log("Gas used:", receipt.gasUsed?.toString?.() ?? "n/a");

  // Parse events from receipt logs
  for (const log of receipt.logs) {
    try {
      const parsed = contract.interface.parseLog(log);
      console.log("Event:", parsed.name, parsed.args);
    } catch {
      // skip non-matching logs
    }
  }

  // Verify new value
  const after = await contract.get();
  console.log("New value:", after.toString());

  // Optional: increment by delta via CLI NEW_DELTA
  const deltaEnv = process.env.NEW_DELTA;
  if (deltaEnv) {
    const delta = BigInt(deltaEnv);
    const incGas = await contract.increment.estimateGas(delta).catch(() => null);
    console.log("Estimated gas for increment(delta):", incGas ? incGas.toString() : "n/a");

    const incTx = await contract.increment(delta);
    console.log("Sent increment tx:", incTx.hash);
    const incRc = await incTx.wait();
    console.log("Increment mined in block:", incRc.blockNumber);

    for (const log of incRc.logs) {
      try {
        const parsed = contract.interface.parseLog(log);
        console.log("Event:", parsed.name, parsed.args);
      } catch {}
    }

    const finalVal = await contract.get();
    console.log("Final value after increment:", finalVal.toString());
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});