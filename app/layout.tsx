import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { TooltipProvider } from '@/components/ui/tooltip'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Next Play',
  description: 'Next.js Play Ground',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col items-center bg-zinc-50 font-sans antialiased`}
      >
        <TooltipProvider>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  )
}
