import { businesses } from '@/lib/schema';
import { ilike, or } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const missingLocations = ['New Town', 'Old Town', "Officer's Line", 'Kosapet', 'Voorhees'];

async function checkBusinessesInLocations() {
    const { db } = await import('@/lib/db');

    console.log('🔍 Checking if businesses exist in missing locations...\n');

    for (const location of missingLocations) {
        console.log(`\n📍 Searching for "${location}"...`);

        const results = await db
            .select({
                id: businesses.id,
                name: businesses.name,
                address: businesses.address,
                pincode: businesses.pincode
            })
            .from(businesses)
            .where(ilike(businesses.address, `%${location}%`))
            .limit(10);

        console.log(`Found ${results.length} businesses`);
        if (results.length > 0) {
            console.table(results.slice(0, 5));
        }
    }
}

checkBusinessesInLocations()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
