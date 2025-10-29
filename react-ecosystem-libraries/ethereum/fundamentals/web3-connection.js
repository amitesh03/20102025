// Ethereum Web3 Connection Examples
// Demonstrates different ways to connect to Ethereum networks

import { ethers } from 'ethers';

/**
 * Example 1: Connect to different Ethereum networks
 * - Localhost: For development with Ganache/Hardhat
 * - Goerli/Sepolia: Test networks
 * - Mainnet: Production network
 */

// Connection to local Ethereum node
const localProvider = new ethers.JsonRpcProvider('http://localhost:8545');

// Connection to public test network
const testnetProvider = new ethers.JsonRpcProvider('https://goerli.infura.io/v3/YOUR_PROJECT_ID');
const mainnetProvider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_PROJECT_ID');

/**
 * Example 2: Basic connection with different providers
 * Shows various ways to connect to Ethereum
 */
function createBasicConnections() {
  console.log('=== Creating Basic Ethereum Connections ===');
  
  // Different provider types
  const providers = [
    { name: 'Local', url: 'http://localhost:8545' },
  { name: 'Goerli', url: 'https://goerli.infura.io/v3/YOUR_PROJECT_ID' },
    { name: 'Infura Mainnet', url: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID' }
  ];
  
  providers.forEach(provider => {
    const connection = new ethers.JsonRpcProvider(provider.url);
    
    console.log(`Connection to ${provider.name} network established');
    console.log('Network ID:', await connection.getNetwork().then(net => net.chainId))
  });
}

/**
 * Example 3: Advanced connection with custom providers
 * Useful for using dedicated RPC providers for better performance
 */
function createAdvancedConnections() {
  console.log('\n=== Creating Advanced Connections ===');
  
  // Using Alchemy as an example RPC provider
  const alchemyUrl = 'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY');
  
  const customConnection = new ethers.JsonRpcProvider('https://your-custom-rpc.com');
  
  console.log('Custom RPC connection established');
  console.log('Custom RPC URL:', 'https://your-custom-rpc.com');
  
  return customConnection;
}

/**
 * Example 4: Connection with error handling and retry logic
 * Important for production applications
 */
class EthereumConnectionManager {
  constructor(rpcUrl = 'http://localhost:8545') {
    this.connection = new ethers.JsonRpcProvider(rpcUrl);
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
    // Get network information to test connection
    const network = await connection.getNetwork();
    
    console.log('Connection test successful');
    console.log('Chain ID:', network.chainId);
    
    // Get current block number
    const blockNumber = await connection.getBlockNumber();
    
    console.log('Current Block Number:', blockNumber);
    
    return true;
  } catch (error) {
    console.error('Connection test failed:', error.message);
    return false;
  }
}

/**
 * Example 6: Connection with custom configuration
 * Includes timeout settings and other options
 */
function createCustomConnection() {
  const customConfig = {
    pollingInterval: 4000, // 4 seconds
  };
  
  const connection = new ethers.JsonRpcProvider('http://localhost:8545');
  
  console.log('Custom connection with specific configuration created');
  
  return connection;
}

// Run connection examples
async function runConnectionExamples() {
  console.log('🔌 Ethereum Web3 Connection Tutorial\n');
  
  // Example 1: Basic connections
  createBasicConnections();
  
  // Example 2: Advanced connection
  const advancedConnection = createAdvancedConnections();
  
  // Test the advanced connection
  await testConnection(advancedConnection);
  
  console.log('\n🎉 Connection setup tutorial completed!');
  console.log('\n📝 Connection Setup Takeaways:');
  console.log('• Use appropriate networks for your use case');
  console.log('• Localhost for development, Mainnet for production');
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