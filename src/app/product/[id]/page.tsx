"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Share2, Check, ShieldCheck, Truck } from 'lucide-react';
import ThreeDViewer from '@/components/ui/ThreeDViewer';
import { useCart } from '@/context/CartContext';
import QuantitySelector from '@/components/ui/QuantitySelector';

export default function ProductDetails({ params }: { params: { id: string } }) {
    const { products } = useProducts();
    const { addToCart } = useCart();
    const [addedToCart, setAddedToCart] = useState(false);

    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [show3D, setShow3D] = useState(false);
    const [copied, setCopied] = useState(false);

    const product = products.find(p => p.id === params.id) ?? products[0];

    // Sync defaults when product loads
    useEffect(() => {
        if (product) {
            setSelectedSize(product.sizes[0]);
        }
    }, [product?.id]);

    if (!product) {
        return (
            <div className="container mx-auto px-6 py-32 text-center">
                <p className="text-gray-500 text-lg">Loading product...</p>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart({
            productId: product.id ?? (product as unknown as { _id: string })._id,
            name: product.name,
            price: totalPrice / quantity,
            quantity,
            image: product.image,
            size: selectedSize,
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: product.name, url });
            } else {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            // fallback: create a temp input and copy
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

    const sizeAddon = selectedSize === 'Large' ? 200 : selectedSize === 'Medium' ? 100 : 0;
    const totalPrice = Math.round(product.price + sizeAddon) * quantity;

    return (
        <div className="container mx-auto px-6 md:px-12 py-12 md:py-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

                {/* Left Column: Media */}
                <div className="space-y-6">
                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                        {show3D ? (
                            <div className="w-full h-full">
                                <ThreeDViewer />
                            </div>
                        ) : (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShow3D(false)}
                            className={`flex-1 py-3 border rounded-xl font-medium text-sm transition-colors ${!show3D ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                        >
                            High-Res Photo
                        </button>
                        <button
                            onClick={() => setShow3D(true)}
                            className={`flex-1 py-3 border rounded-xl font-medium text-sm transition-colors ${show3D ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                        >
                            Interactive 3D View
                        </button>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="flex flex-col pt-4">
                    <p className="text-sm font-semibold tracking-wider text-primary uppercase mb-2">
                        {product.category}
                    </p>
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                        {product.name}
                    </h1>
                    <div className="flex items-center gap-3 mb-6">
                        <p className="text-3xl font-light text-gray-900">
                            ₹{totalPrice.toLocaleString('en-IN')}
                        </p>
                        {product.originalPrice > product.price && (
                            <>
                                <p className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{product.discountPercentage}% off</span>
                            </>
                        )}
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8 border-b border-gray-100 pb-8">
                        {product.description}
                    </p>

                    <div className="space-y-8 mb-10">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Size</h4>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition-all ${selectedSize === size ? 'border-primary bg-lavender-light text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Quantity</h4>
                            <QuantitySelector value={quantity} onChange={setQuantity} />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <Button size="lg" className="flex-1 text-lg flex items-center justify-center gap-3" onClick={handleAddToCart}>
                            {addedToCart ? (
                                <><Check size={22} /> Added to Cart</>
                            ) : (
                                <><ShoppingCart size={22} /> Add to Cart — ₹{totalPrice.toLocaleString('en-IN')}</>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="sm:w-auto px-8 flex items-center gap-2"
                            onClick={handleShare}
                        >
                            {copied ? <Check size={20} className="text-green-500" /> : <Share2 size={20} />}
                            {copied ? 'Copied' : 'Share'}
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h5 className="font-semibold text-sm text-gray-900">Quality Guarantee</h5>
                                <p className="text-xs text-gray-500 mt-1">Free replacements within 72h</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Truck size={20} />
                            </div>
                            <div>
                                <h5 className="font-semibold text-sm text-gray-900">Secure Delivery</h5>
                                <p className="text-xs text-gray-500 mt-1">Carefully packaged to avoid damage</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
