import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

async function main() {
  const conn = new Connection(clusterApiUrl("devnet"), "confirmed");
  const pubkey = new PublicKey("11111111111111111111111111111111"); // replace
  const info = await conn.getAccountInfo(pubkey);
  console.log("Account info:", info);
}
main().catch(console.error);