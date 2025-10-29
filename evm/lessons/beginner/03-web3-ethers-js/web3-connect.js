// web3-connect.js
// Web3.js v4 (ESM) connectivity demo: reads chainId, latest block, gas price, and optional address balance
// Usage:
//   1) npm i web3 dotenv
//   2) Ensure "type": "module" in package.json (for ESM)
//   3) Set .env variables (optional): RPC_URL, ADDRESS
//   4) node lessons/beginner/03-web3-ethers-js/web3-connect.js [0xAddress]
import Web3 from "web3";
import "dotenv/config";

const RPC_URL = process.env.RPC_URL ?? "https://cloudflare-eth.com";
const ADDRESS = process.argv[2] ?? process.env.ADDRESS;

const web3 = new Web3(RPC_URL);

async function main() {
  console.log("RPC:", RPC_URL);

  const chainId = await web3.eth.getChainId();
  console.log("ChainId:", chainId.toString());

  const latest = await web3.eth.getBlockNumber();
  console.log("Latest block:", latest.toString());

  const gasPrice = await web3.eth.getGasPrice();
  console.log("Gas price (wei):", gasPrice.toString());

  if (ADDRESS) {
    const balanceWei = await web3.eth.getBalance(ADDRESS);
    const balanceEth = web3.utils.fromWei(balanceWei, "ether");
    console.log(`Balance of ${ADDRESS}:`, balanceEth, "ETH");
  } else {
    console.log("No ADDRESS provided; pass argv[2] or set ADDRESS in .env");
  }

  const block = await web3.eth.getBlock(latest);
  console.log("Block hash:", block?.hash);
  console.log("Tx count:", Array.isArray(block?.transactions) ? block.transactions.length : "n/a");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});