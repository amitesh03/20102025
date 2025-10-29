// Local VRF test using VRFCoordinatorV2Mock (Chainlink)
// This script deploys the mock, creates/funds a subscription, deploys VRFDemo,
// adds it as a consumer, requests randomness, and fulfills it locally.
//
// Prereqs:
//  - npx hardhat node (localhost)
//  - npm i @chainlink/contracts dotenv
//  - Contract present: VRFDemo at [VRFDemo.sol](lessons/intermediate/hardhat/contracts/VRFDemo.sol)
//
// Run:
//  npx hardhat run scripts/vrf-local-mock.js --network localhost
//
// Notes:
//  - Uses a dummy keyHash (32-byte value) for local testing.
//  - Base fee and gas price for LINK are set to simple defaults suitable for local testing.

"use strict";

require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const { ethers } = hre;

  const network = await ethers.provider.getNetwork();
  console.log("Network:", { name: network.name, chainId: network.chainId.toString() });

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  const bal = await deployer.provider.getBalance(deployer.address);
  console.log("Balance (ETH):", ethers.formatEther(bal));

  // 1) Deploy VRFCoordinatorV2Mock
  // Constructor args: baseFee (LINK), gasPriceLink
  // See Chainlink docs; for local, these can be arbitrary reasonable values.
  const baseFee = ethers.parseEther("0.25"); // 0.25 LINK
  const gasPriceLink = 1_000_000_000n; // 1e9 wei per LINK (arbitrary for local)

  const VRFCoordinatorV2Mock = await ethers.getContractFactory(
    "@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol:VRFCoordinatorV2Mock"
  );
  const coordinator = await VRFCoordinatorV2Mock.deploy(baseFee, gasPriceLink);
  console.log("Coordinator tx:", coordinator.deploymentTransaction().hash);
  await coordinator.waitForDeployment();
  const coordinatorAddr = await coordinator.getAddress();
  console.log("VRFCoordinatorV2Mock at:", coordinatorAddr);

  // 2) Create and fund a subscription
  const txCreate = await coordinator.createSubscription();
  const rcCreate = await txCreate.wait();
  // Parse the SubscriptionCreated event
  const subCreated = rcCreate.logs.find((l) => {
    try {
      return coordinator.interface.parseLog(l).name === "SubscriptionCreated";
    } catch {
      return false;
    }
  });
  const subId = subCreated ? subCreated.args.subId : 1n;
  console.log("Subscription ID:", subId.toString());

  // Fund with some LINK (mock units)
  const amount = ethers.parseEther("10"); // 10 LINK in mock
  await (await coordinator.fundSubscription(subId, amount)).wait();
  console.log("Subscription funded with", ethers.formatEther(amount), "LINK (mock)");

  // 3) Deploy VRFDemo with mock coordinator, subscription, and a dummy keyHash
  const keyHash = ethers.id("dummy-key-hash"); // keccak256("dummy-key-hash"), 32 bytes
  const Demo = await ethers.getContractFactory("VRFDemo");
  const demo = await Demo.deploy(coordinatorAddr, subId, keyHash);
  console.log("VRFDemo tx:", demo.deploymentTransaction().hash);
  await demo.waitForDeployment();
  const demoAddr = await demo.getAddress();
  console.log("VRFDemo at:", demoAddr);

  // 4) Add consumer to subscription
  await (await coordinator.addConsumer(subId, demoAddr)).wait();
  console.log("Consumer added to subscription");

  // 5) Request random words (owner-only)
  const reqTx = await demo.requestRandomWords();
  const reqRc = await reqTx.wait();
  // Read s_lastRequestId from contract
  const reqId = await demo.s_lastRequestId();
  console.log("Requested. RequestId:", reqId.toString());

  // 6) Fulfill randomness locally via mock
  await (await coordinator.fulfillRandomWords(reqId, demoAddr)).wait();
  console.log("Fulfilled locally.");

  // 7) Read result
  const randomWord = await demo.getLastRandomWord();
  console.log("Random word:", randomWord.toString());

  // Show current config (optional)
  const confs = await demo.s_requestConfirmations();
  const gasLimit = await demo.s_callbackGasLimit();
  const numWords = await demo.s_numWords();
  console.log("Config -> confirmations:", confs, "callbackGasLimit:", gasLimit.toString(), "numWords:", numWords.toString());
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}