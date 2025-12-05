import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

async function resetDb() {
    console.log('🗑️ Resetting database tables...');
    try {
        await sql`TRUNCATE TABLE category_hierarchy RESTART IDENTITY CASCADE`;
        await sql`TRUNCATE TABLE businesses RESTART IDENTITY CASCADE`;
        // Also truncate other tables if needed
        await sql`TRUNCATE TABLE categories RESTART IDENTITY CASCADE`;
        await sql`TRUNCATE TABLE appointments RESTART IDENTITY CASCADE`;
        await sql`TRUNCATE TABLE service_offerings RESTART IDENTITY CASCADE`;
        await sql`TRUNCATE TABLE business_amenities RESTART IDENTITY CASCADE`;
        await sql`TRUNCATE TABLE business_hours RESTART IDENTITY CASCADE`;

        console.log('✅ Tables truncated successfully');
    } catch (error) {
        console.error('❌ Error truncating tables:', error);
        process.exit(1);
    }
}

resetDb();
