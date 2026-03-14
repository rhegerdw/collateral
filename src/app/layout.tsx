import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DarkWebIQ Collateral Generator',
  description: 'Generate meeting-specific collateral from your pitch content',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
