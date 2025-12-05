import { businesses } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

/**
 * Fix the business without a slug (ID: 2697)
 * Generate a slug from the business name
 */

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
        .trim();
}

async function fixBusinessSlug() {
    const { db } = await import('@/lib/db');

    console.log('🔧 Fixing business without slug...\n');

    // Get the business without slug
    const business = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, 2697))
        .limit(1);

    if (business.length === 0) {
        console.log('❌ Business ID 2697 not found');
        return;
    }

    const targetBusiness = business[0];
    console.log('Found business:');
    console.log(`  ID: ${targetBusiness.id}`);
    console.log(`  Name: ${targetBusiness.name}`);
    console.log(`  Current slug: ${targetBusiness.slug || 'NULL'}`);
    console.log(`  Category: ${targetBusiness.category}\n`);

    // Generate slug
    let slug = generateSlug(targetBusiness.name);

    // If slug is empty or invalid, use a fallback
    if (!slug || slug.length < 3) {
        slug = `business-${targetBusiness.id}`;
        console.log(`⚠️  Generated slug was too short, using fallback: ${slug}`);
    } else {
        console.log(`✨ Generated slug: ${slug}`);
    }

    // Check if slug already exists
    const existingBusiness = await db
        .select()
        .from(businesses)
        .where(eq(businesses.slug, slug))
        .limit(1);

    if (existingBusiness.length > 0 && existingBusiness[0].id !== targetBusiness.id) {
        // Slug exists, append ID
        slug = `${slug}-${targetBusiness.id}`;
        console.log(`⚠️  Slug already exists, using: ${slug}`);
    }

    // Update the business
    try {
        await db
            .update(businesses)
            .set({ slug })
            .where(eq(businesses.id, 2697));

        console.log(`\n✅ Successfully updated business ID 2697 with slug: ${slug}`);

        // Verify the update
        const updated = await db
            .select()
            .from(businesses)
            .where(eq(businesses.id, 2697))
            .limit(1);

        console.log('\nVerification:');
        console.log(`  Name: ${updated[0].name}`);
        console.log(`  Slug: ${updated[0].slug}`);
        console.log(`  URL: /business/${updated[0].slug}`);

    } catch (error: any) {
        console.error(`\n❌ Error updating business: ${error.message}`);
    }
}

fixBusinessSlug()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Error:', err);
        process.exit(1);
    });
