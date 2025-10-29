# Intermediate: Hardhat Project Guide

This lesson aligns with syllabus topics:
- Hardhat development environment
- Local blockchain setup
- Compilation, deployment, testing
- OpenZeppelin contracts
- Network configuration and management

We will create and run a Hardhat project with:
- Hardhat config: `hardhat.config.js`
- ERC20 contract using OpenZeppelin: `contracts/MyToken.sol`
- Deployment script: `scripts/deploy.js`
- Tests: `test/token.test.js`

Prerequisites
- Node.js v18+
- npm
- Optional accounts in Metamask (for testnet/mainnet later)

Step 1: Initialize a Hardhat project
Run these commands in the lesson directory:
1. Create directory (if not exists): `mkdir -p lessons/intermediate/hardhat`
2. Initialize and install dependencies:
   - `cd lessons/intermediate/hardhat`
   - `npm init -y`
   - `npm i --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv`
   - `npm i @openzeppelin/contracts`

Optional: Generate basic scaffold (we will provide custom files):
- `npx hardhat`

Step 2: Add project files
Create the following files:
- [`lessons/intermediate/hardhat/hardhat.config.js`](lessons/intermediate/hardhat/hardhat.config.js)
- [`lessons/intermediate/hardhat/contracts/MyToken.sol`](lessons/intermediate/hardhat/contracts/MyToken.sol)
- [`lessons/intermediate/hardhat/scripts/deploy.js`](lessons/intermediate/hardhat/scripts/deploy.js)
- [`lessons/intermediate/hardhat/test/token.test.js`](lessons/intermediate/hardhat/test/token.test.js)

We will add them in subsequent steps.

Step 3: Run a local node
- Start a local network:
  - `npx hardhat node`
- This prints accounts and private keys for testing.

Step 4: Compile and deploy to localhost
- Compile:
  - `npx hardhat compile`
- Deploy to the running local node:
  - `npx hardhat run scripts/deploy.js --network localhost`

Step 5: Run tests
- In another terminal:
  - `npx hardhat test`

What you will learn
- How Hardhat providers and networks work
- Using OpenZeppelin ERC20 and deploying with scripts
- Writing unit tests for contracts (Mocha/Chai)
- Estimating gas and observing receipts

Configuration overview
- `hardhat.config.js` sets Solidity version, plugins, and networks (localhost, testnets via env)
- You can manage environment variables with `.env` for API keys and private keys

Environment variables (.env)
For testnet/mainnet deployments, add a `.env` file:
- `SEPOLIA_RPC_URL=<alchemy_or_infura_url>`
- `PRIVATE_KEY=<hex_without_0x>`
- `ETHERSCAN_API_KEY=<optional_for_verification>`

Example networks (to be included in config):
- `localhost`: Hardhat node
- `sepolia`: Testnet
- `mainnet`: Main network (not recommended for beginners)

Next steps
- Create `hardhat.config.js` with network and compiler settings
- Add `MyToken.sol` (OpenZeppelin ERC20)
- Add `deploy.js` to deploy token with initial supply
- Add tests verifying name/symbol/decimals, initial supply, transfers, events

References
- Hardhat docs: https://hardhat.org/docs
- OpenZeppelin Contracts: https://docs.openzeppelin.com/contracts/5.x/
- Ethers.js: https://docs.ethers.org/