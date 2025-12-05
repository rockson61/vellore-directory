import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '../lib/db';
import { businesses } from '../lib/schema';
import { sql } from 'drizzle-orm';

async function analyzeData() {
    console.log('📊 Analyzing Business Data Quality...\n');

    const stats = await db.execute(sql`
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN phone != 'N/A' AND phone IS NOT NULL THEN 1 END) as with_phone,
            COUNT(CASE WHEN phone = 'N/A' OR phone IS NULL THEN 1 END) as without_phone,
            COUNT(CASE WHEN website IS NOT NULL THEN 1 END) as with_website,
            COUNT(CASE WHEN website IS NULL THEN 1 END) as without_website,
            COUNT(CASE WHEN opening_hours IS NOT NULL THEN 1 END) as with_hours,
            COUNT(CASE WHEN opening_hours IS NULL THEN 1 END) as without_hours,
            COUNT(CASE WHEN images IS NOT NULL THEN 1 END) as with_images,
            COUNT(CASE WHEN images IS NULL THEN 1 END) as without_images
        FROM businesses
    `);

    const data = stats.rows[0] as any;

    console.log('Total Businesses:', data.total);
    console.log('\n📞 Phone Numbers:');
    console.log(`  With phone: ${data.with_phone} (${((data.with_phone / data.total) * 100).toFixed(1)}%)`);
    console.log(`  Without phone: ${data.without_phone} (${((data.without_phone / data.total) * 100).toFixed(1)}%)`);

    console.log('\n🌐 Websites:');
    console.log(`  With website: ${data.with_website} (${((data.with_website / data.total) * 100).toFixed(1)}%)`);
    console.log(`  Without website: ${data.without_website} (${((data.without_website / data.total) * 100).toFixed(1)}%)`);

    console.log('\n🕐 Opening Hours:');
    console.log(`  With hours: ${data.with_hours} (${((data.with_hours / data.total) * 100).toFixed(1)}%)`);
    console.log(`  Without hours: ${data.without_hours} (${((data.without_hours / data.total) * 100).toFixed(1)}%)`);

    console.log('\n📸 Images:');
    console.log(`  With images: ${data.with_images} (${((data.with_images / data.total) * 100).toFixed(1)}%)`);
    console.log(`  Without images: ${data.without_images} (${((data.without_images / data.total) * 100).toFixed(1)}%)`);

    process.exit(0);
}

analyzeData().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
