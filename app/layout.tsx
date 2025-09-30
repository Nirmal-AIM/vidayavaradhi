import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Footer from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import "./globals.css"
import '../styles/chatbot.module.css'

export const metadata: Metadata = {
  title: "VidyaVaradhi - AI-Powered Learning Platform",
  description: "Empowering Indian education through AI-driven personalized learning paths",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </main>
          <Footer />
          <Suspense fallback={null}>
            <Chatbot />
          </Suspense>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
