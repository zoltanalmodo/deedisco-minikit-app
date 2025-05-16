"use client"

import { useState } from "react"
import { Loader2 } from 'lucide-react'
import Image from "next/image"

interface ImageData {
  id: number
  src: string
  alt: string
}

interface MintButtonProps {
  selectedImages: ImageData[]
}

export default function MintButton({ selectedImages }: MintButtonProps) {
  const [isMinting, setIsMinting] = useState(false)
  const [walletType, setWalletType] = useState("warpcast")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleMint = async () => {
    setIsMinting(true)

    // Simulate minting process
    try {
      // In a real implementation, you would:
      // 1. Connect to the selected wallet
      // 2. Upload images to IPFS or similar storage
      // 3. Create metadata for the NFTs
      // 4. Call the smart contract to mint the NFTs

      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate network delay

      alert(
        `${selectedImages.length} NFTs have been minted to your ${walletType === "warpcast" ? "Warpcast" : "Coinbase"} wallet.`,
      )

      setIsDialogOpen(false)
    } catch { // Removed the _error parameter
      alert("There was an error minting your NFTs. Please try again.")
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setIsDialogOpen(true)}>
        Mint Selected Images as NFTs
      </button>

      {isDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsDialogOpen(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2 className="dialog-title">Mint NFTs</h2>
              <p className="dialog-description">
                You are about to mint {selectedImages.length} images as NFTs. Choose your wallet to continue.
              </p>
            </div>

            <div className="radio-group">
              <div
                className={`radio-item ${walletType === "warpcast" ? "selected" : ""}`}
                onClick={() => setWalletType("warpcast")}
              >
                <div className="radio-icon radio-icon-warpcast">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <div className="radio-label">
                  <p className="radio-label-title">Warpcast Wallet</p>
                  <p className="radio-label-description">Farcaster&apos;s native wallet</p>
                </div>
              </div>

              <div
                className={`radio-item ${walletType === "coinbase" ? "selected" : ""}`}
                onClick={() => setWalletType("coinbase")}
              >
                <div className="radio-icon radio-icon-coinbase">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                    <path d="M12 18V6" />
                  </svg>
                </div>
                <div className="radio-label">
                  <p className="radio-label-title">Coinbase Wallet</p>
                  <p className="radio-label-description">Popular crypto wallet</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-bold mb-4">Selected Images:</h3>
              <div className="selected-images-grid">
                {selectedImages.map((image, index) => (
                  <div key={index} className="selected-image-thumbnail">
                    <Image 
                      src={image.src || "/placeholder.svg"} 
                      alt={image.alt} 
                      className="object-cover w-full h-full"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="dialog-footer">
              <button className="btn btn-outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleMint} disabled={isMinting}>
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
          </div>
        </div>
      )}
    </div>
  )
}