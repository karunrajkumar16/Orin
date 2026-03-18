import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAuth } from '@/middleware/adminAuth';
import { verifyToken } from '@/lib/auth';

// Helper: try to get auth, but allow guest
function tryAuth(req: NextRequest): { userId: string; role: string } | null {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    try {
        const payload = verifyToken(authHeader.slice(7));
        return { userId: payload.userId, role: payload.role };
    } catch {
        return null;
    }
}
import { calculateCartTotals } from '@/lib/data';

export async function POST(req: NextRequest) {
    // Allow guest checkout — use 'guest' as userId if not logged in
    const auth = tryAuth(req);
    const userId = auth?.userId ?? 'guest';

    try {
        await connectDB();
        const { items, shippingAddress } = await req.json();

        if (!items?.length) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        const totals = calculateCartTotals(items);

        const order = await Order.create({
            userId,
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
        const filter = auth.role === 'admin' ? {} : { userId: auth.userId };
        const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
        return NextResponse.json(orders);
    } catch (error) {
        console.error('GET /api/orders error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
