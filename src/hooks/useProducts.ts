"use client";

import { useState, useEffect } from 'react';
import { Product, PRODUCTS as STATIC_PRODUCTS } from '@/lib/data';

// MongoDB returns _id instead of id — normalize it
function normalize(p: Record<string, unknown>): Product {
    return { ...p, id: (p._id as string) ?? p.id } as unknown as Product;
}

export function useProducts() {
    const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const res = await fetch('/api/products');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setProducts(data.map(normalize));
                        return;
                    }
                }
            } catch {
                // fall through to static data
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
