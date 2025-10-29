/**
 * Wagmi / RainbowKit React sample
 * Maps to syllabus: Wallet connection, hooks, transaction handling, network switching
 *
 * Usage:
 *  - Project scaffold per lessons/frontend/wagmi/README.md
 *  - Replace your Vite app's src/App.jsx with this file
 */

import React, { useEffect, useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useBalance,
  useBlockNumber,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { formatEther, parseEther } from "viem";

// Minimal ERC20 ABI for reads
const ERC20_ABI = [
  { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
];

function Section({ title, children }) {
  return (
    <section style={{ border: "1px solid #333", borderRadius: 8, padding: 16, marginBlock: 12 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </section>
  );
}

export default function App() {
  const { address, isConnected, chain } = useAccount();

  // ETH balance for current account
  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address,
    enabled: Boolean(address),
  });

  // Latest block number (auto updating)
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // viem clients from wagmi
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Local state for ERC20 reads
  const [tokenAddr, setTokenAddr] = useState("");
  const [whoAddr, setWhoAddr] = useState("");
  const [tokenInfo, setTokenInfo] = useState({ symbol: "", decimals: 18 });
  const [tokenBalance, setTokenBalance] = useState(null);
  const canReadToken = useMemo(() => {
    try {
      return Boolean(tokenAddr && /^0x[0-9a-fA-F]{40}$/.test(tokenAddr) && (whoAddr || address));
    } catch {
      return false;
    }
  }, [tokenAddr, whoAddr, address]);

  // Read ERC20 metadata and balance via viem client
  useEffect(() => {
    let cancelled = false;
    async function readToken() {
      if (!publicClient || !canReadToken) return;
      const acct = (whoAddr && whoAddr.length > 0) ? whoAddr : address;

      try {
        const [symbol, decimals] = await Promise.all([
          publicClient.readContract({ address: tokenAddr, abi: ERC20_ABI, functionName: "symbol" }),
          publicClient.readContract({ address: tokenAddr, abi: ERC20_ABI, functionName: "decimals" }),
        ]);
        if (cancelled) return;
        setTokenInfo({ symbol, decimals: Number(decimals) });

        const bal = await publicClient.readContract({
          address: tokenAddr,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [acct],
        });
        if (cancelled) return;
        setTokenBalance(bal);
      } catch (e) {
        console.warn("ERC20 read failed:", e);
        if (!cancelled) {
          setTokenBalance(null);
          setTokenInfo({ symbol: "", decimals: 18 });
        }
      }
    }
    readToken();
    return () => {
      cancelled = true;
    };
  }, [publicClient, tokenAddr, whoAddr, address, canReadToken]);

  // Simple ETH send (transaction handling)
  const [toAddr, setToAddr] = useState("");
  const [ethAmount, setEthAmount] = useState("0.001");
  const canSend = useMemo(() => {
    return Boolean(
      walletClient &&
      isConnected &&
      /^0x[0-9a-fA-F]{40}$/.test(toAddr) &&
      ethAmount &&
      Number(ethAmount) > 0
    );
  }, [walletClient, isConnected, toAddr, ethAmount]);

  async function sendEth() {
    if (!walletClient) return;
    try {
      const hash = await walletClient.sendTransaction({
        to: toAddr,
        value: parseEther(ethAmount),
      });
      alert(`Tx sent: ${hash}`);
      // Balance updates automatically via re-render, but we can refetch explicitly
      refetchBalance?.();
    } catch (e) {
      alert(`Tx failed: ${e?.message || e}`);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", fontFamily: "system-ui, sans-serif", color: "#ddd" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Wagmi / RainbowKit Demo</h2>
        <ConnectButton />
      </header>

      <Section title="Connection">
        <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
        <p>Address: {address || "-"}</p>
        <p>Network: {chain ? `${chain?.name} (id=${chain?.id})` : "-"}</p>
      </Section>

      <Section title="Chain Data">
        <p>Latest block: {blockNumber?.toString() || "-"}</p>
      </Section>

      <Section title="ETH Balance">
        <p>
          Balance:{" "}
          {balanceData ? `${formatEther(balanceData.value)} ${balanceData.symbol}` : "-"}
        </p>
        <button onClick={() => refetchBalance?.()}>Refetch balance</button>
      </Section>

      <Section title="ERC20 Read">
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
          <label>
            ERC20 Address
            <input
              placeholder="0xTokenAddress"
              value={tokenAddr}
              onChange={(e) => setTokenAddr(e.target.value.trim())}
              style={{ width: "100%" }}
            />
          </label>
          <label>
            Account (optional)
            <input
              placeholder="0xAccountAddress"
              value={whoAddr}
              onChange={(e) => setWhoAddr(e.target.value.trim())}
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <div style={{ marginTop: 8 }}>
          <p>
            Token: {tokenInfo.symbol || "-"} | Decimals: {tokenInfo.decimals}
          </p>
          <p>
            Balance:{" "}
            {tokenBalance !== null
              ? `${Number(tokenBalance) / 10 ** tokenInfo.decimals} ${tokenInfo.symbol || ""}`
              : "-"}
          </p>
        </div>
      </Section>

      <Section title="Send ETH (Demo)">
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "2fr 1fr 1fr" }}>
          <label>
            Recipient
            <input
              placeholder="0xRecipient"
              value={toAddr}
              onChange={(e) => setToAddr(e.target.value.trim())}
              style={{ width: "100%" }}
            />
          </label>
          <label>
            Amount (ETH)
            <input
              type="number"
              step="0.0001"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button disabled={!canSend} onClick={sendEth}>
              Send
            </button>
          </div>
        </div>
        <p style={{ color: "#aaa", marginTop: 4 }}>
          Note: Use testnets (e.g., Sepolia) and ensure you have test ETH.
        </p>
      </Section>

      <footer style={{ marginTop: 24, color: "#aaa" }}>
        <p>
          See setup guide: <a href="/lessons/frontend/wagmi/README.md">lessons/frontend/wagmi/README.md</a>
        </p>
      </footer>
    </div>
  );
}