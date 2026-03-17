import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
    return POST();
}

export async function POST() {
    try {
        await connectDB();
        const hashedPassword = await bcrypt.hash('admin123', 12);

        // Upsert: update if exists, create if not
        await User.findOneAndUpdate(
            { email: 'admin@orincore.com' },
            { name: 'Admin', email: 'admin@orincore.com', password: hashedPassword, role: 'admin' },
            { upsert: true, new: true }
        );

        return NextResponse.json({ message: 'Admin user ready: admin@orincore.com / admin123' });
    } catch (error) {
        console.error('Seed admin error:', error);
        return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
    }
}
