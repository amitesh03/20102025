// Deploy Chainlink VRF v2 consumer (VRFDemo)
// Note: Ensure VRFDemo.sol is in your Hardhat project's contracts/ directory.
// Copy from: lessons/external/chainlink/VRFDemo.sol
//
// Requires: @chainlink/contracts
//   npm i @chainlink/contracts
//
// Run:
//   npx hardhat run scripts/deploy-vrf.js --network sepolia
//   npx hardhat run scripts/deploy-vrf.js --network localhost  // if using mocks
//
// Env (.env):
//   VRF_COORDINATOR=0x...   // VRF Coordinator address for your network
//   VRF_SUB_ID=1234         // uint64 subscription ID
//   VRF_KEY_HASH=0x...      // gas lane / key hash for your network
//   PRIVATE_KEY=...         // for non-local networks
//
// After deploy:
// - Add deployed consumer address to your VRF subscription (Chainlink UI)
// - Fund subscription with LINK
// - Call requestRandomWords() and wait for fulfillment

"use strict";

require("dotenv").config();
const hre = require("hardhat");

function ensureEnv() {
  const c = process.env.VRF_COORDINATOR;
  const subId = process.env.VRF_SUB_ID;
  const kh = process.env.VRF_KEY_HASH;

  const errs = [];
  if (!c || !hre.ethers.isAddress(c)) errs.push("VRF_COORDINATOR missing/invalid");
  if (!subId) errs.push("VRF_SUB_ID missing");
  if (!kh || !kh.startsWith("0x") || kh.length !== 66) errs.push("VRF_KEY_HASH missing/invalid (expect 32-byte hex)");

  if (errs.length) {
    throw new Error("Env errors: " + errs.join("; "));
  }
  return { coordinator: c, subscriptionId: BigInt(subId), keyHash: kh };
}

async function main() {
  const { name, chainId } = await hre.ethers.provider.getNetwork();
  console.log("Network:", { name, chainId: chainId.toString() });

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  const bal = await deployer.provider.getBalance(deployer.address);
  console.log("Deployer balance (ETH):", hre.ethers.formatEther(bal));

  const env = ensureEnv();

  console.log("Deploying VRFDemo with:", {
    coordinator: env.coordinator,
    subscriptionId: env.subscriptionId.toString(),
    keyHash: env.keyHash,
  });

  const Demo = await hre.ethers.getContractFactory("VRFDemo");
  const demo = await Demo.deploy(env.coordinator, env.subscriptionId, env.keyHash);
  console.log("Deploy tx:", demo.deploymentTransaction().hash);
  await demo.waitForDeployment();

  const addr = await demo.getAddress();
  console.log("VRFDemo deployed at:", addr);

  // Optional: show current config
  const sub = await demo.s_subscriptionId();
  const kh = await demo.s_keyHash();
  const confs = await demo.s_requestConfirmations();
  const gasLimit = await demo.s_callbackGasLimit();
  const numWords = await demo.s_numWords();

  console.log("On-chain config:", {
    subscriptionId: sub.toString(),
    keyHash: kh,
    confirmations: confs,
    callbackGasLimit: gasLimit.toString(),
    numWords: numWords.toString(),
  });

  console.log("Next steps:");
  console.log("- Add consumer address to VRF subscription via Chainlink UI");
  console.log("- Fund subscription with LINK");
  console.log("- Call requestRandomWords() (owner-only) and wait for fulfillment");
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}