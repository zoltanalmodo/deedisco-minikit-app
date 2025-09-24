"use client"

import { useState, useEffect } from "react"
import { useMiniKit } from "@coinbase/onchainkit/minikit"
import PackCarousel from "@/app/components/carousel/pack-carousel"
import MintButton from "@/app/components/carousel/mint-button"

// Pack data - you can add more pack images here
const packData = [
  { id: 1, src: "/pack1.jpg", alt: "Pack 1 - Basic Collection", name: "Basic Pack" },
  { id: 2, src: "/pack2.jpg", alt: "Pack 2 - Premium Collection", name: "Premium Pack" },
  { id: 3, src: "/pack3.jpg", alt: "Pack 3 - Rare Collection", name: "Rare Pack" },
  { id: 4, src: "/pack4.jpg", alt: "Pack 4 - Legendary Collection", name: "Legendary Pack" },
  { id: 5, src: "/pack5.jpg", alt: "Pack 5 - Epic Collection", name: "Epic Pack" },
]

export default function PackSelection() {
  const { setFrameReady, isFrameReady } = useMiniKit()
  const [selectedPack, setSelectedPack] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isFrameReady) {
        setFrameReady()
        console.log("Frame ready signal sent via MiniKit")
      }
    }, 100)

    if (typeof window !== "undefined") {
      const isInIframe = window !== window.parent
      console.log("Is in iframe:", isInIframe)
      window.parent.postMessage({ type: "frame-ready" }, "*")
      console.log("Direct frame ready signal sent (type)")
      window.parent.postMessage({ method: "ready" }, "*")
      console.log("Farcaster SDK ready signal sent (method)")
    }

    return () => clearTimeout(timer)
  }, [setFrameReady, isFrameReady])

  const handlePackSelect = (packIndex: number) => {
    setSelectedPack(packIndex)
  }

  return (
    <main
      className="flex flex-col items-center w-full max-w-md mx-auto px-2 py-1 bg-[#1a1a1a] text-white"
      style={{ minHeight: "100vh", overflowY: "auto" }}
    >
      <header className="text-center mb-1">
        <h1 className="text-lg sm:text-xl font-bold mb-1 text-gray-300">
          Choose Your Pack
        </h1>
        <h2 className="text-base sm:text-lg font-semibold mb-1 text-gray-300">
          Select a pack to purchase
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mb-1">
          Browse through different pack collections and choose the one you want to buy.
        </p>
      </header>

      {/* Pack Carousel - Same size as 3 combined carousels */}
      <div className="w-full mb-4">
        <PackCarousel
          packs={packData}
          selectedIndex={selectedPack}
          onSelect={handlePackSelect}
        />
      </div>

      {/* Pack Info */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-300 mb-1">
          {packData[selectedPack]?.name}
        </h3>
        <p className="text-sm text-gray-400">
          {packData[selectedPack]?.alt}
        </p>
      </div>

      {/* Buy Button - Links to existing wallet popup */}
      <div className="flex justify-center w-full">
        <MintButton
          randomFrom={{
            top: [packData[selectedPack]], // Selected pack
            mid: [{ id: 0, src: "", alt: "Pack" }], // Dummy data
            bot: [{ id: 0, src: "", alt: "Pack" }], // Dummy data
          }}
          onMint={async ({ pack, wallet }) => {
            // Handle pack purchase here
            console.log("Purchasing pack", {
              requestedPack: pack,
              selectedPack: packData[selectedPack],
              wallet,
            })
          }}
          customButtonText={`Buy ${packData[selectedPack]?.name}`}
          showOnlySelected={true}
        />
      </div>
    </main>
  )
}
