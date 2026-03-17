"use client";

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { CATEGORIES } from '@/lib/data';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ui/ProductCard';
import CategoryCard from '@/components/ui/CategoryCard';
import { Button } from '@/components/ui/Button';
import ThreeDViewer from '@/components/ui/ThreeDViewer';
import { UploadCloud, Sliders, Box, ArrowDown } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 6);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const [scrollProgress, setScrollProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollProgress(latest);
  });

  // Transform values for text fading and sliding based on scroll
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Immersive Scroll Hero Section */}
      <section ref={heroRef} className="relative h-[150vh] bg-background">

        {/* Sticky Container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">

          {/* Sibling Layer: 3D Object */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-80 pointer-events-none">
            <ThreeDViewer scrollYProgress={scrollProgress} />
          </div>

          {/* Sibling Layer: Foreground Text */}
          <motion.div
            style={{ opacity, y, scale }}
            className="relative z-10 container mx-auto px-6 text-center pt-20"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl mx-auto backdrop-blur-[2px] bg-white/30 p-8 rounded-3xl"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 leading-[1.05] mb-6"
              >
                Precision 3D Printing for <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Custom Creations</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl text-gray-800 mb-10 leading-relaxed font-medium max-w-2xl mx-auto"
              >
                Transform your digital models or 2D photos into breathtaking physical objects. Premium quality, expertly crafted, and delivered to your door.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/shop" className="pointer-events-auto">
                  <Button size="lg" className="w-full sm:w-auto px-10 text-lg shadow-xl shadow-primary/20">
                    Shop Products
                  </Button>
                </Link>
                <Link href="/custom-print" className="pointer-events-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 text-lg bg-white/60 backdrop-blur-md border-gray-300 hover:border-primary">
                    Customize Your Print
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-400 cursor-pointer pointer-events-auto"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <ArrowDown size={32} />
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-white overflow-hidden relative z-20 rounded-t-[40px] -mt-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.05)] border-t border-gray-100">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="container mx-auto px-6 md:px-12"
        >
          <div className="flex justify-between items-end mb-16">
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">Featured Collections</h2>
              <p className="text-lg text-gray-500 max-w-2xl">Discover our most popular premium 3D printed accessories and art pieces, crafted with extreme precision.</p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link href="/shop" className="hidden md:inline-flex text-primary font-bold hover:text-[#5A3FE0] transition-colors items-center gap-2 text-lg">
                View All <span>&rarr;</span>
              </Link>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-12 text-center md:hidden">
            <Link href="/shop">
              <Button size="lg" className="w-full">View All Products</Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-32 bg-gray-50 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="container mx-auto px-6 md:px-12"
        >
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">Explore Categories</h2>
            <p className="text-lg text-gray-500">Find exactly what you need from our beautifully curated collections.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CATEGORIES.map((category) => (
              <motion.div
                key={category.id}
                variants={fadeInUp}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-white overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="container mx-auto px-6 md:px-12"
        >
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">Create Custom Prints in 3 Steps</h2>
            <p className="text-lg text-gray-500">We made the custom 3D printing process incredibly simple and intuitive.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-16 relative">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-lavender-light via-primary/30 to-lavender-light z-0 origin-left"
            />

            <motion.div variants={fadeInUp} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-32 h-32 rounded-3xl bg-white flex items-center justify-center mb-8 shadow-xl shadow-primary/5 border border-lavender group-hover:-translate-y-2 transition-transform duration-500">
                <UploadCloud size={48} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Upload Design</h3>
              <p className="text-gray-500 leading-relaxed">Upload your 3D file (.STL, .OBJ) or even a 2D photo for our designers to convert.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-32 h-32 rounded-3xl bg-white flex items-center justify-center mb-8 shadow-xl shadow-primary/5 border border-lavender group-hover:-translate-y-2 transition-transform duration-500">
                <Sliders size={48} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Choose Specs</h3>
              <p className="text-gray-500 leading-relaxed">Select your preferred material, size, and color using our live interactive preview.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-32 h-32 rounded-3xl bg-white flex items-center justify-center mb-8 shadow-xl shadow-primary/5 border border-lavender group-hover:-translate-y-2 transition-transform duration-500">
                <Box size={48} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Receive Print</h3>
              <p className="text-gray-500 leading-relaxed">We carefully print, inspect, and ship your premium quality physical object to your door.</p>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="mt-20 text-center">
            <Link href="/custom-print">
              <Button size="lg" className="px-12 py-6 text-lg rounded-2xl shadow-xl shadow-primary/20">Start Custom Print</Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
