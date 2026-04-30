import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'People You May Know - Professional Network Discovery',
  description: 'Discover and connect with professionals in your network. Find people you may know and expand your professional connections.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/placeholder-user.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/placeholder-user.jpg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/placeholder-user.jpg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/placeholder-user.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
