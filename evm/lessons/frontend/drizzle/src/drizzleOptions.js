// drizzleOptions.js
// Configuration for Drizzle example in lessons/frontend/drizzle
// Note: The imported Truffle-style artifact must contain a "networks" mapping with your deployed address.

import SimpleStorage from "./contracts/SimpleStorage.json";

export const drizzleOptions = {
  contracts: [SimpleStorage],
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545",
    },
  },
};