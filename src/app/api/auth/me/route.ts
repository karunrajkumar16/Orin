import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

function getAuth(req: NextRequest) {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return null;
    try { return verifyToken(auth.slice(7)); } catch { return null; }
}

// GET /api/auth/me — fetch profile
export async function GET(req: NextRequest) {
    const payload = getAuth(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const user = await User.findById(payload.userId).select('-password').lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(user);
}

// PATCH /api/auth/me — update profile
export async function PATCH(req: NextRequest) {
    const payload = getAuth(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { name, phone, addressLine, city, state, pincode, currentPassword, newPassword } = body;

    const user = await User.findById(payload.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Update basic fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (addressLine !== undefined) user.addressLine = addressLine;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (pincode !== undefined) user.pincode = pincode;

    // Change password if requested
    if (newPassword) {
        if (!currentPassword) return NextResponse.json({ error: 'Current password required' }, { status: 400 });
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    return NextResponse.json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addressLine: user.addressLine,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
    });
}
