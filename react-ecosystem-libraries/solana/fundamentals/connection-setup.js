// Solana Connection Setup Examples
// Demonstrates different ways to connect to Solana networks

import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

/**
 * Example 1: Connect to different Solana networks
 * - Devnet: For testing with fake SOL
 * - Testnet: For more rigorous testing
 * - Mainnet-beta: Production network
 */

// Connection to Devnet (public test network)
const devnetConnection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Connection to Local Validator (for development)
const localConnection = new Connection('http://localhost:8899', 'confirmed');

/**
 * Example 2: Basic connection with different commitment levels
 * Commitment levels determine how quickly transactions are considered final
 */
function createBasicConnections() {
  console.log('=== Creating Basic Connections ===');
  
  const commitmentLevels = ['processed', 'confirmed', 'finalized'];
  
  commitmentLevels.forEach(commitment => {
    const connection = new Connection(clusterApiUrl('devnet'), commitment);
    
    console.log(`Connection to ${commitment} network established');
    console.log('RPC URL:', clusterApiUrl('devnet'));
    console.log('Commitment Level:', commitment);
  });
}

/**
 * Example 3: Advanced connection with custom RPC endpoints
 * Useful for using dedicated RPC providers for better performance
 */
function createAdvancedConnections() {
  console.log('\n=== Creating Advanced Connections ===');
  
  // Using QuickNode as an example RPC provider
  const quicknodeUrl = 'https://solana-devnet.quicknode.pro/YOUR_API_KEY');
  
  const customConnection = new Connection('https://your-custom-rpc.com', 'confirmed');
  
  console.log('Custom RPC connection established');
  console.log('Custom RPC URL:', 'https://your-custom-rpc.com');
  
  return customConnection;
}

/**
 * Example 4: Connection with error handling and retry logic
 * Important for production applications
 */
class SolanaConnectionManager {
  constructor(rpcUrl = clusterApiUrl('devnet'), commitment = 'confirmed') {
    this.connection = new Connection(rpcUrl, commitment);
    this.retryCount = 3;
  }
}

/**
 * Example 5: Connection testing and health checks
 * Verifies that the connection is working properly
 */
async function testConnection(connection) {
  console.log('\n=== Testing Connection Health ===');
  
  try {
    // Get recent blockhash to test connection
    const blockhash = await connection.getLatestBlockhash();
    
    console.log('Connection test successful');
    console.log('Blockhash:', blockhash.blockhash);
    console.log('Last Valid Block Height:', blockhash.lastValidBlockHeight);
    
    // Get network version
    const version = await connection.getVersion();
    console.log('Network Version:', version);
    
    return true;
  } catch (error) {
    console.error('Connection test failed:', error.message);
    return false;
  }
}

/**
 * Example 6: Connection with custom configuration
 * Includes timeout settings, commitment, and other options
 */
function createCustomConnection() {
  const customConfig = {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: 60000, // 60 seconds
  };
  
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  
  console.log('Custom connection with specific configuration created');
  
  return connection;
}

// Run connection examples
async function runConnectionExamples() {
  console.log('🔌 Solana Connection Setup Tutorial\n');
  
  // Example 1: Basic connections
  createBasicConnections();
  
  // Example 2: Advanced connection
  const advancedConnection = createAdvancedConnections();
  
  // Test the advanced connection
  await testConnection(advancedConnection);
  
  console.log('\n🎉 Connection setup tutorial completed!');
  console.log('\n📝 Connection Setup Takeaways:');
  console.log('• Use appropriate commitment levels for your use case');
  console.log('• Devnet for testing, Mainnet for production');
  console.log('• Implement error handling for network issues');
  console.log('• Consider using dedicated RPC providers for better performance');
}

// Export functions for use in other modules
export {
  createBasicConnections,
  createAdvancedConnections,
  createCustomConnection,
  testConnection,
  runConnectionExamples
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runConnectionExamples().catch(console.error);
}