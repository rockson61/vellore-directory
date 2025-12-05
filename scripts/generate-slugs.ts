import dotenv from 'dotenv';
import path from 'path';

// Load env vars before importing db
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '../lib/db';
import { businesses } from '../lib/schema';
import { eq, isNull } from 'drizzle-orm';

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

async function generateSlugs() {
    console.log('🚀 Generating slugs for businesses...');

    const allBusinesses = await db.select().from(businesses);

    let updatedCount = 0;

    for (const business of allBusinesses) {
        if (business.slug) continue;

        let slug = generateSlug(business.name);

        // Ensure uniqueness (simple check)
        const existing = await db.query.businesses.findFirst({
            where: eq(businesses.slug, slug),
        });

        if (existing) {
            slug = `${slug}-${business.id}`;
        }

        await db.update(businesses)
            .set({ slug })
            .where(eq(businesses.id, business.id));

        console.log(`✅ Updated ${business.name} -> ${slug}`);
        updatedCount++;
    }

    console.log(`\n✨ Done! Updated ${updatedCount} businesses.`);
}

generateSlugs().catch(console.error);
