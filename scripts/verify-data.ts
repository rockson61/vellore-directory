import { db } from '../lib/db';
import { businesses, locations, categoryHierarchy } from '../lib/schema';
import { sql, eq, isNull } from 'drizzle-orm';

async function verifyData() {
    console.log('🔍 Verifying Vellore Directory Data...\n');

    try {
        // 1. Count total active businesses
        const totalBusinesses = await db
            .select({ count: sql<number>`count(*)` })
            .from(businesses)
            .where(eq(businesses.status, 'active'));

        console.log(`✅ Total Active Businesses: ${totalBusinesses[0].count}`);

        // 2. Count businesses by category
        const categoryCounts = await db
            .select({
                category: businesses.category,
                count: sql<number>`count(*)`
            })
            .from(businesses)
            .where(eq(businesses.status, 'active'))
            .groupBy(businesses.category)
            .orderBy(sql`count(*) DESC`)
            .limit(20);

        console.log(`\n📊 Top 20 Categories by Business Count:`);
        categoryCounts.forEach((cat, index) => {
            console.log(`${index + 1}. ${cat.category}: ${cat.count} businesses`);
        });

        // 3. Count total categories in hierarchy
        const totalCategories = await db
            .select({ count: sql<number>`count(*)` })
            .from(categoryHierarchy);

        const rootCategories = await db
            .select({ count: sql<number>`count(*)` })
            .from(categoryHierarchy)
            .where(isNull(categoryHierarchy.parentId));

        console.log(`\n📁 Category Hierarchy:`);
        console.log(`   Total Categories: ${totalCategories[0].count}`);
        console.log(`   Root Categories: ${rootCategories[0].count}`);
        console.log(`   Subcategories: ${totalCategories[0].count - rootCategories[0].count}`);

        // 4. Count total locations
        const totalLocations = await db
            .select({ count: sql<number>`count(*)` })
            .from(locations);

        console.log(`\n📍 Total Locations: ${totalLocations[0].count}`);

        // 5. Count businesses by location (top 10)
        const locationCounts = await db
            .select({
                pincode: businesses.pincode,
                count: sql<number>`count(*)`
            })
            .from(businesses)
            .where(eq(businesses.status, 'active'))
            .groupBy(businesses.pincode)
            .orderBy(sql`count(*) DESC`)
            .limit(10);

        console.log(`\n📍 Top 10 Locations by Business Count:`);
        locationCounts.forEach((loc, index) => {
            console.log(`${index + 1}. Pincode ${loc.pincode}: ${loc.count} businesses`);
        });

        // 6. Sample businesses to verify data quality
        const sampleBusinesses = await db
            .select()
            .from(businesses)
            .where(eq(businesses.status, 'active'))
            .limit(5);

        console.log(`\n🏢 Sample Businesses:`);
        sampleBusinesses.forEach((biz, index) => {
            console.log(`${index + 1}. ${biz.name} (${biz.category}) - ${biz.pincode || 'No pincode'}`);
        });

        // 7. Check for businesses without categories
        const uncategorized = await db
            .select({ count: sql<number>`count(*)` })
            .from(businesses)
            .where(sql`category IS NULL OR category = ''`);

        console.log(`\n⚠️  Businesses without category: ${uncategorized[0].count}`);

        // 8. Check for businesses without location
        const noLocation = await db
            .select({ count: sql<number>`count(*)` })
            .from(businesses)
            .where(sql`pincode IS NULL OR pincode = ''`);

        console.log(`⚠️  Businesses without pincode: ${noLocation[0].count}`);

        console.log('\n✅ Verification Complete!\n');

    } catch (error) {
        console.error('❌ Error during verification:', error);
        process.exit(1);
    }

    process.exit(0);
}

verifyData();
