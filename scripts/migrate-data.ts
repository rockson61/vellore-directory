import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

interface Business {
    id: string;
    name: string;
    category: string;
    address: string;
    phone?: string;
    whatsappPhone?: string;
    location?: { lat: number; lng: number };
    rating?: number;
    totalRatings?: number;
    types?: string[];
    website?: string;
    openingHours?: string[];
    pincode?: string;
}

const categoryIcons: Record<string, string> = {
    'Restaurants': '🍽️',
    'Cafes': '☕',
    'Hospitals': '🏥',
    'Clinics': '⚕️',
    'Pharmacies': '💊',
    'Shopping': '🛍️',
    'Retail Stores': '🏪',
    'Schools': '🎓',
    'Colleges': '🏫',
    'Banks': '🏦',
    'ATMs': '🏧',
    'Petrol Pumps': '⛽',
    'Auto Services': '🔧',
    'Salons': '💇',
    'Spas': '💆',
    'Gyms': '💪',
    'Hotels': '🏨',
    'Bakeries': '🥐',
    'Electronics': '📱',
    'Supermarkets': '🛒',
    'Clothing': '👕',
    'Jewellery': '💍',
    'Temples': '🛕',
    'Churches': '⛪',
    'Mosques': '🕌'
};

const categoryColors: Record<string, string> = {
    'Restaurants': '#FFE5E5',
    'Cafes': '#FFF0E5',
    'Hospitals': '#E0F4E8',
    'Clinics': '#E5F4FF',
    'Pharmacies': '#F0E5FF',
    'Shopping': '#E0EFFF',
    'Retail Stores': '#E8E0F4',
    'Schools': '#E0EFFF',
    'Colleges': '#E0EFFF',
    'Banks': '#E0EFFF',
    'ATMs': '#E0EFFF',
    'Petrol Pumps': '#E0EFFF',
    'Auto Services': '#E0EFFF',
    'Salons': '#E8E0F4',
    'Spas': '#E8E0F4',
    'Gyms': '#E8E0F4',
    'Hotels': '#E0EFFF',
    'Bakeries': '#FFF0E5',
    'Electronics': '#E8E0F4',
    'Supermarkets': '#D4F1F4',
    'Clothing': '#E8E0F4',
    'Jewellery': '#E8E0F4',
    'Temples': '#E0EFFF',
    'Churches': '#E0EFFF',
    'Mosques': '#E0EFFF'
};

async function migrate() {
    console.log('🚀 Starting data migration...\n');

    try {
        // Read businesses data
        const dataPath = path.join(process.cwd(), 'legacy', 'vellore-business-directory', 'backend', 'data', 'vellore_businesses.json');

        if (!fs.existsSync(dataPath)) {
            console.error(`❌ Data file not found at: ${dataPath}`);
            console.log('💡 Make sure the original project data exists');
            process.exit(1);
        }

        const businessesData: Business[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        console.log(`📊 Found ${businessesData.length} businesses to migrate\n`);

        // Insert businesses
        console.log('📝 Inserting businesses...');
        for (const business of businessesData) {
            await sql`
        INSERT INTO businesses (
          id, name, category, address, phone, whatsapp_phone,
          location, rating, total_ratings, types, website, opening_hours, pincode
        ) VALUES (
          ${business.id},
          ${business.name},
          ${business.category},
          ${business.address},
          ${business.phone || null},
          ${business.whatsappPhone || null},
          ${business.location ? JSON.stringify(business.location) : null},
          ${business.rating || 0},
          ${business.totalRatings || 0},
          ${business.types ? JSON.stringify(business.types) : null},
          ${business.website || null},
          ${business.openingHours ? JSON.stringify(business.openingHours) : null},
          ${business.pincode || null}
        )
        ON CONFLICT (id) DO NOTHING
      `;
        }
        console.log('✅ Businesses inserted\n');

        // Generate categories
        console.log('📝 Generating categories...');
        const categoryMap = new Map<string, number>();
        businessesData.forEach(b => {
            categoryMap.set(b.category, (categoryMap.get(b.category) || 0) + 1);
        });

        for (const [name, count] of categoryMap.entries()) {
            const slug = name.toLowerCase().replace(/\s+/g, '-');
            const icon = categoryIcons[name] || '📍';
            const color = categoryColors[name] || '#E0EFFF';

            await sql`
        INSERT INTO categories (name, slug, count, icon, color)
        VALUES (${name}, ${slug}, ${count}, ${icon}, ${color})
        ON CONFLICT (name) DO UPDATE SET count = ${count}
      `;
        }
        console.log('✅ Categories generated\n');

        console.log('🎉 Migration completed successfully!');
        console.log(`\n📊 Summary:`);
        console.log(`   - Businesses: ${businessesData.length}`);
        console.log(`   - Categories: ${categoryMap.size}`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
