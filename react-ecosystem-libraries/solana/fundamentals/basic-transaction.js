// Solana Basic Transaction Examples
// Demonstrates how to create and send transactions on Solana

import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

/**
 * Example 1: Simple SOL transfer between two wallets
 * This shows the fundamental transaction structure on Solana
 */
async function createBasicTransfer() {
  console.log('=== Creating Basic SOL Transfer ===');
  
  // Create connection to local validator
  const connection = new Connection('http://localhost:8899', 'confirmed');
  
  // Generate sender and receiver keypairs
  const sender = Keypair.generate();
  const receiver = Keypair.generate();
  
  console.log('Sender Public Key:', sender.publicKey.toBase58());
  console.log('Receiver Public Key:', receiver.publicKey.toBase58());
  
  // Airdrop SOL to sender for testing
  try {
    const airdropSignature = await connection.requestAirdrop(
      sender.publicKey,
      LAMPORTS_PER_SOL
    );
    
    console.log('Airdrop successful, signature:', airdropSignature);
    
    // Create transfer instruction
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: receiver.publicKey,
      lamports: LAMPORTS_PER_SOL / 10 // Send 0.1 SOL
    });
    
    // Create transaction
    const transaction = new Transaction().add(transferInstruction);
    
    // Send and confirm transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [sender]
    );
    
    console.log('Transfer successful! Transaction signature:', signature);
    
    return signature;
  } catch (error) {
    console.error('Transfer failed:', error.message);
    return null;
  }
}

/**
 * Example 2: Transaction with multiple instructions
 * Demonstrates batching operations
 */
async function createMultiInstructionTransaction() {
  console.log('\n=== Creating Multi-Instruction Transaction ===');
  
  const connection = new Connection('http://localhost:8899', 'confirmed');
  const sender = Keypair.generate();
  const receiver1 = Keypair.generate();
  const receiver2 = Keypair.generate();
  
  // Airdrop to sender
  await connection.requestAirdrop(sender.publicKey, LAMPORTS_PER_SOL);
  
  // Create multiple transfer instructions
  const instruction1 = SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: receiver1.publicKey,
      lamports: LAMPORTS_PER_SOL / 20 // 0.05 SOL
  });
  
  const instruction2 = SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: receiver2.publicKey,
      lamports: LAMPORTS_PER_SOL / 20 // 0.05 SOL
  });
  
  // Create transaction with both instructions
  const transaction = new Transaction()
    .add(instruction1)
    .add(instruction2);
  
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [sender]
  );
  
  console.log('Multi-instruction transaction successful!');
  console.log('Signature:', signature);
  
  return signature;
}

/**
 * Example 3: Transaction with custom fee payer
 * Shows how to specify a different account to pay transaction fees
 */
async function createTransactionWithCustomFeePayer() {
  console.log('\n=== Creating Transaction with Custom Fee Payer ===');
  
  const connection = new Connection('http://localhost:8899', 'confirmed');
  const feePayer = Keypair.generate();
  const sender = Keypair.generate();
  
  // Airdrop to both accounts
  await connection.requestAirdrop(feePayer.publicKey, LAMPORTS_PER_SOL);
  
  const instruction = SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: receiver.publicKey,
      lamports: LAMPORTS_PER_SOL / 10);
  
  const transaction = new Transaction()
    .add(instruction);
  
  // Set custom fee payer
  transaction.feePayer = feePayer.publicKey;
  
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [sender, feePayer]
  );
  
  console.log('Transaction with custom fee payer successful!');
  
  return signature;
}

/**
 * Example 4: Transaction with recent blockhash
 * Best practice for production applications
 */
async function createTransactionWithBlockhash() {
  console.log('\n=== Creating Transaction with Recent Blockhash ===');
  
  const connection = new Connection('http://localhost:8899', 'confirmed');
  
  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  
  const sender = Keypair.generate();
  const receiver = Keypair.generate();
  
  await connection.requestAirdrop(sender.publicKey, LAMPORTS_PER_SOL);
  
  const instruction = SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: receiver.publicKey,
      lamports: LAMPORTS_PER_SOL / 10);
  
  const transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: sender.publicKey
  });
  
  transaction.add(instruction);
  
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [sender]
  );
  
  console.log('Transaction with recent blockhash successful!');
  
  return signature;
}

/**
 * Example 5: Error handling and transaction validation
 * Important for robust applications
 */
async function validateAndSendTransaction(transaction, signers) {
  console.log('\n=== Validating and Sending Transaction ===');
  
  // Verify transaction has required fields
  if (!transaction.recentBlockhash) {
    throw new Error('Transaction missing recent blockhash');
  }
  
  if (!transaction.feePayer) {
    throw new Error('Transaction missing fee payer');
  }
  
  try {
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      signers
  );
  
  console.log('Transaction validation and sending successful!');
  
  return signature;
}

// Run transaction examples
async function runTransactionExamples() {
  console.log('💰 Solana Basic Transaction Tutorial\n');
  
  // Example 1: Basic transfer
  await createBasicTransfer();
  
  // Example 2: Multi-instruction transaction
  await createMultiInstructionTransaction();
  
  // Example 3: Custom fee payer
  await createTransactionWithCustomFeePayer();
  
  console.log('\n🎉 Transaction tutorial completed!');
  console.log('\n📝 Transaction Takeaways:');
  console.log('• All transactions need a recent blockhash');
  console.log('• Transactions must have a fee payer');
  console.log('• Always handle transaction errors gracefully');
}

// Export functions
export {
  createBasicTransfer,
  createMultiInstructionTransaction,
  createTransactionWithCustomFeePayer,
  createTransactionWithBlockhash,
  validateAndSendTransaction,
  runTransactionExamples
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTransactionExamples().catch(console.error);
}