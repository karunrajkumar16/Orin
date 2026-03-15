"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CategoryCardProps {
    category: {
        id: string;
        name: string;
        image: string;
    };
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link href={`/shop?category=${category.id}`}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group h-64 md:h-80 rounded-2xl overflow-hidden cursor-pointer"
            >
                <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                        <span className="text-white/80 text-sm font-medium flex items-center gap-2 group-hover:text-white transition-colors">
                            Explore Collection
                            <motion.span
                                initial={{ x: 0 }}
                                whileHover={{ x: 5 }}
                            >→</motion.span>
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
