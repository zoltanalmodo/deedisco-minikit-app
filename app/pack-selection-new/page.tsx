"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import ImageCarousel from "../components/carousel/image-carousel"

// Pack data for the new structure
const packData = [
  {
    id: "all-random",
    name: "3 Cards Pack (all random)",
    images: [
      { id: "random1", src: "/pack-all-random.png", alt: "All Random Pack" },
      { id: "random2", src: "/pack-all-random.png", alt: "All Random Pack" },
      { id: "random3", src: "/pack-all-random.png", alt: "All Random Pack" }
    ]
  },
  {
    id: "guaranteed-top",
    name: "3 Cards Pack (guaranteed top)",
    images: [
      { id: "top1", src: "/pack-guaranteed-top.png", alt: "Guaranteed Top Pack" },
      { id: "top2", src: "/pack-guaranteed-top.png", alt: "Guaranteed Top Pack" },
      { id: "top3", src: "/pack-guaranteed-top.png", alt: "Guaranteed Top Pack" }
    ]
  },
  {
    id: "guaranteed-mid",
    name: "3 Cards Pack (guaranteed mid)",
    images: [
      { id: "mid1", src: "/pack-guaranteed-mid.png", alt: "Guaranteed Mid Pack" },
      { id: "mid2", src: "/pack-guaranteed-mid.png", alt: "Guaranteed Mid Pack" },
      { id: "mid3", src: "/pack-guaranteed-mid.png", alt: "Guaranteed Mid Pack" }
    ]
  },
  {
    id: "guaranteed-bot",
    name: "3 Cards Pack (guaranteed bot)",
    images: [
      { id: "bot1", src: "/pack-guaranteed-bot.png", alt: "Guaranteed Bot Pack" },
      { id: "bot2", src: "/pack-guaranteed-bot.png", alt: "Guaranteed Bot Pack" },
      { id: "bot3", src: "/pack-guaranteed-bot.png", alt: "Guaranteed Bot Pack" }
    ]
  }
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
  const [selectedImage, setSelectedImage] = useState(0)

  const handlePackSelect = (packIndex: number) => {
    setSelectedPack(packIndex)
    setSelectedImage(0) // Reset to first image when changing packs
  }

  const handleImageSelect = (imageIndex: number) => {
    setSelectedImage(imageIndex)
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
      <div className="carousel-container w-[360px] h-[360px] sm:w-[450px] sm:h-[450px] m-0 p-0 mx-auto">
        <div
          className="m-0 p-0"
          style={{ 
            margin: "0px", 
            padding: "0px"
          }}
        >
          <ImageCarousel
            images={packData[selectedPack].images}
            selectedIndex={selectedImage}
            onSelect={handleImageSelect}
            onNavigationClick={() => {}}
            showOverlay={false}
            resetTrigger={0}
            fullHeight={true}
          />
        </div>
      </div>

      {/* Pack Description */}
      <div className="text-center mb-3">
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

      {/* Pack Selection Dots */}
      <div className="flex justify-center gap-2 mb-4">
        {packData.map((_, index) => (
          <button
            key={index}
            onClick={() => handlePackSelect(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === selectedPack ? "bg-blue-400" : "bg-gray-600"
            }`}
            aria-label={`Select pack ${index + 1}`}
          />
        ))}
      </div>
    </main>
  )
}
