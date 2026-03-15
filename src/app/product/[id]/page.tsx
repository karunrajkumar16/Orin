"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Share2, Check, ShieldCheck, Truck } from 'lucide-react';
import ThreeDViewer from '@/components/ui/ThreeDViewer';

export default function ProductDetails({ params }: { params: { id: string } }) {
    const product = PRODUCTS.find(p => p.id === params.id) || PRODUCTS[0]; // fallback

    const [selectedMaterial, setSelectedMaterial] = useState(product.materials[0]);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity, setQuantity] = useState(1);
    const [show3D, setShow3D] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const totalPrice = product.price * quantity + (selectedSize === 'Large' ? 10 : selectedSize === 'Medium' ? 5 : 0);

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
                    <p className="text-3xl font-light text-gray-900 mb-6">
                        ${totalPrice.toFixed(2)}
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8 border-b border-gray-100 pb-8">
                        {product.description}
                    </p>

                    <div className="space-y-8 mb-10">
                        {/* Options */}
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Material</h4>
                                <div className="flex flex-wrap gap-3">
                                    {product.materials.map(mat => (
                                        <button
                                            key={mat}
                                            onClick={() => setSelectedMaterial(mat)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selectedMaterial === mat ? 'border-primary bg-lavender-light text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                        >
                                            {mat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Color</h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`h-10 px-4 rounded-lg text-sm font-medium border transition-all ${selectedColor === color ? 'border-primary bg-lavender-light text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

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
                            <div className="flex items-center w-32 border border-gray-200 rounded-lg overflow-hidden bg-white">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    readOnly
                                    className="flex-1 h-10 text-center font-medium bg-transparent border-none outline-none focus:ring-0 p-0"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <Link href="/cart" className="flex-1">
                            <Button size="lg" className="w-full text-lg flex items-center justify-center gap-3">
                                <ShoppingCart size={22} />
                                Add to Cart - ${totalPrice.toFixed(2)}
                            </Button>
                        </Link>
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

                    {/* Info blocks */}
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
