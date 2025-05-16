"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from "next/image"

interface ImageData {
  id: number
  src: string
  alt: string
}

interface ImageCarouselProps {
  images: ImageData[]
  selectedIndex: number
  onSelect: (index: number) => void
}

export default function ImageCarousel({ images, selectedIndex, onSelect }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    // Update the selected index when it changes externally
    setCurrentIndex(selectedIndex)
  }, [selectedIndex])

  useEffect(() => {
    // Scroll to the current image without animation
    if (carouselRef.current) {
      const imageWidth = carouselRef.current.offsetWidth
      carouselRef.current.scrollTo({
        left: currentIndex * imageWidth,
        behavior: "auto", // No animation
      })
    }
  }, [currentIndex])

  const handleNext = () => {
    // Immediately go to the first image if we're at the last image
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    onSelect(newIndex)
  }

  const handlePrev = () => {
    // Immediately go to the last image if we're at the first image
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    onSelect(newIndex)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0))
    setScrollLeft(carouselRef.current?.scrollLeft || 0)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (carouselRef.current) {
      const imageWidth = carouselRef.current.offsetWidth
      const newIndex = Math.round(carouselRef.current.scrollLeft / imageWidth)
      // Ensure the index is within bounds
      const boundedIndex = Math.max(0, Math.min(newIndex, images.length - 1))
      setCurrentIndex(boundedIndex)
      onSelect(boundedIndex)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2 // Scroll speed multiplier
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0))
    setScrollLeft(carouselRef.current?.scrollLeft || 0)
  }

  const handleTouchEnd = () => {
    handleMouseUp() // Reuse the same logic
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const x = e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk
    }
  }

  return (
    <div className="carousel">
      <div
        ref={carouselRef}
        className="carousel-inner"
        style={{ scrollBehavior: "auto" }} // Ensure no smooth scrolling
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        {images.map((image, index) => (
          <div key={image.id} className="carousel-item">
            <div className={`carousel-image-container ${index === currentIndex ? "selected-image" : ""}`}>
              <Image 
                src={image.src || "/placeholder.svg"} 
                alt={image.alt} 
                className="carousel-image"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                priority={index === currentIndex}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-nav-button carousel-nav-button-left" onClick={handlePrev}>
        <ChevronLeft size={24} />
        <span className="sr-only">Previous slide</span>
      </button>

      <button className="carousel-nav-button carousel-nav-button-right" onClick={handleNext}>
        <ChevronRight size={24} />
        <span className="sr-only">Next slide</span>
      </button>
    </div>
  )
}