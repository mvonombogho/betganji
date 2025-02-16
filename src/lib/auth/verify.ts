import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return { success: false };
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { success: true, userId: payload.sub as string };
  } catch (error) {
    return { success: false };
  }
}

export async function getServerSession() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.sub as string };
  } catch {
    return null;
  }
}