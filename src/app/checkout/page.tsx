import { Button } from '@/components/ui/Button';
import { Lock, CreditCard } from 'lucide-react';

export default function Checkout() {
    return (
        <div className="container mx-auto px-6 md:px-12 py-12 md:py-20 min-h-[80vh]">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Secure Checkout</h1>
                    <p className="text-gray-500 flex items-center justify-center gap-2">
                        <Lock size={16} /> All transactions are secure and encrypted
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-12">

                    {/* Form */}
                    <div className="md:col-span-3 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">1. Contact Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="John" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Doe" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="john@example.com" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input type="tel" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="+1 (555) 000-0000" />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">2. Shipping Address</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="123 Printing Ave" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="New York" />
                                </div>
                                <div className="col-span-1 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <input type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="NY" />
                                </div>
                                <div className="col-span-1 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal</label>
                                    <input type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="10001" />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">3. Payment</h2>
                            <div className="p-6 bg-lavender-light border border-primary/20 rounded-2xl flex items-center gap-4 text-primary">
                                <CreditCard size={32} />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Online Payment Only</h3>
                                    <p className="text-sm">Cash on Delivery is not available for custom printed objects.</p>
                                </div>
                            </div>

                            <div className="mt-6 border border-gray-200 rounded-2xl p-6 bg-gray-50">
                                <p className="text-sm text-center text-gray-500 italic">Payment gateway UI placeholder. In a real app, Stripe or PayPal would be mounted here.</p>
                            </div>
                        </section>

                        <Button size="lg" className="w-full text-lg mt-8">
                            Pay $98.00
                        </Button>
                    </div>

                    {/* Inline Summary */}
                    <div className="md:col-span-2">
                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">In Your Cart</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white rounded-lg border border-gray-200" />
                                        <span className="text-sm font-medium">Desk Organizer <span className="text-gray-400">x1</span></span>
                                    </div>
                                    <span className="text-sm font-medium">$28.00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white rounded-lg border border-gray-200" />
                                        <span className="text-sm font-medium">Headphone Stand <span className="text-gray-400">x2</span></span>
                                    </div>
                                    <span className="text-sm font-medium">$70.00</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 mb-4 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">$98.00</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-gray-900 text-lg">Total</span>
                                    <span className="text-2xl font-bold text-gray-900">$98.00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
