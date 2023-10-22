import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'

import { ClassNames } from '@emotion/react'
const poppins = Poppins({weight: ['600'], subsets: ['latin']})
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Arven Scans add new series',

}

export default function RootLayout({
  children, 
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className}` } style={{overflowX:'hidden'}}>{children}</body>
    </html>
  )
}
