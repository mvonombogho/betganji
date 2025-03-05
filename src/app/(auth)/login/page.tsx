'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useServices } from '@/contexts/ServiceContext';

export default function LoginPage() {
  const router = useRouter();
  const { userService } = useServices();
  
  const [email, setEmail] = useState('user@example.com'); // Pre-filled for testing
  const [password, setPassword] = useState('demo1234'); // Pre-filled for testing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Auto-redirect to dashboard
  useEffect(() => {
    console.log('Login page mounted - auto redirecting to dashboard');
    router.push('/dashboard');
  }, [router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted - redirecting to dashboard');
    router.push('/dashboard');
  };
  
  const bypassLogin = () => {
    console.log('Bypassing login - redirecting to dashboard');
    router.push('/dashboard');
  };
  
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
