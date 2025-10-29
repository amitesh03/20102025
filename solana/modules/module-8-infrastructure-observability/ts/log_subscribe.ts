/*
Module 8: Observability - Subscribe to logs (TypeScript)

Setup:
  npm init -y
  npm i @solana/web3.js
  npm i -D ts-node typescript @types/node
Run:
  npx ts-node log_subscribe.ts
Notes:
  For best results, use a WebSocket-enabled RPC (e.g., wss://) from a provider like Helius.
*/

import { Connection, clusterApiUrl, Logs, LogsCallback } from "@solana/web3.js";

async function main() {
  const url = clusterApiUrl("devnet");
  const connection = new Connection(url, "confirmed");

  const subId = connection.onLogs("all", (log: Logs) => {
    console.log("Slot:", log.slot);
    console.log("Signature:", log.signature);
    console.log("Logs:", log.logs);
    console.log("=====================================");
  });

  console.log("Subscribed to logs. Press Ctrl+C to exit.");
  // Keep process alive
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = await new Promise((_resolve) => setTimeout(_resolve, 60 * 60 * 1000));
  await connection.removeOnLogsListener(await subId);
}

main().catch(console.error);
