"use client";

import { useState } from "react";
import { Button } from "./button"; // relative
import { Loader2 } from "lucide-react";
import { useToast } from "../../../lib/hooks/use-toast"; // relative to app/components/ui
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"; // relative
import { RadioGroup, RadioGroupItem } from "./radio-group"; // relative
import { Label } from "./label"; // relative
import Image from "next/image";

interface ImageData {
  id: number;
  src: string;
  alt: string;
}

interface MintButtonProps {
  selectedImages: ImageData[];
}

export default function MintButton({ selectedImages }: MintButtonProps) {
  const { toast } = useToast();
  const [isMinting, setIsMinting] = useState(false);
  const [walletType, setWalletType] = useState<"warpcast" | "coinbase">("warpcast");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleMint = async () => {
    setIsMinting(true);
    try {
      // TODO: integrate wallet + mint
      await new Promise((r) => setTimeout(r, 2000));
      toast({
        title: "NFTs Minted Successfully!",
        description: `${selectedImages.length} NFTs have been minted to your ${
          walletType === "warpcast" ? "Warpcast" : "Coinbase"
        } wallet.`,
        variant: "default",
      });
      setIsDialogOpen(false);
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
        >
          Mint Selected Images as NFTs
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mint NFTs</DialogTitle>
          <DialogDescription>
            You are about to mint {selectedImages.length} images as NFTs. Choose your wallet to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <RadioGroup
            value={walletType}
            onValueChange={(v: "warpcast" | "coinbase") => setWalletType(v)} // typed, no implicit any
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="warpcast" id="warpcast" className="peer sr-only" />
              <Label
                htmlFor="warpcast"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
              >
                <div className="mb-2 rounded-full bg-purple-100 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                       viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                       className="text-purple-600">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-medium">Warpcast Wallet</p>
                  <p className="text-sm text-muted-foreground">Farcaster&apos;s native wallet</p>
                </div>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="coinbase" id="coinbase" className="peer sr-only" />
              <Label
                htmlFor="coinbase"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
              >
                <div className="mb-2 rounded-full bg-blue-100 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                       viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                       className="text-blue-600">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                    <path d="M12 18V6" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-medium">Coinbase Wallet</p>
                  <p className="text-sm text-muted-foreground">Popular crypto wallet</p>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <h3 className="font-medium">Selected Images:</h3>
            <div className="grid grid-cols-3 gap-2">
              {selectedImages.map((image, index) => (
                <div
                  key={`${image.id}-${index}`}
                  className="relative h-20 rounded-md overflow-hidden border border-gray-200"
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleMint} disabled={isMinting} className="bg-purple-600 hover:bg-purple-700">
            {isMinting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : (
              "Mint NFTs"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
