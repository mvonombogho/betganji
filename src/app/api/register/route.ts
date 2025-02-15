import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return new NextResponse('User already exists', { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    // Remove password from response
    const { hashedPassword: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    return new NextResponse(
      'An error occurred while registering',
      { status: 500 }
    );
  }
}
