import { db } from '@/lib/db';
import { businesses } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkSlug() {
    const slug = 'signature-by-darling';
    console.log(`Checking for slug: ${slug}`);

    const business = await db.query.businesses.findFirst({
        where: eq(businesses.slug, slug),
    });

    if (business) {
        console.log('✅ Business found:', business.name);
        console.log('Slug:', business.slug);
    } else {
        console.log('❌ Business NOT found');
    }

    process.exit(0);
}

checkSlug();
