// Ethereum Wallet Creation Examples
// Demonstrates different ways to create and manage Ethereum wallets

import { ethers } from 'ethers';

/**
 * Example 1: Create a new random wallet
 * This generates a completely new Ethereum address with private key
 */
function createNewWallet() {
  console.log('=== Creating New Ethereum Wallet ===');
  
  // Create wallet using ethers.js
  const wallet = ethers.Wallet.createRandom();
  
  console.log('Address:', wallet.address);
  console.log('Private Key:', wallet.privateKey);
  console.log('Mnemonic:', wallet.mnemonic?.phrase || 'Not available');
  
  return wallet;
}

/**
 * Example 2: Create wallet from private key
 * Useful for importing existing wallets
 */
function createWalletFromPrivateKey() {
  console.log('\n=== Creating Wallet from Private Key ===');
  
  // Example private key (never use this in production)
  const privateKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  
  const wallet = new ethers.Wallet(privateKey);
  
  console.log('Address:', wallet.address);
  console.log('Private Key:', wallet.privateKey);
  
  return wallet;
}

/**
 * Example 3: Create wallet from mnemonic phrase
 * Standard way to create deterministic wallets
 */
function createWalletFromMnemonic() {
  console.log('\n=== Creating Wallet from Mnemonic ===');
  
  const mnemonic = 'test test test test test test test test test test junk';
  
  const wallet = ethers.Wallet.fromPhrase(mnemonic);
  
  console.log('Address:', wallet.address);
  console.log('Mnemonic:', wallet.mnemonic.phrase);
  
  return wallet;
}

/**
 * Example 4: Create HD wallet (Hierarchical Deterministic)
 * Can generate multiple addresses from single seed
 */
function createHDWallet() {
  console.log('\n=== Creating HD Wallet ===');
  
  const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(16));
  
  const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
  
  console.log('HD Wallet created');
  console.log('Master Extended Private Key:', hdNode.privateKey);
  
  return hdNode;
}

/**
 * Example 5: Wallet operations and utilities
 * Shows common wallet functions
 */
function demonstrateWalletOperations() {
  console.log('\n=== Demonstrating Wallet Operations ===');
  
  const wallet = createNewWallet();
  
  // Sign a message
  const message = 'Hello Ethereum!';
  const signature = wallet.signMessage(message);
  
  console.log('Message:', message);
  console.log('Signature:', signature);
  
  // Verify signature
  const recoveredAddress = ethers.verifyMessage(message, signature);
  
  console.log('Original Address:', wallet.address);
  console.log('Recovered Address:', recoveredAddress);
  
  // Generate random wallet
  const randomWallet = ethers.Wallet.createRandom();
  
  console.log('Random Wallet Address:', randomWallet.address);
  
  return {
    original: wallet,
    random: randomWallet
  };
}

/**
 * Example 6: Wallet with provider connection
 * Shows how to connect wallet to Ethereum network
 */
function createWalletWithProvider() {
  console.log('\n=== Creating Wallet with Provider ===');
  
  // Connect to local Ethereum node
  const provider = new ethers.JsonRpcProvider('http://localhost:8545');
  
  const wallet = createNewWallet().connect(provider);
  
  console.log('Wallet connected to provider');
  console.log('Address:', wallet.address);
  
  return wallet;
}

// Run all wallet examples
async function runWalletExamples() {
  console.log('🔐 Ethereum Wallet Creation Tutorial\n');
  
  // Example 1: New wallet
  const newWallet = createNewWallet();
  
  // Example 2: From private key
  const importedWallet = createWalletFromPrivateKey();
  
  // Example 3: From mnemonic
  const mnemonicWallet = createWalletFromMnemonic();
  
  // Example 4: HD wallet
  const hdWallet = createHDWallet();
  
  // Example 5: Operations
  demonstrateWalletOperations();
  
  console.log('\n🎉 Wallet creation tutorial completed!');
  console.log('\n📝 Wallet Creation Takeaways:');
  console.log('• Always keep private keys secure');
  console.log('• Use mnemonics for better backup');
  console.log('• HD wallets can generate multiple addresses');
  console.log('• Never commit private keys to version control');
}

// Export functions for use in other modules
export {
  createNewWallet,
  createWalletFromPrivateKey,
  createWalletFromMnemonic,
  createHDWallet,
  demonstrateWalletOperations,
  runWalletExamples
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runWalletExamples().catch(console.error);
}