import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'easyGear Terminal',
  description: 'Admin & Vendor Management System',
  // Browser tab and device bookmark icons
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
      <body className='antialiased bg-zinc-50 text-brand-slate selection:bg-brand-blue selection:text-white'>
        {/* Main Content Area */}
        <main className='min-h-screen'>{children}</main>
      </body>
    </html>
  )
}