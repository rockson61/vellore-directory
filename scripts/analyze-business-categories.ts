import { businesses, categoryHierarchy } from '@/lib/schema';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function analyzeBusinessCategories() {
    const { db } = await import('@/lib/db');

    console.log('📊 Analyzing business categories...\n');

    // Get unique categories from businesses table
    const businessCategories = await db
        .selectDistinct({ category: businesses.category })
        .from(businesses)
        .where(sql`${businesses.category} IS NOT NULL`)
        .orderBy(businesses.category);

    console.log(`Found ${businessCategories.length} unique business categories:\n`);

    // Get all GMB categories
    const gmbCategories = await db
        .select({ id: categoryHierarchy.id, name: categoryHierarchy.name, slug: categoryHierarchy.slug })
        .from(categoryHierarchy)
        .orderBy(categoryHierarchy.name);

    // Count businesses per category
    const categoryCounts = await db
        .select({
            category: businesses.category,
            count: sql<number>`count(*)::int`
        })
        .from(businesses)
        .where(sql`${businesses.category} IS NOT NULL`)
        .groupBy(businesses.category)
        .orderBy(sql`count(*) DESC`);

    console.log('Top 20 business categories by count:');
    console.table(categoryCounts.slice(0, 20));

    // Check which business categories don't have exact matches in GMB
    const gmbCategoryNames = new Set(gmbCategories.map(c => c.name));
    const unmatchedCategories = businessCategories.filter(bc => !gmbCategoryNames.has(bc.category!));

    console.log(`\n❌ ${unmatchedCategories.length} business categories without exact GMB match:\n`);
    console.table(unmatchedCategories.slice(0, 30).map(c => ({ category: c.category })));
}

analyzeBusinessCategories()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
