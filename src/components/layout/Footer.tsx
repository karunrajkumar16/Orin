import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-20">
            <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
                        ORINCORE
                    </Link>
                    <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                        Precision 3D printing for custom creations. Combining minimal design with modern engineering.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Shop</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
                        <li><Link href="/shop?category=figurines" className="hover:text-primary transition-colors">Figurines</Link></li>
                        <li><Link href="/shop?category=desk" className="hover:text-primary transition-colors">Desk Accessories</Link></li>
                        <li><Link href="/shop?category=gaming" className="hover:text-primary transition-colors">Gaming Accessories</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><Link href="/custom-print" className="hover:text-primary transition-colors">Custom 3D Print</Link></li>
                        <li><Link href="/custom-print?type=2d" className="hover:text-primary transition-colors">2D to 3D Conversion</Link></li>
                        <li><Link href="/about" className="hover:text-primary transition-colors">How It Works</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><Link href="/policies" className="hover:text-primary transition-colors">Replacement Policy</Link></li>
                        <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                    </ul>
                </div>
            </div>

            <div className="container mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-gray-200 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                <p>&copy; {new Date().getFullYear()} ORINCORE. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <Link href="/policies" className="hover:text-primary">Terms of Service</Link>
                    <Link href="/policies" className="hover:text-primary">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
}
