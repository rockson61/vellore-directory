import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function addSlugColumn() {
    console.log('🚀 Adding slug column to businesses table...');

    try {
        await db.execute(sql`ALTER TABLE businesses ADD COLUMN IF NOT EXISTS slug text UNIQUE`);
        console.log('✅ Slug column added successfully!');
    } catch (error) {
        console.error('❌ Error adding slug column:', error);
    }

    process.exit(0);
}

addSlugColumn();
