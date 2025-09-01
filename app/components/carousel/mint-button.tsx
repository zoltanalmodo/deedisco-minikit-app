// app/components/carousel/mint-button.tsx
"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useToast } from "../../../lib/hooks/use-toast"; // adjust if your path differs

type Wallet = "warpcast" | "coinbase";

interface MintButtonProps {
  selectedImages: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
}

export default function MintButton({ selectedImages }: MintButtonProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [walletType, setWalletType] = useState<Wallet>("warpcast");

  const handleMint = async () => {
    setIsMinting(true);
    try {
      // TODO: connect wallet, upload assets, create metadata, contract call...
      await new Promise((r) => setTimeout(r, 1500));

      toast({
        title: "NFTs Minted Successfully!",
        description: `${selectedImages.length} NFTs have been minted to your ${
          walletType === "warpcast" ? "Warpcast" : "Coinbase"
        } wallet.`,
        variant: "default",
      });

      setOpen(false);
    } catch {
      toast({
        title: "Minting Failed",
        description: "There was an error minting your NFTs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors"
        >
          Mint Your Unforgettable NFT
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-neutral-900 p-6 text-white shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95">
          <Dialog.Title className="text-lg font-semibold">Mint NFTs</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-neutral-300">
            You are about to mint {selectedImages.length} image{selectedImages.length === 1 ? "" : "s"} as NFTs.
            Choose your wallet to continue.
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

          {/* Selected images */}
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium">Selected Images</h3>
            <div className="grid grid-cols-3 gap-2">
              {selectedImages.map((img, i) => (
                <div
                  key={`${img.id}-${i}`}
                  className="relative h-20 overflow-hidden rounded-md border border-white/10"
                >
                  <Image
                    src={img.src || "/placeholder.svg"}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="80px"
                    priority={i < 3}
                  />
                </div>
              ))}
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
              disabled={isMinting}
              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isMinting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Minting...
                </>
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

/** Small wallet card with peer-checked styles but no external UI deps */
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
          // Simple shield-ish icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-purple-400"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
        ) : (
          // Simple coin-ish icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-400"
          >
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
