import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/middleware/adminAuth';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const product = await Product.findById(params.id).lean();
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        console.error('GET /api/products/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = requireAdmin(req);
    if ('error' in auth) return auth.error;

    try {
        await connectDB();
        const body = await req.json();
        const product = await Product.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        console.error('PUT /api/products/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = requireAdmin(req);
    if ('error' in auth) return auth.error;

    try {
        await connectDB();
        const product = await Product.findByIdAndDelete(params.id);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/products/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
