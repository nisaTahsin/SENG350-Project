// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'Staff' | 'Registrar' | 'Admin';
export type AuthUser = { username: string; role: Role } | null;

type AuthContextType = {
  user: AuthUser;
  login: (username: string, role: Role) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: AuthUser;
}) => {
  const [user, setUser] = useState<AuthUser>(initialUser);

  const login = (username: string, role: Role) => setUser({ username, role });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
