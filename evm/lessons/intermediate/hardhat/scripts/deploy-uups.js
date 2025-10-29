// UUPS proxy deploy script for BoxV1Upgradeable
// Requires plugin: add this at top of hardhat.config.js -> require('@openzeppelin/hardhat-upgrades');
//
// Run:
//   npx hardhat run scripts/deploy-uups.js --network localhost
//   npx hardhat run scripts/deploy-uups.js --network sepolia
//
// Env (.env):
//   INITIAL_VALUE=42
//   PRIVATE_KEY=... (for non-local networks)

"use strict";

require("dotenv").config();
const { ethers, upgrades } = require("hardhat");

async function main() {
  const network = await ethers.provider.getNetwork();
  console.log("Network:", { name: network.name, chainId: network.chainId.toString() });

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  const bal = await deployer.provider.getBalance(deployer.address);
  console.log("Balance (ETH):", ethers.formatEther(bal));

  const initial = process.env.INITIAL_VALUE
    ? BigInt(process.env.INITIAL_VALUE)
    : 42n;

  const BoxV1 = await ethers.getContractFactory("BoxV1Upgradeable");
  console.log("Deploying UUPS proxy for BoxV1Upgradeable with initialize(%s)...", initial.toString());

  const proxy = await upgrades.deployProxy(BoxV1, [initial], {
    kind: "uups",
    initializer: "initialize",
  });

  await proxy.waitForDeployment();

  const proxyAddress = await proxy.getAddress();
  console.log("UUPS Proxy deployed at:", proxyAddress);

  // Check stored value and version
  const value = await proxy.retrieve();
  const version = await proxy.version();
  console.log("Proxy value:", value.toString());
  console.log("Implementation version:", version);

  // Implementation address (optional informational)
  const implAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("Implementation address:", implAddress);

  // Admin address for ERC1967 (UUPS has no admin proxy, but the admin slot is still present)
  const adminAddress = await upgrades.erc1967.getAdminAddress(proxyAddress).catch(() => null);
  if (adminAddress) {
    console.log("Admin address:", adminAddress);
  } else {
    console.log("Admin slot not applicable for UUPS (expected).");
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}