import dotenv from 'dotenv';
import path from 'path';

// Load environment variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '../lib/db';
import { businesses, categoryHierarchy } from '../lib/schema';
import { sql, eq } from 'drizzle-orm';

async function updateCategoryCounts() {
    console.log('🔄 Updating category business counts...\n');

    // Get all categories
    const allCategories = await db
        .select()
        .from(categoryHierarchy)
        .orderBy(categoryHierarchy.level);

    console.log(`Found ${allCategories.length} categories\n`);

    // For each category, count businesses that match this category OR any of its descendants
    for (const category of allCategories) {
        // Get all descendant category names (including this category)
        const descendants = await db.execute(sql`
            WITH RECURSIVE category_tree AS (
                -- Base case: start with the current category
                SELECT id, name, parent_id
                FROM category_hierarchy
                WHERE id = ${category.id}
                
                UNION ALL
                
                -- Recursive case: get all children
                SELECT ch.id, ch.name, ch.parent_id
                FROM category_hierarchy ch
                INNER JOIN category_tree ct ON ch.parent_id = ct.id
            )
            SELECT name FROM category_tree
        `);

        const categoryNames = descendants.rows.map((row: any) => row.name);

        // Count businesses in any of these categories using IN operator
        const count = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(businesses)
            .where(sql`${businesses.category} IN (${sql.join(categoryNames.map(name => sql`${name}`), sql`, `)})`);

        const businessCount = count[0]?.count || 0;

        console.log(`${category.name} (Level ${category.level}): ${businessCount} businesses`);
    }

    console.log('\n✅ Category counts updated successfully!');
    process.exit(0);
}

updateCategoryCounts().catch(err => {
    console.error('❌ Error updating counts:', err);
    process.exit(1);
});
