"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface UserData {
    id: string;
    name: string;
    email: string;
    token: string;
}

interface UserAuthContextType {
    user: UserData | null;
    login: (email: string, password: string) => Promise<string | null>;
    signup: (name: string, email: string, password: string) => Promise<string | null>;
    logout: () => void;
    isLoading: boolean;
}

const UserAuthContext = createContext<UserAuthContextType | null>(null);

export function UserAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        const id = localStorage.getItem('userId');
        const name = localStorage.getItem('userName');
        const email = localStorage.getItem('userEmail');
        if (token && id && name && email) {
            setUser({ token, id, name, email });
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<string | null> => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) return data.error ?? 'Login failed';
            saveUser(data);
            return null;
        } catch {
            return 'Network error';
        }
    };

    const signup = async (name: string, email: string, password: string): Promise<string | null> => {
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) return data.error ?? 'Signup failed';
            saveUser(data);
            return null;
        } catch {
            return 'Network error';
        }
    };

    const saveUser = (data: { token: string; user: { id: string; name: string; email: string } }) => {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userEmail', data.user.email);
        // also set generic 'token' for order API calls
        localStorage.setItem('token', data.token);
        setUser({ token: data.token, id: data.user.id, name: data.user.name, email: data.user.email });
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <UserAuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
            {children}
        </UserAuthContext.Provider>
    );
}

export function useUserAuth() {
    const ctx = useContext(UserAuthContext);
    if (!ctx) throw new Error('useUserAuth must be used within UserAuthProvider');
    return ctx;
}
