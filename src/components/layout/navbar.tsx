"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">BetGanji</span>
            </div>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
