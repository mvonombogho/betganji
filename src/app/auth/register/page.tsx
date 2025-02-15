import { RegisterForm } from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - BetGanji',
  description: 'Create a BetGanji account to access AI-powered sports predictions.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <RegisterForm />
    </div>
  );
}
