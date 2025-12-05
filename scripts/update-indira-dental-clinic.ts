import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

async function updateIndiraDentalClinic() {
    try {
        console.log('🔍 Finding Indira Dental Clinic...');

        // Find the business
        const existing = await sql`
            SELECT id, name, email, website 
            FROM businesses 
            WHERE slug = 'indira-dental-clinic-dr-rockson-samuel-vellore'
            LIMIT 1
        `;

        if (existing.length === 0) {
            console.log('❌ Business not found!');
            process.exit(1);
        }

        console.log('✅ Found business:');
        console.log('   ID:', existing[0].id);
        console.log('   Name:', existing[0].name);
        console.log('   Current Email:', existing[0].email);
        console.log('   Current Website:', existing[0].website);
        console.log('');

        console.log('📝 Updating email and website...');

        // Update the business
        const result = await sql`
            UPDATE businesses 
            SET 
                email = 'rockson68@hotmail.com',
                website = 'https://velloredental.com',
                updated_at = NOW()
            WHERE slug = 'indira-dental-clinic-dr-rockson-samuel-vellore'
            RETURNING id, name, email, website, phone, whatsapp_phone
        `;

        console.log('✅ Successfully updated Indira Dental Clinic!');
        console.log('');
        console.log('📋 Updated Details:');
        console.log('─────────────────────────────────────────');
        console.log('ID:', result[0].id);
        console.log('Name:', result[0].name);
        console.log('Email:', result[0].email);
        console.log('Website:', result[0].website);
        console.log('Phone:', result[0].phone);
        console.log('WhatsApp:', result[0].whatsapp_phone);
        console.log('');
        console.log('🔗 View at: http://localhost:3000/business/indira-dental-clinic-dr-rockson-samuel-vellore');
        console.log('');

    } catch (error) {
        console.error('❌ Error updating business:', error);
        throw error;
    }
}

updateIndiraDentalClinic()
    .then(() => {
        console.log('✅ Update completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Update failed:', error);
        process.exit(1);
    });
