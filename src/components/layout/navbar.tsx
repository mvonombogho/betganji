import Link from 'next/link';
import { LogoutButton } from '@/components/auth/logout-button';

export function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Main Nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold">
                BetGanji
              </Link>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/matches"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Matches
              </Link>
              <Link
                href="/predictions"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Predictions
              </Link>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <Link
              href="/profile"
              className="text-sm text-gray-500 hover:text-gray-900 mr-4"
            >
              Profile
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
