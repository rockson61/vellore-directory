import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { appointments, serviceOfferings } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            businessId,
            serviceId,
            customerName,
            customerPhone,
            customerEmail,
            appointmentDate,
            appointmentTime,
            notes
        } = body;

        // Validate required fields
        if (!businessId || !serviceId || !customerName || !customerPhone || !appointmentDate || !appointmentTime) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get service details
        const service = await db
            .select()
            .from(serviceOfferings)
            .where(eq(serviceOfferings.id, serviceId))
            .limit(1);

        if (!service.length) {
            return NextResponse.json(
                { success: false, error: 'Service not found' },
                { status: 404 }
            );
        }

        // Create appointment
        const appointment = await db.insert(appointments).values({
            businessId,
            serviceId,
            customerName,
            customerPhone,
            customerEmail,
            appointmentDate,
            appointmentTime,
            durationMinutes: service[0].durationMinutes,
            notes,
            status: 'pending'
        }).returning();

        // TODO: Send confirmation email/SMS

        return NextResponse.json({
            success: true,
            data: appointment[0],
            message: 'Appointment booked successfully'
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create appointment' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const businessId = searchParams.get('business_id');
        const userId = searchParams.get('user_id');
        const status = searchParams.get('status');

        const conditions = [];

        if (businessId) {
            conditions.push(eq(appointments.businessId, businessId));
        }

        if (userId) {
            conditions.push(eq(appointments.userId, userId));
        }

        if (status) {
            conditions.push(eq(appointments.status, status));
        }

        let query = db.select().from(appointments);

        if (conditions.length > 0) {
            // @ts-expect-error - Drizzle types can be tricky with dynamic where
            query = query.where(and(...conditions));
        }

        const results = await query.orderBy(appointments.appointmentDate, appointments.appointmentTime);

        return NextResponse.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch appointments' },
            { status: 500 }
        );
    }
}
