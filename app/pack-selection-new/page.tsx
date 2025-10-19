"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import PackCarousel from "../components/carousel/pack-carousel"

// Pack data - 4 pack options as requested (from old pack selection page)
const packData = [
  { id: 1, src: "/pack-all-random.png", alt: "3 Cards Pack (all random)", name: "3 Cards Pack (all random)" },
  { id: 2, src: "/pack-guaranteed-top.png", alt: "3 Cards Pack (guaranteed top)", name: "3 Cards Pack (guaranteed top)" },
  { id: 3, src: "/pack-guaranteed-mid.png", alt: "3 Cards Pack (guaranteed mid)", name: "3 Cards Pack (guaranteed mid)" },
  { id: 4, src: "/pack-guaranteed-bot.png", alt: "3 Cards Pack (guaranteed bot)", name: "3 Cards Pack (guaranteed bot)" },
]

const getPackDescription = (packIndex: number) => {
  const descriptions = [
    "all 3 cards are random",
    "one guaranteed top card, two random cards",
    "one guaranteed mid card, two random cards", 
    "one guaranteed bot card, two random cards"
  ]
  return descriptions[packIndex] || descriptions[0]
}

const getPackButtonText = (packIndex: number) => {
  const buttonTexts = [
    "Buy 3 Cards Pack (all random)",
    "Buy 3 Cards Pack (guaranteed top)",
    "Buy 3 Cards Pack (guaranteed mid)",
    "Buy 3 Cards Pack (guaranteed bot)"
  ]
  return buttonTexts[packIndex] || buttonTexts[0]
}

export default function PackSelectionNewPage() {
  const [selectedPack, setSelectedPack] = useState(0)

  const handlePackSelect = (packIndex: number) => {
    setSelectedPack(packIndex)
  }

  return (
    <main
      className="flex flex-col items-center w-full max-w-[450px] mx-auto px-0 py-1 bg-[#1a1a1a] text-white"
      style={{ minHeight: "100vh", overflowY: "auto" }}
    >
      {/* Back to Main page button */}
      <div className="w-full flex justify-start mb-2 sm:justify-start">
        <Link href="/">
          <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Main
          </button>
        </Link>
      </div>

      <header className="text-center mb-1">
        <h1 className="text-lg sm:text-xl font-bold mb-1 text-gray-300">
          Find a pack you like and make it yours.
        </h1>
      </header>

      {/* Pack Carousel - Same structure as main page */}
      <div className="w-full mb-4">
        <PackCarousel
          packs={packData}
          selectedIndex={selectedPack}
          onSelect={handlePackSelect}
        />
      </div>

      {/* Pack Description */}
      <div className="text-center mb-3 mt-4">
        <p className="text-sm text-gray-300 font-medium">
          {getPackDescription(selectedPack)}
        </p>
      </div>

      {/* Buy Button */}
      <div className="mt-2 mb-2 flex justify-center w-full">
        <button
          type="button"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base"
        >
          {getPackButtonText(selectedPack)}
        </button>
      </div>

    </main>
  )
}
