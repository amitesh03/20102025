// src/App.jsx
// Drizzle React example bound to SimpleStorage from the syllabus.
// Requires a Truffle-style artifact at:
//   [SimpleStorage.json](lessons/frontend/drizzle/src/contracts/SimpleStorage.json)

import React, { useEffect, useState } from "react";
import { DrizzleContext } from "drizzle-react";

function Section({ title, children }) {
  return (
    <section style={{ border: "1px solid #333", borderRadius: 8, padding: 16, marginBlock: 12 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </section>
  );
}

export default function App() {
  const [current, setCurrent] = useState("-");
  const [input, setInput] = useState("");
  const [account, setAccount] = useState("");

  return (
    <DrizzleContext.Consumer>
      {({ drizzle, drizzleState }) => {
        const { accounts } = drizzleState;
        const defaultAccount = accounts && accounts.length > 0 ? accounts[0] : "";
        const from = account || defaultAccount;
        const contract = drizzle.contracts.SimpleStorage;

        async function readValue() {
          try {
            // Direct call via web3 contract wrapper
            const result = await contract.methods.get().call();
            setCurrent(result.toString());
          } catch (e) {
            console.error("read failed:", e);
          }
        }

        async function writeValue() {
          if (!from) {
            alert("No account available");
            return;
          }
          try {
            // set(uint256) will only succeed if msg.sender is owner per SimpleStorage
            await contract.methods.set(input).send({ from });
            await readValue();
          } catch (e) {
            alert(e?.message || e);
          }
        }

        useEffect(() => {
          let mounted = true;

          // Initial load
          readValue();

          // Optional: poll every few seconds
          const interval = setInterval(() => {
            if (!mounted) return;
            readValue();
          }, 4000);

          return () => {
            mounted = false;
            clearInterval(interval);
          };
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [from]);

        return (
          <div style={{ maxWidth: 800, margin: "24px auto", fontFamily: "system-ui, sans-serif", color: "#ddd" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0 }}>Drizzle + SimpleStorage</h2>
              <small>Network: via web3 provider configured in Drizzle</small>
            </header>

            <Section title="Account">
              <div style={{ display: "grid", gap: 8, gridTemplateColumns: "2fr 1fr" }}>
                <label>
                  Active From
                  <input
                    placeholder={defaultAccount || "0x..."}
                    value={from}
                    onChange={(e) => setAccount(e.target.value.trim())}
                    style={{ width: "100%" }}
                  />
                </label>
                <div>
                  <p style={{ marginTop: 0 }}>
                    Default detected: {defaultAccount || "-"}
                  </p>
                </div>
              </div>
            </Section>

            <Section title="Read">
              <p>Stored value (get): {current}</p>
              <button onClick={readValue}>Refresh</button>
            </Section>

            <Section title="Write (owner only)">
              <div style={{ display: "grid", gap: 8, gridTemplateColumns: "2fr 1fr" }}>
                <label>
                  New value (uint256)
                  <input
                    type="number"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </label>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button onClick={writeValue}>set()</button>
                </div>
              </div>
              <p style={{ color: "#aaa" }}>
                Note: set() is restricted to the owner account per SimpleStorage in
                [{`SimpleStorage.sol`}](lessons/beginner/02-solidity-basics/contracts/SimpleStorage.sol).
              </p>
            </Section>

            <footer style={{ marginTop: 24, color: "#aaa" }}>
              <p>
                Drizzle options: [{`drizzleOptions.js`}](lessons/frontend/drizzle/src/drizzleOptions.js)
                {" "}• Artifact: [{`SimpleStorage.json`}](lessons/frontend/drizzle/src/contracts/SimpleStorage.json)
              </p>
            </footer>
          </div>
        );
      }}
    </DrizzleContext.Consumer>
  );
}