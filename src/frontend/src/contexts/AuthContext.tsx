import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserType = 'staff' | 'registrar' | 'admin';

export interface User {
  id: string;
  username: string;
  userType: UserType;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, userType: UserType, password?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, userType: UserType, password?: string) => {
    try {
      // Call the backend login API
      const response = await fetch('http://localhost:4000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newUser: User = {
          id: data.user.id.toString(),
          username: data.user.username,
          userType: data.user.role as UserType,
        };
        setUser(newUser);
        // Store the token for future API calls
        localStorage.setItem('authToken', data.access_token);
      } else {
        // If account is blocked, throw a special error that can be caught
        if (data.blocked) {
          throw new Error('BLOCKED_ACCOUNT');
        }
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
