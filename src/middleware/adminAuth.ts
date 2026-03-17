import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function requireAdmin(req: NextRequest): { error: NextResponse } | { userId: string } {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    try {
        const token = authHeader.slice(7);
        const payload = verifyToken(token);
        if (payload.role !== 'admin') {
            return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
        }
        return { userId: payload.userId };
    } catch {
        return { error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) };
    }
}

export function requireAuth(req: NextRequest): { error: NextResponse } | { userId: string; role: string } {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    try {
        const token = authHeader.slice(7);
        const payload = verifyToken(token);
        return { userId: payload.userId, role: payload.role };
    } catch {
        return { error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) };
    }
}
