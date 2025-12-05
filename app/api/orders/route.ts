import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { stackServerApp } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        // Get authenticated user (optional)
        let userId = null;
        try {
            const user = await stackServerApp.getUser();
            userId = user?.id || null;
        } catch {
            // User not authenticated, continue anyway
        }

        const body = await request.json();
        const { businessId, items, notes, customerPhone } = body;

        if (!businessId || !items || items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const order = await db.insert(orders).values({
            userId,
            businessId,
            items,
            notes: notes || null,
            customerPhone,
            status: 'pending'
        }).returning();

        return NextResponse.json({
            success: true,
            data: order[0]
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        // Get authenticated user
        const user = await stackServerApp.getUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.userId, user.id));

        return NextResponse.json({
            success: true,
            count: userOrders.length,
            data: userOrders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
