import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const poppins = Poppins({weight: ['600'], subsets: ['latin']})

export const metadata: Metadata = {
  title: 'Arven Scans edit series',

}

export default function RootLayout({
  children, 
}: {
  children: React.ReactNode
}) {
  return (
    <>
   {children} <Toaster />
   </>
  )
}
