import { locations } from '@/lib/schema';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

/**
 * Add missing Vellore locations that have businesses in them
 * Based on analysis of business addresses
 */

const newLocations = [
    {
        name: "Officer's Line",
        slug: 'officers-line',
        pincode: '632001',
        description: 'Popular commercial area in Vellore near Lakshmi Theater'
    },
    {
        name: 'Kosapet',
        slug: 'kosapet',
        pincode: '632001',
        description: 'Central business district in Vellore near CMC Eye Hospital'
    },
    {
        name: 'Voorhees',
        slug: 'voorhees',
        pincode: '632001',
        description: 'Area near Voorhees College and shopping complex'
    }
];

async function addVelloreLocations() {
    const { db } = await import('@/lib/db');

    console.log('📍 Adding missing Vellore locations...\n');

    for (const location of newLocations) {
        console.log(`Adding: ${location.name} (${location.slug})`);

        try {
            await db.insert(locations).values({
                name: location.name,
                slug: location.slug,
                pincode: location.pincode,
                description: location.description
            });
            console.log(`✅ Added ${location.name}`);
        } catch (error: any) {
            if (error.code === '23505') { // Unique constraint violation
                console.log(`⚠️  ${location.name} already exists, skipping...`);
            } else {
                console.error(`❌ Error adding ${location.name}:`, error.message);
            }
        }
    }

    console.log('\n✨ Location addition complete!');

    // Verify the additions
    const allLocations = await db
        .select()
        .from(locations)
        .orderBy(locations.name);

    console.log(`\nTotal locations in database: ${allLocations.length}`);
}

addVelloreLocations()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Error:', err);
        process.exit(1);
    });
