import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

async function inspectLocations() {
    console.log('🔍 Inspecting locations table...');
    try {
        const locations = await sql`SELECT * FROM locations LIMIT 50`;
        console.log(`Found ${locations.length} locations (showing first 50):`);
        console.table(locations);
    } catch (error) {
        console.error('❌ Error fetching locations:', error);
    }
}

inspectLocations();
