import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { metrics } from '@/lib/monitoring/metrics';
import logger from '@/lib/monitoring/logger';

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const response = NextResponse.next();

  // Log request
  logger.info({
    method: request.method,
    path: request.nextUrl.pathname,
    ip: request.ip,
    userAgent: request.headers.get('user-agent'),
  });

  // Record API latency
  const latency = Date.now() - startTime;
  metrics.apiLatency.set({ endpoint: request.nextUrl.pathname }, latency);

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
