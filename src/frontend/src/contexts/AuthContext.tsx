import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserType = 'staff' | 'registrar' | 'admin';

export interface User {
  id: string;
  username: string;
  userType: UserType;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, userType: UserType, password?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load user and token from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('token') || localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        console.log('✅ Restored user session from localStorage:', parsedUser);
      } catch (error) {
        console.error('❌ Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (username: string, userType: UserType, password?: string): Promise<void> => {
    try {
      console.log('🔐 Attempting login for:', { username, userType });

      // Use the correct backend auth endpoint
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      // Be resilient to non-JSON error responses (e.g., plain text 404)
      let data: any = null;
      try {
        data = await response.json();
      } catch (_) {
        // Fallback to text for better diagnostics
        const text = await response.text();
        console.error('📡 Login non-JSON response:', text);
        if (!response.ok) {
          throw new Error(text || `HTTP ${response.status}`);
        }
      }
      console.log('📡 Login response:', data);

      if (response.ok && data && data.success && data.access_token) {
        const newUser: User = {
          id: data.user.id.toString(),
          username: data.user.username,
          userType: data.user.role as UserType,
          email: data.user.email,
        };

        // Store user and token
        setUser(newUser);
        setToken(data.access_token);
        
        // Store in localStorage - use 'token' as primary key to match audit component
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        console.log('✅ Login successful! User:', newUser);
        console.log('🔑 Token stored (preview):', data.access_token.substring(0, 20) + '...');
        
        return Promise.resolve();
      } else {
        console.error('❌ Login failed:', data);
        
        // Handle different error scenarios
        if (data.blocked || (data.message && data.message.includes('blocked'))) {
          throw new Error('BLOCKED_ACCOUNT');
        }
        
        if (data.message && data.message.includes('Invalid credentials')) {
          throw new Error('Invalid username or password');
        }
        // Prefer server-provided message; fallback to HTTP status text
        const msg = (data && data.message) ? data.message : (response.statusText || 'Login failed');
        throw new Error(msg);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Network or server errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }
      
      // Re-throw known errors
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Login failed due to an unexpected error');
    }
  };

  const logout = () => {
    console.log('🔓 Logging out user:', user?.username);
    
    setUser(null);
    setToken(null);
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log('✅ Logout complete');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
