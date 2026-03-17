"use client";

import { useEffect, useState } from 'react';
import { IndianRupee, ShoppingBag, Clock, Package, TrendingUp } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    status: string;
    totalAmount: number;
    items: OrderItem[];
    createdAt: string;
    shippingAddress?: { name?: string };
}

interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700',
    processing: 'bg-blue-50 text-blue-700',
    shipped: 'bg-purple-50 text-purple-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
};

export default function AdminDashboard() {
    const { admin } = useAdminAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!admin) return;
        const headers = { Authorization: `Bearer ${admin.token}` };

        Promise.all([
            fetch('/api/orders', { headers }).then(r => r.json()),
            fetch('/api/products').then(r => r.json()),
        ]).then(([ordersData, productsData]) => {
            setOrders(Array.isArray(ordersData) ? ordersData : []);
            setProducts(Array.isArray(productsData) ? productsData : []);
        }).finally(() => setLoading(false));
    }, [admin]);

    const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);

    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const recentOrders = orders.slice(0, 5);
    const lowStockProducts = products.filter(p => (p.stock ?? 0) < 5);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
                <p className="text-gray-500">Welcome back. Here&apos;s your store overview.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<IndianRupee className="text-green-600" size={22} />}
                    iconBg="bg-green-50"
                    label="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString('en-IN')}`}
                    sub={`${orders.filter(o => o.status !== 'cancelled').length} orders`}
                    subColor="text-green-600"
                />
                <StatCard
                    icon={<Package className="text-purple-600" size={22} />}
                    iconBg="bg-purple-50"
                    label="Total Products"
                    value={String(products.length)}
                    sub="Live in store"
                    subColor="text-purple-600"
                />
                <StatCard
                    icon={<Clock className="text-orange-600" size={22} />}
                    iconBg="bg-orange-50"
                    label="Pending Orders"
                    value={String(pendingOrders)}
                    sub="Needs attention"
                    subColor="text-orange-500"
                />
                <StatCard
                    icon={<ShoppingBag className="text-blue-600" size={22} />}
                    iconBg="bg-blue-50"
                    label="Total Orders"
                    value={String(orders.length)}
                    sub="All time"
                    subColor="text-blue-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp size={18} className="text-primary" /> Recent Orders
                        </h2>
                        <Link href="/admin/orders" className="text-sm text-primary font-medium hover:underline">View all</Link>
                    </div>
                    {recentOrders.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">No orders yet</div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {recentOrders.map(order => (
                                <div key={order._id} className="px-6 py-4 flex items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {order.shippingAddress?.name ?? 'Customer'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {order.status}
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">₹{(order.totalAmount ?? 0).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Low Stock */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Low Stock</h2>
                        <Link href="/admin/products" className="text-sm text-primary font-medium hover:underline">Manage</Link>
                    </div>
                    {lowStockProducts.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">All products well stocked</div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {lowStockProducts.map(p => (
                                <div key={p._id} className="px-6 py-4 flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900 truncate max-w-[140px]">{p.name}</p>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.stock === 0 ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, iconBg, label, value, sub, subColor }: {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    value: string;
    sub: string;
    subColor: string;
}) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                <p className={`text-xs font-medium mt-1 ${subColor}`}>{sub}</p>
            </div>
        </div>
    );
}
