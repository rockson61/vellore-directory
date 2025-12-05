import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

async function addIndiraDentalClinic() {
    try {
        console.log('🔍 Checking if Indira Dental Clinic already exists...');

        // Check if business already exists
        const existing = await sql`
            SELECT id, name, slug, category, address 
            FROM businesses 
            WHERE name ILIKE '%Indira Dental%' 
            OR name ILIKE '%Rockson Samuel%'
            LIMIT 5
        `;

        if (existing.length > 0) {
            console.log('✅ Found existing dental clinic listings:');
            existing.forEach((b, i) => {
                console.log(`\n${i + 1}. ${b.name}`);
                console.log(`   ID: ${b.id}`);
                console.log(`   Slug: ${b.slug}`);
                console.log(`   Category: ${b.category}`);
            });

            const exactMatch = existing.find(b =>
                b.name.includes('Indira Dental Clinic') &&
                b.name.includes('Dr Rockson Samuel')
            );

            if (exactMatch) {
                console.log('\n✅ Exact match found! Business already exists.');
                return;
            }
        }

        console.log('\n➕ Adding Indira Dental Clinic to database...');

        // Generate a unique slug
        const slug = 'indira-dental-clinic-dr-rockson-samuel-vellore';

        // Add the business
        const result = await sql`
            INSERT INTO businesses (
                name, slug, description, category, address, pincode,
                phone, whatsapp_phone, email, website, rating, total_ratings,
                verified, status, amenities, opening_hours, latitude, longitude
            ) VALUES (
                'Indira Dental Clinic | Dr Rockson Samuel | Top Dentist in Vellore for RCT, Braces, Implants, & Dental Fillings',
                ${slug},
                'Indira Dental Clinic, led by Dr Rockson Samuel, is a premier dental care facility in Vellore specializing in Root Canal Treatment (RCT), Braces & Orthodontics, Dental Implants, and Dental Fillings. We provide comprehensive dental solutions with state-of-the-art technology and personalized care.',
                'Dentist',
                'Vellore, Tamil Nadu',
                '632001',
                '+91 70106 50063',
                '+91 70106 50063',
                'info@indiradentalclinic.com',
                'https://indiradentalclinic.com',
                '4.9',
                150,
                true,
                'active',
                ${JSON.stringify([
            'Wheelchair Accessible',
            'Parking Available',
            'Air Conditioned',
            'Digital X-Ray',
            'Sterilization Equipment',
            'Emergency Services',
            'Online Booking',
            'Insurance Accepted'
        ])},
                ${JSON.stringify({
            weekday_text: [
                'Monday: 9:00 AM – 8:00 PM',
                'Tuesday: 9:00 AM – 8:00 PM',
                'Wednesday: 9:00 AM – 8:00 PM',
                'Thursday: 9:00 AM – 8:00 PM',
                'Friday: 9:00 AM – 8:00 PM',
                'Saturday: 9:00 AM – 6:00 PM',
                'Sunday: Closed'
            ],
            open_now: true
        })},
                '12.9165',
                '79.1325'
            )
            RETURNING id, name, slug, category, rating, address, phone
        `;

        console.log('\n✅ Successfully added Indira Dental Clinic!');
        console.log('\n📋 Business Details:');
        console.log('─────────────────────────────────────────');
        console.log('ID:', result[0].id);
        console.log('Name:', result[0].name);
        console.log('Slug:', result[0].slug);
        console.log('Category:', result[0].category);
        console.log('Rating:', result[0].rating);
        console.log('Address:', result[0].address);
        console.log('Phone:', result[0].phone);
        console.log('');
        console.log('🔗 View at: http://localhost:3000/business/' + result[0].slug);
        console.log('');

    } catch (error) {
        console.error('❌ Error adding business:', error);
        throw error;
    }
}

addIndiraDentalClinic()
    .then(() => {
        console.log('✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Script failed:', error);
        process.exit(1);
    });
