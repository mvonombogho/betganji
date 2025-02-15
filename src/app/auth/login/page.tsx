import { LoginForm } from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - BetGanji',
  description: 'Sign in to your BetGanji account to access predictions and insights.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <LoginForm />
    </div>
  );
}
