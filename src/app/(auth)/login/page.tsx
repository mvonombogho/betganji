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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login with:', email, password);
      alert('Login clicked - check console for debug info');
      
      // Just go directly to dashboard in dev mode for now
      router.push('/dashboard');
      return;
      
      // This is the normal flow but bypassing for now
      const user = await userService.login(email, password);
      
      if (user) {
        // Successful login
        console.log('Logged in successfully:', user);
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        console.error('Login failed - no user returned');
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const bypassLogin = () => {
    console.log('Bypassing login...');
    alert('Bypassing login - redirecting to dashboard');
    router.push('/dashboard');
  };
  
  // For testing purposes - auto login in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode detected - you can click login to proceed');
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Sign in to your account</h1>
        
        <p className="text-center mb-4">
          Or{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            create a new account
          </Link>
        </p>
        
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="font-semibold mb-1">Mock credentials (pre-filled):</p>
          <p>Email: user@example.com</p>
          <p>Password: demo1234</p>
          
          <button 
            onClick={bypassLogin}
            className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
          >
            Bypass Login (Go To Dashboard)
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="remember" 
              className="mr-2" 
            />
            <label htmlFor="remember">Remember me</label>
          </div>
          
          <div>
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-8 border-t pt-4">
          <h2 className="font-bold mb-2">Developer Controls</h2>
          <div className="flex items-center mb-2">
            <label className="mr-2">Mock Services:</label>
            <input type="checkbox" defaultChecked={true} />
          </div>
          <button className="bg-gray-300 hover:bg-gray-400 px-4 py-1 rounded-md">
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}
