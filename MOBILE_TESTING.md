# 📱 Mobile Testing Guide - Deploy & Test Your MiniKit App

## 🚀 Option 1: Deploy to Vercel (RECOMMENDED)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Set Up Environment Variables
Before deploying, you need to configure your environment:

1. **Create `.env.local` file** (for local testing):
```bash
cp .env.example .env.local
```

2. **Add minimum required variables** to `.env.local`:
```bash
# Required for MiniKit
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME="deedisco"
NEXT_PUBLIC_URL="http://localhost:3000"
NEXT_PUBLIC_ONCHAINKIT_API_KEY="your_api_key_here"

# Optional: For NFT minting (can add later)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=""
```

3. **Get OnchainKit API Key** (if you don't have one):
   - Go to: https://portal.cdp.coinbase.com/
   - Create a project
   - Copy the API key

### Step 3: Deploy to Vercel
```bash
# Login to Vercel (first time only)
vercel login

# Deploy
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **deedisco-minikit-app** (or press enter)
- Directory? **./** (press enter)
- Override settings? **No** (press enter)

### Step 4: Add Environment Variables to Vercel
After deployment, add environment variables:

```bash
# Add each variable to Vercel
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY
vercel env add NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME
vercel env add NEXT_PUBLIC_URL
```

Or add them via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add each variable

### Step 5: Redeploy with Environment Variables
```bash
vercel --prod
```

You'll get a URL like: `https://deedisco-minikit-app.vercel.app`

### Step 6: Update NEXT_PUBLIC_URL
Update your environment variable with the actual Vercel URL:
```bash
vercel env add NEXT_PUBLIC_URL production
# Enter: https://your-app.vercel.app
```

Redeploy:
```bash
vercel --prod
```

### Step 7: Test on Mobile!

**Option A: Via Coinbase Wallet**
1. Open **Coinbase Wallet** app on your phone
2. Go to the **Discover** tab (compass icon)
3. Enter your Vercel URL: `https://your-app.vercel.app`
4. Your MiniKit app should load!

**Option B: Via Warpcast (Farcaster)**
1. Open **Warpcast** app on your phone
2. Create a cast with your URL
3. Or use the frame debugger: https://warpcast.com/~/developers/frames

---

## 🔧 Option 2: Local Testing with ngrok

If you want to test locally before deploying:

### Step 1: Install ngrok
```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com/download
```

### Step 2: Start Your Dev Server
```bash
npm run dev
```

### Step 3: Expose with ngrok
In a new terminal:
```bash
ngrok http 3000
```

You'll get a URL like: `https://abc123.ngrok.io`

### Step 4: Update Environment
Add the ngrok URL to your `.env.local`:
```bash
NEXT_PUBLIC_URL="https://abc123.ngrok.io"
```

Restart your dev server:
```bash
npm run dev
```

### Step 5: Test on Mobile
Open the ngrok URL in:
- Coinbase Wallet (Discover tab)
- Warpcast app

**Note**: ngrok URLs change each time you restart, so you'll need to update the URL frequently.

---

## 🌐 Option 3: Local Network (Same WiFi)

If your phone and computer are on the same WiFi:

### Step 1: Find Your Local IP
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

Look for something like: `192.168.1.100`

### Step 2: Start Dev Server on Network
```bash
npm run dev -- --hostname 0.0.0.0
```

### Step 3: Access from Mobile
On your phone, open:
```
http://192.168.1.100:3000
```

**Limitation**: This won't work in Coinbase Wallet/Warpcast due to HTTPS requirements. Use ngrok or Vercel instead.

---

## 📋 Testing Checklist

### Before Testing:
- [ ] Environment variables configured
- [ ] App deployed or exposed publicly
- [ ] OnchainKit API key added
- [ ] HTTPS URL obtained (Vercel or ngrok)

### On Mobile:
- [ ] App loads in Coinbase Wallet or Warpcast
- [ ] Can navigate between pages
- [ ] Carousels work smoothly
- [ ] Mint button appears
- [ ] Wallet connection works
- [ ] Can test minting (after contract deployed)

---

## 🔑 Required Environment Variables

**Minimum to run:**
```bash
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME="deedisco"
NEXT_PUBLIC_ONCHAINKIT_API_KEY="your_api_key"
NEXT_PUBLIC_URL="https://your-deployed-url.com"
```

**For NFT minting:**
```bash
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS="0x..."
```

**For Frame metadata (optional):**
```bash
NEXT_PUBLIC_APP_ICON="/icon.png"
NEXT_PUBLIC_APP_SUBTITLE="Mint Parts. Build Collections!"
NEXT_PUBLIC_APP_DESCRIPTION="Collect, assemble, and trade NFT parts"
```

---

## 🐛 Troubleshooting

### "Frame not loading"
- Make sure you're using HTTPS (Vercel or ngrok)
- Check environment variables are set
- Verify OnchainKit API key is valid

### "Wallet not connecting"
- Ensure you're accessing via Coinbase Wallet or Warpcast
- Check that MiniKitProvider is configured (already done in providers.tsx)

### "Mint button not working"
- Deploy NFT contract first (see QUICK_START.md)
- Add contract address to environment variables
- Make sure you have testnet ETH

---

## 🎉 Quick Deploy Commands

**Fastest way to test on mobile:**

```bash
# 1. Set up environment
cp .env.example .env.local
# Edit .env.local with your API key

# 2. Deploy to Vercel
npm i -g vercel
vercel login
vercel

# 3. Add environment variables
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY
# Paste your API key

# 4. Deploy to production
vercel --prod

# 5. Open in Coinbase Wallet on mobile!
```

---

## 📱 Best Testing Workflow

1. **Development**: Local testing with `npm run dev`
2. **Mobile Preview**: Use ngrok for quick mobile testing
3. **Production**: Deploy to Vercel for stable mobile access
4. **Share**: Share Vercel URL with testers

---

Need help? Check:
- [Vercel Docs](https://vercel.com/docs)
- [ngrok Docs](https://ngrok.com/docs)
- [MiniKit Docs](https://docs.base.org/builderkits/minikit)
- [OnchainKit Docs](https://docs.base.org/builderkits/onchainkit)
