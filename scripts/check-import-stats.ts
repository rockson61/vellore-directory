import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '../lib/db';
import { businesses } from '../lib/schema';
import { sql } from 'drizzle-orm';

async function checkBusinessStats() {
    console.log('📊 Business Import Statistics\n');

    // Total count
    const totalResult = await db.select({ count: sql<number>`count(*)::int` }).from(businesses);
    const total = totalResult[0].count;
    console.log(`✅ Total Businesses Imported: ${total}\n`);

    // By category
    console.log('📋 Businesses by Category:');
    const byCategory = await db
        .select({
            category: businesses.category,
            count: sql<number>`count(*)::int`,
        })
        .from(businesses)
        .groupBy(businesses.category)
        .orderBy(sql`count(*) DESC`);

    byCategory.forEach(cat => {
        console.log(`   ${cat.category}: ${cat.count} businesses`);
    });

    console.log('\n📍 Businesses by Pincode (Top 10):');
    const byPincode = await db
        .select({
            pincode: businesses.pincode,
            count: sql<number>`count(*)::int`,
        })
        .from(businesses)
        .groupBy(businesses.pincode)
        .orderBy(sql`count(*) DESC`)
        .limit(10);

    byPincode.forEach(pin => {
        console.log(`   ${pin.pincode || 'Unknown'}: ${pin.count} businesses`);
    });

    console.log('\n⭐ Average Rating:');
    const avgRating = await db
        .select({
            avgRating: sql<number>`AVG(CAST(rating AS FLOAT))`,
        })
        .from(businesses)
        .where(sql`rating IS NOT NULL`);

    console.log(`   ${avgRating[0].avgRating?.toFixed(2) || 'N/A'} stars`);
}

checkBusinessStats().catch(console.error);
