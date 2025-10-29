/*
Module 9: Performance - Compute budget example (TypeScript)

Setup:
  npm init -y
  npm i @solana/web3.js
  npm i -D ts-node typescript @types/node
Run:
  npx ts-node compute_budget_demo.ts
*/

import {
  Connection, Keypair, LAMPORTS_PER_SOL, clusterApiUrl, ComputeBudgetProgram,
  SystemProgram, Transaction, sendAndConfirmTransaction
} from "@solana/web3.js";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const payer = Keypair.generate();
  const to = Keypair.generate();

  console.log("Airdropping 2 SOL to payer...");
  const sig = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(sig, "confirmed");

  const cuPriceMicroLamports = 50_000; // prioritize
  const cuLimit = 1_000_000; // cap

  const setPrice = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: cuPriceMicroLamports });
  const setLimit = ComputeBudgetProgram.setComputeUnitLimit({ units: cuLimit });

  const transferIx = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: to.publicKey,
    lamports: 0.01 * LAMPORTS_PER_SOL,
  });

  const tx = new Transaction().add(setPrice, setLimit, transferIx);
  const signature = await sendAndConfirmTransaction(connection, tx, [payer]);
  console.log("Tx signature:", signature);
}

main().catch(console.error);
