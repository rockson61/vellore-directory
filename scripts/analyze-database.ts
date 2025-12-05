import dotenv from 'dotenv';
import path from 'path';

// Load environment variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '../lib/db';
import { businesses, locations, categoryHierarchy } from '../lib/schema';
import { sql, count, eq } from 'drizzle-orm';


interface DuplicateReport {
    duplicateBusinesses: any[];
    duplicateLocations: any[];
    duplicateCategories: any[];
    emptyCategoriesCount: number;
    emptyCategories: any[];
    totalBusinesses: number;
    totalLocations: number;
    totalCategories: number;
}

async function analyzeDuplicates(): Promise<DuplicateReport> {
    console.log('🔍 Starting database analysis...\n');

    // 1. Find duplicate businesses (by name and address)
    console.log('📊 Analyzing businesses for duplicates...');
    const duplicateBusinesses = await db.execute(sql`
        SELECT name, address, COUNT(*) as count, 
               STRING_AGG(id::text, ', ') as ids
        FROM businesses
        WHERE name IS NOT NULL AND address IS NOT NULL
        GROUP BY name, address
        HAVING COUNT(*) > 1
        ORDER BY count DESC
        LIMIT 50
    `);


    // 2. Find duplicate locations (by name or slug)
    console.log('📍 Analyzing locations for duplicates...');
    const duplicateLocations = await db.execute(sql`
        SELECT name, slug, pincode, COUNT(*) as count,
               STRING_AGG(id::text, ', ') as ids
        FROM locations
        GROUP BY name, slug, pincode
        HAVING COUNT(*) > 1
        ORDER BY count DESC
    `);

    // 3. Find duplicate categories (by name or slug)
    console.log('🏷️  Analyzing categories for duplicates...');
    const duplicateCategories = await db.execute(sql`
        SELECT name, slug, COUNT(*) as count,
               STRING_AGG(id::text, ', ') as ids
        FROM category_hierarchy
        GROUP BY name, slug
        HAVING COUNT(*) > 1
        ORDER BY count DESC
    `);

    // 4. Find categories with zero businesses
    console.log('📉 Finding categories with no listings...');
    const emptyCategories = await db.execute(sql`
        SELECT 
            ch.id,
            ch.name,
            ch.slug,
            ch.level,
            COUNT(b.id) as business_count
        FROM category_hierarchy ch
        LEFT JOIN businesses b ON b.category = ch.name
        GROUP BY ch.id, ch.name, ch.slug, ch.level
        HAVING COUNT(b.id) = 0
        ORDER BY ch.name
    `);

    // 5. Get total counts
    const [businessCount] = await db.select({ count: count() }).from(businesses);
    const [locationCount] = await db.select({ count: count() }).from(locations);
    const [categoryCount] = await db.select({ count: count() }).from(categoryHierarchy);

    return {
        duplicateBusinesses: duplicateBusinesses.rows,
        duplicateLocations: duplicateLocations.rows,
        duplicateCategories: duplicateCategories.rows,
        emptyCategoriesCount: emptyCategories.rows.length,
        emptyCategories: emptyCategories.rows,
        totalBusinesses: businessCount.count,
        totalLocations: locationCount.count,
        totalCategories: categoryCount.count,
    };
}

async function generateReport() {
    try {
        const report = await analyzeDuplicates();

        console.log('\n' + '='.repeat(80));
        console.log('📋 DATABASE ANALYSIS REPORT');
        console.log('='.repeat(80) + '\n');

        console.log('📊 CURRENT DATABASE STATS:');
        console.log(`   Total Businesses: ${report.totalBusinesses}`);
        console.log(`   Total Locations: ${report.totalLocations}`);
        console.log(`   Total Categories: ${report.totalCategories}\n`);

        console.log('🔍 DUPLICATE ANALYSIS:\n');

        console.log(`🏢 Duplicate Businesses: ${report.duplicateBusinesses.length} groups found`);
        if (report.duplicateBusinesses.length > 0) {
            console.log('   Top duplicates:');
            report.duplicateBusinesses.slice(0, 10).forEach((dup: any) => {
                console.log(`   - "${dup.name}" at "${dup.address}" (${dup.count} copies, IDs: ${dup.ids})`);
            });
        }

        console.log(`\n📍 Duplicate Locations: ${report.duplicateLocations.length} groups found`);
        if (report.duplicateLocations.length > 0) {
            console.log('   Duplicates:');
            report.duplicateLocations.forEach((dup: any) => {
                console.log(`   - "${dup.name}" (${dup.pincode}) - ${dup.count} copies, IDs: ${dup.ids}`);
            });
        }

        console.log(`\n🏷️  Duplicate Categories: ${report.duplicateCategories.length} groups found`);
        if (report.duplicateCategories.length > 0) {
            console.log('   Duplicates:');
            report.duplicateCategories.forEach((dup: any) => {
                console.log(`   - "${dup.name}" (${dup.slug}) - ${dup.count} copies, IDs: ${dup.ids}`);
            });
        }

        console.log(`\n📉 Empty Categories: ${report.emptyCategoriesCount} categories with 0 businesses`);
        if (report.emptyCategoriesCount > 0) {
            console.log('   Sample empty categories (first 20):');
            report.emptyCategories.slice(0, 20).forEach((cat: any) => {
                console.log(`   - "${cat.name}" (Level ${cat.level}, ID: ${cat.id})`);
            });
            console.log(`   ... and ${Math.max(0, report.emptyCategoriesCount - 20)} more`);
        }

        console.log('\n' + '='.repeat(80));
        console.log('💡 RECOMMENDATIONS:');
        console.log('='.repeat(80));

        if (report.duplicateBusinesses.length > 0) {
            console.log(`\n✓ Remove ${report.duplicateBusinesses.length} duplicate business groups`);
        }
        if (report.duplicateLocations.length > 0) {
            console.log(`✓ Remove ${report.duplicateLocations.length} duplicate location groups`);
        }
        if (report.duplicateCategories.length > 0) {
            console.log(`✓ Remove ${report.duplicateCategories.length} duplicate category groups`);
        }
        if (report.emptyCategoriesCount > 0) {
            console.log(`✓ Consider removing ${report.emptyCategoriesCount} empty categories`);
        }

        console.log('\n📁 Saving detailed report to file...');

        // Save detailed report to JSON
        const fs = require('fs');
        const reportPath = path.join(process.cwd(), 'database-analysis-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`✅ Report saved to: ${reportPath}\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error analyzing database:', error);
        process.exit(1);
    }
}

generateReport();
