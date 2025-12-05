import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '../lib/db';
import { businesses, categoryHierarchy, locations } from '../lib/schema';
import { sql, isNull, isNotNull } from 'drizzle-orm';

async function verifyDataQuality() {
    console.log('🔍 Data Quality & Completeness Check\n');
    console.log('='.repeat(60));

    // 1. Total businesses
    const totalResult = await db.select({ count: sql<number>`count(*)::int` }).from(businesses);
    const total = totalResult[0].count;
    console.log(`\n📊 TOTAL BUSINESSES: ${total}`);

    // 2. Required fields completeness
    console.log('\n📋 REQUIRED FIELDS COMPLETENESS:');

    const withName = await db.select({ count: sql<number>`count(*)::int` }).from(businesses).where(isNotNull(businesses.name));
    console.log(`   ✅ Name: ${withName[0].count}/${total} (${((withName[0].count / total) * 100).toFixed(1)}%)`);

    const withSlug = await db.select({ count: sql<number>`count(*)::int` }).from(businesses).where(isNotNull(businesses.slug));
    console.log(`   ✅ Slug: ${withSlug[0].count}/${total} (${((withSlug[0].count / total) * 100).toFixed(1)}%)`);

    const withAddress = await db.select({ count: sql<number>`count(*)::int` }).from(businesses).where(isNotNull(businesses.address));
    console.log(`   ✅ Address: ${withAddress[0].count}/${total} (${((withAddress[0].count / total) * 100).toFixed(1)}%)`);

    const withCategory = await db.select({ count: sql<number>`count(*)::int` }).from(businesses).where(isNotNull(businesses.category));
    console.log(`   ✅ Category: ${withCategory[0].count}/${total} (${((withCategory[0].count / total) * 100).toFixed(1)}%)`);

    // 3. Optional but important fields
    console.log('\n📞 OPTIONAL FIELDS COMPLETENESS:');

    const withPhone = await db.select({ count: sql<number>`count(*)::int` }).from(businesses).where(sql`phone IS NOT NULL AND phone != 'N/A'`);
    console.log(`   📱 Phone: ${withPhone[0].count}/${total} (${((withPhone[0].count / total) * 100).toFixed(1)}%)`);

    const withWebsite = await db.select({ count: sql<number>`count(*)::int` }).from(businesses).where(isNotNull(businesses.website));
    console.log(`   🌐 Website: ${withWebsite[0].count}/${total} (${((withWebsite[0].count / total) * 100).toFixed(1)}%)`);

    const withRating = await db.select({ count: sql<number>`count(*)::int` }).from(businesses).where(isNotNull(businesses.rating));
    console.log(`   ⭐ Rating: ${withRating[0].count}/${total} (${((withRating[0].count / total) * 100).toFixed(1)}%)`);

    const withCoordinates = await db.select({ count: sql<number>`count(*)::int` }).from(businesses).where(sql`latitude IS NOT NULL AND longitude IS NOT NULL`);
    console.log(`   📍 Coordinates: ${withCoordinates[0].count}/${total} (${((withCoordinates[0].count / total) * 100).toFixed(1)}%)`);

    const withPincode = await db.select({ count: sql<number>`count(*)::int` }).from(businesses).where(isNotNull(businesses.pincode));
    console.log(`   📮 Pincode: ${withPincode[0].count}/${total} (${((withPincode[0].count / total) * 100).toFixed(1)}%)`);

    const withDescription = await db.select({ count: sql<number>`count(*)::int` }).from(businesses).where(isNotNull(businesses.description));
    console.log(`   📝 Description: ${withDescription[0].count}/${total} (${((withDescription[0].count / total) * 100).toFixed(1)}%)`);

    // 4. Data quality issues
    console.log('\n⚠️  POTENTIAL DATA QUALITY ISSUES:');

    const duplicateSlugs = await db.execute(sql`
        SELECT slug, COUNT(*) as count 
        FROM businesses 
        GROUP BY slug 
        HAVING COUNT(*) > 1
    `);
    console.log(`   🔄 Duplicate slugs: ${duplicateSlugs.rows.length}`);

    const missingPincode = await db.select({ count: sql<number>`count(*)::int` }).from(businesses).where(isNull(businesses.pincode));
    console.log(`   📮 Missing pincode: ${missingPincode[0].count}`);

    const noPhone = await db.select({ count: sql<number>`count(*)::int` }).from(businesses).where(sql`phone IS NULL OR phone = 'N/A'`);
    console.log(`   📱 No phone number: ${noPhone[0].count}`);

    // 5. Category mapping check
    console.log('\n🏷️  CATEGORY MAPPING:');

    const totalCategories = await db.select({ count: sql<number>`count(*)::int` }).from(categoryHierarchy);
    console.log(`   Total categories in hierarchy: ${totalCategories[0].count}`);

    const categoriesWithBusinesses = await db.execute(sql`
        SELECT COUNT(DISTINCT category) as count
        FROM businesses
        WHERE category IS NOT NULL
    `);
    console.log(`   Categories with businesses: ${categoriesWithBusinesses.rows[0].count}`);

    const unmappedCategories = await db.execute(sql`
        SELECT DISTINCT b.category
        FROM businesses b
        LEFT JOIN category_hierarchy ch ON b.category = ch.name
        WHERE ch.id IS NULL AND b.category IS NOT NULL
        LIMIT 10
    `);
    if (unmappedCategories.rows.length > 0) {
        console.log(`   ⚠️  Unmapped categories (sample):`);
        unmappedCategories.rows.forEach((row: any) => {
            console.log(`      - ${row.category}`);
        });
    } else {
        console.log(`   ✅ All categories mapped to hierarchy`);
    }

    // 6. Location mapping check
    console.log('\n📍 LOCATION MAPPING:');

    const totalLocations = await db.select({ count: sql<number>`count(*)::int` }).from(locations);
    console.log(`   Total locations in database: ${totalLocations[0].count}`);

    const businessesWithLocation = await db.execute(sql`
        SELECT COUNT(*) as count
        FROM businesses b
        INNER JOIN locations l ON b.pincode = l.pincode
    `);
    console.log(`   Businesses mapped to locations: ${businessesWithLocation.rows[0].count}/${total} (${((Number(businessesWithLocation.rows[0].count) / total) * 100).toFixed(1)}%)`);

    // 7. Rating distribution
    console.log('\n⭐ RATING DISTRIBUTION:');
    const ratingDist = await db.execute(sql`
        SELECT 
            FLOOR(CAST(rating AS FLOAT)) as rating_floor,
            COUNT(*) as count
        FROM businesses
        WHERE rating IS NOT NULL
        GROUP BY FLOOR(CAST(rating AS FLOAT))
        ORDER BY rating_floor DESC
    `);
    ratingDist.rows.forEach((row: any) => {
        const stars = '★'.repeat(Number(row.rating_floor)) + '☆'.repeat(5 - Number(row.rating_floor));
        console.log(`   ${stars} (${row.rating_floor}+): ${row.count} businesses`);
    });

    // 8. Top 5 most common business types
    console.log('\n🏢 TOP 5 BUSINESS TYPES:');
    const topTypes = await db.execute(sql`
        SELECT category, COUNT(*) as count
        FROM businesses
        GROUP BY category
        ORDER BY count DESC
        LIMIT 5
    `);
    topTypes.rows.forEach((row: any, index: number) => {
        console.log(`   ${index + 1}. ${row.category}: ${row.count} businesses`);
    });

    // 9. Overall data quality score
    console.log('\n📊 OVERALL DATA QUALITY SCORE:');
    const requiredScore = ((withName[0].count + withSlug[0].count + withAddress[0].count + withCategory[0].count) / (total * 4)) * 100;
    const optionalScore = ((withPhone[0].count + withRating[0].count + withCoordinates[0].count + withPincode[0].count) / (total * 4)) * 100;
    const overallScore = (requiredScore * 0.7 + optionalScore * 0.3);

    console.log(`   Required fields: ${requiredScore.toFixed(1)}%`);
    console.log(`   Optional fields: ${optionalScore.toFixed(1)}%`);
    console.log(`   Overall score: ${overallScore.toFixed(1)}%`);

    if (overallScore >= 90) {
        console.log(`   ✅ EXCELLENT - Data quality is very high!`);
    } else if (overallScore >= 75) {
        console.log(`   ✓ GOOD - Data quality is acceptable`);
    } else if (overallScore >= 60) {
        console.log(`   ⚠️  FAIR - Some improvements needed`);
    } else {
        console.log(`   ❌ POOR - Significant improvements needed`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Data quality check complete!\n');
}

verifyDataQuality().catch(console.error);
