import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { UserDto } from '../../types/auth';
import { tokenStorage } from '../../api/authApi';
import { setupApiInterceptor } from '../../utilities/api_interseptor';
import SessionExpiredModal from '../../components/SessionExpiredModal/SessionExpiredModal';

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
    const [showExpiredModal, setShowExpiredModal] = useState(false);

    const logout = () => {
        tokenStorage.clearAuth();
        setUser(null);
        setShowExpiredModal(false);
    };

    const handleTokenExpired = () => {
        setShowExpiredModal(true);
    };

    const handleModalClose = () => {
        logout();
    };

    useEffect(() => {
        // Setup API interceptor to handle token expiration
        setupApiInterceptor(handleTokenExpired);
        
        const storedUser = tokenStorage.getUser();
        const token = tokenStorage.getToken();
        if (storedUser && token && !tokenStorage.isTokenExpired()) {
            setUser(storedUser);
        } else {
            // Token expired or missing clear auth
            tokenStorage.clearAuth();
        }
        setIsLoading(false);
    }, []);
    // schedule a single timeout to show modal 15s before token expiry
    // simplified: use local timer in effect (no refs)
    useEffect(() => {
        if (!user) return;

        const expiry = tokenStorage.getTokenExpiry();
        if (!expiry) return;

        const msUntilExpiry = expiry - Date.now();
        const msUntilModal = msUntilExpiry - 15000; // show 15s before expiry

        if (msUntilModal <= 0) {
            // already within modal window or expired
            handleTokenExpired();
            return;
        }

        const timerId = window.setTimeout(() => {
            handleTokenExpired();
        }, msUntilModal) as unknown as number;

        return () => clearTimeout(timerId);
    }, [user]);

    const login = (userData: UserDto, token: string) => {
        tokenStorage.setToken(token);
        tokenStorage.setUser(userData);
        setUser(userData);
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
            <SessionExpiredModal 
                isOpen={showExpiredModal} 
                onClose={handleModalClose} 
            />
        </AuthContext.Provider>
    );
};

export default AuthProvider;