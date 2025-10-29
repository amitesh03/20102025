# EVM dApp Development – Lessons Index

This index maps the syllabus topics in [`syllabus.md`](syllabus.md) to runnable lessons and code samples you can open and execute.

Getting Started
- Clone/open this workspace in VSCode
- Follow each lesson in order, or jump to a topic using the links below

Beginner
- Blockchain fundamentals guide: [`lessons/beginner/01-blockchain-fundamentals.md`](lessons/beginner/01-blockchain-fundamentals.md)
- Solidity basics guide: [`lessons/beginner/02-solidity-basics/README.md`](lessons/beginner/02-solidity-basics/README.md)
- SimpleStorage contract: [`lessons/beginner/02-solidity-basics/contracts/SimpleStorage.sol`](lessons/beginner/02-solidity-basics/contracts/SimpleStorage.sol)
- Web3.js RPC/connect: [`lessons/beginner/03-web3-ethers-js/web3-connect.js`](lessons/beginner/03-web3-ethers-js/web3-connect.js)
- Ethers.js RPC/connect: [`lessons/beginner/03-web3-ethers-js/ethers-connect.js`](lessons/beginner/03-web3-ethers-js/ethers-connect.js)
- Ethers.js SimpleStorage interaction: [`lessons/beginner/03-web3-ethers-js/interact-simple-storage.js`](lessons/beginner/03-web3-ethers-js/interact-simple-storage.js)
- Scripts README: [`lessons/beginner/03-web3-ethers-js/README.md`](lessons/beginner/03-web3-ethers-js/README.md)

Intermediate – Hardhat
- Project package: [`lessons/intermediate/hardhat/package.json`](lessons/intermediate/hardhat/package.json)
- Hardhat config: [`lessons/intermediate/hardhat/hardhat.config.js`](lessons/intermediate/hardhat/hardhat.config.js)
- Environment template: [`lessons/intermediate/hardhat/.env.example`](lessons/intermediate/hardhat/.env.example)
- ERC20 token contract: [`lessons/intermediate/hardhat/contracts/MyToken.sol`](lessons/intermediate/hardhat/contracts/MyToken.sol)
- Deploy script: [`lessons/intermediate/hardhat/scripts/deploy.js`](lessons/intermediate/hardhat/scripts/deploy.js)
- Token tests: [`lessons/intermediate/hardhat/test/token.test.js`](lessons/intermediate/hardhat/test/token.test.js)

Intermediate – Upgradeable (UUPS)
- Upgradeable Box contracts: [`lessons/intermediate/hardhat/contracts/BoxUpgradeable.sol`](lessons/intermediate/hardhat/contracts/BoxUpgradeable.sol)
- Deploy UUPS proxy: [`lessons/intermediate/hardhat/scripts/deploy-uups.js`](lessons/intermediate/hardhat/scripts/deploy-uups.js)
- Upgrade UUPS proxy: [`lessons/intermediate/hardhat/scripts/upgrade-uups.js`](lessons/intermediate/hardhat/scripts/upgrade-uups.js)
- UUPS tests: [`lessons/intermediate/hardhat/test/uups.test.js`](lessons/intermediate/hardhat/test/uups.test.js)

Intermediate – Truffle
- Truffle README: [`lessons/intermediate/truffle/README.md`](lessons/intermediate/truffle/README.md)
- Truffle config: [`lessons/intermediate/truffle/truffle-config.js`](lessons/intermediate/truffle/truffle-config.js)
- Migrations: [`lessons/intermediate/truffle/migrations/1_initial_migration.js`](lessons/intermediate/truffle/migrations/1_initial_migration.js)
- Deploy MyToken migration: [`lessons/intermediate/truffle/migrations/2_deploy_mytoken.js`](lessons/intermediate/truffle/migrations/2_deploy_mytoken.js)
- MyToken contract: [`lessons/intermediate/truffle/contracts/MyToken.sol`](lessons/intermediate/truffle/contracts/MyToken.sol)
- Token tests: [`lessons/intermediate/truffle/test/mytoken.test.js`](lessons/intermediate/truffle/test/mytoken.test.js)

External Data – Chainlink
- VRF consumer contract: [`lessons/external/chainlink/VRFDemo.sol`](lessons/external/chainlink/VRFDemo.sol)
- Chainlink README: [`lessons/external/chainlink/README.md`](lessons/external/chainlink/README.md)
- Local VRF mock workflow: [`lessons/intermediate/hardhat/scripts/vrf-local-mock.js`](lessons/intermediate/hardhat/scripts/vrf-local-mock.js)
- Deploy VRF to testnet: [`lessons/intermediate/hardhat/scripts/deploy-vrf.js`](lessons/intermediate/hardhat/scripts/deploy-vrf.js)
- Price Feed consumer: [`lessons/external/chainlink/PriceFeedConsumer.sol`](lessons/external/chainlink/PriceFeedConsumer.sol)

Frontend – Wagmi / RainbowKit
- Wagmi README: [`lessons/frontend/wagmi/README.md`](lessons/frontend/wagmi/README.md)
- React entry: [`lessons/frontend/wagmi/main.jsx`](lessons/frontend/wagmi/main.jsx)
- App component: [`lessons/frontend/wagmi/App.jsx`](lessons/frontend/wagmi/App.jsx)

Frontend – Drizzle (optional)
- Drizzle README: [`lessons/frontend/drizzle/README.md`](lessons/frontend/drizzle/README.md)
- Drizzle options: [`lessons/frontend/drizzle/src/drizzleOptions.js`](lessons/frontend/drizzle/src/drizzleOptions.js)
- React entry: [`lessons/frontend/drizzle/src/main.jsx`](lessons/frontend/drizzle/src/main.jsx)
- App component: [`lessons/frontend/drizzle/src/App.jsx`](lessons/frontend/drizzle/src/App.jsx)
- SimpleStorage artifact: [`lessons/frontend/drizzle/src/contracts/SimpleStorage.json`](lessons/frontend/drizzle/src/contracts/SimpleStorage.json)

Advanced – Security and Patterns
- Security README: [`lessons/advanced/security/README.md`](lessons/advanced/security/README.md)
- Reentrancy vulnerable contract: [`lessons/advanced/security/Reentrancy.sol`](lessons/advanced/security/Reentrancy.sol)
- Reentrancy fixed contract: [`lessons/advanced/security/ReentrancyFixed.sol`](lessons/advanced/security/ReentrancyFixed.sol)
- UUPS proxy example: [`lessons/advanced/patterns/UUPSProxy.sol`](lessons/advanced/patterns/UUPSProxy.sol)
- Minimal proxy factory: [`lessons/advanced/patterns/MinimalProxyFactory.sol`](lessons/advanced/patterns/MinimalProxyFactory.sol)

Ops – Deployment, Verification, Monitoring
- Deployment strategies: [`lessons/ops/deployment.md`](lessons/ops/deployment.md)
- Etherscan verification: [`lessons/ops/verification.md`](lessons/ops/verification.md)
- Monitoring guide: [`lessons/ops/monitoring.md`](lessons/ops/monitoring.md)
- Event monitor script: [`lessons/ops/monitor-events.js`](lessons/ops/monitor-events.js)

Tools – Testing and Gas
- Testing strategies: [`lessons/tools/testing-strategies.md`](lessons/tools/testing-strategies.md)
- Gas usage analysis: [`lessons/tools/gas-usage.md`](lessons/tools/gas-usage.md)

Advanced Topics
- Layer 2 overview: [`lessons/advanced/topics/layer2.md`](lessons/advanced/topics/layer2.md)
- DeFi overview: [`lessons/advanced/topics/defi.md`](lessons/advanced/topics/defi.md)
- Enterprise integration overview: [`lessons/advanced/topics/enterprise.md`](lessons/advanced/topics/enterprise.md)

How to Use These Lessons
- Read the guide files (.md) to understand concepts and steps
- Open the contracts (.sol) in Remix or compile them in Hardhat/Truffle
- Run scripts (.js/.jsx) with Node or Vite; follow each folder README
- Configure environment variables per [`lessons/intermediate/hardhat/.env.example`](lessons/intermediate/hardhat/.env.example)

Prerequisites
- Node.js LTS, npm or yarn
- VSCode with Solidity and ESLint extensions
- A testnet RPC (e.g., Alchemy/Infura) and a funded test wallet

Notes
- Some links may be placeholders until their files are created in subsequent steps
- We will implement each lesson progressively and validate execution

References
- Syllabus: [`syllabus.md`](syllabus.md)
- Libraries overview: [`content.txt.txt`](content.txt.txt)