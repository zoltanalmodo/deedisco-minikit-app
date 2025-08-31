// app/components/carousel/mint-button.tsx
// before update
"use client"

interface MintButtonProps {
  selectedImages: Array<{
    id: number
    src: string
    alt: string
  }>
}

export default function MintButton({ selectedImages }: MintButtonProps) {
  const handleMint = () => {
    console.log("Minting with selected images:", selectedImages)
    // Add your minting logic here
  }

  return (
    <button
      onClick={handleMint}
      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
    >
      Mint Your Unforgettable NFT
    </button>
  )
}