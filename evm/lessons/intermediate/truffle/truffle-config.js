// truffle-config.js
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
      provider: () =>
        new HDWalletProvider(
          PRIVATE_KEY && PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY || ""}`,
          SEPOLIA_RPC_URL || ""
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