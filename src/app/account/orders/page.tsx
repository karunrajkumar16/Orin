"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/context/UserAuthContext';
import { Button } from '@/components/ui/Button';
import { Package, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    subtotal: number;
    shipping: number;
    gst: number;
    platformFee: number;
    status: string;
    shippingAddress: {
        name: string;
        phone: string;
        addressLine: string;
        city: string;
        state: string;
        pincode: string;
    };
    createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
    pending:    'bg-yellow-100 text-yellow-700',
    confirmed:  'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped:    'bg-indigo-100 text-indigo-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-700',
};

export default function OrdersPage() {
    const { user, isLoading } = useUserAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        if (isLoading) return;
        if (!user) { router.push('/account'); return; }

        fetch('/api/orders', {
            headers: { Authorization: `Bearer ${user.token}` },
        })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setOrders(data);
                else setError(data.error ?? 'Failed to load orders');
            })
            .catch(() => setError('Network error'))
            .finally(() => setLoading(false));
    }, [user, isLoading, router]);

    if (isLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 md:px-12 py-16 max-w-3xl">
            <div className="flex items-center gap-4 mb-10">
                <Link href="/account">
                    <button className="text-gray-500 hover:text-primary transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            </div>

            {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">{error}</p>
            )}

            {orders.length === 0 && !error ? (
                <div className="text-center py-24">
                    <Package size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6">No orders yet.</p>
                    <Button onClick={() => router.push('/shop')}>Start Shopping</Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Order Header */}
                            <button
                                className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                            >
                                <div className="flex items-center gap-4 text-left">
                                    <div>
                                        <p className="text-xs text-gray-400 font-mono mb-0.5">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            ₹{order.totalAmount.toLocaleString('en-IN')}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {order.status}
                                    </span>
                                    {expanded === order._id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                </div>
                            </button>

                            {/* Expanded Details */}
                            {expanded === order._id && (
                                <div className="px-6 pb-6 border-t border-gray-100">
                                    {/* Items */}
                                    <div className="mt-4 space-y-3">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                                    {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                                                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                                                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5 text-sm">
                                        <div className="flex justify-between text-gray-500">
                                            <span>Subtotal</span>
                                            <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>Shipping</span>
                                            <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>GST (18%)</span>
                                            <span>₹{order.gst?.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100">
                                            <span>Total</span>
                                            <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    {order.shippingAddress && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Shipping To</p>
                                            <p className="text-sm text-gray-700">{order.shippingAddress.name}</p>
                                            <p className="text-sm text-gray-500">{order.shippingAddress.addressLine}</p>
                                            <p className="text-sm text-gray-500">
                                                {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                                            </p>
                                            <p className="text-sm text-gray-500">{order.shippingAddress.phone}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
