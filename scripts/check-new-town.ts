import { locations } from '@/lib/schema';
import { like, ilike } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkNewTown() {
    const { db } = await import('@/lib/db');

    console.log('🔍 Checking for "New Town" location...\n');

    // Search for new-town
    const results = await db
        .select()
        .from(locations)
        .where(ilike(locations.name, '%new%town%'));

    console.log('Found locations:');
    console.table(results.map(r => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        pincode: r.pincode
    })));

    // Also check all locations
    const allLocations = await db
        .select()
        .from(locations);

    console.log(`\nTotal locations in database: ${allLocations.length}`);
    console.log('\nAll locations:');
    console.table(allLocations.map(r => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        pincode: r.pincode
    })));
}

checkNewTown()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
