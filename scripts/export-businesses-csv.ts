import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '../lib/db';
import { businesses, locations, categoryHierarchy } from '../lib/schema';
import { sql } from 'drizzle-orm';

async function exportToCSV() {
    console.log('📊 Exporting All Businesses to CSV...\n');

    // Fetch all businesses with location and category details
    const allBusinesses = await db
        .select({
            id: businesses.id,
            name: businesses.name,
            slug: businesses.slug,
            category: businesses.category,
            description: businesses.description,
            address: businesses.address,
            pincode: businesses.pincode,
            location: businesses.location,
            phone: businesses.phone,
            email: businesses.email,
            website: businesses.website,
            whatsappPhone: businesses.whatsappPhone,
            rating: businesses.rating,
            totalRatings: businesses.totalRatings,
            latitude: businesses.latitude,
            longitude: businesses.longitude,
            status: businesses.status,
            verified: businesses.verified,
            types: businesses.types,
            createdAt: businesses.createdAt,
        })
        .from(businesses)
        .orderBy(businesses.location, businesses.category, businesses.name);

    console.log(`Found ${allBusinesses.length} businesses\n`);

    // Create CSV header
    const headers = [
        'ID',
        'Business Name',
        'Slug',
        'Category',
        'Description',
        'Address',
        'Pincode',
        'Location',
        'Phone',
        'Email',
        'Website',
        'WhatsApp',
        'Rating',
        'Total Ratings',
        'Latitude',
        'Longitude',
        'Status',
        'Verified',
        'Google Types',
        'Created At',
    ];

    // Convert to CSV rows
    const csvRows = [headers.join(',')];

    for (const business of allBusinesses) {
        const row = [
            business.id,
            `"${(business.name || '').replace(/"/g, '""')}"`,
            business.slug || '',
            `"${(business.category || '').replace(/"/g, '""')}"`,
            `"${(business.description || '').replace(/"/g, '""')}"`,
            `"${(business.address || '').replace(/"/g, '""')}"`,
            business.pincode || '',
            `"${(business.location || '').replace(/"/g, '""')}"`,
            business.phone || '',
            business.email || '',
            business.website || '',
            business.whatsappPhone || '',
            business.rating || '',
            business.totalRatings || 0,
            business.latitude || '',
            business.longitude || '',
            business.status || '',
            business.verified || false,
            `"${(business.types || '').replace(/"/g, '""')}"`,
            business.createdAt?.toISOString() || '',
        ];
        csvRows.push(row.join(','));
    }

    // Write to file
    const csvContent = csvRows.join('\n');
    const filename = `vellore-businesses-${new Date().toISOString().split('T')[0]}.csv`;
    const filepath = path.join(process.cwd(), filename);

    fs.writeFileSync(filepath, csvContent, 'utf-8');

    console.log(`✅ CSV Export Complete!`);
    console.log(`📁 File: ${filename}`);
    console.log(`📍 Location: ${filepath}`);
    console.log(`📊 Total Records: ${allBusinesses.length}`);

    // Generate summary by location
    const locationStats = await db.execute(sql`
        SELECT 
            location,
            COUNT(*) as business_count,
            COUNT(CASE WHEN phone != 'N/A' THEN 1 END) as with_phone,
            AVG(CASE WHEN rating IS NOT NULL THEN CAST(rating AS DECIMAL) END) as avg_rating
        FROM businesses
        WHERE location IS NOT NULL
        GROUP BY location
        ORDER BY business_count DESC
        LIMIT 20
    `);

    console.log('\n📍 Top 20 Locations by Business Count:');
    console.log('─'.repeat(80));
    console.log('Location'.padEnd(30), 'Businesses'.padEnd(15), 'With Phone'.padEnd(15), 'Avg Rating');
    console.log('─'.repeat(80));

    for (const stat of locationStats.rows) {
        const loc = stat as any;
        console.log(
            (loc.location || 'Unknown').padEnd(30),
            String(loc.business_count).padEnd(15),
            String(loc.with_phone).padEnd(15),
            (loc.avg_rating ? Number(loc.avg_rating).toFixed(1) : 'N/A')
        );
    }

    process.exit(0);
}

exportToCSV().catch(err => {
    console.error('❌ Export failed:', err);
    process.exit(1);
});
