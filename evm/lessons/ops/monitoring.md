# Monitoring and Maintenance for EVM dApps

Maps to syllabus:
- Monitoring and maintenance
- Security best practices (continuous observability)
- Infra setup and on-call readiness

This guide provides battle-tested approaches and runnable snippets to monitor smart contracts, transactions, and node health.

Prerequisites
- Hardhat or Node.js runtime
- RPC endpoint (provider)
- Optional third-party services for alerts

Key Monitoring Dimensions
- Contract events and anomalies
- Transaction throughput and failure rates
- Node/provider health and latency
- Chain conditions (base fee, reorgs)
- Operational metrics (queues, job success)
- Security posture (admin actions, role changes)

On-Chain Monitoring with Node.js (ethers v6)
The script below subscribes to blocks, decodes contract events, and emits alerts to the console. Adapt for your infra (Slack, PagerDuty, email).

Create: [`monitor-events.js`](lessons/ops/monitoring.md)
Usage:
- npm i ethers dotenv
- .env:
  RPC_URL=<your_rpc_url>
  CONTRACT_ADDRESS=<monitored_contract>
- node monitor-events.js

// monitor-events.js
"use strict";
try { require("dotenv").config(); } catch {}
const { ethers } = require("ethers");

// Minimal ABI example for ERC20 Transfer; add your app events
const ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

async function main() {
  const rpc = process.env.RPC_URL;
  const addr = process.env.CONTRACT_ADDRESS;
  if (!rpc || !addr) {
    console.error("Set RPC_URL and CONTRACT_ADDRESS in .env");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(addr, ABI, provider);

  provider.on("block", async (bn) => {
    console.log("[block]", bn);
    // Add chain-level checks: base fee, gas spikes, finality windows, etc.
    const block = await provider.getBlock(bn);
    if (block?.baseFeePerGas) {
      console.log("baseFeePerGas:", block.baseFeePerGas.toString());
    }
  });

  contract.on("Transfer", (from, to, value, log) => {
    const v = value.toString();
    console.log(`[event] Transfer from=${from} to=${to} value=${v} tx=${log.transactionHash}`);
    // Example anomaly policy: alerts for transfers above threshold
    const THRESH = 1_000_000n * 10n ** 18n;
    if (value >= THRESH) {
      console.log("[ALERT] Large transfer detected");
      // TODO: Send to Slack/Webhook
    }
  });

  console.log("Monitoring started. Press Ctrl+C to stop.");
}
main().catch((e) => { console.error(e); process.exit(1); });

Off-Chain Infra and Services
- OpenZeppelin Defender
  - Admin actions and timelock/upgrade workflows
  - Sentinel monitoring of events/tx patterns, webhook alerts
- Tenderly
  - Real-time monitoring, debugger, forking, alerting
  - Simulations before sending txs
- Blocknative / Alchemy Mempool
  - Mempool monitoring, transaction lifecycle, gas strategies
- Etherscan/Polygonscan Watchlists
  - Address watch with email alerts for specific events
- Cloud-native monitoring
  - Prometheus + Grafana dashboards (export Node.js metrics)
  - CloudWatch/Stackdriver logs
  - Alerting integrations: PagerDuty, Opsgenie, Slack

Health Checks for Backends
If you have a backend worker or relayer, add liveness probes and metrics:
- Liveness: responds 200 OK and includes last-processed block
- Readiness: checks provider connectivity and lag
- Metrics: total processed events, failures, retry counts, queue sizes

Example Express Metrics Endpoint
// metrics.js
"use strict";
const express = require("express");
const app = express();
let stats = {
  lastBlock: 0,
  processedEvents: 0,
  failures: 0,
};
app.get("/healthz", (req, res) => res.json({ ok: true, stats }));
app.listen(3000, () => console.log("Metrics server on :3000"));

// Integrate with monitor loop by incrementing stats.processedEvents and updating stats.lastBlock.

Security-Focused Monitoring
- Privileged actions:
  - RoleAdminChanged, RoleGranted, RoleRevoked for AccessControl
  - OwnershipTransferred for Ownable
  - Upgrade events for UUPS/Transparent proxies
- Guard rails:
  - Alert on calls from unexpected EOAs
  - Alert on changes to critical config (oracle addresses, router addresses)
- Pausable and circuit breakers:
  - Alert when paused/unpaused occurs
- Rate limits and anomaly scores:
  - Spikes in failed transactions may indicate issues or attacks

Gas and Chain Conditions
- Track baseFee and priorityFee trends
- Alert if baseFee surges above an SLO threshold
- For L2s, monitor submission/settlement latencies and message status (bridges)

Data Integrity and Indexers
- If indexing events (e.g., The Graph, custom indexer), validate:
  - Event counts match chain expectations
  - Reorg handling: implement idempotency and backfill
  - Snapshot with periodic full-state checksums

Runbooks and On-Call
- Document step-by-step recovery:
  - Rotate owner to multisig in emergencies
  - Pause contracts and communicate status
  - Rollback upgrades (for UUPS) or deploy hotfix versions
- Access management:
  - Secure secrets in a vault (HashiCorp Vault, AWS Secrets Manager)
  - Two-person approval for production actions
- Post-incident reviews:
  - Root cause, timeline, remediation, follow-up tasks

Automated Alerts Example with Defender (high level)
- Create Sentinel:
  - Filter: contract address, event signature (e.g., Upgrade, OwnershipTransferred)
  - Condition: any match or thresholded rules
  - Action: Webhook to your incident management system
- Connect Relayer for automated, rate-limited tx execution (if needed)

Tying Back to Lessons
- Contracts to monitor:
  - ERC20 transfers and mints in: [`lessons/intermediate/hardhat/contracts/MyToken.sol`](lessons/intermediate/hardhat/contracts/MyToken.sol)
  - Proxy upgrades in: [`lessons/advanced/patterns/UUPSProxy.sol`](lessons/advanced/patterns/UUPSProxy.sol)
  - VRF fulfillments in: [`lessons/external/chainlink/VRFDemo.sol`](lessons/external/chainlink/VRFDemo.sol)
- Use the event monitor template to watch these in real time and build alerts.

Checklist
- [ ] Event monitors run on a stable host (with restart policy)
- [ ] Alerts wired to on-call channels (Slack/PagerDuty)
- [ ] Health endpoints expose last processed block and error counts
- [ ] Runbooks documented and accessible
- [ ] Secrets stored in a vault, rotated regularly