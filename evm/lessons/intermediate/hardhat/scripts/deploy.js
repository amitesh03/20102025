// Deploy script for MyToken (OpenZeppelin ERC20)
// Maps to syllabus: compilation, deployment, verification, gas estimation
//
// Usage:
//   npx hardhat compile
//   npx hardhat run scripts/deploy.js --network localhost
//   npx hardhat run scripts/deploy.js --network sepolia
//
// Env (.env):
//   TOKEN_NAME=MyToken
//   TOKEN_SYMBOL=MTK
//   INITIAL_SUPPLY=1000000        // human-readable units before decimals (default 1,000,000)
//   ETHERSCAN_API_KEY=...         // optional for verification
//   PRIVATE_KEY=...               // account for networks like sepolia
//
// Notes:
// - INITIAL_SUPPLY is parsed with 18 decimals by default (ERC20 common)
"use strict";

require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const networkName = hre.network.name;
  const chainId = hre.network.config.chainId;
  console.log("Network:", { name: networkName, chainId });

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Deployer balance (ETH):", hre.ethers.formatEther(balance));

  const name = process.env.TOKEN_NAME || "MyToken";
  const symbol = process.env.TOKEN_SYMBOL || "MTK";
  const humanInitial = process.env.INITIAL_SUPPLY || "1000000";
  const decimals = 18;
  const initialSupply = hre.ethers.parseUnits(humanInitial.toString(), decimals);

  console.log("Deploying token with params:", { name, symbol, initialSupply: initialSupply.toString() });

  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const estimated = await MyToken.signer.estimateGas(
    MyToken.getDeployTransaction(name, symbol, initialSupply)
  ).catch(() => null);

  if (estimated) {
    console.log("Estimated deployment gas:", estimated.toString());
  } else {
    console.log("Gas estimation for deployment not available on this network/provider.");
  }

  const token = await MyToken.deploy(name, symbol, initialSupply);
  console.log("Deploy tx hash:", token.deploymentTransaction().hash);
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("MyToken deployed at:", address);

  // Optional: wait a few blocks for etherscan indexers
  const tx = token.deploymentTransaction();
  try {
    await tx.wait(3);
  } catch {
    // On localhost/hardhat, confirmations may be 0/1; ignore
  }

  // Optional Etherscan verification
  const shouldVerify =
    process.env.ETHERSCAN_API_KEY &&
    networkName !== "hardhat" &&
    chainId !== 31337;

  if (shouldVerify) {
    console.log("Verifying on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address,
        constructorArguments: [name, symbol, initialSupply],
      });
      console.log("Verification submitted.");
    } catch (err) {
      console.log("Verification skipped/failed:", err.message || err);
    }
  } else {
    console.log("Skipping verification: no ETHERSCAN_API_KEY or unsupported network.");
  }

  // Quick sanity checks
  const onName = await token.name();
  const onSymbol = await token.symbol();
  const onSupply = await token.totalSupply();
  console.log("On-chain metadata:", {
    name: onName,
    symbol: onSymbol,
    totalSupply: onSupply.toString(),
  });
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}