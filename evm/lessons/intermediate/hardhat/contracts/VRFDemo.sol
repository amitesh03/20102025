// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { VRFCoordinatorV2Interface } from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import { VRFConsumerBaseV2 } from "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract VRFDemo is VRFConsumerBaseV2 {
    address public owner;
    VRFCoordinatorV2Interface private immutable COORDINATOR;

    uint64 public s_subscriptionId;
    bytes32 public s_keyHash;
    uint16 public s_requestConfirmations = 3;
    uint32 public s_callbackGasLimit = 200_000;
    uint32 public s_numWords = 1;

    uint256 public s_lastRequestId;
    uint256 public s_lastRandomWord;
    mapping(uint256 => address) public s_requester;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event RandomWordsRequested(uint256 indexed requestId, address indexed requester);
    event RandomWordsFulfilled(uint256 indexed requestId, uint256[] randomWords);

    error NotOwner();
    error InvalidAddress();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address vrfCoordinator, uint64 subscriptionId, bytes32 keyHash) VRFConsumerBaseV2(vrfCoordinator) {
        if (vrfCoordinator == address(0)) revert InvalidAddress();
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
        s_keyHash = keyHash;
    }

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

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        if (randomWords.length > 0) {
            s_lastRandomWord = randomWords[0];
        }
        emit RandomWordsFulfilled(requestId, randomWords);
    }

    function getLastRandomWord() external view returns (uint256) {
        return s_lastRandomWord;
    }

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