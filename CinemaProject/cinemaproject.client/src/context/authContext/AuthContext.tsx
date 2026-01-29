import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { UserDto } from '../../types/auth';
import { tokenStorage } from '../../api/authApi';

interface AuthContextType {
    user: UserDto | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (user: UserDto, token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = tokenStorage.getUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setIsLoading(false);
    }, []);

    const login = (userData: UserDto, token: string) => {
        tokenStorage.setToken(token);
        tokenStorage.setUser(userData);
        setUser(userData);
    };

    const logout = () => {
        tokenStorage.clearAuth();
        setUser(null);
    };

    const isAdmin = user?.role === 1; // 1 — це код адміна?

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!user, 
            isAdmin, 
            login, 
            logout, 
            isLoading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;