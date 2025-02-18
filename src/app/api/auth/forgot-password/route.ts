import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new NextResponse(
        'Email is required',
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { resetToken: true },
    });

    // Don't reveal if user exists
    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with that email, a password reset link has been sent.'
      });
    }

    // Delete any existing reset tokens
    if (user.resetToken) {
      await prisma.resetToken.delete({
        where: { userId: user.id },
      });
    }

    // Generate new reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save reset token
    await prisma.resetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // TODO: Send email with reset link
    // For now, just log the token (we'll implement email in the next step)
    console.log(`Reset token for ${email}: ${token}`);

    return NextResponse.json({
      message: 'If an account exists with that email, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return new NextResponse(
      'Internal server error',
      { status: 500 }
    );
  }
}
