"use client"

import { useState, useEffect } from "react"
import ImageCarousel from "@/app/components/carousel/image-carousel"
import MintButton from "@/app/components/carousel/mint-button"
import { useMiniKit } from "@coinbase/onchainkit/minikit"

// updated with useMiniKit frameready hook and direct frame ready signals!

const carouselData = [
  {
    id: 1,
    images: [
      { id: 1, src: "/carousel1-image1.jpg", alt: "Carousel 1 Image 1" },
      { id: 2, src: "/carousel1-image2.jpg", alt: "Carousel 1 Image 2" },
      { id: 3, src: "/carousel1-image3.jpg", alt: "Carousel 1 Image 3" },
      { id: 4, src: "/carousel1-image4.jpg", alt: "Carousel 1 Image 4" },
      { id: 4, src: "/carousel1-image5.jpg", alt: "Carousel 1 Image 5" },
      { id: 4, src: "/carousel1-image6.jpg", alt: "Carousel 1 Image 6" },
      { id: 4, src: "/carousel1-image7.jpg", alt: "Carousel 1 Image 7" },
      { id: 4, src: "/carousel1-image8.jpg", alt: "Carousel 1 Image 8" },
    ],
  },
  {
    id: 2,
    images: [
      { id: 1, src: "/carousel2-image1.jpg", alt: "Carousel 2 Image 1" },
      { id: 2, src: "/carousel2-image2.jpg", alt: "Carousel 2 Image 2" },
      { id: 3, src: "/carousel2-image3.jpg", alt: "Carousel 2 Image 3" },
      { id: 4, src: "/carousel2-image4.jpg", alt: "Carousel 2 Image 4" },
      { id: 1, src: "/carousel2-image5.jpg", alt: "Carousel 2 Image 5" },
      { id: 2, src: "/carousel2-image6.jpg", alt: "Carousel 2 Image 6" },
      { id: 3, src: "/carousel2-image7.jpg", alt: "Carousel 2 Image 7" },
      { id: 4, src: "/carousel2-image8.jpg", alt: "Carousel 2 Image 8" },
    ],
  },
  {
    id: 3,
    images: [
      { id: 1, src: "/carousel3-image1.jpg", alt: "Carousel 3 Image 1" },
      { id: 2, src: "/carousel3-image2.jpg", alt: "Carousel 3 Image 2" },
      { id: 3, src: "/carousel3-image3.jpg", alt: "Carousel 3 Image 3" },
      { id: 4, src: "/carousel3-image4.jpg", alt: "Carousel 3 Image 4" },
      { id: 1, src: "/carousel3-image5.jpg", alt: "Carousel 3 Image 5" },
      { id: 2, src: "/carousel3-image6.jpg", alt: "Carousel 3 Image 6" },
      { id: 3, src: "/carousel3-image7.jpg", alt: "Carousel 3 Image 7" },
      { id: 4, src: "/carousel3-image8.jpg", alt: "Carousel 3 Image 8" },
    ],
  },
]

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    // Approach 1: Using MiniKit with timeout
    const timer = setTimeout(() => {
      if (!isFrameReady) {
        setFrameReady();
        console.log("Frame ready signal sent via MiniKit");
      }
    }, 100); // Small timeout
    
    // Approach 2: Direct frame ready signals
    if (typeof window !== "undefined") {
      // Log if we're in an iframe
      const isInIframe = window !== window.parent;
      console.log("Is in iframe:", isInIframe);
      
      // Send the frame-ready message directly to the parent window
      window.parent.postMessage({ type: "frame-ready" }, "*");
      console.log("Direct frame ready signal sent (type)");
      
      // Also try the Farcaster Frame SDK format
      window.parent.postMessage({ method: "ready" }, "*");
      console.log("Farcaster SDK ready signal sent (method)");
    }
  
    return () => clearTimeout(timer);
  }, [setFrameReady, isFrameReady]);

  const [selectedImages, setSelectedImages] = useState([0, 0, 0]) // Default selected index for each carousel

  const handleImageSelect = (carouselIndex: number, imageIndex: number) => {
    const newSelectedImages = [...selectedImages]
    newSelectedImages[carouselIndex] = imageIndex
    setSelectedImages(newSelectedImages)
  }

  const getSelectedImagesData = () => {
    return carouselData.map((carousel, index) => {
      const selectedImageIndex = selectedImages[index]
      return carousel.images[selectedImageIndex]
    })
  }

  return (
    <main className="container" style={{ padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "660px", margin: "0 auto" }}>
        <header className="text-center" style={{ marginBottom: "2rem" }}>
          <h1 className="text-3xl font-bold" style={{ marginBottom: "0.5rem" }}>
            Deedisco - Build Your Modular Fighter!<br />
            Combine parts, evolve through gameplay, and win your way.
          </h1>
          <p className="text-gray-600">
            Each fighter is forged from three parts — head, body, base.<br />
            Mix and match, evolve through play, build a fighter that stands out and make it uniquely yours.</p>
        </header>

        <div className="carousel-container">
          {carouselData.map((carousel, index) => (
            <div
              key={carousel.id}
              style={{
                borderTop: index > 0 ? "1px solid #e2e8f0" : "none",
                marginBottom: "-4px", // Remove any potential gap between carousels
              }}
            >
              <ImageCarousel
                images={carousel.images}
                selectedIndex={selectedImages[index]}
                onSelect={(imageIndex) => handleImageSelect(index, imageIndex)}
              />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <MintButton selectedImages={getSelectedImagesData()} />
        </div>
      </div>
    </main>
  )
}