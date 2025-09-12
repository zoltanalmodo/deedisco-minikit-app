// app/page.tsx
// after random selection implemented

"use client"

import { useState, useEffect } from "react"
import ImageCarousel from "@/app/components/carousel/image-carousel"
import MintButton from "@/app/components/carousel/mint-button"
import { useMiniKit } from "@coinbase/onchainkit/minikit"

// updated with useMiniKit frameready hook and direct frame ready signals!
// back to working OK BUT embed valid is X

type Img = { id: number; src: string; alt: string }

const carouselData: { id: number; images: Img[] }[] = [
  {
    id: 1,
    images: [
      { id: 1, src: "/carousel1-image1.jpg", alt: "Carousel 1 Image 1" },
      { id: 2, src: "/carousel1-image2.jpg", alt: "Carousel 1 Image 2" },
      { id: 3, src: "/carousel1-image3.jpg", alt: "Carousel 1 Image 3" },
      { id: 4, src: "/carousel1-image4.jpg", alt: "Carousel 1 Image 4" },
      { id: 5, src: "/carousel1-image5.jpg", alt: "Carousel 1 Image 5" },
      { id: 6, src: "/carousel1-image6.jpg", alt: "Carousel 1 Image 6" },
      { id: 7, src: "/carousel1-image7.jpg", alt: "Carousel 1 Image 7" },
      { id: 8, src: "/carousel1-image8.jpg", alt: "Carousel 1 Image 8" },
    ],
  },
  {
    id: 2,
    images: [
      { id: 1, src: "/carousel2-image1.jpg", alt: "Carousel 2 Image 1" },
      { id: 2, src: "/carousel2-image2.jpg", alt: "Carousel 2 Image 2" },
      { id: 3, src: "/carousel2-image3.jpg", alt: "Carousel 2 Image 3" },
      { id: 4, src: "/carousel2-image4.jpg", alt: "Carousel 2 Image 4" },
      { id: 5, src: "/carousel2-image5.jpg", alt: "Carousel 2 Image 5" },
      { id: 6, src: "/carousel2-image6.jpg", alt: "Carousel 2 Image 6" },
      { id: 7, src: "/carousel2-image7.jpg", alt: "Carousel 2 Image 7" },
      { id: 8, src: "/carousel2-image8.jpg", alt: "Carousel 2 Image 8" },
    ],
  },
  {
    id: 3,
    images: [
      { id: 1, src: "/carousel3-image1.jpg", alt: "Carousel 3 Image 1" },
      { id: 2, src: "/carousel3-image2.jpg", alt: "Carousel 3 Image 2" },
      { id: 3, src: "/carousel3-image3.jpg", alt: "Carousel 3 Image 3" },
      { id: 4, src: "/carousel3-image4.jpg", alt: "Carousel 3 Image 4" },
      { id: 5, src: "/carousel3-image5.jpg", alt: "Carousel 3 Image 5" },
      { id: 6, src: "/carousel3-image6.jpg", alt: "Carousel 3 Image 6" },
      { id: 7, src: "/carousel3-image7.jpg", alt: "Carousel 3 Image 7" },
      { id: 8, src: "/carousel3-image8.jpg", alt: "Carousel 3 Image 8" },
    ],
  },
]

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit()

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

  // Carousels still have their own selection state for browsing,
  // but MintButton will ignore it and mint a random top/mid/bot.
  const [selectedImages, setSelectedImages] = useState([0, 0, 0])
  
  // Overlay state - becomes true after 6 navigation button clicks
  const [showOverlay, setShowOverlay] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [resetTrigger, setResetTrigger] = useState(0)
  const CLICK_THRESHOLD = 6

  const handleImageSelect = (carouselIndex: number, imageIndex: number) => {
    const next = [...selectedImages]
    next[carouselIndex] = imageIndex
    setSelectedImages(next)
  }

  // Handle navigation button clicks - show overlay after 6 clicks
  const handleNavigationClick = () => {
    // Don't increment if we've already reached the threshold
    if (clickCount >= CLICK_THRESHOLD) {
      return
    }
    
    const newClickCount = clickCount + 1
    setClickCount(newClickCount)
    
    if (newClickCount >= CLICK_THRESHOLD) {
      setShowOverlay(true)
    }
  }

  // Reset to original state - clear overlay and reset all carousels to index 0
  const handleReset = () => {
    setShowOverlay(false)
    setClickCount(0)
    setSelectedImages([0, 0, 0])
    setResetTrigger(prev => prev + 1) // Trigger carousel reset
  }

  return (
    <main
      className="flex flex-col items-center w-full max-w-md mx-auto px-4 py-2 bg-[#1a1a1a] text-white"
      style={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <header className="text-center mb-2">
        <h1 className="text-xl font-bold mb-1 text-gray-300">
          deedisco - Mint Parts. Build Your Collections!
        </h1>
        <h2 className="text-lg font-semibold mb-1 text-gray-300">
          Mint 3 Random Parts - top, mid, bot.
        </h2>
        <p className="text-sm text-gray-400 mb-2">
          Collect pieces, assemble originals, trade, complete or create new sets and earn license fees when they are reused.
        </p>
        
        {/* Click progress indicator - always visible to maintain layout */}
        <div className="text-xs text-blue-400 mb-2 flex items-center justify-center gap-2">
          <span>Explore the collection! clicks: </span>
          <div className="flex gap-1">
            {Array.from({ length: CLICK_THRESHOLD }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i >= (CLICK_THRESHOLD - clickCount) ? "bg-gray-600" : "bg-blue-400"
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Notification space - always reserved to maintain layout */}
        <div className="mb-2 min-h-[24px] flex items-center justify-center">
          {showOverlay && (
            <div className="text-xs text-yellow-400 animate-pulse flex items-center justify-center gap-2">
              <span>🔒 Images are now hidden - navigate to explore parts!</span>
              <button
                onClick={handleReset}
                className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded hover:bg-yellow-400/30 transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="carousel-container w-full">
        {carouselData.map((carousel, index) => (
          <div
            key={carousel.id}
            className={`mb-0 ${index > 0 ? "border-t border-gray-700" : ""}`}
            style={{ marginBottom: "-1px" }}
          >
            <ImageCarousel
              images={carousel.images}
              selectedIndex={selectedImages[index]}
              onSelect={(imageIndex) => handleImageSelect(index, imageIndex)}
              onNavigationClick={handleNavigationClick}
              showOverlay={showOverlay}
              resetTrigger={resetTrigger}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 mb-4 flex justify-center w-full">
        <MintButton
          randomFrom={{
            top: carouselData[0].images,
            mid: carouselData[1].images,
            bot: carouselData[2].images,
          }}
          onMint={async ({ pack, wallet }) => {
            // Upload assets, create metadata, and call your mint contract here.
            console.log("Minting random pack", { pack, wallet })
          }}
        />
      </div>
    </main>
  )
}
