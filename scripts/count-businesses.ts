import { businesses } from '@/lib/schema';
import { count } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function countBusinesses() {
    const { db } = await import('@/lib/db');
    const result = await db.select({ count: count() }).from(businesses);
    console.log(`Total businesses: ${result[0].count}`);
}

countBusinesses()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
