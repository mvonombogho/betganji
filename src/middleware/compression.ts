import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import compression from 'compression';
import { createMiddlewareHandler } from '@next/middleware';

// Configure compression middleware
const compressionMiddleware = compression({
  level: 6, // Compression level (0-9)
  threshold: 1024, // Only compress responses above 1KB
});

// Create middleware handler
export const middleware = createMiddlewareHandler(async (req: NextRequest) => {
  const res = await compressionMiddleware(req, new NextResponse());
  
  // Add compression headers
  res.headers.set('Content-Encoding', 'gzip');
  res.headers.set('Vary', 'Accept-Encoding');
  
  return res;
});

// Configure middleware to run only on API routes
export const config = {
  matcher: '/api/:path*',
};