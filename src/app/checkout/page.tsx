"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Lock, CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
}

const EMPTY: FormData = {
    firstName: '', lastName: '', email: '', phone: '',
    addressLine: '', city: '', state: '', pincode: '',
};

export default function Checkout() {
    const { cartItems, totals, clearCart } = useCart();
    const router = useRouter();
    const [form, setForm] = useState<FormData>(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');

    const setField = (key: keyof FormData, value: string) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cartItems.length) return;
        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    items: cartItems,
                    shippingAddress: {
                        name: `${form.firstName} ${form.lastName}`.trim(),
                        phone: form.phone,
                        addressLine: form.addressLine,
                        city: form.city,
                        state: form.state,
                        pincode: form.pincode,
                    },
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? 'Order failed');

            setOrderId(data._id);
            setSuccess(true);
            clearCart();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="container mx-auto px-6 py-32 text-center max-w-lg">
                <div className="flex justify-center mb-6">
                    <CheckCircle size={72} className="text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed!</h1>
                <p className="text-gray-500 mb-2">Your order has been saved successfully.</p>
                <p className="text-xs text-gray-400 font-mono mb-8">Order ID: #{orderId.slice(-8).toUpperCase()}</p>
                <Button size="lg" onClick={() => router.push('/shop')}>Continue Shopping</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 md:px-12 py-12 md:py-20 min-h-[80vh]">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Secure Checkout</h1>
                    <p className="text-gray-500 flex items-center justify-center gap-2">
                        <Lock size={16} /> All transactions are secure and encrypted
                    </p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-gray-500 mb-4">Your cart is empty.</p>
                        <Button onClick={() => router.push('/shop')}>Browse Products</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-5 gap-12">
                            {/* Form */}
                            <div className="md:col-span-3 space-y-8">
                                <section>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">1. Contact Information</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                            <input required value={form.firstName} onChange={e => setField('firstName', e.target.value)} type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Rahul" />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                            <input required value={form.lastName} onChange={e => setField('lastName', e.target.value)} type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Sharma" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input required value={form.email} onChange={e => setField('email', e.target.value)} type="email" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="rahul@example.com" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input required value={form.phone} onChange={e => setField('phone', e.target.value)} type="tel" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="+91 98765 43210" />
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">2. Shipping Address</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                            <input required value={form.addressLine} onChange={e => setField('addressLine', e.target.value)} type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="123, MG Road, Koramangala" />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input required value={form.city} onChange={e => setField('city', e.target.value)} type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Bengaluru" />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                            <input required value={form.state} onChange={e => setField('state', e.target.value)} type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Karnataka" />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                                            <input required value={form.pincode} onChange={e => setField('pincode', e.target.value)} type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="560001" />
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">3. Payment</h2>
                                    <div className="p-6 bg-lavender-light border border-primary/20 rounded-2xl flex items-center gap-4">
                                        <CreditCard size={32} className="text-primary flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Online Payment Only</h3>
                                            <p className="text-sm text-gray-500">Cash on Delivery is not available for 3D printed objects.</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 border border-gray-200 rounded-2xl p-6 bg-gray-50 text-center">
                                        <p className="text-sm text-gray-400 italic">Payment gateway coming soon. Order will be saved and confirmed manually.</p>
                                    </div>
                                </section>

                                {error && (
                                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
                                )}

                                <Button type="submit" size="lg" className="w-full text-lg" disabled={submitting}>
                                    {submitting ? 'Placing Order...' : `Place Order — ₹${totals.total.toLocaleString('en-IN')}`}
                                </Button>
                            </div>

                            {/* Order Summary */}
                            <div className="md:col-span-2">
                                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 sticky top-24">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>

                                    <div className="space-y-4 mb-6">
                                        {cartItems.map(item => (
                                            <div key={item.productId} className="flex justify-between items-center gap-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 truncate">
                                                        {item.name} <span className="text-gray-400">x{item.quantity}</span>
                                                    </span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                                                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-gray-200 mb-4 space-y-2 text-sm">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
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
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex justify-between items-end">
                                            <span className="font-bold text-gray-900 text-lg">Total</span>
                                            <span className="text-2xl font-bold text-gray-900">₹{totals.total.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
