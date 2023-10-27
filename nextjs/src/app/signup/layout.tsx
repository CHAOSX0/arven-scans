import './style.css'
import toast, { Toaster } from 'react-hot-toast';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{overflow:'auto !important'}} className='h-[100vh] text-sm text-white'>{children}</body>
      <Toaster />
    </html>
  )
}
