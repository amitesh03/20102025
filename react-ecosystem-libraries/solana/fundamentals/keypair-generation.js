// Solana Keypair Generation Examples
// Demonstrates different ways to create and manage Solana keypairs

import { Keypair } from '@solana/web3.js';
import { getKeypairFromEnvironment, getKeypairFromFile } from '@solana-developers/helpers';
import bs58 from 'bs58';

/**
 * Example 1: Generate a new random keypair
 * This creates a completely new wallet with random private/public keys
 */
function generateNewKeypair() {
  console.log('=== Generating New Random Keypair ===');
  
  const keypair = Keypair.generate();
  
  console.log('Public Key:', keypair.publicKey.toBase58());
  console.log('Private Key (base58):', bs58.encode(keypair.secretKey));
  console.log('Private Key (hex):', Buffer.from(keypair.secretKey).toString('hex'));
  
  return keypair;
}

/**
 * Example 2: Create keypair from existing private key
 * Useful for importing existing wallets
 */
function createFromPrivateKey() {
  console.log('\n=== Creating Keypair from Private Key ===');
  
  // Example private key in base58 format
  const privateKeyBase58 = 'your-private-key-here-in-base58-format';
  
  try {
    const secretKey = bs58.decode(privateKeyBase58);
    const keypair = Keypair.fromSecretKey(secretKey);
    
    console.log('Public Key:', keypair.publicKey.toBase58());
    console.log('Successfully imported existing wallet');
    
    return keypair;
  } catch (error) {
    console.error('Error importing private key:', error.message);
  }
}

/**
 * Example 3: Load keypair from environment variable
 * Best practice for production applications
 */
async function loadFromEnvironment() {
  console.log('\n=== Loading Keypair from Environment ===');
  
  try {
    // This expects an environment variable named 'SOLANA_PRIVATE_KEY'
    const keypair = await getKeypairFromEnvironment('SOLANA_PRIVATE_KEY');
    
    console.log('Public Key:', keypair.publicKey.toBase58());
    console.log('Successfully loaded from environment');
    
    return keypair;
  } catch (error) {
    console.log('Environment variable not set, using fallback method');
    return generateNewKeypair();
  }
}

/**
 * Example 4: Load keypair from file
 * Common for development and testing
 */
async function loadFromFile() {
  console.log('\n=== Loading Keypair from File ===');
  
  try {
    const keypair = await getKeypairFromFile('~/.config/solana/id.json');
    
    console.log('Public Key:', keypair.publicKey.toBase58());
    console.log('Successfully loaded from file');
    
    return keypair;
  } catch (error) {
    console.log('Keypair file not found, generating new one');
    return generateNewKeypair();
  }
}

/**
 * Example 5: Keypair validation and verification
 * Demonstrates how to verify keypair integrity
 */
function validateKeypair(keypair) {
  console.log('\n=== Validating Keypair ===');
  
  // Verify the public key can be derived from the private key
  const derivedKeypair = Keypair.fromSecretKey(keypair.secretKey);
  
  const isValid = derivedKeypair.publicKey.toBase58() === keypair.publicKey.toBase58();
  
  console.log('Keypair is valid:', isValid);
  console.log('Original Public Key:', keypair.publicKey.toBase58());
  console.log('Derived Public Key:', derivedKeypair.publicKey.toBase58());
  
  return isValid;
}

// Run all examples
async function runExamples() {
  console.log('🔐 Solana Keypair Generation Tutorial\n');
  
  // Example 1: Generate new keypair
  const newKeypair = generateNewKeypair();
  
  // Example 2: Validate the generated keypair
  validateKeypair(newKeypair);
  
  // Example 3: Try loading from environment
  await loadFromEnvironment();
  
  // Example 4: Try loading from file
  await loadFromFile();
  
  console.log('\n🎉 Keypair generation tutorial completed!');
  console.log('\n📝 Key Takeaways:');
  console.log('• Always keep private keys secure');
  console.log('• Use environment variables for production');
  console.log('• Test with generated keypairs in development');
  console.log('• Never commit private keys to version control');
}

// Export functions for use in other modules
export {
  generateNewKeypair,
  createFromPrivateKey,
  loadFromEnvironment,
  loadFromFile,
  validateKeypair,
  runExamples
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(console.error);
}