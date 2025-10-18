# 🎨 NFT Minting Implementation Guide

## Overview
Your MiniKit app is now configured to mint actual NFTs on Base Sepolia testnet! This guide will walk you through the complete setup and testing process.

## 📋 What's Been Implemented

### 1. **Wagmi Configuration** (`lib/wagmi.ts`)
- Configured for Base Sepolia testnet
- Coinbase Wallet connector with Smart Wallet support
- HTTP transport for blockchain communication

### 2. **Smart Contract ABI** (`lib/contracts/nft-abi.ts`)
- ERC-721 NFT contract interface
- Supports `mint(address, string)` and `safeMint(address)` functions
- Ready for common NFT operations

### 3. **Minting Utilities** (`lib/mint-utils.ts`)
- Transaction preparation helpers
- Metadata generation functions
- IPFS upload placeholder (to be implemented)

### 4. **Updated Mint Button** (`app/components/carousel/mint-button.tsx`)
- Integrated with Wagmi hooks
- Real blockchain transaction execution
- Transaction status tracking
- Error handling and user feedback

### 5. **Updated Providers** (`app/providers.tsx`)
- WagmiProvider for wallet connection
- QueryClient for React Query
- Base Sepolia network configuration

---

## 🚀 Setup Instructions

### Step 1: Deploy or Use an NFT Contract on Base Sepolia

You have **3 options**:

#### Option A: Use Remix IDE (Easiest for Testing)
1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file `MyNFT.sol` with this simple contract:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {}

    function safeMint(address to) public {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
    }

    function mint(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
\`\`\`

3. Compile the contract
4. Deploy to **Base Sepolia** using:
   - Network: Base Sepolia (Chain ID: 84532)
   - Get testnet ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
5. Copy the deployed contract address

#### Option B: Use Thirdweb (Recommended for Production)
1. Go to [Thirdweb](https://thirdweb.com/dashboard)
2. Click "Deploy Contract" → "NFT Collection"
3. Configure your collection
4. Deploy to Base Sepolia
5. Copy the contract address

#### Option C: Use an Existing Contract
If you already have a contract deployed, just use its address!

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
\`\`\`bash
cp .env.example .env.local
\`\`\`

2. Add your NFT contract address to `.env.local`:
\`\`\`bash
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x... # Your contract address here
\`\`\`

3. Make sure other required variables are set:
\`\`\`bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME="Your App Name"
\`\`\`

### Step 3: Get Testnet ETH

1. Go to [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
2. Or [Coinbase Wallet Faucet](https://portal.cdp.coinbase.com/products/faucet)
3. Enter your wallet address
4. Request testnet ETH (for gas fees)

### Step 4: Test the Minting Flow

1. Start your development server:
\`\`\`bash
npm run dev
\`\`\`

2. Open your MiniKit app in Coinbase Wallet or Warpcast

3. Click the "Buy a pack of random parts" button

4. Select your wallet (Warpcast or Coinbase)

5. Click "Mint NFTs"

6. Approve the transaction in your wallet

7. Wait for confirmation!

---

## 🔍 How It Works

### Minting Flow:
1. **User clicks "Mint" button** → Modal opens with random pack selection
2. **User selects wallet** → Warpcast or Coinbase wallet
3. **User clicks "Mint NFTs"** → Transaction is prepared
4. **Transaction execution**:
   - Checks wallet connection
   - Generates metadata URI for the NFT
   - Calls contract `mint(address, string)` function
   - Sends transaction to Base Sepolia
5. **Transaction confirmation** → User sees success toast with tx hash
6. **NFT is minted** → Check on [BaseScan Sepolia](https://sepolia.basescan.org/)

### Technical Stack:
- **Wagmi**: Wallet connection and contract interaction
- **Viem**: Ethereum utilities and encoding
- **OnchainKit**: MiniKit integration
- **Base Sepolia**: Testnet for testing

---

## 📝 Next Steps & Improvements

### 1. **Batch Minting** (Mint All 3 NFTs)
Currently, only the first NFT from the pack is minted. To mint all 3:

\`\`\`typescript
// In mint-button.tsx, replace single mint with batch
for (const item of pack) {
  const tokenURI = generateTokenURI(item);
  await writeContract({
    address: contractAddress,
    abi: NFT_ABI,
    functionName: 'mint',
    args: [address, tokenURI],
  });
}
\`\`\`

Or better, implement a batch mint function in your smart contract:
\`\`\`solidity
function batchMint(address to, string[] memory uris) public {
    for (uint i = 0; i < uris.length; i++) {
        mint(to, uris[i]);
    }
}
\`\`\`

### 2. **IPFS Integration**
Upload images and metadata to IPFS for permanent storage:

\`\`\`bash
npm install @pinata/sdk
# or
npm install nft.storage
\`\`\`

Update `lib/mint-utils.ts`:
\`\`\`typescript
import { PinataSDK } from "pinata";

export async function uploadToIPFS(imageData: Img) {
  const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: "example-gateway.mypinata.cloud",
  });
  
  const metadata = {
    name: imageData.alt,
    description: \`NFT #\${imageData.id}\`,
    image: imageData.src,
  };
  
  const upload = await pinata.upload.json(metadata);
  return \`ipfs://\${upload.IpfsHash}\`;
}
\`\`\`

### 3. **Payment Integration**
Add payment functionality:

\`\`\`typescript
// In mint transaction
const txData = {
  to: contractAddress,
  data: encodedMintData,
  value: parseEther('0.001'), // 0.001 ETH price
};
\`\`\`

### 4. **Add Minting History**
Track user's minted NFTs:

\`\`\`typescript
import { useReadContract } from 'wagmi';

const { data: balance } = useReadContract({
  address: contractAddress,
  abi: NFT_ABI,
  functionName: 'balanceOf',
  args: [address],
});
\`\`\`

### 5. **Production Deployment**
When ready for mainnet:
1. Update `lib/wagmi.ts` to use `base` instead of `baseSepolia`
2. Deploy contract to Base mainnet
3. Update `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS`
4. Test thoroughly!

---

## 🐛 Troubleshooting

### "Wallet Not Connected"
- Make sure MiniKit is properly initialized
- Check that wallet connector is working in providers.tsx

### "Configuration Error"
- Verify `.env.local` has `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS`
- Restart dev server after changing .env

### "Transaction Failed"
- Ensure you have testnet ETH for gas
- Check contract address is correct
- Verify you're on Base Sepolia network

### "Contract Function Not Found"
- Make sure your contract has the `mint(address, string)` function
- Update ABI in `lib/contracts/nft-abi.ts` to match your contract

---

## 🔗 Useful Links

- [Base Sepolia Explorer](https://sepolia.basescan.org/)
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- [OnchainKit Docs](https://docs.base.org/builderkits/onchainkit)
- [MiniKit Docs](https://docs.base.org/builderkits/minikit)
- [Wagmi Docs](https://wagmi.sh/)
- [Remix IDE](https://remix.ethereum.org/)
- [Thirdweb](https://thirdweb.com/)

---

## ✅ Testing Checklist

- [ ] NFT contract deployed to Base Sepolia
- [ ] Contract address added to .env.local
- [ ] Testnet ETH in wallet
- [ ] App connects to wallet successfully
- [ ] Mint button triggers transaction
- [ ] Transaction confirms on blockchain
- [ ] NFT appears in wallet
- [ ] Can view NFT on BaseScan

---

## 🎉 Success!

Your MiniKit app can now mint real NFTs on Base Sepolia testnet! 

Next steps:
1. Test the full minting flow
2. Implement IPFS for metadata
3. Add batch minting for all 3 NFTs
4. Prepare for mainnet deployment

Happy building! 🚀
