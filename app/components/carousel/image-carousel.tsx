"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Image {
  id: number
  src: string
  alt: string
}

interface ImageCarouselProps {
  images: Image[]
  selectedIndex: number
  onSelect: (index: number) => void
  onNavigationClick?: () => void
  showOverlay?: boolean
  resetTrigger?: number // This will change when reset is clicked, triggering useEffect
}

export default function ImageCarousel({
  images,
  selectedIndex,
  onSelect,
  onNavigationClick,
  showOverlay = false,
  resetTrigger = 0,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex)

  // Reset to index 0 when resetTrigger changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [resetTrigger])

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length
    setCurrentIndex(newIndex)
    onSelect(newIndex)
    onNavigationClick?.()
  }

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length
    setCurrentIndex(newIndex)
    onSelect(newIndex)
    onNavigationClick?.()
  }

  return (
    <div className="relative h-[286px] w-full bg-white m-0 p-0" style={{ margin: "0px", padding: "0px" }}>
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 flex items-center justify-center ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-contain"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, 100vw"
            />
          </div>
        </div>
      ))}
      
      {/* Overlay that becomes semi-transparent and blurred when showOverlay is true */}
      <div 
        className={`absolute top-0 left-0 w-full h-full transition-all duration-300 ${
          showOverlay 
            ? "bg-white/75 backdrop-blur-lg" 
            : "bg-transparent backdrop-blur-none"
        }`}
      />

      <button
        onClick={handlePrevious}
        className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-5 w-5 text-black" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
        aria-label="Next image"
      >
        <ChevronRight className="h-5 w-5 text-black" />
      </button>
    </div>
  )
}
