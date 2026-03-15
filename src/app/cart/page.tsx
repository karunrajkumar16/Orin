import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Trash2, ArrowRight } from 'lucide-react';

export default function Cart() {
    return (
        <div className="container mx-auto px-6 md:px-12 py-12 md:py-20">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-10">Your Cart</h1>

            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    {/* Cart Item */}
                    <div className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm items-center hover:shadow-md transition-shadow">
                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                            <Image src="/images/desk_organizer.png" alt="Desk Organizer" fill className="object-cover" />
                        </div>

                        <div className="flex-1 w-full flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Desk Organizer</h3>
                                    <p className="text-sm text-gray-500">Color: White | Material: PLA | Size: Standard</p>
                                </div>
                                <p className="text-lg font-bold text-primary">$28.00</p>
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <div className="flex items-center w-28 border border-gray-200 rounded-lg overflow-hidden bg-white">
                                    <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50">-</button>
                                    <input type="number" readOnly value={1} className="flex-1 h-8 text-center text-sm font-medium border-none outline-none p-0" />
                                    <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50">+</button>
                                </div>
                                <button className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium">
                                    <Trash2 size={16} /> Remove
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm items-center hover:shadow-md transition-shadow">
                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                            <Image src="/images/gaming_stand.png" alt="Headphone Stand" fill className="object-cover" />
                        </div>

                        <div className="flex-1 w-full flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Gaming Headphone Stand</h3>
                                    <p className="text-sm text-gray-500">Color: Black | Material: PETG | Size: Standard</p>
                                </div>
                                <p className="text-lg font-bold text-primary">$35.00</p>
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <div className="flex items-center w-28 border border-gray-200 rounded-lg overflow-hidden bg-white">
                                    <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50">-</button>
                                    <input type="number" readOnly value={2} className="flex-1 h-8 text-center text-sm font-medium border-none outline-none p-0" />
                                    <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50">+</button>
                                </div>
                                <button className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium">
                                    <Trash2 size={16} /> Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal (3 items)</span>
                                <span className="font-medium text-gray-900">$98.00</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="font-medium text-gray-900">Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span className="font-medium text-gray-900">Calculated at checkout</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="font-medium text-gray-900">Estimated Total</span>
                                <span className="text-3xl font-bold text-gray-900">$98.00</span>
                            </div>
                        </div>

                        <Link href="/checkout" className="block">
                            <Button size="lg" className="w-full flex items-center justify-center gap-2">
                                Proceed to Checkout <ArrowRight size={18} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
