'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function Home() {
  useEffect(() => {
    // In a real application, we would check if the user is logged in
    // and redirect to either the login page or dashboard
    
    // For simplicity in development, redirect directly to the login page
    // This gives the option to either log in or use the bypass button
    redirect('/login');
    
    // Alternatively, to go straight to the dashboard, uncomment this line:
    // redirect('/dashboard');
  }, []);
  
  // This is just a fallback in case the redirect doesn't happen immediately
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">BetGanji</h1>
        <p className="mb-4">AI-Powered Sports Prediction Platform</p>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}
