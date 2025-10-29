// SPL Token Examples for Solana
// Demonstrates token creation, minting, and transfers

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  TOKEN_PROGRAM_ID,
  getAccount,
  getMint
} from '@solana/spl-token';

/**
 * Example 1: Create a new SPL token mint
 * This creates a new token type on Solana
 */
async function createNewTokenMint() {
  console.log('=== Creating New SPL Token Mint ===');
  
  const connection = new Connection('http://localhost:8899', 'confirmed');
  const payer = Keypair.generate();
  
  // Airdrop SOL to payer for transaction fees
  await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
  
  // Create token mint
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey, // mint authority
    payer.publicKey, // freeze authority (optional)
    9 // decimals
  );
  
  console.log('Token Mint created successfully!');
  console.log('Mint Address:', mint.toBase58());
  
  return mint;
}

/**
 * Example 2: Create associated token account
 * Each wallet needs an ATA to hold tokens of a specific mint
 */
async function createAssociatedTokenAccountExample() {
  console.log('\n=== Creating Associated Token Account ===');
  
  const connection = new Connection('http://localhost:8899', 'confirmed');
  const payer = Keypair.generate();
  const owner = Keypair.generate();
  
  await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
  
  const mint = await createNewTokenMint();
  
  // Create ATA for the owner
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    owner.publicKey
  );
  
  console.log('Associated Token Account created!');
  console.log('Token Account Address:', tokenAccount.address.toBase58());
  
  return tokenAccount;
}

/**
 * Example 3: Mint tokens to an account
 * The mint authority can create new tokens
 */
async function mintTokensExample() {
  console.log('\n=== Minting Tokens to Account ===');
  
  const connection = new Connection('http://localhost:8899', 'confirmed');
  const payer = Keypair.generate();
  const recipient = Keypair.generate();
  
  await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
  
  const mint = await createNewTokenMint();
  
  // Create ATA for recipient
  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    recipient.publicKey
  );
  
  // Mint 1000 tokens to recipient
  const amount = 1000 * Math.pow(10, 9); // 1000 tokens with 9 decimals
  
  const signature = await mintTo(
    connection,
    payer,
    mint,
    recipientTokenAccount.address,
    payer, // mint authority
    amount
  );
  
  console.log('Tokens minted successfully!');
  console.log('Transaction Signature:', signature);
  
  return signature;
}

/**
 * Example 4: Transfer tokens between accounts
 */
async function transferTokensExample() {
  console.log('\n=== Transferring Tokens ===');
  
  const connection = new Connection('http://localhost:8899', 'confirmed');
  
  const payer = Keypair.generate();
  const sender = Keypair.generate();
  const receiver = Keypair.generate();
  
  await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
  
  const mint = await createNewTokenMint();
  
  // Create ATAs for both sender and receiver
  const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    sender.publicKey
  );
  
  const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    receiver.publicKey
  );
  
  // Transfer 500 tokens
  const transferAmount = 500 * Math.pow(10, 9);
  
  const signature = await transfer(
    connection,
    sender,
    senderTokenAccount.address,
    receiverTokenAccount.address,
    sender,
    amount
  );
  
  console.log('Token transfer successful!');
  console.log('Signature:', signature);
  
  return signature;
}

/**
 * Example 5: Get token account information
 * Useful for checking balances and account details
 */
async function getTokenAccountInfo() {
  console.log('\n=== Getting Token Account Information ===');
  
  const connection = new Connection('http://localhost:8899', 'confirmed');
  
  const payer = Keypair.generate();
  const owner = Keypair.generate();
  
  await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
  
  const mint = await createNewTokenMint();
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    owner.publicKey
  );
  
  const accountInfo = await getAccount(connection, tokenAccount.address);
  
  console.log('Token Account Information:');
  console.log('  Owner:', accountInfo.owner.toBase58());
  console.log('  Mint:', accountInfo.mint.toBase58());
  console.log('  Amount:', accountInfo.amount.toString());
  console.log('  Is Frozen:', accountInfo.isFrozen);
  console.log('  Delegated Amount:', accountInfo.delegatedAmount?.toString() || '0');
  console.log('  Delegated To:', accountInfo.delegatedTo?.toBase58() || 'None');
  
  return accountInfo;
}

/**
 * Example 6: Get mint information
 * Shows token supply, decimals, and authorities
 */
async function getMintInformation() {
  console.log('\n=== Getting Mint Information ===');
  
  const connection = new Connection('http://localhost:8899', 'confirmed');
  
  const payer = Keypair.generate();
  const mint = await createNewTokenMint();
  
  const mintInfo = await getMint(connection, mint);
  
  console.log('Mint Information:');
  console.log('  Supply:', mintInfo.supply.toString());
  console.log('  Decimals:', mintInfo.decimals);
  console.log('  Mint Authority:', mintInfo.mintAuthority?.toBase58() || 'None');
  console.log('  Freeze Authority:', mintInfo.freezeAuthority?.toBase58() || 'None');
  
  return mintInfo;
}

// Run all token examples
async function runTokenExamples() {
  console.log('🪙 SPL Token Operations Tutorial\n');
  
  // Example 1: Create token mint
  const mint = await createNewTokenMint();
  
  // Example 2: Create ATA
  await createAssociatedTokenAccountExample();
  
  // Example 3: Mint tokens
  await mintTokensExample();
  
  // Example 4: Transfer tokens
  await transferTokensExample();
  
  // Example 5: Get account info
  await getTokenAccountInfo();
  
  // Example 6: Get mint info
  await getMintInformation();
  
  console.log('\n🎉 SPL Token tutorial completed!');
  console.log('\n📝 Token Operation Takeaways:');
  console.log('• Each token type has a unique mint address');
  console.log('• Each wallet needs an ATA for each token mint');
  console.log('• Mint authority controls token creation');
  console.log('• Token accounts hold specific token types');
}

// Export functions
export {
  createNewTokenMint,
  createAssociatedTokenAccountExample,
  mintTokensExample,
  transferTokensExample,
  getTokenAccountInfo,
  getMintInformation,
  runTokenExamples
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTokenExamples().catch(console.error);
}