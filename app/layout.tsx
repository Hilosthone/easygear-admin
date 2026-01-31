// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'easyGear Terminal',
  description: 'Admin & Vendor Management System for easyGear Marketplace',
  // metadataBase is REQUIRED for relative image paths to work on social media
  metadataBase: new URL('https://easygearadmin.netlify.app'),

  // Standard Icons
  icons: {
    icon: '/easyGear-Orange.jpeg',
    apple: '/easyGear-Orange.jpeg',
  },

  // WhatsApp & Facebook (Open Graph)
  openGraph: {
    title: 'easyGear Terminal',
    description: 'Mission-critical Admin & Vendor Management Terminal.',
    url: 'https://easygearadmin.netlify.app',
    siteName: 'easyGear',
    images: [
      {
        url: '/easyGear-Orange.jpeg', 
        width: 800,
        height: 600,
        alt: 'easyGear Admin Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'easyGear Terminal',
    description: 'Admin & Vendor Management System',
    images: ['/easyGear-Orange.jpeg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className='scroll-smooth'>
      <body className='antialiased bg-zinc-50 text-brand-slate'>
        {children}
      </body>
    </html>
  )
}