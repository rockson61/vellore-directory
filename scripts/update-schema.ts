import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function updateSchema() {
    console.log('🚀 Updating schema...');

    const columns = [
        { name: 'slug', type: 'text UNIQUE' },
        { name: 'email', type: 'text' },
        { name: 'latitude', type: 'text' },
        { name: 'longitude', type: 'text' },
        { name: 'status', type: 'text DEFAULT \'active\'' },
        { name: 'verified', type: 'boolean DEFAULT false' },
        { name: 'amenities', type: 'jsonb' },
        { name: 'opening_hours', type: 'jsonb' },
        { name: 'images', type: 'jsonb' },
        { name: 'created_at', type: 'timestamp DEFAULT now()' },
        { name: 'updated_at', type: 'timestamp DEFAULT now()' },
    ];

    for (const col of columns) {
        try {
            console.log(`Adding column ${col.name}...`);
            await db.execute(sql.raw(`ALTER TABLE businesses ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type}`));
            console.log(`✅ Column ${col.name} added/verified.`);
        } catch (error) {
            console.error(`❌ Error adding column ${col.name}:`, error);
        }
    }

    process.exit(0);
}

updateSchema();
