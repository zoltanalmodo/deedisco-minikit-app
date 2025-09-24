"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Pack {
  id: number
  src: string
  alt: string
  name: string
}

interface PackCarouselProps {
  packs: Pack[]
  selectedIndex: number
  onSelect: (index: number) => void
}

export default function PackCarousel({
  packs,
  selectedIndex,
  onSelect,
}: PackCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex)

  // Reset to selected index when it changes
  useEffect(() => {
    setCurrentIndex(selectedIndex)
  }, [selectedIndex])

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + packs.length) % packs.length
    setCurrentIndex(newIndex)
    onSelect(newIndex)
  }

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % packs.length
    setCurrentIndex(newIndex)
    onSelect(newIndex)
  }

  return (
    <div className="relative w-full m-0 p-0" style={{ margin: "0px", padding: "0px" }}>
      <div className="overflow-hidden m-0 p-0" style={{ margin: "0px", padding: "0px" }}>
        {/* Single carousel with same dimensions as 3 combined carousels */}
        <div 
          className="relative w-full bg-white m-0 p-0 h-[360px] sm:h-[450px]" 
          style={{ 
            margin: "0px", 
            padding: "0px"
          }}
        >
          {packs.map((pack, index) => (
            <div
              key={pack.id}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 flex items-center justify-center ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={pack.src || "/placeholder.svg"}
                  alt={pack.alt}
                  fill
                  className="object-contain"
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, 100vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md z-10"
        aria-label="Previous pack"
      >
        <ChevronLeft className="h-5 w-5 text-black" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md z-10"
        aria-label="Next pack"
      >
        <ChevronRight className="h-5 w-5 text-black" />
      </button>
    </div>
  )
}
