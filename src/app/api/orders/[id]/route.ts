import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAuth } from '@/middleware/adminAuth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = requireAuth(req);
    if ('error' in auth) return auth.error;
    if (auth.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        await connectDB();
        const { id } = await params;
        const { status } = await req.json();

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
        if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

        return NextResponse.json(order);
    } catch (error) {
        console.error('PATCH /api/orders/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = requireAuth(req);
    if ('error' in auth) return auth.error;

    try {
        await connectDB();
        const { id } = await params;
        const order = await Order.findById(id).lean();
        if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

        // Non-admins can only see their own orders
        if (auth.role !== 'admin' && (order as { userId: string }).userId !== auth.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('GET /api/orders/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}
