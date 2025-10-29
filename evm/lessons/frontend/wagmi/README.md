# Frontend Integration: Wagmi / RainbowKit

Maps to syllabus:
- React hooks and UI components for Ethereum
- Wallet connection management
- Transaction handling
- Network switching
- Component library for dApp UIs

Core sample:
- App component: [`lessons/frontend/wagmi/App.jsx`](lessons/frontend/wagmi/App.jsx)

Prerequisites
- Node.js v18+
- npm
- Metamask (or any EIP-1193 wallet)
- WalletConnect Project ID (for RainbowKit default config)

Setup (Vite + React)
1. Create app:
   - `npm create vite@latest wagmi-demo -- --template react`
2. Install:
   - `cd wagmi-demo`
   - `npm i wagmi @rainbow-me/rainbowkit viem`
3. Get WalletConnect projectId:
   - Create a project at https://cloud.walletconnect.com
   - Copy the `projectId` from the dashboard
4. Add CSS:
   - In `main.jsx` import RainbowKit styles:
     - `import '@rainbow-me/rainbowkit/styles.css';`
5. Replace your app:
   - Overwrite `src/App.jsx` with content from [`lessons/frontend/wagmi/App.jsx`](lessons/frontend/wagmi/App.jsx)
   - Update `src/main.jsx` to wrap with WagmiConfig and RainbowKitProvider (shown below)
6. Run:
   - `npm run dev`

main.jsx wrapper (example)
/* Place in wagmi-demo/src/main.jsx */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import App from './App.jsx';

const config = getDefaultConfig({
  appName: 'wagmi-demo',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [sepolia, mainnet],
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <RainbowKitProvider theme={darkTheme()}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

What App.jsx demonstrates
- ConnectButton from RainbowKit (wallet connection UI)
- useAccount: current address/connection status
- useBalance: read ETH balance
- useBlockNumber: read latest block number
- Network switching via RainbowKit UI
- Optional: read ERC20 balance with address input

Environment considerations
- Default chains above include `sepolia` and `mainnet`
- For local development (Hardhat):
  - Add `hardhat` chain with viem custom chain config
  - Example:
    import { defineChain } from 'viem';
    const hardhat = defineChain({
      id: 31337,
      name: 'Hardhat',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: { default: { http: ['http://127.0.0.1:8545'] } },
    });
  - Then include `hardhat` in your `chains` list in `getDefaultConfig`

Common issues
- If ConnectButton shows "No connectors", ensure Metamask is installed and page is served over http(s)
- If balances do not load, verify RPC rate limits and projectId validity
- Ensure `@rainbow-me/rainbowkit/styles.css` is imported once at app root

Next
- Open [`lessons/frontend/wagmi/App.jsx`](lessons/frontend/wagmi/App.jsx) and copy into your Vite project
- Run the app and connect your wallet
- Observe block number and balance updates