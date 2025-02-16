import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = cookies().get('session');

    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify the session token
    const token = verify(
      sessionCookie.value,
      process.env.JWT_SECRET || 'your-secret-key'
    );

    // TODO: Fetch user data from your database
    // This is a placeholder implementation
    const user = {
      id: (token as any).userId,
      role: (token as any).role,
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(user);
  } catch (error) {
    console.error('Session check error:', error);

    // Clear invalid session
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      cookies().delete('session');
      return NextResponse.json(
        { message: 'Invalid session' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
