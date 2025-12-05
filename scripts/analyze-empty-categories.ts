import { db } from '@/lib/db';
import { categoryHierarchy, businesses } from '@/lib/schema';
import { sql, eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

/**
 * Script to identify and optionally hide empty GMB categories
 */

async function analyzeEmptyCategories() {
    console.log('🔍 Analyzing empty GMB categories...\n');

    // Get all categories
    const allCategories = await db
        .select()
        .from(categoryHierarchy)
        .orderBy(categoryHierarchy.level, categoryHierarchy.name);

    console.log(`Total GMB categories: ${allCategories.length}\n`);

    // Get business counts per category
    const businessCounts = await db
        .select({
            category: businesses.category,
            count: sql<number>`count(*)::int`
        })
        .from(businesses)
        .groupBy(businesses.category);

    const categoryCountMap = new Map(
        businessCounts.map(bc => [bc.category, bc.count])
    );

    // Find empty categories
    const emptyCategories = allCategories.filter(cat =>
        !categoryCountMap.has(cat.name)
    );

    const categoriesWithBusinesses = allCategories.filter(cat =>
        categoryCountMap.has(cat.name)
    );

    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`Categories with businesses: ${categoriesWithBusinesses.length}`);
    console.log(`Empty categories: ${emptyCategories.length}\n`);

    // Show empty categories by level
    console.log('📋 EMPTY CATEGORIES BY LEVEL');
    console.log('='.repeat(50));

    const emptyByLevel = {
        0: emptyCategories.filter(c => c.level === 0),
        1: emptyCategories.filter(c => c.level === 1),
        2: emptyCategories.filter(c => c.level === 2),
    };

    console.log(`Level 0 (Root): ${emptyByLevel[0].length}`);
    console.log(`Level 1 (Main): ${emptyByLevel[1].length}`);
    console.log(`Level 2 (Sub): ${emptyByLevel[2].length}\n`);

    // Show sample empty categories
    console.log('📝 SAMPLE EMPTY CATEGORIES (First 20)');
    console.log('='.repeat(50));
    console.table(emptyCategories.slice(0, 20).map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        level: c.level
    })));

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS');
    console.log('='.repeat(50));
    console.log('1. Filter empty categories in category listing pages');
    console.log('2. Only show categories with businessCount > 0');
    console.log('3. Keep all categories in database for future use');
    console.log('4. Update CategoryGrid to filter client-side or server-side\n');

    console.log('✨ Analysis complete!\n');
}

analyzeEmptyCategories()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Error:', err);
        process.exit(1);
    });
