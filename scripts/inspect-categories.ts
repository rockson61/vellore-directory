import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

async function inspectCategories() {
    console.log('🔍 Inspecting category_hierarchy table...');
    try {
        const categories = await sql`SELECT id, name, slug, level FROM category_hierarchy LIMIT 20`;
        console.table(categories);
    } catch (error) {
        console.error('❌ Error fetching categories:', error);
    }
}

inspectCategories();
