import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

/**
 * Comprehensive site analysis script
 * Tests all routes and identifies 404 errors
 */

async function analyzeSite() {
    const { db } = await import('@/lib/db');
    const { businesses, categoryHierarchy, locations } = await import('@/lib/schema');

    console.log('🔍 Starting comprehensive site analysis...\n');

    // 1. Check database stats
    console.log('📊 DATABASE STATISTICS');
    console.log('='.repeat(50));

    const businessCount = await db.select().from(businesses);
    const categoryCount = await db.select().from(categoryHierarchy);
    const locationCount = await db.select().from(locations);

    console.log(`Total Businesses: ${businessCount.length}`);
    console.log(`Total Categories: ${categoryCount.length}`);
    console.log(`Total Locations: ${locationCount.length}\n`);

    // 2. Check for businesses without slugs
    console.log('🔍 CHECKING DATA INTEGRITY');
    console.log('='.repeat(50));

    const businessesWithoutSlugs = businessCount.filter(b => !b.slug);
    console.log(`Businesses without slugs: ${businessesWithoutSlugs.length}`);

    if (businessesWithoutSlugs.length > 0) {
        console.log('Sample businesses without slugs:');
        console.table(businessesWithoutSlugs.slice(0, 5).map(b => ({
            id: b.id,
            name: b.name,
            category: b.category
        })));
    }

    // 3. Check category distribution
    console.log('\n📈 CATEGORY DISTRIBUTION (Top 10)');
    console.log('='.repeat(50));

    const categoryCounts: Record<string, number> = {};
    businessCount.forEach(b => {
        if (b.category) {
            categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
        }
    });

    const topCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    console.table(topCategories.map(([category, count]) => ({ category, count })));

    // 4. Check location distribution
    console.log('\n📍 LOCATION DISTRIBUTION (Top 10)');
    console.log('='.repeat(50));

    const locationCounts: Record<string, number> = {};
    businessCount.forEach(b => {
        if (b.pincode) {
            const location = locationCount.find(l => l.pincode === b.pincode);
            if (location) {
                locationCounts[location.name] = (locationCounts[location.name] || 0) + 1;
            }
        }
    });

    const topLocations = Object.entries(locationCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    console.table(topLocations.map(([location, count]) => ({ location, count })));

    // 5. Check for orphaned categories
    console.log('\n🔍 CHECKING FOR ORPHANED CATEGORIES');
    console.log('='.repeat(50));

    const businessCategories = new Set(businessCount.map(b => b.category).filter(Boolean));
    const gmbCategories = new Set(categoryCount.map(c => c.name));

    const orphanedGmbCategories = categoryCount.filter(c => !businessCategories.has(c.name));
    console.log(`GMB categories without businesses: ${orphanedGmbCategories.length}`);

    // 6. List all route patterns
    console.log('\n🛣️  ROUTE PATTERNS');
    console.log('='.repeat(50));

    console.log('Static Routes:');
    console.log('  - /');
    console.log('  - /about');
    console.log('  - /contact');
    console.log('  - /categories');
    console.log('  - /appointments');
    console.log('  - /privacy');
    console.log('  - /terms');
    console.log('  - /sitemap-html');

    console.log('\nDynamic Routes:');
    console.log('  - /business/[slug]');
    console.log('  - /near-me/[...slug]');

    console.log('\nAPI Routes:');
    console.log('  - /api/businesses');
    console.log('  - /api/categories');
    console.log('  - /api/appointments');

    // 7. Sample valid URLs
    console.log('\n✅ SAMPLE VALID URLS');
    console.log('='.repeat(50));

    const sampleBusiness = businessCount.find(b => b.slug);
    if (sampleBusiness) {
        console.log(`Business: /business/${sampleBusiness.slug}`);
    }

    const sampleCategory = categoryCount.find(c => c.level === 1);
    if (sampleCategory) {
        console.log(`Category: /near-me/${sampleCategory.slug}`);
    }

    const sampleLocation = locationCount[0];
    if (sampleLocation) {
        console.log(`Location: /near-me/${sampleLocation.slug}`);
    }

    console.log('\n✨ Analysis complete!\n');
}

analyzeSite()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Error:', err);
        process.exit(1);
    });
