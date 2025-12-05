import { businesses, locations } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

function extractAreaName(address: string): string | null {
    if (!address) return null;
    const parts = address.split(',').map(p => p.trim());
    // Find index of "Vellore"
    const velloreIndex = parts.findIndex(p => p.toLowerCase().includes('vellore'));

    if (velloreIndex > 0) {
        // Return the part immediately before Vellore
        return parts[velloreIndex - 1];
    }

    // Fallback: if "Vellore" is not found or is first, try to find something that looks like an area
    // This is heuristic and might need improvement
    if (parts.length > 2) {
        return parts[parts.length - 3];
    }

    return null;
}

async function populateLocations() {
    const { db } = await import('@/lib/db');
    console.log('🚀 Populating locations from businesses...');

    const allBusinesses = await db.select().from(businesses);
    console.log(`Found ${allBusinesses.length} businesses.`);

    let addedCount = 0;

    for (const business of allBusinesses) {
        if (!business.pincode || !business.address) continue;

        const areaName = extractAreaName(business.address);
        if (!areaName) continue;

        const slug = generateSlug(areaName);

        // Check if location exists by slug or pincode
        const existingSlug = await db.query.locations.findFirst({
            where: eq(locations.slug, slug),
        });

        const existingPincode = await db.query.locations.findFirst({
            where: eq(locations.pincode, business.pincode),
        });

        if (existingSlug || existingPincode) {
            continue;
        }

        try {
            await db.insert(locations).values({
                name: areaName,
                slug: slug,
                pincode: business.pincode,
                city: 'Vellore',
                state: 'Tamil Nadu',
                description: `Area in Vellore`,
            });
            console.log(`✅ Added location: ${areaName} (${business.pincode})`);
            addedCount++;
        } catch (err) {
            console.error(`❌ Failed to add location ${areaName}:`, err);
        }
    }

    console.log(`\n🎉 Finished! Added ${addedCount} new locations.`);
}

populateLocations()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
