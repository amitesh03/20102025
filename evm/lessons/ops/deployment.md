# Deployment Strategies for EVM dApps

Maps to syllabus:
- Deployment strategies
- Testnet vs Mainnet considerations
- Verification and infra setup
- Monitoring handoff

Prerequisites
- Hardhat project set up at:
  - [`lessons/intermediate/hardhat/hardhat.config.js`](lessons/intermediate/hardhat/hardhat.config.js)
  - [`lessons/intermediate/hardhat/contracts/MyToken.sol`](lessons/intermediate/hardhat/contracts/MyToken.sol)
  - [`lessons/intermediate/hardhat/scripts/deploy.js`](lessons/intermediate/hardhat/scripts/deploy.js)
  - [`lessons/advanced/patterns/UUPSProxy.sol`](lessons/advanced/patterns/UUPSProxy.sol)

Environments
- Localhost (Hardhat):
  - Fast, deterministic, unlimited funds. Use for TDD.
- Testnet (Sepolia, Holesky):
  - Realistic environment with faucets, public explorers, Chainlink test feeds.
- Mainnet:
  - Real value at risk. Require checklists, multisig, monitoring, and audit.

Secrets and accounts
- Use a .env file (never commit):
  - SEPOLIA_RPC_URL=https://...
  - PRIVATE_KEY=hex_without_0x
  - ETHERSCAN_API_KEY=api_key
- In config:
  - Accounts pulled from PRIVATE_KEY in [`hardhat.config.js`](lessons/intermediate/hardhat/hardhat.config.js)
- Prefer multisig ownership (e.g., Safe) on production deploys.

Gas and fee strategy
- Estimate gas before sending:
  - In scripts, call estimateGas when possible.
- Watch base fee volatility; consider maxFeePerGas/maxPriorityFeePerGas.
- For mass writes, batch or use off-chain computation when feasible.

Compile and build
- Commands:
  - npx hardhat clean
  - npx hardhat compile

Local deployment (localhost)
- Start node:
  - npx hardhat node
- In another terminal:
  - npx hardhat run scripts/deploy.js --network localhost
- Inspect results in console and via Hardhat console:
  - npx hardhat console --network localhost

Testnet deployment (Sepolia)
- Prepare:
  - Fund the deployer address with test ETH from a faucet.
  - Set SEPOLIA_RPC_URL, PRIVATE_KEY in .env
- Deploy:
  - npx hardhat run scripts/deploy.js --network sepolia
- Save artifacts:
  - Record contract addresses, constructor args, block numbers, and commit to a deployments/ directory (JSON). Example schema:
    {
      "network": "sepolia",
      "contracts": {
        "MyToken": {
          "address": "0x...",
          "constructorArgs": ["MyToken", "MTK", "1000000000000000000000000"],
          "deployer": "0x...",
          "txHash": "0x...",
          "block": 12345678
        }
      },
      "timestamp": 1700000000
    }

Mainnet deployment
- Checklist:
  - Security review and sign-off completed.
  - Owner is a multisig (not an EOA).
  - Pause or circuit breaker reviewed if relevant.
  - Backend/frontends ready to point at new addresses.
  - Run a dry run on a fork:
    - npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/yourKey
    - npx hardhat run scripts/deploy.js --network localhost
- Deploy during low-volatility windows when feasible.
- Immediately verify and announce addresses, publish ABI.

Upgradeable deployments (UUPS)
- Use the UUPS pattern example:
  - [`lessons/advanced/patterns/UUPSProxy.sol`](lessons/advanced/patterns/UUPSProxy.sol)
- Deployment script outline (requires @openzeppelin/hardhat-upgrades):
  - Deploy proxy with kind: "uups"
  - Restrict upgrades via onlyOwner; set owner to multisig.
- Upgrade steps:
  - Deploy new implementation
  - upgrades.upgradeProxy(proxyAddress, NewImplFactory)
  - Smoke test read/write
  - Publish change log and ABI diff
- Storage safety:
  - Never change storage variable ordering or types.
  - Append variables only in new versions.
  - Run storage layout checks (OZ plugins provide reports).

Multi-chain and L2 considerations
- RPC endpoints per chain (rate limits differ).
- Gas tokens and fee markets vary (e.g., baseFee behavior).
- Bridges:
  - Do not hardcode bridge assumptions; use well-reviewed adapters.
- L2 quirks:
  - Finality windows and delayed withdrawals (Optimistic)
  - Calldata cost dominance (optimize ABI and batch)
  - Precompiles and opcodes differences in some L2s
- Validate Chainlink oracles/VRF supported per chain before relying on them:
  - [`lessons/external/chainlink/VRFDemo.sol`](lessons/external/chainlink/VRFDemo.sol)

Deterministic addresses (advanced)
- CREATE2 can precompute addresses:
  - Improves predictability for frontends/integrators.
  - Risks if salts collide or init code changes; manage carefully.
- Hardhat plugins and utilities exist for deterministic deploys.

Access control and ownership transfer
- Immediately transfer ownership on deploy:
  - Token/contract owner => multisig Safe
- Use time-locked upgrades for production
- Document runbooks:
  - How to pause/unpause
  - How to recover from misconfig
  - How to rotate roles

Post-deploy validation
- Sanity calls:
  - name/symbol/decimals/totalSupply on ERC20
  - Role memberships (hasRole)
  - Critical addresses set (oracles, routers, vaults)
- Event emissions:
  - Confirm expected events logged in deployment receipt.

Artifacts and ABIs
- Commit JSON ABIs used by frontends to a dedicated path:
  - e.g., app/src/abi/MyToken.json
- Freeze ABI for public interfaces post-audit.

Rollback plan
- For non-upgradeable contracts:
  - Deploy new version and migrate state off-chain where applicable.
- For UUPS:
  - Keep previous implementation binaries and storage layout reports.
  - If upgrade fails, retain proxy at previous implementation.
- Always test upgrade and rollback on a fork before mainnet changes.

Integration with verification and monitoring
- Immediately verify contracts after deploy:
  - See verification guide:
    - [`lessons/ops/verification.md`](lessons/ops/verification.md)
- Enable alerts and monitoring:
  - See monitoring guide:
    - [`lessons/ops/monitoring.md`](lessons/ops/monitoring.md)

References
- Hardhat deployment scripts: [`lessons/intermediate/hardhat/scripts/deploy.js`](lessons/intermediate/hardhat/scripts/deploy.js)
- UUPS example: [`lessons/advanced/patterns/UUPSProxy.sol`](lessons/advanced/patterns/UUPSProxy.sol)
- OpenZeppelin Upgrades Plugins docs
- Ethereum.org Best Practices