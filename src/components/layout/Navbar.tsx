"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { useCart } from '@/context/CartContext';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Custom Print', href: '/custom-print' },
    { name: 'Policies', href: '/policies' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={clsx(
                'fixed top-0 w-full z-50 transition-all duration-300',
                scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'
            )}
        >
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
                {/* Left - Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
                    ORINCORE
                </Link>

                {/* Center - Desktop Menu */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                'text-sm font-medium transition-colors hover:text-primary',
                                pathname === link.href ? 'text-primary' : 'text-gray-600'
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Right - Icons */}
                <div className="flex items-center space-x-5">
                    <button className="text-gray-700 hover:text-primary transition-colors">
                        <Search size={20} />
                    </button>

                    <Link href="/cart" className="relative text-gray-700 hover:text-primary transition-colors">
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </Link>

                    <Link href="/admin" className="hidden md:block text-gray-700 hover:text-primary transition-colors">
                        <User size={20} />
                    </Link>

                    <button
                        className="md:hidden text-gray-900"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="px-6 py-4 flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={clsx(
                                        'text-base font-medium py-2',
                                        pathname === link.href ? 'text-primary' : 'text-gray-600'
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/admin"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-base font-medium py-2 text-gray-600 flex items-center gap-2"
                            >
                                <User size={18} />
                                Admin
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
