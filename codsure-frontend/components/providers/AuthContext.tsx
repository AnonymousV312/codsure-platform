"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    email: string;
    full_name?: string;
    is_active: boolean;
    // Add other user fields as needed
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string) => void;
    signup: (userData: any) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Function to fetch current user profile using the token
    const fetchUserProfile = async () => {
        try {
            // Assuming there's a 'users/me' or similar endpoint. 
            // If not, we might decoding the token or just store basic info.
            // For now, let's assume we just have the token and need to verify it/get user data.
            // If no /me endpoint exists yet, we'll implement it or placeholder it.
            // IMPORTANT: The current backend might NOT have /users/me endpoint visible in summary.
            // I will assume for now we might need to rely on what the login returns or add /me.
            // Let's try to get it.
            // TODO: Ensure backend has /users/me
            const response = await api.get('/users/me');
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            await fetchUserProfile();
        } else {
            setUser(null);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        fetchUserProfile();
        router.push('/dashboard');
    };

    const signup = async (userData: any) => {
        // Signup usually returns the user object, but we then need to log them in.
        // If the backend returns a token on signup, great. 
        // If not, we might need to ask user to login or auto-login.
        // The current backend api/endpoints/auth.py signup returns UserSchema (no token).
        // So flow is: Signup -> Login (auto or manual).
        // We will handle this in the page component usually, but helper here is good.
        // For now, let's leave signup logic mainly in the page or simple wrapper.
        throw new Error("Signup handling should be done in component to trigger login next");
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/auth');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
