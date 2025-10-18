// lib/mint-utils.ts
import { encodeFunctionData, parseEther } from 'viem'
import { NFT_ABI } from './contracts/nft-abi'

export interface MintParams {
  contractAddress: `0x${string}`
  recipientAddress: `0x${string}`
  tokenURI?: string
}

/**
 * Prepares transaction data for minting an NFT
 */
export function prepareMintTransaction(params: MintParams) {
  const { contractAddress, recipientAddress, tokenURI } = params

  // If tokenURI is provided, use mint(address, string)
  // Otherwise, use safeMint(address)
  const data = tokenURI
    ? encodeFunctionData({
        abi: NFT_ABI,
        functionName: 'mint',
        args: [recipientAddress, tokenURI],
      })
    : encodeFunctionData({
        abi: NFT_ABI,
        functionName: 'safeMint',
        args: [recipientAddress],
      })

  return {
    to: contractAddress,
    data,
    value: parseEther('0'), // Free mint, adjust if needed
  }
}

/**
 * Generates metadata URI for an NFT
 * In production, you'd upload to IPFS or your backend
 */
export function generateTokenURI(imageData: { id: number; src: string; alt: string }) {
  // For testing, we can use a data URI or placeholder
  // In production, upload to IPFS and return the IPFS hash
  const metadata = {
    name: imageData.alt,
    description: `NFT #${imageData.id}`,
    image: imageData.src,
    attributes: [
      {
        trait_type: 'ID',
        value: imageData.id,
      },
    ],
  }

  // Return base64 encoded JSON for testing
  const jsonString = JSON.stringify(metadata)
  const base64 = Buffer.from(jsonString).toString('base64')
  return `data:application/json;base64,${base64}`
}

/**
 * Upload image metadata to IPFS (placeholder)
 * You'll need to implement this with a service like Pinata, NFT.Storage, or your own backend
 */
export async function uploadToIPFS(imageData: { id: number; src: string; alt: string }): Promise<string> {
  // TODO: Implement actual IPFS upload
  // For now, return a placeholder URI
  console.log('IPFS upload not implemented yet, using placeholder', imageData)
  return generateTokenURI(imageData)
}
