import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/lib/logging/logger';

interface RequestLog {
  id: string;
  method: string;
  path: string;
  query: Record<string, string>;
  headers: Record<string, string>;
  timestamp: string;
  duration?: number;
  status?: number;
  error?: Error;
  userId?: string;
}

const requestLogs = new Map<string, RequestLog>();

export async function loggingMiddleware(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  // Log initial request
  const log: RequestLog = {
    id: requestId,
    method: request.method,
    path: request.nextUrl.pathname,
    query: Object.fromEntries(request.nextUrl.searchParams),
    headers: Object.fromEntries(request.headers),
    timestamp: new Date().toISOString(),
  };

  // Add user ID if available
  try {
    const session = await getSession();
    if (session?.user?.id) {
      log.userId = session.user.id;
    }
  } catch {}

  requestLogs.set(requestId, log);
  logger.info(`API Request: ${request.method} ${request.nextUrl.pathname}`, log);

  try {
    // Add request ID to response headers
    const response = await NextResponse.next();
    response.headers.set('X-Request-ID', requestId);

    // Update log with response info
    const duration = Date.now() - startTime;
    const updatedLog = {
      ...log,
      duration,
      status: response.status
    };
    requestLogs.set(requestId, updatedLog);

    // Log response
    logger.info(
      `API Response: ${request.method} ${request.nextUrl.pathname} ${response.status}`,
      updatedLog
    );

    // Clean up old logs
    if (requestLogs.size > 1000) {
      const oldestId = requestLogs.keys().next().value;
      requestLogs.delete(oldestId);
    }

    return response;
  } catch (error) {
    // Log error
    const errorLog = {
      ...log,
      duration: Date.now() - startTime,
      error
    };
    requestLogs.set(requestId, errorLog);
    
    logger.error(
      `API Error: ${request.method} ${request.nextUrl.pathname}`,
      error as Error,
      errorLog
    );

    throw error;
  }
}

// Export for monitoring
export function getRequestLogs(limit: number = 100) {
  return Array.from(requestLogs.values())
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export function getRequestLog(id: string) {
  return requestLogs.get(id);
}
