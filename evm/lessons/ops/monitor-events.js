/**
 * On-chain event monitor (ethers v6)
 * Referenced in: [monitoring guide](lessons/ops/monitoring.md)
 *
 * Usage:
 *   cd lessons/ops
 *   npm i ethers dotenv
 *   Create .env with:
 *     RPC_URL=<your_rpc_url>
 *     CONTRACT_ADDRESS=<erc20_or_app_contract>
 *   node monitor-events.js
 */

"use strict";

try {
  require("dotenv").config();
} catch (_) {}

const { ethers } = require("ethers");

// Minimal ABI for ERC20 Transfer; extend with your app events
const ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

async function main() {
  const rpc = process.env.RPC_URL;
  const addr = process.env.CONTRACT_ADDRESS;

  if (!rpc) {
    console.error("Missing RPC_URL in environment.");
    process.exit(1);
  }
  if (!addr || !ethers.isAddress(addr)) {
    console.error("Missing/invalid CONTRACT_ADDRESS in environment.");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(addr, ABI, provider);

  // Basic chain heartbeat
  provider.on("block", async (bn) => {
    console.log("[block]", bn);
    try {
      const block = await provider.getBlock(bn);
      if (block?.baseFeePerGas) {
        console.log("baseFeePerGas:", block.baseFeePerGas.toString());
      }
    } catch (e) {
      console.warn("Block fetch failed:", e?.message || e);
    }
  });

  // Example event monitoring with a simple anomaly policy
  contract.on("Transfer", (from, to, value, log) => {
    const v = value.toString();
    console.log(
      `[event] Transfer from=${from} to=${to} value=${v} tx=${log.transactionHash}`
    );
    // Alert for unusually large transfers (adjust as needed)
    const THRESH = 1_000_000n * 10n ** 18n; // 1,000,000 tokens at 18 decimals
    if (value >= THRESH) {
      console.log("[ALERT] Large Transfer detected:", v);
      // TODO: send webhook/Slack notification here
    }
  });

  console.log("Monitoring started. Press Ctrl+C to stop.");
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}