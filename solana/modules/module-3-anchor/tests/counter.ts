import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

describe("counter program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter as Program<any>;

  it("initializes and increments", async () => {
    const payer = provider.wallet.publicKey;
    const [counterPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("counter"), payer.toBuffer()],
      program.programId
    );

    // Initialize
    await program.methods.initialize().accounts({
      counter: counterPda,
      payer,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).rpc();

    // Increment
    await program.methods.increment().accounts({
      counter: counterPda,
      payer,
      owner: payer, // demo: owner check
    }).rpc();

    // Fetch
    const acc = await program.account.counter.fetch(counterPda);
    console.log("count =", acc.count.toString(), "bump =", acc.bump);
  });
});