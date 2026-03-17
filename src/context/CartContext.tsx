"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, calculateCartTotals, CartTotals } from '@/lib/data';

interface CartContextType {
    cartItems: CartItem[];
    totals: CartTotals;
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string) => void;
    updateQty: (productId: string, delta: number) => void;
    clearCart: () => void;
    cartCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('orincore_cart');
            if (stored) setCartItems(JSON.parse(stored));
        } catch {}
    }, []);

    // Persist to localStorage on change
    useEffect(() => {
        localStorage.setItem('orincore_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: CartItem) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.productId === item.productId);
            if (existing) {
                return prev.map(i =>
                    i.productId === item.productId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (productId: string) => {
        setCartItems(prev => prev.filter(i => i.productId !== productId));
    };

    const updateQty = (productId: string, delta: number) => {
        setCartItems(prev =>
            prev.map(i =>
                i.productId === productId
                    ? { ...i, quantity: Math.max(1, i.quantity + delta) }
                    : i
            )
        );
    };

    const clearCart = () => setCartItems([]);

    const totals = calculateCartTotals(cartItems);
    const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, totals, addToCart, removeFromCart, updateQty, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
