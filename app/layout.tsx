import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'easyGear Terminal',
  description: 'Admin & Vendor Management System',
  // This adds the logo to your browser tab and device bookmarks
  icons: {
    icon: '/easyGearlogo_Black.png',
    apple: '/easyGearlogo_Black.png',
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