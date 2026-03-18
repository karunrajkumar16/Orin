"use client";

import { useState, useEffect } from 'react';
import { Product } from '@/lib/data';

// MongoDB returns _id instead of id — normalize it
function normalize(p: Record<string, unknown>): Product {
    return { ...p, id: (p._id as string) ?? p.id } as unknown as Product;
}

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                console.log('[useProducts] API response:', res.status, data);
                if (res.ok && Array.isArray(data)) {
                    setProducts(data.map(normalize));
                } else {
                    console.error('[useProducts] Bad response:', data);
                }
            } catch (err) {
                console.error('[useProducts] Fetch error:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const addProduct = async (product: Omit<Product, 'id'>) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(product),
            });
            if (res.ok) {
                const newProduct = normalize(await res.json());
                setProducts(prev => [newProduct, ...prev]);
                return newProduct;
            }
        } catch (error) {
            console.error('Failed to add product', error);
        }
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                const updated = normalize(await res.json());
                setProducts(prev => prev.map(p => p.id === id ? updated : p));
                return updated;
            }
        } catch (error) {
            console.error('Failed to update product', error);
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== id));
                return true;
            }
        } catch (error) {
            console.error('Failed to delete product', error);
        }
        return false;
    };

    return { products, loading, addProduct, updateProduct, deleteProduct };
}
