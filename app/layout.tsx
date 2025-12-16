import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'A Life in Celebration',
  description: 'Join us for a special celebration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
