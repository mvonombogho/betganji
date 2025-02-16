import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/jwt';

export async function middleware(request: NextRequest) {
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

  const session = await getSession();

  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
