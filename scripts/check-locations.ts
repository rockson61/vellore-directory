import { db } from '../lib/db';
import { locations, businesses } from '../lib/schema';
import { sql } from 'drizzle-orm';

async function checkLocations() {
    console.log('🔍 Checking Location Pages...\n');

    // 1. Check locations table
    const allLocations = await db.select().from(locations);
    console.log(`📍 Locations in database: ${allLocations.length}`);

    console.log('\nAll locations:');
    allLocations.forEach((loc, i) => {
        console.log(`${i + 1}. ${loc.name} (Pincode: ${loc.pincode}, Slug: ${loc.slug})`);
    });

    // 2. Check unique pincodes from businesses
    const uniquePincodes = await db
        .select({
            pincode: businesses.pincode,
            count: sql<number>`count(*)`
        })
        .from(businesses)
        .groupBy(businesses.pincode)
        .orderBy(sql`count(*) DESC`);

    console.log(`\n📊 Unique pincodes with businesses: ${uniquePincodes.length}`);
    console.log('\nTop 20 pincodes:');
    uniquePincodes.slice(0, 20).forEach((p, i) => {
        console.log(`${i + 1}. Pincode ${p.pincode}: ${p.count} businesses`);
    });

    // 3. Explain location page structure
    console.log('\n📄 Location Page Types:');
    console.log('1. Named locations (from locations table): 35 pages');
    console.log('   Example: /near-me/katpadi, /near-me/gandhi-nagar');
    console.log('\n2. Category pages: 585 pages');
    console.log('   Example: /near-me/food-and-dining, /near-me/healthcare');
    console.log('\n3. Location + Category combinations: 35 × 585 = 20,475 potential pages');
    console.log('   Example: /near-me/katpadi/food-and-dining');
    console.log('\n4. Business detail pages: 3,799 pages');
    console.log('   Example: /near-me/food-and-dining/restaurant-name');

    const totalPages = 35 + 585 + (35 * 585) + 3799;
    console.log(`\n✅ Total potential pages: ${totalPages.toLocaleString()}`);
    console.log('\nNote: Pages are generated dynamically, not pre-built.');

    process.exit(0);
}

checkLocations();
