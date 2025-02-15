import { Suspense } from 'react'
import { Analytics } from '@/components/analytics'
import { PerformanceMonitor } from '@/components/performance-monitor'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical assets */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://api.football-data.org"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <PerformanceMonitor />
          <Analytics />
        </Suspense>
        {children}
      </body>
    </html>
  )
}