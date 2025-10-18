"use client"

import { useState, useEffect } from "react"
import { useMiniKit } from "@coinbase/onchainkit/minikit"
import PackCarousel from "@/app/components/carousel/pack-carousel"
import MintButton from "@/app/components/carousel/mint-button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

// Pack data - 4 pack options as requested
const packData = [
  { id: 1, src: "/pack-all-random.png", alt: "3 Parts Pack (all random)", name: "3 Parts Pack (all random)" },
  { id: 2, src: "/pack-guaranteed-top.png", alt: "3 Parts Pack (guaranteed top)", name: "3 Parts Pack (guaranteed top)" },
  { id: 3, src: "/pack-guaranteed-mid.png", alt: "3 Parts Pack (guaranteed mid)", name: "3 Parts Pack (guaranteed mid)" },
  { id: 4, src: "/pack-guaranteed-bot.png", alt: "3 Parts Pack (guaranteed bot)", name: "3 Parts Pack (guaranteed bot)" },
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
        {/* Back to Main page button */}
        <div className="w-full flex justify-start mb-2">
          <Link href="/">
            <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Main
            </button>
          </Link>
        </div>
        
        <h1 className="text-lg sm:text-xl font-bold mb-1 text-gray-300">
          Choose Your Pack
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mb-1">
          Discover our pack collections and choose the one you want.
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
