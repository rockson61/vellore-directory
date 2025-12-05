import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { businesses } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const business = await db
            .select()
            .from(businesses)
            .where(eq(businesses.id, parseInt(id)))
            .limit(1);

        if (business.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Business not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: business[0]
        });
    } catch (error) {
        console.error('Error fetching business:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch business' },
            { status: 500 }
        );
    }
}
