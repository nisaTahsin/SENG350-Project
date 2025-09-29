import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserType = 'staff' | 'registrar' | 'admin';

export interface User {
  id: string;
  username: string;
  userType: UserType;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, userType: UserType) => void;
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

  const login = (username: string, userType: UserType) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      userType,
    };
    setUser(newUser);
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
