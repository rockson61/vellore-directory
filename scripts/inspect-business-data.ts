import { db } from '@/lib/db';
import { businesses, locations, categoryHierarchy } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function inspectBusiness(slug: string) {
    console.log(`Inspecting business: ${slug}`);

    const business = await db.query.businesses.findFirst({
        where: eq(businesses.slug, slug),
    });

    if (!business) {
        console.log('Business not found');
        return;
    }

    console.log('Business Data:', {
        name: business.name,
        category: business.category,
        pincode: business.pincode,
    });

    if (business.pincode) {
        const location = await db.query.locations.findFirst({
            where: eq(locations.pincode, business.pincode),
        });
        console.log('Location match:', location ? `Found: ${location.name} (${location.slug})` : 'Not Found');
    } else {
        console.log('Business has no pincode');
    }

    if (business.category) {
        const category = await db.query.categoryHierarchy.findFirst({
            where: eq(categoryHierarchy.name, business.category),
        });
        console.log('Category match:', category ? `Found: ${category.name} (${category.slug})` : 'Not Found');
    } else {
        console.log('Business has no category');
    }
}

const slug = process.argv[2];
if (!slug) {
    console.error('Please provide a slug');
    process.exit(1);
}

inspectBusiness(slug)
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
