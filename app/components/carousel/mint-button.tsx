// app/components/carousel/mint-button.tsx
// after random selection implemented
"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useToast } from "../../../lib/hooks/use-toast";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { NFT_ABI } from "@/lib/contracts/nft-abi";
import { prepareMintTransaction, generateTokenURI } from "@/lib/mint-utils";

type Wallet = "warpcast" | "coinbase";
type Img = { id: number; src: string; alt: string };

interface MintButtonProps {
  /** Pools to draw from: exactly 1 random from each */
  randomFrom: {
    top: Img[];
    mid: Img[];
    bot: Img[];
  };
  /** Your mint hook (upload, metadata, contract call, etc.) */
  onMint?: (params: { pack: Img[]; wallet: Wallet }) => Promise<void> | void;
  /** Custom button text */
  customButtonText?: string;
  /** Show only selected pack (hide mid/bot) */
  showOnlySelected?: boolean;
}

export default function MintButton({ randomFrom, onMint, customButtonText, showOnlySelected = false }: MintButtonProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [walletType, setWalletType] = useState<Wallet>("warpcast");
  const [pack, setPack] = useState<Img[]>([]); // the locked random set for this modal open
  
  // Wagmi hooks for blockchain interaction
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // ---- crypto-safe random helpers (no user shuffle UI) ----
  function cryptoIndex(n: number) {
    if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
      const buf = new Uint32Array(1);
      const max = Math.floor(0xffffffff / n) * n; // rejection sampling, avoid modulo bias
      while (true) {
        window.crypto.getRandomValues(buf);
        const r = buf[0];
        if (r < max) return r % n;
      }
    }
    return Math.floor(Math.random() * n); // fallback
  }
  function pickOne<T>(arr: T[]): T {
    if (!arr || arr.length === 0) throw new Error("Empty image pool");
    return arr[cryptoIndex(arr.length)];
  }

  // Roll exactly once per modal open; no way for user to change it
  useEffect(() => {
    if (open) {
      const rolled = [pickOne(randomFrom.top), pickOne(randomFrom.mid), pickOne(randomFrom.bot)];
      setPack(rolled);
    } else {
      setPack([]); // clear when closed
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Watch for transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      toast({
        title: "NFTs Minted Successfully!",
        description: `${pack.length} NFT(s) have been minted! Transaction: ${hash.slice(0, 10)}...`,
      });
      setOpen(false);
      setIsMinting(false);
    }
  }, [isConfirmed, hash, pack.length, toast]);

  // Watch for errors
  useEffect(() => {
    if (writeError) {
      toast({
        title: "Minting Failed",
        description: writeError.message || "There was an error minting your NFTs. Please try again.",
        variant: "destructive",
      });
      setIsMinting(false);
    }
  }, [writeError, toast]);

  const handleMint = async () => {
    setIsMinting(true);
    
    try {
      // Check if wallet is connected
      if (!isConnected || !address) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to continue.",
          variant: "destructive",
        });
        setIsMinting(false);
        return;
      }

      // Get NFT contract address from environment
      const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`;
      
      if (!contractAddress) {
        toast({
          title: "Configuration Error",
          description: "NFT contract address not configured. Please set NEXT_PUBLIC_NFT_CONTRACT_ADDRESS in your .env file.",
          variant: "destructive",
        });
        setIsMinting(false);
        return;
      }

      // If custom onMint is provided, use it
      if (onMint) {
        await onMint({ pack, wallet: walletType });
        toast({
          title: "NFTs Minted Successfully!",
          description: `${pack.length} NFTs have been minted to your ${
            walletType === "warpcast" ? "Warpcast" : "Coinbase"
          } wallet.`,
        });
        setOpen(false);
        setIsMinting(false);
        return;
      }

      // Otherwise, use blockchain minting
      // For now, we'll mint the first item (you can batch mint all 3 in production)
      const firstItem = pack[0];
      if (!firstItem) {
        throw new Error("No items to mint");
      }

      // Generate metadata URI for the NFT
      const tokenURI = generateTokenURI(firstItem);

      // Prepare and send mint transaction
      const txData = prepareMintTransaction({
        contractAddress,
        recipientAddress: address,
        tokenURI,
      });

      // Execute the contract write
      writeContract({
        address: contractAddress,
        abi: NFT_ABI,
        functionName: 'mint',
        args: [address, tokenURI],
      });

      // The useEffect hooks above will handle success/error
    } catch (error) {
      console.error("Minting error:", error);
      toast({
        title: "Minting Failed",
        description: error instanceof Error ? error.message : "There was an error minting your NFTs. Please try again.",
        variant: "destructive",
      });
      setIsMinting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-lg transition-colors text-sm sm:text-base"
        >
          {customButtonText || "Buy a pack of random parts"}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-neutral-900 p-6 text-white shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95">
          <Dialog.Title className="text-lg font-semibold">Mint NFTs</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-neutral-300">
            You are about to mint 3 randomly selected parts. Choose your wallet to continue.
          </Dialog.Description>

          {/* Wallet selector */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <WalletCard
              id="warpcast"
              label="Warpcast Wallet"
              desc="Farcaster's native wallet"
              icon="warpcast"
              selected={walletType === "warpcast"}
              onSelect={() => setWalletType("warpcast")}
            />
            <WalletCard
              id="coinbase"
              label="Coinbase Wallet"
              desc="Popular crypto wallet"
              icon="coinbase"
              selected={walletType === "coinbase"}
              onSelect={() => setWalletType("coinbase")}
            />
          </div>

          {/* Locked random selection (no shuffle button) */}
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium">
              {showOnlySelected ? "Selected Pack" : "the 3 random parts"}
            </h3>
            <div className={`grid gap-2 ${showOnlySelected ? "grid-cols-1" : "grid-cols-3"}`}>
              {(pack.length ? pack : new Array(showOnlySelected ? 1 : 3).fill(null)).map((img, i) => {
                // If showOnlySelected is true, only show the first item (top)
                if (showOnlySelected && i > 0) return null;
                
                return (
                  <div
                    key={i}
                    className={`relative h-20 overflow-hidden rounded-md border border-white/10 ${
                      img ? "" : "animate-pulse bg-white/10"
                    }`}
                  >
                    {img && (
                      <Image
                        src={img.src || "/placeholder.svg"}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        sizes="80px"
                        priority={i < 3}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-white/15 bg-transparent px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
              >
                Cancel
              </button>
            </Dialog.Close>

            <button
              type="button"
              onClick={handleMint}
              disabled={isMinting || isPending || isConfirming || pack.length !== 3 || !isConnected}
              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isMinting || isPending || isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isConfirming ? "Confirming..." : "Minting..."}
                </>
              ) : !isConnected ? (
                "Connect Wallet First"
              ) : (
                "Mint NFTs"
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function WalletCard(props: {
  id: string;
  label: string;
  desc: string;
  icon: "warpcast" | "coinbase";
  selected: boolean;
  onSelect: () => void;
}) {
  const { id, label, desc, icon, selected, onSelect } = props;
  return (
    <label
      htmlFor={id}
      className={[
        "group block cursor-pointer rounded-xl border p-4 transition-colors",
        selected ? "border-purple-500 bg-purple-500/10" : "border-white/15 hover:bg-white/5",
      ].join(" ")}
      onClick={onSelect}
    >
      <input id={id} type="radio" name="wallet" className="sr-only" checked={selected} readOnly />
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
        {icon === "warpcast" ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
            <circle cx="12" cy="12" r="9" />
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
            <path d="M12 18V6" />
          </svg>
        )}
      </div>
      <div className="text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-xs text-neutral-400">{desc}</p>
      </div>
    </label>
  );
}
