# Drizzle (Optional, Legacy)

Maps to syllabus:
- Drizzle
- React integration patterns
- State management for blockchain data
- Contract interaction hooks
- Real-time data synchronization

Status note
- Drizzle was part of the original Truffle Suite. It is less actively maintained in modern stacks where Wagmi + RainbowKit + viem are preferred.
- This lesson is optional and intended for historical context. For production work, prefer the Wagmi sample: [`lessons/frontend/wagmi/README.md`](lessons/frontend/wagmi/README.md)

Concepts
- Drizzle keeps your contract data in a Redux store that auto-syncs via web3 subscriptions.
- Components can bind to contract calls and automatically re-render when the chain updates.

Prerequisites
- Node.js v18+
- Metamask
- A local or testnet RPC
- A compiled contract artifact (Truffle-style) or at least ABI + address

Install (approximate legacy packages)
npm i drizzle drizzle-react drizzle-react-components web3

Directory scaffold (suggestion)
- src/
  - drizzleOptions.js
  - App.jsx
  - contracts/
    - SimpleStorage.json  // Truffle artifact (recommended for Drizzle)
      // For this lesson, you can quickly produce an artifact by compiling with Truffle or Hardhat + truffle-flattener style,
      // but Drizzle expects Truffle-style artifacts with networks mapping.

Option A: Using Truffle artifact (recommended for Drizzle)
1) Produce a Truffle-style artifact for SimpleStorage (includes abi + networks + bytecode).
2) Create drizzleOptions with the artifact:

// src/drizzleOptions.js
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

3) Initialize Drizzle and wrap React app:

// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from "drizzle-react";
import { drizzleOptions } from "./drizzleOptions";
import App from "./App.jsx";

const store = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <DrizzleContext.Provider drizzle={drizzle}>
    <DrizzleContext.Consumer>
      {(drizzleContext) => {
        const { initialized } = drizzleContext;
        if (!initialized) return <div>Loading web3, accounts, and contracts...</div>;
        return <App />;
      }}
    </DrizzleContext.Consumer>
  </DrizzleContext.Provider>
);

4) Use Drizzle in a component to read state:

// src/App.jsx
import React, { useEffect, useState } from "react";
import { DrizzleContext } from "drizzle-react";

export default function App() {
  const [value, setValue] = useState("-");
  const [input, setInput] = useState("");

  return (
    <DrizzleContext.Consumer>
      {({ drizzle, drizzleState }) => {
        const contract = drizzle.contracts.SimpleStorage;

        useEffect(() => {
          let mounted = true;
          async function read() {
            try {
              const result = await contract.methods.get().call();
              if (mounted) setValue(result.toString());
            } catch (e) {
              console.error(e);
            }
          }
          read();
          // Optionally set up a polling or subscription strategy
          const interval = setInterval(read, 4000);
          return () => {
            mounted = false;
            clearInterval(interval);
          };
        }, [contract]);

        async function write() {
          const accounts = drizzleState.accounts;
          const from = accounts[0];
          try {
            // only owner can set() in our SimpleStorage example
            await contract.methods.set(input).send({ from });
          } catch (e) {
            alert(e?.message || e);
          }
        }

        return (
          <div style={{ padding: 16 }}>
            <h3>Drizzle + SimpleStorage (Optional)</h3>
            <p>Stored value: {value}</p>
            <div>
              <input
                placeholder="new value (uint256)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button onClick={write}>set()</button>
            </div>
          </div>
        );
      }}
    </DrizzleContext.Consumer>
  );
}

Option B: ABI + address without Truffle artifact (advanced)
- Drizzle expects Truffle-style artifacts to map deployed addresses by network.
- While you can craft a pseudo-artifact, the quickest path is to use a proper artifact or switch to Wagmi/viem.

Binding to events
- Drizzle can subscribe to events declared in the artifact.
- For SimpleStorage’s ValueChanged event from [`lessons/beginner/02-solidity-basics/contracts/SimpleStorage.sol`](lessons/beginner/02-solidity-basics/contracts/SimpleStorage.sol), ensure the artifact includes the event ABI and Drizzle will index it into Redux.
- Then read it via drizzle state or components like drizzle-react-components (legacy).

Recommendations
- Prefer the Wagmi sample for a modern React + EVM experience: [`lessons/frontend/wagmi/App.jsx`](lessons/frontend/wagmi/App.jsx)
- Use Drizzle here to understand historical patterns and Redux-style syncing.