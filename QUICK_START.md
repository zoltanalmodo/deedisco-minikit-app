# 🚀 Quick Start: Test NFT Minting

## 5-Minute Setup Guide

### Step 1: Deploy NFT Contract (Using Remix)

1. **Open Remix IDE**: https://remix.ethereum.org/

2. **Create New File**: `MyNFT.sol`
   - Copy the contract from `/contracts/MyNFT.sol` in this repo

3. **Compile**:
   - Click "Solidity Compiler" tab
   - Select compiler version `0.8.20` or higher
   - Click "Compile MyNFT.sol"

4. **Deploy to Base Sepolia**:
   - Click "Deploy & Run Transactions" tab
   - Select "Injected Provider - MetaMask" as environment
   - **Switch your wallet to Base Sepolia network**:
     - Network Name: Base Sepolia
     - RPC URL: `https://sepolia.base.org`
     - Chain ID: `84532`
     - Currency: ETH
     - Block Explorer: `https://sepolia.basescan.org`
   - Click "Deploy"
   - Confirm transaction in MetaMask

5. **Copy Contract Address**:
   - After deployment, copy the contract address from Remix
   - It will look like: `0x1234567890123456789012345678901234567890`

### Step 2: Get Testnet ETH

1. Go to: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
2. Connect your wallet
3. Request testnet ETH
4. Wait for confirmation

### Step 3: Configure Your App

1. **Create `.env.local`** file in your project root:

\`\`\`bash
# Copy from .env.example
cp .env.example .env.local
\`\`\`

2. **Add your contract address** to `.env.local`:

\`\`\`bash
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x... # Paste your contract address here
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME="MiniKit NFT App"
\`\`\`

3. **Get OnchainKit API Key** (if you don't have one):
   - Go to: https://portal.cdp.coinbase.com/
   - Create a project
   - Copy API key

### Step 4: Run Your App

\`\`\`bash
npm install
npm run dev
\`\`\`

### Step 5: Test Minting!

1. Open your app in browser
2. Click "Buy a pack of random parts"
3. Select wallet (Warpcast or Coinbase)
4. Click "Mint NFTs"
5. Approve transaction in your wallet
6. Wait for confirmation!

### Step 6: Verify Your NFT

1. Go to: https://sepolia.basescan.org/
2. Search for your contract address
3. Click "Token" tab to see minted NFTs
4. Or check your wallet to see the NFT!

---

## ✅ Checklist

- [ ] Contract deployed to Base Sepolia
- [ ] Contract address copied
- [ ] Testnet ETH received
- [ ] `.env.local` configured
- [ ] App running on localhost
- [ ] Successfully minted NFT
- [ ] NFT visible on BaseScan

---

## 🐛 Common Issues

**"Wallet Not Connected"**
- Refresh the page
- Make sure you're in a MiniKit environment (Coinbase Wallet or Warpcast)

**"Transaction Failed"**
- Make sure you have testnet ETH
- Verify you're on Base Sepolia network
- Check contract address is correct

**"Configuration Error"**
- Restart dev server: `npm run dev`
- Check `.env.local` has contract address

---

## 🎉 Success!

You've successfully implemented NFT minting! Your NFTs are now minting on Base Sepolia testnet.

For more details, see `MINTING_GUIDE.md`
