import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#667eea',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://gradientsaas.com'),
  title: {
    default: 'GradientSaaS - Build Faster with Gradient Magic',
    template: '%s | GradientSaaS'
  },
  description: 'The most powerful SaaS platform with beautiful gradients. Scale your business, delight your customers, and grow faster than ever.',
  keywords: ['saas', 'platform', 'gradient', 'business', 'scalable', 'dashboard', 'analytics'],
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gradientsaas.com',
    title: 'GradientSaaS - Build Faster with Gradient Magic',
    description: 'The most powerful SaaS platform with beautiful gradients.',
    siteName: 'GradientSaaS',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'GradientSaaS - Build Faster with Gradient Magic',
    description: 'The most powerful SaaS platform with beautiful gradients.',
    creator: '@gradientsaas',
    images: ['/twitter-image.png'],
  },
  
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}