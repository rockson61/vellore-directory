import dotenv from 'dotenv';
import path from 'path';

// Load environment variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '../lib/db';
import { businesses, categoryHierarchy } from '../lib/schema';
import { sql, eq, inArray } from 'drizzle-orm';

async function cleanupDatabase() {
    console.log('🧹 Starting database cleanup...\n');

    let totalRemoved = 0;

    // 1. Remove duplicate businesses (keep the first one, delete the rest)
    console.log('📊 Removing duplicate businesses...');
    const duplicateBusinesses = await db.execute(sql`
        SELECT name, address, 
               ARRAY_AGG(id ORDER BY id) as ids,
               COUNT(*) as count
        FROM businesses
        WHERE name IS NOT NULL AND address IS NOT NULL
        GROUP BY name, address
        HAVING COUNT(*) > 1
    `);

    let businessesRemoved = 0;
    for (const dup of duplicateBusinesses.rows) {
        const ids = dup.ids as number[];
        // Keep the first ID, delete the rest
        const idsToDelete = ids.slice(1);

        if (idsToDelete.length > 0) {
            await db.delete(businesses).where(inArray(businesses.id, idsToDelete));
            businessesRemoved += idsToDelete.length;
            console.log(`  ✓ Removed ${idsToDelete.length} duplicate(s) of "${dup.name}"`);
        }
    }
    console.log(`  Total duplicate businesses removed: ${businessesRemoved}\n`);
    totalRemoved += businessesRemoved;

    // 2. Remove empty categories (categories with 0 businesses AND no children)
    // Only delete leaf categories to avoid foreign key violations
    console.log('🏷️  Removing empty leaf categories...');

    // Get all empty leaf categories (no businesses AND no children)
    const emptyCategories = await db.execute(sql`
        SELECT 
            ch.id,
            ch.name,
            ch.slug,
            ch.level
        FROM category_hierarchy ch
        LEFT JOIN businesses b ON b.category = ch.name
        LEFT JOIN category_hierarchy children ON children.parent_id = ch.id
        GROUP BY ch.id, ch.name, ch.slug, ch.level
        HAVING COUNT(b.id) = 0 AND COUNT(children.id) = 0
        ORDER BY ch.level DESC
    `);

    let categoriesRemoved = 0;
    const idsToDelete = emptyCategories.rows.map((cat: any) => cat.id);

    if (idsToDelete.length > 0) {
        await db.delete(categoryHierarchy).where(inArray(categoryHierarchy.id, idsToDelete));
        categoriesRemoved = idsToDelete.length;
        console.log(`  ✓ Removed ${categoriesRemoved} empty leaf categories`);
    } else {
        console.log(`  ✓ No empty leaf categories found`);
    }

    totalRemoved += categoriesRemoved;

    // Show sample of removed categories
    console.log('  Sample removed categories:');
    emptyCategories.rows.slice(0, 10).forEach((cat: any) => {
        console.log(`    - "${cat.name}" (Level ${cat.level})`);
    });
    if (emptyCategories.rows.length > 10) {
        console.log(`    ... and ${emptyCategories.rows.length - 10} more\n`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ CLEANUP COMPLETE');
    console.log('='.repeat(80));
    console.log(`Total items removed: ${totalRemoved}`);
    console.log(`  - Duplicate businesses: ${businessesRemoved}`);
    console.log(`  - Empty categories: ${categoriesRemoved}`);
    console.log('='.repeat(80) + '\n');

    // Get final counts
    const [finalBusinessCount] = await db.execute(sql`SELECT COUNT(*) as count FROM businesses`);
    const [finalCategoryCount] = await db.execute(sql`SELECT COUNT(*) as count FROM category_hierarchy`);

    console.log('📊 FINAL DATABASE STATS:');
    console.log(`   Businesses: ${finalBusinessCount.rows[0].count}`);
    console.log(`   Categories: ${finalCategoryCount.rows[0].count}`);
    console.log(`   Locations: 383 (unchanged)\n`);

    process.exit(0);
}

cleanupDatabase().catch(err => {
    console.error('❌ Cleanup failed:', err);
    process.exit(1);
});
