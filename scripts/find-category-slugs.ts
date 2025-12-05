import { categoryHierarchy } from '@/lib/schema';
import { ilike, or } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const searchTerms = [
    'Beauty',
    'Gym',
    'Fitness',
    'Automotive',
    'Pet',
    'Home Services',
    'Electronics',
    'Clothing',
    'Fashion',
    'Bookstore',
    'Travel',
    'Event'
];

async function findCategorySlugs() {
    const { db } = await import('@/lib/db');

    console.log('🔍 Finding correct category slugs...\n');

    for (const term of searchTerms) {
        const results = await db
            .select({ name: categoryHierarchy.name, slug: categoryHierarchy.slug, level: categoryHierarchy.level })
            .from(categoryHierarchy)
            .where(ilike(categoryHierarchy.name, `%${term}%`))
            .limit(5);

        if (results.length > 0) {
            console.log(`\n📌 "${term}":`);
            console.table(results);
        }
    }
}

findCategorySlugs()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
