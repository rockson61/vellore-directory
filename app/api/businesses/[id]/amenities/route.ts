import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { businessAmenities } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const amenities = await db
            .select()
            .from(businessAmenities)
            .where(eq(businessAmenities.businessId, id));

        // Group by type
        const grouped = amenities.reduce((acc, amenity) => {
            if (!acc[amenity.amenityType]) {
                acc[amenity.amenityType] = [];
            }
            acc[amenity.amenityType].push({
                name: amenity.amenityName,
                value: amenity.amenityValue
            });
            return acc;
        }, {} as Record<string, Array<{ name: string | null; value: string | null }>>);

        return NextResponse.json({
            success: true,
            data: grouped
        });
    } catch (error) {
        console.error('Error fetching amenities:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch amenities' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const { amenityType, amenityName, amenityValue } = body;

        const amenity = await db.insert(businessAmenities).values({
            businessId: id,
            amenityType,
            amenityName,
            amenityValue
        }).returning();

        return NextResponse.json({
            success: true,
            data: amenity[0]
        });
    } catch (error) {
        console.error('Error adding amenity:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to add amenity' },
            { status: 500 }
        );
    }
}
