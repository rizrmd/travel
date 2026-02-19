import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Toaster } from 'sonner'
import { DensityProvider } from '@/lib/hooks/use-density'
import './globals.css'

// Font optimization with Next.js
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Travel Umroh',
    template: '%s | Travel Umroh',
  },
  description: 'Sistem Manajemen Agen Travel Umroh',
  keywords: ['umroh', 'travel', 'haji', 'manajemen', 'jamaah'],
  authors: [{ name: 'Travel Umroh' }],
  creator: 'Travel Umroh',
  metadataBase: new URL('https://travelumroh.com'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://travelumroh.com',
    title: 'Travel Umroh',
    description: 'Sistem Manajemen Agen Travel Umroh',
    siteName: 'Travel Umroh',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>
        <DensityProvider>
          {children}
          <Toaster position="top-right" richColors />
        </DensityProvider>
      </body>
    </html>
  )
}
