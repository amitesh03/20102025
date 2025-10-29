// lessons/frontend/wagmi/main.jsx
// Wrapper for Wagmi + RainbowKit per guide: [README.md](lessons/frontend/wagmi/README.md)
// Uses App component from: [App.jsx](lessons/frontend/wagmi/App.jsx)

import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import App from "./App.jsx";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "YOUR_WALLETCONNECT_PROJECT_ID";

// Optional: include local Hardhat chain (31337) for dev
// If you want to use localhost node, you can define it via viem:
// import { defineChain } from "viem";
// const hardhat = defineChain({
//   id: 31337,
//   name: "Hardhat",
//   nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
//   rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } },
// });

// Build wagmi config
const config = getDefaultConfig({
  appName: "wagmi-demo",
  projectId,
  chains: [sepolia, mainnet /*, hardhat*/],
  // transports, connectors etc. are preconfigured for RainbowKit via getDefaultConfig
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <RainbowKitProvider theme={darkTheme()}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);