import { Toaster } from 'react-hot-toast'
import './style.css'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
  {children}
  <Toaster />
  </>
  )
}
