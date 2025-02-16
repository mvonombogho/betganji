import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function apiAuthMiddleware(req: NextRequest) {
  try {
    // Get the session cookie
    const session = req.cookies.get('session');

    if (!session?.value) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const decoded = verify(
      session.value,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: string; role: string };

    // Add user info to request headers for downstream handlers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('X-User-Id', decoded.userId);
    requestHeaders.set('X-User-Role', decoded.role);

    // Clone the request with new headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch (error) {
    console.error('API Auth Middleware Error:', error);
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
}

// Helper to check role-based access
export function checkRole(requiredRole: string, userRole: string): boolean {
  const roleHierarchy: Record<string, number> = {
    'user': 1,
    'premium': 2,
    'admin': 3
  };

  const userRoleLevel = roleHierarchy[userRole] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

  return userRoleLevel >= requiredRoleLevel;
}

// Helper to get user info from request
export function getUserFromRequest(req: NextRequest) {
  return {
    userId: req.headers.get('X-User-Id'),
    role: req.headers.get('X-User-Role')
  };
}
