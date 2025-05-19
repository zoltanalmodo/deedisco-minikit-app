// app/components/carousel/image-carousel.tsx
"use client"

import { useState } from "react"
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
}

export default function ImageCarousel({
  images,
  selectedIndex,
  onSelect,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex)

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length
    setCurrentIndex(newIndex)
    onSelect(newIndex)
  }

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length
    setCurrentIndex(newIndex)
    onSelect(newIndex)
  }

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-lg">
        <div className="relative h-[150px] w-full">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 flex items-center justify-center ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handlePrevious}
        className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
        aria-label="Next image"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}