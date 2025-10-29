/*
Module 5: Clients & Frontend - basic transaction with priority fees (TypeScript)

Setup:
  npm init -y
  npm i @solana/web3.js
  npm i -D ts-node typescript @types/node
Run:
  npx ts-node basic_tx.ts
*/

import {
  Connection, Keypair, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction,
  Transaction, clusterApiUrl, ComputeBudgetProgram, PublicKey
} from "@solana/web3.js";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const payer = Keypair.generate();
  const to = Keypair.generate();

  console.log("Airdropping 2 SOL to payer...");
  const sig = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(sig, "confirmed");

  // Priority fees + CU limit
  const cuPriceMicroLamports = 10_000; // 0.00001 SOL per 1M CU
  const cuLimit = 200_000;

  const ix1 = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: cuPriceMicroLamports });
  const ix2 = ComputeBudgetProgram.setComputeUnitLimit({ units: cuLimit });

  const transferIx = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: to.publicKey,
    lamports: 0.1 * LAMPORTS_PER_SOL,
  });

  const tx = new Transaction().add(ix1, ix2, transferIx);
  const signature = await sendAndConfirmTransaction(connection, tx, [payer]);
  console.log("Transfer signature:", signature);

  const bal = await connection.getBalance(to.publicKey);
  console.log("Recipient balance:", bal / LAMPORTS_PER_SOL, "SOL");
}

main().catch(console.error);
