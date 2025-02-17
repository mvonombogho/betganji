import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-gray-600">
            Sign in to access your predictions
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm">
          <span className="text-gray-500">
            Don't have an account?{' '}
          </span>
          <a 
            href="/register" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
