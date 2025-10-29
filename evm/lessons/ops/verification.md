# Contract Verification Guide (Etherscan and Explorers)

Maps to syllabus:
- Deployment strategies
- Verification on Etherscan
- Infrastructure setup

This guide shows how to verify your contracts on popular explorers using Hardhat.

Prerequisites
- Hardhat project set up:
  - Config: [`lessons/intermediate/hardhat/hardhat.config.js`](lessons/intermediate/hardhat/hardhat.config.js)
  - ERC20 sample: [`lessons/intermediate/hardhat/contracts/MyToken.sol`](lessons/intermediate/hardhat/contracts/MyToken.sol)
  - Deploy script: [`lessons/intermediate/hardhat/scripts/deploy.js`](lessons/intermediate/hardhat/scripts/deploy.js)
- Environment variables in .env:
  - SEPOLIA_RPC_URL=https://...
  - PRIVATE_KEY=hex_without_0x
  - ETHERSCAN_API_KEY=your_api_key

Install
- Hardhat Toolbox includes the Etherscan plugin:
  - require("@nomicfoundation/hardhat-toolbox") in config
- Make sure ETHERSCAN API key is set for the relevant network

Hardhat config
- See [`hardhat.config.js`](lessons/intermediate/hardhat/hardhat.config.js) for:
  - networks.sepolia.url
  - networks.sepolia.accounts loaded from PRIVATE_KEY
  - etherscan.apiKey from ETHERSCAN_API_KEY

Workflow

1) Deploy
- Example command:
  - npx hardhat run scripts/deploy.js --network sepolia
- Output should include the deployed address for MyToken

2) Verify with constructor args
- If your deploy script logs constructor args, reuse them:
  - npx hardhat verify --network sepolia 0xYourContractAddress "MyToken" "MTK" 1000000000000000000000000
- Or use programmatic verify task:
  - Your deploy script already attempts verification when ETHERSCAN_API_KEY is set:
    - [`lessons/intermediate/hardhat/scripts/deploy.js`](lessons/intermediate/hardhat/scripts/deploy.js)

3) Confirm on Etherscan
- Open the contract address in Etherscan
- ABI should be published and source verified
- The "Read/Write Contract" tabs should be available

Common issues and fixes

- Wrong constructor args
  - Ensure on-chain args match your deploy script exactly (types and order)
  - For uint256 amounts use full 18-decimal units (parseUnits in script)

- API rate limiting
  - Etherscan can throttle requests; retry after waiting
  - Keep a short delay between deploy and verify (3+ block confirmations)

- Different compiler settings
  - Your config’s Solidity version and optimizer settings must match what was used at compile time:
    - version: "0.8.24", optimizer enabled with runs = 200 (in this lesson)
  - Re-compile and retry if mismatched

- Multiple files/paths
  - Hardhat handles multi-file verification automatically
  - Keep imports consistent and use the same versions as compiled

- Proxy verification (UUPS, Transparent)
  - First verify implementation
  - Then verify proxy with the appropriate plugin/task
  - For UUPS example, see the implementation contracts:
    - [`lessons/advanced/patterns/UUPSProxy.sol`](lessons/advanced/patterns/UUPSProxy.sol)

Other explorers
- Blockscout-compatible chains: similar flow; they often support the Etherscan API
- Polygonscan, Arbiscan, Optimistic Etherscan:
  - Use their API keys and matching networks in Hardhat config

Manual verification (fallback)
- If automated verification fails, you can:
  - Flatten (not recommended for licenses) or upload multi-file sources manually through the explorer
  - Make sure to match compiler version and optimizer settings exactly

Checklist
- [ ] Address and network are correct
- [ ] Constructor args match deployment
- [ ] Compiler version and optimizer settings match
- [ ] API key is set and not rate-limited
- [ ] Waited sufficient block confirmations for indexers