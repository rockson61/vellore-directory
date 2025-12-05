import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { businesses, locations } from '@/lib/schema';
import { ilike, or, eq, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q') || '';
        const category = searchParams.get('category');
        const location = searchParams.get('location');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');

        if (!query && !category && !location) {
            return NextResponse.json({
                error: 'At least one search parameter is required'
            }, { status: 400 });
        }

        // Build search conditions
        const conditions = [];

        if (query) {
            conditions.push(
                or(
                    ilike(businesses.name, `%${query}%`),
                    ilike(businesses.description, `%${query}%`),
                    ilike(businesses.category, `%${query}%`)
                )
            );
        }

        if (category) {
            conditions.push(eq(businesses.category, category));
        }

        if (location) {
            // Find location by slug
            const locationData = await db
                .select()
                .from(locations)
                .where(eq(locations.slug, location))
                .limit(1);

            if (locationData.length > 0) {
                conditions.push(eq(businesses.pincode, locationData[0].pincode));
            }
        }

        // Execute search query
        const results = await db
            .select()
            .from(businesses)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .limit(limit)
            .offset(offset)
            .orderBy(sql`${businesses.rating} DESC NULLS LAST`);

        // Get total count for pagination
        const countResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(businesses)
            .where(conditions.length > 0 ? and(...conditions) : undefined);

        const total = countResult[0]?.count || 0;

        return NextResponse.json({
            results,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total
            }
        });

    } catch (error: unknown) {
        console.error('Search error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
