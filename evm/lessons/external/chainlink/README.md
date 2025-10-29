# Chainlink VRF Lesson

This folder demonstrates integrating external data (randomness) using Chainlink VRF v2, aligned with the syllabus External Data section.

Core contract
- VRF consumer: [`VRFDemo.sol`](lessons/external/chainlink/VRFDemo.sol)

Project-local copies (for Hardhat)
- Contract (copied for Hardhat project use): [`VRFDemo.sol`](lessons/intermediate/hardhat/contracts/VRFDemo.sol)
- Sepolia deploy script: [`deploy-vrf.js`](lessons/intermediate/hardhat/scripts/deploy-vrf.js)
- Local mock end-to-end script: [`vrf-local-mock.js`](lessons/intermediate/hardhat/scripts/vrf-local-mock.js)

Prerequisites
- Node.js v18+
- Hardhat dev deps installed in the Hardhat lesson directory:
  - See [`package.json`](lessons/intermediate/hardhat/package.json)
  - Install: from lessons/intermediate/hardhat, run: npm install
- For Sepolia: funded testnet account and Chainlink subscription

A. Local development with VRFCoordinatorV2Mock
- Start a local node:
  - npx hardhat node
- In another terminal, run the mock workflow:
  - npx hardhat run [`scripts/vrf-local-mock.js`](lessons/intermediate/hardhat/scripts/vrf-local-mock.js) --network localhost
- What it does:
  - Deploys Chainlink’s VRFCoordinatorV2Mock
  - Creates/funds a subscription
  - Deploys [`VRFDemo`](lessons/intermediate/hardhat/contracts/VRFDemo.sol)
  - Adds the consumer address to the subscription
  - Requests randomness and fulfills it locally
- Expected output:
  - A non-zero random word printed at the end
  - Printouts of configuration (confirmations, gas limit, numWords)

B. Testnet (Sepolia) deployment
- Ensure you have:
  - VRF subscription created and funded with LINK
  - Coordinator address and keyHash for your network from Chainlink docs
- Set environment variables in a .env file under the Hardhat lesson:
  - See template: [`.env.example`](lessons/intermediate/hardhat/.env.example)
- Deploy the consumer on Sepolia:
  - npx hardhat run [`scripts/deploy-vrf.js`](lessons/intermediate/hardhat/scripts/deploy-vrf.js) --network sepolia
- After deployment:
  - Add the deployed consumer address to your VRF subscription (Chainlink UI)
  - Call requestRandomWords() from the owner and wait for fulfillment
  - Read getLastRandomWord() to verify a non-zero value

Security notes
- Restrict requestRandomWords() to trusted callers (owner-only in the demo)
- Be careful with callback gas limits; keep fulfillRandomWords() logic minimal
- Monitor fulfillments and alert on failures (see Ops monitoring)
  - Ops event monitor: [`monitor-events.js`](lessons/ops/monitor-events.js)

Troubleshooting
- Local mock not fulfilling:
  - Verify the consumer is added to the subscription in the script
  - Confirm fulfillRandomWords is called with the correct requestId and consumer address
- Sepolia not fulfilling:
  - Ensure the subscription has sufficient LINK
  - Confirm consumer was added to the subscription
  - Verify coordinator and keyHash values match the network docs
- Rate limits or RPC errors:
  - Retry with a different RPC provider or increase request intervals

References
- Chainlink docs: https://docs.chain.link/
- Contract source used in this lesson: [`VRFDemo.sol`](lessons/external/chainlink/VRFDemo.sol)
- Hardhat integration scripts:
  - [`deploy-vrf.js`](lessons/intermediate/hardhat/scripts/deploy-vrf.js)
  - [`vrf-local-mock.js`](lessons/intermediate/hardhat/scripts/vrf-local-mock.js)