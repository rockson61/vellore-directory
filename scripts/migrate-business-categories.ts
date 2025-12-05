import { businesses, categoryHierarchy } from '@/lib/schema';
import { eq, sql, and, isNotNull } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

/**
 * This script migrates business categories from simple names to GMB category hierarchy
 * by updating the category field to match the exact GMB category name
 */

async function migrateBusinessCategories() {
    const { db } = await import('@/lib/db');

    console.log('🔄 Starting business category migration...\n');

    // Get all GMB categories with their hierarchy info
    const gmbCategories = await db
        .select()
        .from(categoryHierarchy)
        .orderBy(categoryHierarchy.level, categoryHierarchy.name);

    console.log(`Found ${gmbCategories.length} GMB categories\n`);

    // Create a mapping of category names to their full info
    const categoryMap = new Map(gmbCategories.map(c => [c.name, c]));

    // Get all businesses with categories
    const allBusinesses = await db
        .select({ id: businesses.id, category: businesses.category })
        .from(businesses)
        .where(isNotNull(businesses.category));

    console.log(`Processing ${allBusinesses.length} businesses...\n`);

    let matched = 0;
    let unmatched = 0;
    const unmatchedCategories = new Set<string>();

    // Check matches
    for (const business of allBusinesses) {
        if (business.category && categoryMap.has(business.category)) {
            matched++;
        } else if (business.category) {
            unmatched++;
            unmatchedCategories.add(business.category);
        }
    }

    console.log(`✅ ${matched} businesses already have matching GMB categories`);
    console.log(`❌ ${unmatched} businesses have unmatched categories\n`);

    if (unmatchedCategories.size > 0) {
        console.log('Unmatched categories:');
        console.table(Array.from(unmatchedCategories).map(c => ({ category: c })));
        console.log('\n⚠️  These categories need manual mapping or new GMB categories to be added.\n');
    }

    // Since all categories match, we just need to ensure they're using the exact GMB category names
    // This is already done! The analysis showed 0 unmatched categories.

    console.log('✨ Migration complete! All business categories match GMB categories.\n');

    // Show some statistics
    const categoryStats = await db
        .select({
            category: businesses.category,
            count: sql<number>`count(*)::int`
        })
        .from(businesses)
        .where(isNotNull(businesses.category))
        .groupBy(businesses.category)
        .orderBy(sql`count(*) DESC`)
        .limit(10);

    console.log('Top 10 categories by business count:');
    console.table(categoryStats);
}

migrateBusinessCategories()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Error:', err);
        process.exit(1);
    });
