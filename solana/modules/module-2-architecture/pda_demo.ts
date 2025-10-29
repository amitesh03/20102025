/*
Module 2: Solana Architecture - PDA derivation demo (TypeScript)

How to run:
  npm init -y
  npm i @solana/web3.js
  node pda_demo.ts  (with ts-node) or transpile via tsc then node
*/

import { PublicKey } from "@solana/web3.js";

// Replace with your on-chain program id
const PROGRAM_ID = new PublicKey("11111111111111111111111111111111");

function pdaFromSeed(seed: string) {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(seed)],
    PROGRAM_ID
  );
  console.log(`seed="${seed}" -> PDA=${pda.toBase58()} bump=${bump}`);
}

function pdaFromUserSeed(user: PublicKey, seed: string) {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("state"), user.toBuffer(), Buffer.from(seed)],
    PROGRAM_ID
  );
  console.log(`user+seed -> PDA=${pda.toBase58()} bump=${bump}`);
}

function main() {
  const user = new PublicKey("11111111111111111111111111111111");
  pdaFromSeed("counter");
  pdaFromUserSeed(user, "position");
}

main();
