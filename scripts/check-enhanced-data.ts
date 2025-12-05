import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '../lib/db';
import { businesses } from '../lib/schema';
import { isNotNull, sql } from 'drizzle-orm';

async function checkEnhancedData() {
    console.log('🔍 Checking Enhanced Business Data...\n');

    // Check for businesses with opening hours
    const withHours = await db
        .select()
        .from(businesses)
        .where(isNotNull(businesses.openingHours))
        .limit(5);

    console.log(`✅ Businesses with opening hours: ${withHours.length}`);

    if (withHours.length > 0) {
        console.log('\n📋 Sample Opening Hours:');
        console.log('Business:', withHours[0].name);
        console.log(JSON.stringify(withHours[0].openingHours, null, 2));
    }

    // Check for businesses with photos
    const withPhotos = await db
        .select()
        .from(businesses)
        .where(isNotNull(businesses.images))
        .limit(5);

    console.log(`\n📸 Businesses with photos: ${withPhotos.length}`);

    if (withPhotos.length > 0) {
        console.log('\nSample Photos:');
        console.log('Business:', withPhotos[0].name);
        console.log('Photo count:', withPhotos[0].images?.length || 0);
        if (withPhotos[0].images && withPhotos[0].images.length > 0) {
            console.log('First photo URL:', withPhotos[0].images[0]);
        }
    }

    // Overall stats
    const stats = await db.execute(sql`
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN opening_hours IS NOT NULL THEN 1 END) as with_hours,
            COUNT(CASE WHEN images IS NOT NULL THEN 1 END) as with_images,
            COUNT(CASE WHEN phone != 'N/A' THEN 1 END) as with_phone
        FROM businesses
    `);

    const data = stats.rows[0] as any;

    console.log('\n📊 Overall Statistics:');
    console.log(`Total businesses: ${data.total}`);
    console.log(`With opening hours: ${data.with_hours} (${((data.with_hours / data.total) * 100).toFixed(1)}%)`);
    console.log(`With photos: ${data.with_images} (${((data.with_images / data.total) * 100).toFixed(1)}%)`);
    console.log(`With phone: ${data.with_phone} (${((data.with_phone / data.total) * 100).toFixed(1)}%)`);

    process.exit(0);
}

checkEnhancedData().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
