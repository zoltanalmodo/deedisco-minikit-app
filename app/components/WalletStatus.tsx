// app/components/WalletStatus.tsx
"use client";

import { useAccount, useBalance } from "wagmi";
import { baseSepolia } from "wagmi/chains";

/**
 * Optional component to display wallet connection status
 * Add this to your app to show wallet info to users
 */
export function WalletStatus() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId: baseSepolia.id,
  });

  if (!isConnected) {
    return (
      <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-200">
        <p>⚠️ Wallet not connected</p>
        <p className="text-xs text-yellow-300/70 mt-1">
          Make sure you're accessing this app from Coinbase Wallet or Warpcast
        </p>
      </div>
    );
  }

  const isCorrectNetwork = chain?.id === baseSepolia.id;

  return (
    <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-medium">
            {isCorrectNetwork ? "✅ Connected" : "⚠️ Wrong Network"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
        {balance && (
          <div className="text-right">
            <p className="text-white font-medium">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </p>
            <p className="text-xs text-gray-400">Balance</p>
          </div>
        )}
      </div>
      {!isCorrectNetwork && (
        <p className="text-xs text-yellow-300 mt-2">
          Please switch to Base Sepolia network
        </p>
      )}
    </div>
  );
}
