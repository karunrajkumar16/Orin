"use client";

import { useEffect, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface Order {
    _id: string;
    userId: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    platformFee: number;
    gst: number;
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress?: {
        name?: string;
        phone?: string;
        addressLine?: string;
        city?: string;
        state?: string;
        pincode?: string;
    };
    createdAt: string;
}

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default function AdminOrdersPage() {
    const { admin } = useAdminAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        if (!admin) return;
        fetch('/api/orders', { headers: { Authorization: `Bearer ${admin.token}` } })
            .then(r => r.json())
            .then(data => setOrders(Array.isArray(data) ? data : []))
            .finally(() => setLoading(false));
    }, [admin]);

    const updateStatus = async (orderId: string, status: string) => {
        if (!admin) return;
        setUpdatingId(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${admin.token}`,
                },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                const updated = await res.json();
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: updated.status } : o));
                if (selectedOrder?._id === orderId) {
                    setSelectedOrder(prev => prev ? { ...prev, status: updated.status } : null);
                }
            }
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Orders</h1>
                <p className="text-gray-500">{orders.length} total orders</p>
            </div>

            {/* Status filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {['all', ...STATUSES].map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                            statusFilter === s
                                ? 'bg-primary text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {s === 'all' ? `All (${orders.length})` : `${s} (${orders.filter(o => o.status === s).length})`}
                    </button>
                ))}
            </div>

            {/* Orders table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="w-7 h-7 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">No orders found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-mono text-gray-400">#{order._id.slice(-8).toUpperCase()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-gray-900">{order.shippingAddress?.name ?? '—'}</p>
                                            <p className="text-xs text-gray-400">{order.shippingAddress?.city ?? ''}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                            ₹{(order.totalAmount ?? 0).toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-xs text-primary font-medium hover:underline"
                                                >
                                                    View
                                                </button>
                                                <StatusDropdown
                                                    current={order.status}
                                                    loading={updatingId === order._id}
                                                    onChange={s => updateStatus(order._id, s)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700">Status</span>
                                <StatusDropdown
                                    current={selectedOrder.status}
                                    loading={updatingId === selectedOrder._id}
                                    onChange={s => updateStatus(selectedOrder._id, s)}
                                />
                            </div>

                            {/* Shipping Address */}
                            {selectedOrder.shippingAddress && (
                                <div className="bg-gray-50 rounded-2xl p-4">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Shipping Address</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedOrder.shippingAddress.name}</p>
                                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.phone}</p>
                                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.addressLine}</p>
                                    <p className="text-sm text-gray-600">
                                        {[selectedOrder.shippingAddress.city, selectedOrder.shippingAddress.state, selectedOrder.shippingAddress.pincode].filter(Boolean).join(', ')}
                                    </p>
                                </div>
                            )}

                            {/* Items */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Items</p>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="border-t border-gray-100 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{(selectedOrder.subtotal ?? 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span>{selectedOrder.shipping === 0 ? 'Free' : `₹${selectedOrder.shipping}`}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Platform Fee</span>
                                    <span>₹{selectedOrder.platformFee}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>GST (18%)</span>
                                    <span>₹{selectedOrder.gst}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                                    <span>Total</span>
                                    <span>₹{(selectedOrder.totalAmount ?? 0).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusDropdown({ current, loading, onChange }: {
    current: string;
    loading: boolean;
    onChange: (s: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                disabled={loading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-colors ${STATUS_COLORS[current] ?? 'bg-gray-50 text-gray-600 border-gray-200'} ${loading ? 'opacity-60' : 'hover:opacity-80'}`}
            >
                {loading ? '...' : current}
                <ChevronDown size={12} />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden min-w-[130px]">
                        {STATUSES.map(s => (
                            <button
                                key={s}
                                onClick={() => { onChange(s); setOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-xs font-semibold capitalize hover:bg-gray-50 transition-colors ${s === current ? 'text-primary' : 'text-gray-700'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
