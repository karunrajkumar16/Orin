"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
    userId: string;
    email: string;
    token: string;
}

interface AdminAuthContextType {
    admin: AdminUser | null;
    login: (email: string, password: string) => Promise<string | null>;
    logout: () => void;
    isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const userId = localStorage.getItem('adminUserId');
        const email = localStorage.getItem('adminEmail');
        if (token && userId && email) {
            setAdmin({ token, userId, email });
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
            if (data.user?.role !== 'admin') return 'Access denied. Admin only.';

            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUserId', data.user.id);
            localStorage.setItem('adminEmail', email);
            // Also set 'token' so useProducts hooks work
            localStorage.setItem('token', data.token);
            setAdmin({ token: data.token, userId: data.user.id, email });
            return null;
        } catch {
            return 'Network error';
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUserId');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('token');
        setAdmin(null);
        router.push('/admin/login');
    };

    return (
        <AdminAuthContext.Provider value={{ admin, login, logout, isLoading }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
    return ctx;
}
