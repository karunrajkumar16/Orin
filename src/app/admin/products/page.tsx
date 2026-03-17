"use client";

import { useState } from 'react';
import { Edit, Trash2, X, Upload, Check, Plus, Database } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { Product } from '@/lib/data';

const EMPTY_FORM = {
    name: '', category: 'custom', price: '', originalPrice: '',
    description: '', imageStr: '', model3dStr: '', stock: '10',
};

const CATEGORIES = [
    { value: 'figurines', label: 'Figurines' },
    { value: 'desk', label: 'Desk Accessories' },
    { value: 'gaming', label: 'Gaming Accessories' },
    { value: 'custom', label: 'Custom Prints' },
];

export default function AdminProductsPage() {
    const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [seeding, setSeeding] = useState(false);
    const [seedMsg, setSeedMsg] = useState('');
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [form, setForm] = useState(EMPTY_FORM);

    const setField = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setField('imageStr', reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setField('model3dStr', reader.result as string);
        reader.readAsDataURL(file);
    };

    const openAdd = () => {
        setEditingProduct(null);
        setForm(EMPTY_FORM);
        setIsModalOpen(true);
    };

    const openEdit = (product: Product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            category: product.category,
            price: String(product.price),
            originalPrice: String(product.originalPrice),
            description: product.description,
            imageStr: product.image,
            model3dStr: product.model3d ?? '',
            stock: String(product.stock ?? 10),
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const price = parseFloat(form.price) || 0;
        const originalPrice = parseFloat(form.originalPrice) || price;
        const payload = {
            name: form.name,
            category: form.category,
            price,
            originalPrice,
            discountPercentage: originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0,
            image: form.imageStr || '/images/plant_pot.png',
            images: [form.imageStr || '/images/plant_pot.png'],
            description: form.description,
            materials: ['PLA', 'ABS'],
            materialOptions: [
                { name: 'PLA' as const, multiplier: 1.0 },
                { name: 'ABS' as const, multiplier: 1.2 },
            ],
            colors: ['White', 'Black'],
            sizes: ['Standard'],
            stock: parseInt(form.stock) || 10,
            model3d: form.model3dStr || undefined,
        };

        if (editingProduct) {
            await updateProduct(editingProduct.id, payload);
        } else {
            await addProduct(payload);
        }

        setIsModalOpen(false);
        setForm(EMPTY_FORM);
        setEditingProduct(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this product? This cannot be undone.')) return;
        await deleteProduct(id);
    };

    const handleSeed = async () => {
        setSeeding(true);
        setSeedMsg('');
        try {
            const res = await fetch('/api/seed', { method: 'POST' });
            const data = await res.json();
            setSeedMsg(data.message ?? data.error ?? 'Done');
            setTimeout(() => window.location.reload(), 1000);
        } catch {
            setSeedMsg('Seed failed');
        } finally {
            setSeeding(false);
        }
    };

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
        return matchSearch && matchCat;
    });

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Products</h1>
                    <p className="text-gray-500">{products.length} products in your store</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding} className="flex items-center gap-2">
                        <Database size={15} /> {seeding ? 'Seeding...' : 'Seed DB'}
                    </Button>
                    <Button onClick={openAdd} className="flex items-center gap-2">
                        <Plus size={16} /> Add Product
                    </Button>
                </div>
            </div>

            {seedMsg && <p className="text-sm text-green-600 font-medium">{seedMsg}</p>}

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="h-10 px-4 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none w-64"
                />
                <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="h-10 px-4 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none bg-white"
                >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="w-7 h-7 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">No products found</div>
                ) : (
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
                                {filtered.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                                                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-lavender-light text-primary capitalize">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</p>
                                            {product.originalPrice > product.price && (
                                                <p className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${(product.stock ?? 0) > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${(product.stock ?? 0) > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                                                {(product.stock ?? 0) > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEdit(product)} className="p-2 text-gray-400 hover:text-primary hover:bg-lavender-light rounded-lg transition-colors" title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                            <h2 className="text-2xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Product Name</label>
                                    <input required value={form.name} onChange={e => setField('name', e.target.value)} type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="e.g. Custom Dragon" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Category</label>
                                    <select value={form.category} onChange={e => setField('category', e.target.value)} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white">
                                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Selling Price (₹)</label>
                                    <input required value={form.price} onChange={e => setField('price', e.target.value)} type="number" step="1" min="0" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="499" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">MRP / Original Price (₹)</label>
                                    <input value={form.originalPrice} onChange={e => setField('originalPrice', e.target.value)} type="number" step="1" min="0" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="649" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Stock Quantity</label>
                                    <input value={form.stock} onChange={e => setField('stock', e.target.value)} type="number" step="1" min="0" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="10" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Description</label>
                                <textarea required value={form.description} onChange={e => setField('description', e.target.value)} rows={3} className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" placeholder="Product description..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Product Image</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        <div className="flex flex-col items-center gap-2">
                                            {form.imageStr && !form.imageStr.startsWith('/') ? <Check className="text-green-500" size={24} /> : <Upload className="text-gray-400" size={24} />}
                                            <span className="text-sm text-gray-600 font-medium">
                                                {form.imageStr && !form.imageStr.startsWith('/') ? 'Image selected' : 'Click to upload image'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">3D Model (Optional)</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                                        <input type="file" accept=".obj,.gltf,.glb" onChange={handleModelUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        <div className="flex flex-col items-center gap-2">
                                            {form.model3dStr ? <Check className="text-green-500" size={24} /> : <Upload className="text-gray-400" size={24} />}
                                            <span className="text-sm text-gray-600 font-medium">{form.model3dStr ? 'Model selected' : 'Upload .obj, .gltf'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button type="submit">{editingProduct ? 'Save Changes' : 'Publish Product'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
