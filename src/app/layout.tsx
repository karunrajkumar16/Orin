import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { UserAuthProvider } from '@/context/UserAuthContext';
import IntroScreen from '@/components/ui/IntroScreen';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ORINCORE | Premium 3D Printing',
  description: 'Precision 3D Printing for Custom Creations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased bg-background text-foreground`}>
        <UserAuthProvider>
          <CartProvider>
            <IntroScreen />
            <Navbar />
            <main className="flex-grow flex flex-col pt-20">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </UserAuthProvider>
      </body>
    </html>
  );
}
