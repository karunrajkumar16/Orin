import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/middleware/adminAuth';

export async function GET() {
    try {
        await connectDB();
        const products = await Product.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(products);
    } catch (error) {
        console.error('GET /api/products error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = requireAdmin(req);
    if ('error' in auth) return auth.error;

    try {
        await connectDB();
        const body = await req.json();
        const product = await Product.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('POST /api/products error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
