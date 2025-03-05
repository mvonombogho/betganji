'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  
  // Auto-redirect to dashboard
  useEffect(() => {
    console.log('Register page mounted - auto redirecting to dashboard');
    router.push('/dashboard');
  }, [router]);
  
  // While the redirect is happening, show a loading message
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-6">Redirecting to Dashboard...</h1>
        <div className="animate-pulse mt-4">
          <div className="h-2 bg-blue-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
