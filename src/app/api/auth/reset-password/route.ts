import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return new NextResponse(
        'Token and password are required',
        { status: 400 }
      );
    }

    // Find reset token
    const resetToken = await prisma.resetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return new NextResponse(
        'Invalid or expired reset token',
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > resetToken.expiresAt) {
      await prisma.resetToken.delete({
        where: { token },
      });
      return new NextResponse(
        'Reset token has expired',
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user's password and delete reset token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.resetToken.delete({
        where: { token },
      }),
    ]);

    return NextResponse.json({
      message: 'Password reset successfully',
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return new NextResponse(
      'Internal server error',
      { status: 500 }
    );
  }
}
