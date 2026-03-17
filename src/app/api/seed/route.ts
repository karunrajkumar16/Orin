import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import { PRODUCTS } from '@/lib/data';
import bcrypt from 'bcryptjs';

export async function POST() {
    try {
        await connectDB();
        const count = await Product.countDocuments();
        if (count > 0) {
            return NextResponse.json({ message: `Already seeded (${count} products exist)` });
        }

        const docs = PRODUCTS.map(p => ({
            name: p.name,
            category: p.category,
            price: p.price,
            originalPrice: p.originalPrice,
            discountPercentage: p.discountPercentage,
            image: p.image,
            images: p.images,
            description: p.description,
            materials: p.materials,
            colors: p.colors,
            sizes: p.sizes,
            stock: p.stock,
        }));

        await Product.insertMany(docs);

        // Also seed admin user if none exists
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 12);
            await User.create({ name: 'Admin', email: 'admin@orincore.com', password: hashedPassword, role: 'admin' });
        }

        return NextResponse.json({ message: `Seeded ${docs.length} products${adminExists ? '' : ' + admin user (admin@orincore.com / admin123)'}` });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
    }
}
