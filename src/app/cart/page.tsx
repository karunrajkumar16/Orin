"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import QuantitySelector from '@/components/ui/QuantitySelector';

export default function Cart() {
    const { cartItems, totals, updateQty, removeFromCart } = useCart();

    return (
        <div className="container mx-auto px-6 md:px-12 py-12 md:py-20">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-10">Your Cart</h1>

            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    {cartItems.map(item => (
                        <div key={item.productId} className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm items-center hover:shadow-md transition-shadow">
                            <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>

                            <div className="flex-1 w-full flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500">Size: {item.size ?? 'Standard'}</p>
                                    </div>
                                    <p className="text-lg font-bold text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                </div>

                                <div className="flex justify-between items-center mt-6">
                                    <QuantitySelector
                                        value={item.quantity}
                                        onChange={(val) => {
                                            const delta = val - item.quantity;
                                            updateQty(item.productId, delta);
                                        }}
                                    />
                                    <button onClick={() => removeFromCart(item.productId)} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium">
                                        <Trash2 size={16} /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {cartItems.length === 0 && (
                        <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500 mb-4">Your cart is empty.</p>
                            <Link href="/shop"><Button>Browse Products</Button></Link>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                                <span className="font-medium text-gray-900">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className={`font-medium ${totals.shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                    {totals.shipping === 0 ? 'Free' : `₹${totals.shipping}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Platform Fee</span>
                                <span className="font-medium text-gray-900">₹{totals.platformFee}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>GST (18%)</span>
                                <span className="font-medium text-gray-900">₹{totals.gst.toLocaleString('en-IN')}</span>
                            </div>
                            {totals.shipping === 0 && cartItems.length > 0 && (
                                <p className="text-xs text-green-600">🎉 You qualify for free shipping!</p>
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-200 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="font-medium text-gray-900">Total</span>
                                <span className="text-3xl font-bold text-gray-900">₹{totals.total.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <Link href="/checkout" className="block">
                            <Button size="lg" className="w-full flex items-center justify-center gap-2" disabled={cartItems.length === 0}>
                                Proceed to Checkout <ArrowRight size={18} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
