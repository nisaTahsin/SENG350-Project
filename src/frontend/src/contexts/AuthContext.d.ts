import React, { ReactNode } from 'react';
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
export declare const useAuth: () => AuthContextType;
interface AuthProviderProps {
    children: ReactNode;
}
export declare const AuthProvider: React.FC<AuthProviderProps>;
export {};
//# sourceMappingURL=AuthContext.d.ts.map