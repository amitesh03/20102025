// ethers-connect.js
// Ethers.js v6 (ESM) connectivity demo: reads network, latest block, fee data, optional wallet & balances
// Usage:
//   1) npm i ethers dotenv
//   2) Ensure "type": "module" in package.json (Ethers v6 is ESM-only)
//   3) Set .env variables (optional): RPC_URL, PRIVATE_KEY, ADDRESS, TOKEN
//   4) node lessons/beginner/03-web3-ethers-js/ethers-connect.js [0xAddress]
import { ethers } from "ethers";
import "dotenv/config";

const RPC_URL = process.env.RPC_URL ?? "https://cloudflare-eth.com";
const ADDRESS = process.argv[2] ?? process.env.ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TOKEN = process.env.TOKEN; // optional ERC20 address to inspect

const provider = new ethers.JsonRpcProvider(RPC_URL);

async function showNetworkBasics() {
  const network = await provider.getNetwork();
  const latest = await provider.getBlockNumber();
  const fee = await provider.getFeeData();

  console.log("RPC:", RPC_URL);
  console.log("Network:", network.chainId.toString(), network.name);
  console.log("Latest block:", latest);
  console.log("GasPrice (wei):", fee.gasPrice?.toString() ?? "n/a");
  console.log("MaxFeePerGas (wei):", fee.maxFeePerGas?.toString() ?? "n/a");
  console.log("MaxPriorityFeePerGas (wei):", fee.maxPriorityFeePerGas?.toString() ?? "n/a");

  const block = await provider.getBlock(latest);
  console.log("Block hash:", block.hash);
  console.log("Tx count:", block.transactions.length);
}

async function showWalletInfo() {
  if (!PRIVATE_KEY) {
    console.log("No PRIVATE_KEY set; skipping wallet info");
    return;
  }
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const address = await wallet.getAddress();
  const balance = await provider.getBalance(address);
  console.log("Wallet address:", address);
  console.log("Wallet balance:", ethers.formatEther(balance), "ETH");

  // Example: estimate cost to send 0.001 ETH
  const estimate = await provider.estimateGas({ to: address, value: ethers.parseEther("0.001") }).catch(() => null);
  console.log("Estimated gas (self-transfer 0.001 ETH):", estimate?.toString() ?? "n/a");
}

async function showAddressBalance(addr) {
  if (!addr) {
    console.log("No ADDRESS provided; pass argv[2] or set ADDRESS in .env");
    return;
  }
  const balance = await provider.getBalance(addr);
  console.log(`Balance of ${addr}:`, ethers.formatEther(balance), "ETH");
}

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)"
];

async function showERC20Metadata(token, holder) {
  if (!token) {
    console.log("No TOKEN address provided; set TOKEN in .env to query ERC20 metadata");
    return;
  }
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);

  const [name, symbol, decimals, totalSupply] = await Promise.all([
    erc20.name().catch(() => "n/a"),
    erc20.symbol().catch(() => "n/a"),
    erc20.decimals().catch(() => 18),
    erc20.totalSupply().catch(() => 0n)
  ]);

  console.log("ERC20:", token);
  console.log(" - name:", name);
  console.log(" - symbol:", symbol);
  console.log(" - decimals:", decimals);
  console.log(" - totalSupply:", ethers.formatUnits(totalSupply, decimals));

  if (holder) {
    const bal = await erc20.balanceOf(holder).catch(() => 0n);
    console.log(` - balanceOf(${holder}):`, ethers.formatUnits(bal, decimals));
  } else {
    console.log(" - No holder provided; pass argv[2] or set ADDRESS in .env to show token balance");
  }
}

async function main() {
  await showNetworkBasics();
  await showWalletInfo();
  await showAddressBalance(ADDRESS);
  await showERC20Metadata(TOKEN, ADDRESS);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});