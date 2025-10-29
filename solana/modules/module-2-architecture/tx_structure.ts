/*
Module 2: Transaction structure demo (TypeScript)

Setup:
  npm init -y
  npm i @solana/web3.js
  npm i -D ts-node typescript @types/node
Run:
  npx ts-node tx_structure.ts
*/
import {
  Connection, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction,
  LAMPORTS_PER_SOL, clusterApiUrl, ComputeBudgetProgram
} from "@solana/web3.js";

async function main() {
  const conn = new Connection(clusterApiUrl("devnet"), "confirmed");
  const payer = Keypair.generate();
  const recipient = Keypair.generate();

  console.log("Airdropping 1 SOL to payer...");
  const sig = await conn.requestAirdrop(payer.publicKey, 1 * LAMPORTS_PER_SOL);
  await conn.confirmTransaction(sig, "confirmed");

  const setLimit = ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 });
  const setPrice = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 10_000 });

  const transfer = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: recipient.publicKey,
    lamports: 0.05 * LAMPORTS_PER_SOL,
  });

  const tx = new Transaction().add(setLimit, setPrice, transfer);
  const signature = await sendAndConfirmTransaction(conn, tx, [payer]);
  console.log("Transaction signature:", signature);

  const bal = await conn.getBalance(recipient.publicKey);
  console.log("Recipient balance:", bal / LAMPORTS_PER_SOL, "SOL");
}
main().catch(console.error);