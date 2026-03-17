"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Share2, Check } from 'lucide-react';
import { Button } from './Button';
import { Product } from '@/lib/data';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [copied, setCopied] = useState(false);
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({
            productId: product.id ?? (product as unknown as { _id: string })._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            size: product.sizes?.[0] ?? 'Standard',
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        const url = `${window.location.origin}/product/${product.id}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: product.name, url });
            } else {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    return (
        <motion.div
            whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="perspective block"
        >
            <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative h-full flex flex-col">
                <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>

                <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-xs text-gray-400 font-medium tracking-wider uppercase mb-1">
                                    {product.category}
                                </p>
                                <Link href={`/product/${product.id}`}>
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                </Link>
                            </div>
                            <p className="text-lg font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                            {product.description || "Premium 3D printed object, beautifully designed and expertly crafted for your space."}
                        </p>
                    </div>

                    <div className="mt-4 flex animate-in fade-in slide-in-from-bottom-2 items-center justify-between opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                        <Button size="sm" className="flex-1 mr-2 flex items-center justify-center gap-2" onClick={handleAddToCart}>
                            {added ? <><Check size={16} /> Added!</> : <><ShoppingCart size={16} /> Add to Cart</>}
                        </Button>
                        <Button variant="outline" size="sm" className="px-3" onClick={handleShare}>
                            {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
