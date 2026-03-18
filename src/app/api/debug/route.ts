import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await connectDB();
        const db = mongoose.connection.db;
        if (!db) return NextResponse.json({ error: 'No DB connection' });

        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        const results: Record<string, unknown> = {
            database: db.databaseName,
            collections: collectionNames,
        };

        // Count docs in each collection
        for (const name of collectionNames) {
            const count = await db.collection(name).countDocuments();
            const sample = await db.collection(name).findOne({});
            results[name] = { count, sampleKeys: sample ? Object.keys(sample) : [] };
        }

        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
