import { Toaster } from 'react-hot-toast'

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
