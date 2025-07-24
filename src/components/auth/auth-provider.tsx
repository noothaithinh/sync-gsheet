'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already signed in
    const savedUser = localStorage.getItem('googleUser');
    if (savedUser) {
      try {
        const userInfo = JSON.parse(savedUser);
        // Extract only the needed fields for the User interface
        const user: User = {
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          sub: userInfo.sub,
        };
        setUser(user);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('googleUser');
      }
    }
    setIsLoading(false);
  }, []);

  const signOut = () => {
    localStorage.removeItem('googleUser');
    setUser(null);
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    // Redirect to login page after sign out
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
