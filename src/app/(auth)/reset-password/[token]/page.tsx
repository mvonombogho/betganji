import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

async function verifyToken(token: string) {
  const resetToken = await prisma.resetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) {
    return null;
  }

  // Check if token is expired
  if (new Date() > resetToken.expiresAt) {
    await prisma.resetToken.delete({
      where: { token },
    });
    return null;
  }

  return resetToken;
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const resetToken = await verifyToken(params.token);

  if (!resetToken) {
    redirect('/login?error=Invalid or expired reset link');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create a new password for your account
          </p>
        </div>

        {/* Reset Password Form */}
        <ResetPasswordForm 
          token={params.token} 
          email={resetToken.user.email}
        />
      </div>
    </div>
  );
}
