'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { database } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';
import AuthGuard from '@/components/auth/auth-guard';
import { useAuth } from '@/components/auth/auth-provider';

// Declare global google types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleInitConfig) => void;
          renderButton: (
            element: HTMLElement,
            config: GoogleButtonConfig
          ) => void;
          prompt: (
            callback?: (notification: GoogleNotification) => void
          ) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GoogleInitConfig {
  client_id: string | undefined;
  callback: (response: GoogleUser) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleButtonConfig {
  theme?: string;
  size?: string;
  type?: string;
  shape?: string;
  text?: string;
  logo_alignment?: string;
  width?: number;
}

interface GoogleNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
}

interface DatabaseUser {
  email: string;
  name: string;
  picture: string;
  googleId: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
}

interface GoogleUser {
  credential: string;
  select_by: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, setUser, signOut: authSignOut } = useAuth();

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to parse JWT token:', error);
      throw new Error('Invalid token');
    }
  };

  const handleCredentialResponse = useCallback(
    async (response: GoogleUser) => {
      try {
        // Decode the JWT token to get user info
        const userInfo = parseJwt(response.credential);
        console.log('User signed in:', userInfo);

        // Check if user exists in Firebase 'users' collection
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        const users = snapshot.val() || {};

        // Find user by email
        const existingUserKey = Object.keys(users).find(
          (key) => users[key].email === userInfo.email
        );

        let userData: DatabaseUser;

        if (existingUserKey) {
          // User exists, update last login
          userData = users[existingUserKey];
          userData.lastLogin = new Date().toISOString();
          userData.name = userInfo.name; // Update name in case it changed
          userData.picture = userInfo.picture; // Update picture in case it changed

          await set(ref(database, `users/${existingUserKey}`), userData);
          console.log('Existing user updated:', userData);

          // Set user in context with the correct format
          const contextUser = {
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            sub: userInfo.sub,
          };
          setUser(contextUser);

          // Store user info in localStorage
          localStorage.setItem('googleUser', JSON.stringify(userInfo));

          // Redirect existing user to dashboard
          router.push('/');
        } else {
          // Redirect new user to register page
          router.push('/register');
        }
      } catch (error) {
        console.error('Error processing sign-in:', error);
        setError('Failed to process sign-in. Please try again.');
      }
    },
    [router, setUser]
  );

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('googleUser');
    if (savedUser) {
      // User is already logged in, no need to initialize Google Sign-In
      setIsLoading(false);
      return;
    }

    // Load Google Identity Services script
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      script.onerror = () => {
        setError('Failed to load Google Sign-In');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      if (window.google) {
        try {
          // Initialize Google Sign-In
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: false,
          });

          // Render the sign-in button
          if (googleButtonRef.current) {
            window.google.accounts.id.renderButton(googleButtonRef.current, {
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              shape: 'rectangular',
              width: 320,
            });
          }

          // Also enable One Tap
          window.google.accounts.id.prompt(
            (notification: GoogleNotification) => {
              if (
                notification.isNotDisplayed() ||
                notification.isSkippedMoment()
              ) {
                console.log('One Tap not displayed or skipped');
              }
            }
          );

          setIsLoading(false);
        } catch (error) {
          console.error('Failed to initialize Google Sign-In:', error);
          setError('Failed to initialize Google Sign-In');
          setIsLoading(false);
        }
      }
    };

    // Check if script is already loaded
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      loadGoogleScript();
    }

    return () => {
      // Cleanup if needed
      const script = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (script) {
        script.remove();
      }
    };
  }, [handleCredentialResponse]);

  const handleSignOut = () => {
    authSignOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Google Sign-In...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="mb-6">
              <Image
                src={user.picture}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
              <p className="text-gray-600 mt-2">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>

              <button
                onClick={handleSignOut}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Sync GSheet
              </h1>
              <p className="text-gray-600">
                Sign in with your Google account to continue
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <div ref={googleButtonRef} className="flex justify-center"></div>
            </div>

            <div className="text-xs text-gray-500">
              <p>
                By signing in, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </div>

          {/* Setup Instructions */}
          {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Setup Required:
              </h3>
              <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
                <li>Go to Google Cloud Console</li>
                <li>Create OAuth 2.0 credentials</li>
                <li>Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
