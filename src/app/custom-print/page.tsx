"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { calculatePrintPrice } from '@/lib/data';
import { UploadCloud, Image as ImageIcon, Box, AlertCircle, Info } from 'lucide-react';
import QuantitySelector from '@/components/ui/QuantitySelector';

export default function CustomPrint() {
    const [uploadType, setUploadType] = useState<'3d' | '2d'>('3d');
    const [file, setFile] = useState<File | null>(null);
    const [size, setSize] = useState<number>(5);
    const [material, setMaterial] = useState<'PLA' | 'ABS' | 'Resin'>('PLA');
    const [quantity, setQuantity] = useState<number>(1);

    // Price Calculation Logic
    const estimatedHours = size * 0.8; // rough estimate: 0.8h per inch
    const conversionFee = uploadType === '2d' ? 500 : 0;
    const basePrice = 299 + size * 50; // base scales with size

    const unitPrice = calculatePrintPrice({
        basePrice,
        material,
        quantity: 1,
        estimatedPrintTimeHours: estimatedHours,
    });
    const totalPrice = unitPrice * quantity + conversionFee;

    return (
        <div className="container mx-auto px-6 md:px-12 py-12 md:py-20">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">Create Your Custom Print</h1>
                <p className="text-lg text-gray-600">Upload your own 3D model or a 2D photo. We&apos;ll handle the rest with precision 3D printing.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">

                {/* Configuration Left/Center */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Upload Section */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">1. Upload Files</h2>

                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setUploadType('3d')}
                                className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${uploadType === '3d' ? 'border-primary bg-lavender-light text-primary' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                            >
                                <Box size={28} className="mb-2" />
                                <span className="font-semibold">3D Model</span>
                                <span className="text-xs opacity-70 mt-1">STL, OBJ, GLB</span>
                            </button>
                            <button
                                onClick={() => setUploadType('2d')}
                                className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${uploadType === '2d' ? 'border-primary bg-lavender-light text-primary' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                            >
                                <ImageIcon size={28} className="mb-2" />
                                <span className="font-semibold">2D Photo</span>
                                <span className="text-xs opacity-70 mt-1">JPG, PNG</span>
                            </button>
                        </div>

                        {uploadType === '2d' && (
                            <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-xl flex items-start gap-3">
                                <Info size={20} className="shrink-0 mt-0.5" />
                                <p className="text-sm">2D images require additional 3D modeling work. A standard conversion fee of ₹500 will be added to your order.</p>
                            </div>
                        )}

                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                            <div className="w-16 h-16 bg-lavender-light rounded-full flex items-center justify-center mb-4">
                                <UploadCloud size={32} className="text-primary" />
                            </div>
                            <p className="text-lg font-medium text-gray-900 mb-1">
                                {file ? file.name : 'Click to upload or drag and drop'}
                            </p>
                            <p className="text-sm text-gray-500">
                                {uploadType === '3d' ? 'Maximum file size 50MB' : 'High resolution image recommended'}
                            </p>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">2. Print Specifications</h2>

                        <div className="space-y-8">
                            {/* Size Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-900">Longest Axis Size</h3>
                                    <span className="text-primary font-bold bg-lavender-light px-3 py-1 rounded-lg">{size} inches</span>
                                </div>
                                <input
                                    type="range"
                                    min="3"
                                    max="9"
                                    step="0.5"
                                    value={size}
                                    onChange={(e) => setSize(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-2">
                                    <span>3&quot; (Min)</span>
                                    <span>9&quot; (Max)</span>
                                </div>
                            </div>

                            {/* Material */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Material</h3>
                                <div className="flex gap-4">
                                    {['PLA', 'ABS', 'Resin'].map((mat) => (
                                        <button
                                            key={mat}
                                            onClick={() => setMaterial(mat as 'PLA' | 'ABS' | 'Resin')}
                                            className={`flex-1 py-3 rounded-xl font-medium border-2 transition-colors ${material === mat ? 'border-primary bg-lavender-light text-primary' : 'border-gray-100 text-gray-600 hover:border-gray-200'}`}
                                        >
                                            {mat}
                                            <span className="block text-xs font-normal opacity-70 mt-0.5">
                                                {mat === 'PLA' ? 'Standard, eco-friendly' : mat === 'ABS' ? 'Durable, heat-resistant' : 'Ultra-detail finish'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Quantity</h3>
                                <QuantitySelector value={quantity} onChange={setQuantity} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Sticky Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-900 text-white p-8 rounded-3xl sticky top-24 shadow-xl">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6 text-sm">
                            <div className="flex justify-between text-gray-300">
                                <span>Material Cost ({material})</span>
                                <span>₹{unitPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Size ({size}&quot;)</span>
                                <span>Included</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Quantity</span>
                                <span>x{quantity}</span>
                            </div>
                            {uploadType === '2d' && (
                                <div className="flex justify-between text-blue-300 pt-2 border-t border-gray-700">
                                    <span>2D to 3D Conversion Fee</span>
                                    <span>₹{conversionFee}</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-700 mb-8">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-300">Total Estimated Price</span>
                                <span className="text-3xl font-bold text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <p className="text-xs text-gray-400">Final price subject to file analysis.</p>
                        </div>

                        <Button
                            size="lg"
                            className={`w-full ${file ? 'bg-primary hover:bg-[#5A3FE0] text-white' : 'bg-gray-800 text-gray-400'} border-none shadow-none`}
                            disabled={!file}
                        >
                            {file ? 'Add Custom Print to Cart' : 'Upload File to Continue'}
                        </Button>

                        {!file && (
                            <p className="text-center text-xs text-red-300 mt-4 flex items-center justify-center gap-1">
                                <AlertCircle size={14} /> Please upload a file first
                            </p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
