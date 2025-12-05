import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

async function seedServices() {
    const businessId = 'ChIJL3EU1JA4rTsRsK1OmLomSfg'; // The Vellore Kitchen
    console.log(`🌱 Seeding services for business ${businessId}...`);

    try {
        // Check if business exists
        const business = await sql`SELECT id FROM businesses WHERE id = ${businessId}`;
        if (business.length === 0) {
            console.error('❌ Business not found');
            process.exit(1);
        }

        // Insert services
        await sql`
            INSERT INTO service_offerings (business_id, service_name, service_description, duration_minutes, price, is_bookable)
            VALUES 
            (${businessId}, 'Table Reservation', 'Reserve a table for dining', 60, 0, true),
            (${businessId}, 'Party Hall Booking', 'Book party hall for events', 180, 5000, true)
            ON CONFLICT DO NOTHING
        `;

        console.log('✅ Services seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding services:', error);
        process.exit(1);
    }
}

seedServices();
