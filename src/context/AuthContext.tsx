'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Tipos para os dados do usuário e do contexto
export type UserType = 'cliente' | 'barbeiro' | 'dono' | 'admin';

interface User {
    id: number;
    name: string;
    email?: string;
    userType: UserType;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user?: User | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Valor padrão seguro para quem usar o hook fora do provider
const defaultAuth: AuthContextType = {
    user: null,
    token: null,
    isAuthenticated: false,
    login: () => { /* noop */ },
    logout: () => { /* noop */ },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        const [token, setToken] = useState<string | null>(() => {
            try {
                if (typeof window !== 'undefined') return localStorage.getItem('authToken');
            } catch {
                return null;
            }
            return null;
        });

        const [user, setUser] = useState<User | null>(() => {
            try {
                if (typeof window !== 'undefined') {
                    const raw = localStorage.getItem('authUser');
                    return raw ? JSON.parse(raw) : null;
                }
            } catch {
                return null;
            }
            return null;
        });

    useEffect(() => {
        // Mantém token e usuário no localStorage para persistência simples
            try {
                if (token) localStorage.setItem('authToken', token);
                else localStorage.removeItem('authToken');

                if (user) localStorage.setItem('authUser', JSON.stringify(user));
                else localStorage.removeItem('authUser');
            } catch {
                // ignore
            }
    }, [token, user]);

    const login = (newToken: string, newUser: User | null = null) => {
        setToken(newToken);
        if (newUser) setUser(newUser);
    };

    const router = useRouter();

    const logout = () => {
        setToken(null);
        setUser(null);
        try {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
        } catch {
            // ignore
        }
        // SPA redirect para a home
        try {
            router.push('/');
        } catch {
            if (typeof window !== 'undefined') window.location.href = '/';
        }
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

// Hook seguro que retorna um valor padrão caso não haja provider
export const useAuthSafe = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    return ctx ?? defaultAuth;
};