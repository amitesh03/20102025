/*
Module 6: SPL Token - create mint and mint to ATA (TypeScript)

Setup:
  npm init -y
  npm i @solana/web3.js @solana/spl-token
  npm i -D ts-node typescript @types/node
Run:
  npx ts-node spl_mint_demo.ts
*/

import {
  Connection, Keypair, LAMPORTS_PER_SOL, clusterApiUrl, sendAndConfirmTransaction, PublicKey
} from "@solana/web3.js";
import {
  createMint, getOrCreateAssociatedTokenAccount, mintTo, getMint, getAccount, TOKEN_PROGRAM_ID
} from "@solana/spl-token";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const payer = Keypair.generate();
  const mintAuthority = payer;
  const freezeAuthority: PublicKey | null = null;

  console.log("Airdropping 2 SOL to payer...");
  const sig = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(sig, "confirmed");

  console.log("Creating mint...");
  const mint = await createMint(
    connection,
    payer,
    mintAuthority.publicKey,
    freezeAuthority,
    9 // decimals
  );
  console.log("Mint pubkey:", mint.toBase58());

  console.log("Getting ATA for payer...");
  const ata = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );
  console.log("ATA:", ata.address.toBase58());

  console.log("Minting tokens...");
  await mintTo(
    connection,
    payer,
    mint,
    ata.address,
    mintAuthority,
    1_000_000_000n // 1 token with 9 decimals
  );

  const mintInfo = await getMint(connection, mint);
  const ataInfo = await getAccount(connection, ata.address);
  console.log("Mint supply:", mintInfo.supply.toString());
  console.log("ATA amount:", ataInfo.amount.toString());
}

main().catch(console.error);
