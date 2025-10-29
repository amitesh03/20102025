# Truffle Development Framework

Maps to syllabus:
- Truffle: development and deployment framework
- Migration management system
- Built-in testing framework
- Console for contract interaction
- Network artifact management

This lesson provides a runnable Truffle project scaffold, migrations, tests, and deployment to localhost and Sepolia. Truffle is an alternative to Hardhat covered elsewhere in this course: [`lessons/intermediate/hardhat/README.md`](lessons/intermediate/hardhat/README.md)

Prerequisites
- Node.js v18+
- npm
- A wallet (MetaMask) for testnets
- RPC URL for Sepolia (Alchemy/Infura)

Install Truffle and Initialize
1) Install:
   - npm i -g truffle
2) Create a project:
   - mkdir truffle-demo && cd truffle-demo
   - truffle init
3) Install OpenZeppelin:
   - npm i @openzeppelin/contracts dotenv

Project Structure (after init)
- contracts/
  - Migrations.sol (generated)
  - MyToken.sol (add this)
- migrations/
  - 1_initial_migration.js (generated)
  - 2_deploy_mytoken.js (add this)
- test/
  - mytoken.test.js (add this)
- truffle-config.js (edit with networks/compilers)
- .env (add for private keys and RPC URLs)

Create ERC20 Contract
contracts/MyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract MyToken is ERC20, Ownable {
    constructor(string memory name_, string memory symbol_, uint256 initialSupply) ERC20(name_, symbol_) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

Create Migration Files
migrations/2_deploy_mytoken.js
const MyToken = artifacts.require("MyToken");
module.exports = async function (deployer) {
  const name = process.env.TOKEN_NAME || "MyToken";
  const symbol = process.env.TOKEN_SYMBOL || "MTK";
  const human = process.env.INITIAL_SUPPLY || "1000000"; // 1,000,000
  const decimals = BigInt(18);
  const initial = (BigInt(human) * (10n ** decimals)).toString();
  await deployer.deploy(MyToken, name, symbol, initial);
};

Configure Truffle
truffle-config.js (example)
require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env;
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    sepolia: {
      provider: () => new HDWalletProvider(
        PRIVATE_KEY?.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`,
        SEPOLIA_RPC_URL
      ),
      network_id: 11155111,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.8.24",
      settings: { optimizer: { enabled: true, runs: 200 } },
    },
  },
  db: { enabled: false },
};

Install the HDWallet Provider
- npm i @truffle/hdwallet-provider

Environment Variables
Create .env:
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/yourKey
PRIVATE_KEY=hex_without_0x
TOKEN_NAME=MyToken
TOKEN_SYMBOL=MTK
INITIAL_SUPPLY=1000000

Run a Local Chain
Option A: Ganache
- npm i -g ganache
- ganache
Option B: Hardhat node (compatible):
- npx hardhat node
Configure truffle-config.js development network to 127.0.0.1:8545 (already set above).

Compile and Migrate
- truffle compile
- truffle migrate --network development
- For Sepolia:
  - truffle migrate --network sepolia

Artifacts and Network Management
- Truffle stores deployed addresses in build/contracts/*.json under the networks mapping.
- These artifacts are consumable by UIs and scripts.

Interact via Truffle Console
- truffle console --network development
Then:
truffle(development)> const MyToken = artifacts.require("MyToken")
truffle(development)> const token = await MyToken.deployed()
truffle(development)> (await token.name()).toString()
truffle(development)> (await token.totalSupply()).toString()

Write Tests (Mocha/Chai)
test/mytoken.test.js
const MyToken = artifacts.require("MyToken");
const { assert } = require("chai");
const toWei = (n) => web3.utils.toWei(n, "ether");
contract("MyToken", (accounts) => {
  const [deployer, user] = accounts;
  it("deploys with correct metadata and initial supply", async () => {
    const token = await MyToken.deployed();
    assert.equal(await token.name(), "MyToken");
    assert.equal(await token.symbol(), "MTK");
    const total = await token.totalSupply();
    assert.equal(total.toString(), toWei("1000000"));
  });
  it("transfers tokens", async () => {
    const token = await MyToken.deployed();
    await token.transfer(user, toWei("100"), { from: deployer });
    const bal = await token.balanceOf(user);
    assert.equal(bal.toString(), toWei("100"));
  });
});

Run Tests
- truffle test

Event and Gas Insights
- Truffle test runner shows tx receipts; you can inspect logs via receipt.logs.
- For more detailed gas analysis, consider plugins or running on a local chain and inspecting receipts.

Verification
- For Etherscan verification, prefer Hardhat plugins or Truffle plugins (less maintained). Alternatively, flatten and upload with exact compiler settings.

Troubleshooting
- “Invalid number of parameters for constructor”:
  - Ensure migration passes (name, symbol, initialSupply) in correct order and units.
- “ProviderError: could not unlock signer”:
  - Verify PRIVATE_KEY and RPC URL; ensure the account has test ETH on Sepolia.
- “Out of gas”:
  - Increase gas or let Truffle estimate; ensure network gas price/limits allow deployment.

Related Lessons
- Hardhat alternative path: [`lessons/intermediate/hardhat/README.md`](lessons/intermediate/hardhat/README.md)
- ERC20 contract used in Hardhat: [`lessons/intermediate/hardhat/contracts/MyToken.sol`](lessons/intermediate/hardhat/contracts/MyToken.sol)