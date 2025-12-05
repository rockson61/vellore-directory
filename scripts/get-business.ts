import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

async function getBusiness() {
    try {
        const business = await sql`SELECT id, name FROM businesses LIMIT 1`;
        console.log(JSON.stringify(business[0]));
    } catch (error) {
        console.error('❌ Error fetching business:', error);
    }
}

getBusiness();
