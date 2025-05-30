import type React from "react"
import "./theme.css"
import "@coinbase/onchainkit/styles.css"
import type { Viewport } from "next"
import "./globals.css"
import { Providers } from "./providers"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const title = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "NFT Game Character Generator"
  const description = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Build Your Hero. Mint. Play."
  const URL = process.env.NEXT_PUBLIC_URL || "https://deedisco-minikit-app.vercel.app"
  const heroImage = process.env.NEXT_PUBLIC_APP_HERO_IMAGE || "https://deedisco-minikit-app.vercel.app/hero.png"
  const splashImage = process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE || "https://deedisco-minikit-app.vercel.app/splash.png"
  const splashBackground = process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#1a1a1a"

  // Create the Mini App embed JSON
  const frameEmbed = {
    version: "next",
    imageUrl: heroImage,
    button: {
      title: "Start",
      action: {
        type: "launch_frame",
        name: title,
        url: URL,
        splashImageUrl: splashImage,
        splashBackgroundColor: splashBackground,
      },
    },
  }

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* ✅ CORRECT Mini App Embed Meta Tag */}
        <meta name="fc:frame" content={JSON.stringify(frameEmbed)} />

        {/* Open Graph tags for better sharing */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={process.env.NEXT_PUBLIC_APP_OG_IMAGE || heroImage} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={process.env.NEXT_PUBLIC_APP_OG_IMAGE || heroImage} />
      </head>
      <body className="bg-[#1a1a1a]">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
