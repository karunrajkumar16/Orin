"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
];

function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { admin, isLoading, logout } = useAdminAuth();

    useEffect(() => {
        if (!isLoading && !admin && pathname !== '/admin/login') {
            router.replace('/admin/login');
        }
    }, [admin, isLoading, pathname, router]);

    // Show login page without sidebar
    if (pathname === '/admin/login') return <>{children}</>;

    if (isLoading || !admin) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex h-screen bg-gray-50 overflow-hidden text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-10 hidden md:flex">
                <div className="h-20 flex items-center px-6 border-b border-gray-100">
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">ORINCORE Admin</Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(
                                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-lavender text-primary'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    )}
                                >
                                    <Icon size={20} className={isActive ? 'text-primary' : 'text-gray-400'} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-100 space-y-1">
                    <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        ← Return to Store
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                        <LogOut size={20} className="text-red-400" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 md:px-12 z-0">
                    <h2 className="text-xl font-bold text-gray-900 md:hidden">Admin</h2>
                    <div className="flex-1 md:flex justify-end items-center gap-4 hidden">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Admin</p>
                            <p className="text-xs text-gray-500">{admin.email}</p>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-6 md:p-12">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuthProvider>
            <AdminShell>{children}</AdminShell>
        </AdminAuthProvider>
    );
}
