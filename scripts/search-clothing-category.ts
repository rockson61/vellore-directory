import { categoryHierarchy } from '@/lib/schema';
import { like, or, ilike } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function searchCategory() {
    const { db } = await import('@/lib/db');

    console.log('🔍 Searching for clothing-related categories...\n');

    const results = await db
        .select()
        .from(categoryHierarchy)
        .where(
            or(
                like(categoryHierarchy.slug, '%clothing%'),
                ilike(categoryHierarchy.name, '%clothing%'),
                like(categoryHierarchy.slug, '%fashion%'),
                ilike(categoryHierarchy.name, '%fashion%')
            )
        )
        .limit(20);

    console.log('Found categories:');
    console.table(results.map(r => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        level: r.level,
        parentId: r.parentId
    })));
}

searchCategory()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
