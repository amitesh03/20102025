// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
Chainlink VRFv2 Consumer Demo
Maps to syllabus: Chainlink (VRF random number generation), External data

Compile/install notes (Hardhat):
  npm i --save-dev @chainlink/contracts hardhat @nomicfoundation/hardhat-toolbox
  // Ensure your hardhat.config.js solidity version is >= 0.8.7 and compatible

Coordinator addresses, keyHash (gas lane), and subscription setup:
  - Create a VRF subscription in Chainlink UI for your network
  - Fund the subscription with LINK
  - Add this consumer contract address to the subscription (after you deploy it)
  - Use correct VRF Coordinator and keyHash for your chain:
    https://docs.chain.link/vrf/v2/subscription/supported-networks

Sepolia example (as of docs; verify in docs):
  VRF Coordinator: 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625
  Key Hash (gas lane): 0x474e34a077df... (shortened here; copy from docs)
  LINK token: 0x779877A7B0D9E8603169DdbD7836e478b4624789

Caution:
  - Avoid exposing functions that let arbitrary users spend your callback gas
  - Always validate fulfillRandomWords callers (handled by VRFConsumerBaseV2)
  - Do not rely on randomness for security-critical outcomes without careful design
*/

import { VRFCoordinatorV2Interface } from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import { VRFConsumerBaseV2 } from "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract VRFDemo is VRFConsumerBaseV2 {
    // Owner (simple access control)
    address public owner;

    // Chainlink VRF v2
    VRFCoordinatorV2Interface private immutable COORDINATOR;

    // Subscription ID (created and funded off-chain in Chainlink UI / scripts)
    uint64 public s_subscriptionId;

    // The gas lane to use, which specifies the maximum gas price to bump to
    // You can find these key hashes in the VRF supported networks docs
    bytes32 public s_keyHash;

    // How many confirmations the Chainlink node should wait before responding.
    // The higher, the more secure, but the longer it takes.
    uint16 public s_requestConfirmations = 3;

    // How much gas to use for the callback fulfillRandomWords
    uint32 public s_callbackGasLimit = 200_000;

    // How many random words we want in one request
    uint32 public s_numWords = 1;

    // Last request and result storage
    uint256 public s_lastRequestId;
    uint256 public s_lastRandomWord;

    // Optional: map requestId to requester
    mapping(uint256 => address) public s_requester;

    // Events
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event RandomWordsRequested(uint256 indexed requestId, address indexed requester);
    event RandomWordsFulfilled(uint256 indexed requestId, uint256[] randomWords);

    error NotOwner();
    error InvalidAddress();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(
        address vrfCoordinator, // VRF Coordinator for your chain
        uint64 subscriptionId,
        bytes32 keyHash
    ) VRFConsumerBaseV2(vrfCoordinator) {
        if (vrfCoordinator == address(0)) revert InvalidAddress();
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);

        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
        s_keyHash = keyHash;
    }

    // Request randomness. Typically restricted; demos may leave public but consider abuse.
    function requestRandomWords() external onlyOwner returns (uint256 requestId) {
        requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            s_requestConfirmations,
            s_callbackGasLimit,
            s_numWords
        );
        s_lastRequestId = requestId;
        s_requester[requestId] = msg.sender;
        emit RandomWordsRequested(requestId, msg.sender);
    }

    // Chainlink VRF callback. Only callable by Coordinator.
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        // Demo: store the first random word (if multiple requested, you can use all)
        if (randomWords.length > 0) {
            s_lastRandomWord = randomWords[0];
        }
        emit RandomWordsFulfilled(requestId, randomWords);
        // Application-specific logic can be added here (e.g., minting, lotteries)
    }

    // View helpers
    function getLastRandomWord() external view returns (uint256) {
        return s_lastRandomWord;
    }

    // Admin functions
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function setSubscriptionId(uint64 subscriptionId) external onlyOwner {
        s_subscriptionId = subscriptionId;
    }

    function setKeyHash(bytes32 keyHash) external onlyOwner {
        s_keyHash = keyHash;
    }

    function setRequestConfirmations(uint16 confirmations) external onlyOwner {
        // Chainlink recommends 3+; some networks may require min/max
        s_requestConfirmations = confirmations;
    }

    function setCallbackGasLimit(uint32 limit) external onlyOwner {
        s_callbackGasLimit = limit;
    }

    function setNumWords(uint32 numWords) external onlyOwner {
        require(numWords > 0, "numWords=0");
        s_numWords = numWords;
    }
}

/*
How to test quickly (on a testnet like Sepolia):

1) Setup Hardhat and install Chainlink contracts:
   - cd lessons/intermediate/hardhat
   - npm i @chainlink/contracts

2) Deploy:
   - Update constructor params with your VRF coordinator address, subscriptionId, and keyHash in a small deploy script:
     const Demo = await ethers.getContractFactory("VRFDemo");
     const demo = await Demo.deploy("<coordinator>", <subId>, "<keyHash>");
     await demo.waitForDeployment();

3) Add the deployed demo contract as a consumer to your VRF subscription in Chainlink UI.

4) Call requestRandomWords() from the owner:
   - await demo.requestRandomWords()

5) Wait for fulfillment (a few blocks), then read:
   - await demo.getLastRandomWord()

Notes:
- On local Hardhat network, VRF requires a mock; see Chainlink docs for VRFCoordinatorV2Mock to test locally.
*/