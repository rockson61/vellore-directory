import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

async function countSitemapUrls() {
    try {
        console.log('📊 Counting Sitemap URLs...\n');

        // Static pages
        const staticPages = 10;
        console.log('Static Pages: 10');
        console.log('  - Homepage, Search, Categories, Near Me, Appointments');
        console.log('  - Sitemap HTML, About, Contact, Privacy, Terms\n');

        // Categories
        const categories = await sql`SELECT * FROM category_hierarchy`;
        const level0 = categories.filter((c: any) => c.level === 0).length;
        const level1 = categories.filter((c: any) => c.level === 1).length;
        const level2 = categories.filter((c: any) => c.level === 2).length;

        console.log(`Categories: ${categories.length}`);
        console.log(`  - Level 0 (Top): ${level0}`);
        console.log(`  - Level 1 (Mid): ${level1}`);
        console.log(`  - Level 2 (Sub): ${level2}\n`);

        // Locations
        const locations = await sql`SELECT * FROM locations`;
        console.log(`Locations: ${locations.length}\n`);

        // Businesses with valid slugs
        const allBusinesses = await sql`
            SELECT 
                b.slug as business_slug,
                l.slug as location_slug,
                c.slug as category_slug
            FROM businesses b
            LEFT JOIN locations l ON b.pincode = l.pincode
            LEFT JOIN category_hierarchy c ON b.category = c.name
        `;

        const validBusinesses = allBusinesses.filter(
            (b: any) => b.business_slug && b.location_slug && b.category_slug
        );

        console.log(`Businesses:`);
        console.log(`  - Total in DB: ${allBusinesses.length}`);
        console.log(`  - Valid for sitemap: ${validBusinesses.length}`);
        console.log(`  - Missing data: ${allBusinesses.length - validBusinesses.length}\n`);

        // Total
        const total = staticPages + categories.length + locations.length + validBusinesses.length;

        console.log('═══════════════════════════════════════');
        console.log(`📍 TOTAL SITEMAP URLS: ${total.toLocaleString()}`);
        console.log('═══════════════════════════════════════\n');

        // Breakdown by priority
        console.log('Priority Distribution:');
        console.log(`  - Priority 1.0: 1 (Homepage)`);
        console.log(`  - Priority 0.9: ${3 + level0} (Main pages + Top categories)`);
        console.log(`  - Priority 0.8: ${2 + locations.length} (About, Contact + Locations)`);
        console.log(`  - Priority 0.7: ${level1 + validBusinesses.length} (Mid categories + Businesses)`);
        console.log(`  - Priority 0.6: ${level2} (Sub categories)`);
        console.log(`  - Priority 0.3-0.5: 3 (Privacy, Terms, Sitemap HTML)\n`);

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

countSitemapUrls()
    .then(() => {
        console.log('✅ Count completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Failed:', error);
        process.exit(1);
    });
