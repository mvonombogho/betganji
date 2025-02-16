import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify';

// Paths that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Verify authentication
  const authResult = await verifyAuth(request);
  
  if (!authResult.success) {
    // Redirect to login for page requests
    if (!pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Return 401 for API requests
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      {
        status: 401,
        headers: { 'content-type': 'application/json' }
      }
    );
  }

  // Add user info to headers for API routes
  if (pathname.startsWith('/api')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', authResult.userId);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};