import { PRODUCTS } from '@/lib/data';
import { DollarSign, ShoppingBag, Clock, Edit, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
                <p className="text-gray-500">Welcome back. Here&apos;s what&apos;s happening with your store today.</p>
            </div>

            {/* Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <DollarSign className="text-green-600" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-bold text-gray-900">$12,450.00</h3>
                        <p className="text-xs text-green-600 font-medium mt-2">+14% from last month</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="text-purple-600" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                        <h3 className="text-3xl font-bold text-gray-900">342</h3>
                        <p className="text-xs text-green-600 font-medium mt-2">+5% from last month</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="text-orange-600" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Pending Orders</p>
                        <h3 className="text-3xl font-bold text-gray-900">18</h3>
                        <p className="text-xs text-orange-500 font-medium mt-2">Requires attention</p>
                    </div>
                </div>
            </div>

            {/* Product Management Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-bold text-gray-900">Recent Products</h2>
                    <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-[#5A3FE0] transition-colors shadow-sm cursor-pointer">
                        Add Product
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {PRODUCTS.slice(0, 5).map(product => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200">
                                                <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                                            </div>
                                            <span className="font-semibold text-gray-900 text-sm">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-lavender-light text-primary capitalize">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        ${product.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                            In Stock
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-lavender-light rounded-lg transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
                    <button className="text-sm font-semibold text-primary hover:text-[#5A3FE0] transition-colors py-2 px-4 rounded-lg hover:bg-lavender-light">
                        View All Products &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
}
