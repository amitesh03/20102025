// UUPS proxy upgrade script: upgrade proxy from BoxV1Upgradeable to BoxV2Upgradeable
// Requires plugin enabled in config: require('@openzeppelin/hardhat-upgrades');
//
// Run:
//   set PROXY_ADDRESS=0xYourProxy && npx hardhat run scripts/upgrade-uups.js --network localhost
//   set PROXY_ADDRESS=0xYourProxy && npx hardhat run scripts/upgrade-uups.js --network sepolia
//
// Env (.env):
//   PROXY_ADDRESS=0xProxyAddressDeployedByDeployUups
//   PRIVATE_KEY=... (for non-local networks)

"use strict";

require("dotenv").config();
const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = process.env.PROXY_ADDRESS;
  if (!proxyAddress || !ethers.isAddress(proxyAddress)) {
    throw new Error("Set a valid PROXY_ADDRESS in environment.");
  }

  const network = await ethers.provider.getNetwork();
  console.log("Network:", { name: network.name, chainId: network.chainId.toString() });
  console.log("Proxy:", proxyAddress);

  const [deployer] = await ethers.getSigners();
  console.log("Upgrader:", deployer.address);

  // Snapshot pre-upgrade
  const pre = await ethers.getContractAt("BoxV1Upgradeable", proxyAddress);
  const preVal = await pre.retrieve();
  const preVer = await pre.version();
  console.log("Before upgrade -> value:", preVal.toString(), "version:", preVer);

  // Perform upgrade
  const BoxV2 = await ethers.getContractFactory("BoxV2Upgradeable");
  console.log("Upgrading proxy to BoxV2Upgradeable...");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, BoxV2);
  await upgraded.waitForDeployment();

  // Post-upgrade checks
  const implAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("New implementation address:", implAddress);

  const postVal = await upgraded.retrieve();
  const postVer = await upgraded.version();
  console.log("After upgrade -> value:", postVal.toString(), "version:", postVer);

  // Demonstrate new function availability (increment)
  console.log("Calling increment()...");
  const tx = await upgraded.increment();
  await tx.wait();
  const afterInc = await upgraded.retrieve();
  console.log("Value after increment:", afterInc.toString());
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}