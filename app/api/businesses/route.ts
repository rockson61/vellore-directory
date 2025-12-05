import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { businesses } from '@/lib/schema';
import { eq, like, and, desc } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const pincode = searchParams.get('pincode');
        const limit = parseInt(searchParams.get('limit') || '100');

        let query = db.select().from(businesses);

        const conditions = [];
        if (category) conditions.push(eq(businesses.category, category));
        if (search) conditions.push(like(businesses.name, `%${search}%`));
        if (pincode) conditions.push(eq(businesses.pincode, pincode));

        if (conditions.length > 0) {
            // @ts-expect-error - Drizzle dynamic where clause typing
            query = query.where(and(...conditions));
        }

        const results = await query.orderBy(desc(businesses.rating)).limit(limit);

        return NextResponse.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        console.error('Error fetching businesses:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch businesses' },
            { status: 500 }
        );
    }
}
