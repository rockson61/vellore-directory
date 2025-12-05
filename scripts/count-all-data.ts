import { locations, categoryHierarchy } from '@/lib/schema';
import { count } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function countData() {
    const { db } = await import('@/lib/db');

    const locationsResult = await db.select({ count: count() }).from(locations);
    const categoriesResult = await db.select({ count: count() }).from(categoryHierarchy);

    console.log(`Total locations: ${locationsResult[0].count}`);
    console.log(`Total categories: ${categoriesResult[0].count}`);
}

countData()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
