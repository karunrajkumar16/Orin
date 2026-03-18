"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/data';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ui/ProductCard';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function ShopContent() {
    const searchParams = useSearchParams();
    const initCategory = searchParams ? searchParams.get('category') : null;

    const [activeCategory, setActiveCategory] = useState<string | null>(initCategory);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    
    const { products, loading } = useProducts();

    // Filter state
    const [priceRange, setPriceRange] = useState<number>(3000);

    const filteredProducts = products.filter(p => {
        if (activeCategory && activeCategory !== 'all' && p.category !== activeCategory) return false;
        if (p.price > priceRange) return false;
        return true;
    });

    return (
        <div className="container mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row gap-10">

            {/* Mobile Filter Toggle */}
            <div className="md:hidden flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h1 className="text-xl font-bold">Shop</h1>
                <Button variant="outline" size="sm" onClick={() => setMobileFilterOpen(!mobileFilterOpen)}>
                    <Filter size={16} className="mr-2" /> Filters
                </Button>
            </div>

            {/* Sidebar Filters */}
            <aside className={`md:w-64 flex-shrink-0 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
                <div className="sticky top-24 space-y-8">

                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <SlidersHorizontal size={18} className="text-primary" /> Filters
                        </h3>

                        <div className="space-y-6">
                            {/* Category Filter */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setActiveCategory(null)}
                                        className={`block w-full text-left text-sm ${!activeCategory ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary transition-colors'}`}
                                    >
                                        All Products
                                    </button>
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`block w-full text-left text-sm ${activeCategory === cat.id ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary transition-colors'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex justify-between">
                                    Price <span>Up to ₹{priceRange}</span>
                                </h4>
                                <input
                                    type="range"
                                    min="0"
                                    max="3000"
                                    step="100"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full h-2 bg-lavender-light rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <div className="hidden md:flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {activeCategory ? CATEGORIES.find(c => c.id === activeCategory)?.name : 'All Products'}
                    </h1>
                    <p className="text-sm text-gray-500">Showing {filteredProducts.length} results</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-2xl aspect-[3/4] animate-pulse" />
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your filters or category selection.</p>
                        <Button onClick={() => { setActiveCategory(null); setPriceRange(3000); }}>
                            Reset Filters
                        </Button>
                    </div>
                )}
            </main>

        </div>
    );
}

export default function Shop() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ShopContent />
        </Suspense>
    )
}
