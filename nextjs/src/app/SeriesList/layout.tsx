import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
const poppins = Poppins({weight: ['600'], subsets: ['latin']})
const inter = Inter({ subsets: ['latin'] })
import './style1.css'
import './style2.css'
import './style3.css'

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
      <body className={`${poppins.className}` } style={{overflowX:'hidden'}}>{children} <Toaster /></body>
    </html>
  )
}
