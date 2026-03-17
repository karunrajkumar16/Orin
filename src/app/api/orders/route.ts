import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAuth } from '@/middleware/adminAuth';
import { calculateCartTotals } from '@/lib/data';

export async function POST(req: NextRequest) {
    const auth = requireAuth(req);
    if ('error' in auth) return auth.error;

    try {
        await connectDB();
        const { items, shippingAddress } = await req.json();

        if (!items?.length) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        const totals = calculateCartTotals(items);

        const order = await Order.create({
            userId: auth.userId,
            items,
            ...totals,
            totalAmount: totals.total,
            shippingAddress,
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('POST /api/orders error:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const auth = requireAuth(req);
    if ('error' in auth) return auth.error;

    try {
        await connectDB();
        // Admin gets all orders; regular users get only their own
        const filter = auth.role === 'admin' ? {} : { userId: auth.userId };
        const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
        return NextResponse.json(orders);
    } catch (error) {
        console.error('GET /api/orders error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
