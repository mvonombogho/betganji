import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Add Server-Timing header for performance monitoring
  const startTime = process.hrtime()
  response.headers.set(
    'Server-Timing',
    `miss, startTime;dur=${process.hrtime(startTime)[1] / 1000000}`
  )

  return response
}