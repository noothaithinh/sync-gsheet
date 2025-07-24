'use client';

import { useAuth } from '@/components/auth/auth-provider';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <>
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                📊 Sync GSheet
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={user.picture}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={signOut}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation for Dashboard Pages */}
      {user && (pathname === '/' || pathname.startsWith('/read-me')) && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6">
            <nav className="flex space-x-8" aria-label="Tabs">
              <Link
                href="/"
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  pathname === '/'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Dashboard
              </Link>
              <Link
                href="/read-me"
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  pathname === '/read-me'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📖 README
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
