import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

async function updateIndiraDentalClinicDetails() {
    try {
        console.log('🔍 Finding Indira Dental Clinic...');

        const businessId = '19054';

        // Update main business details
        console.log('📝 Updating address, pincode, and opening hours...');

        const result = await sql`
            UPDATE businesses 
            SET 
                address = '3rd Floor, 54, Katpadi Main Rd, Suthanthira Ponvizha Nagar, Gandhi Nagar, Vellore, Tamil Nadu 632006',
                pincode = '632006',
                latitude = '12.9165',
                longitude = '79.1325',
                opening_hours = ${JSON.stringify({
            weekday_text: [
                'Monday: 10:00 AM – 8:00 PM',
                'Tuesday: 10:00 AM – 8:00 PM',
                'Wednesday: 10:00 AM – 8:00 PM',
                'Thursday: 10:00 AM – 8:00 PM',
                'Friday: 10:00 AM – 8:00 PM',
                'Saturday: 10:00 AM – 8:00 PM',
                'Sunday: 10:00 AM – 1:30 PM'
            ],
            open_now: true,
            periods: [
                { open: { day: 0, time: '1000' }, close: { day: 0, time: '1330' } }, // Sunday
                { open: { day: 1, time: '1000' }, close: { day: 1, time: '2000' } }, // Monday
                { open: { day: 2, time: '1000' }, close: { day: 2, time: '2000' } }, // Tuesday
                { open: { day: 3, time: '1000' }, close: { day: 3, time: '2000' } }, // Wednesday
                { open: { day: 4, time: '1000' }, close: { day: 4, time: '2000' } }, // Thursday
                { open: { day: 5, time: '1000' }, close: { day: 5, time: '2000' } }, // Friday
                { open: { day: 6, time: '1000' }, close: { day: 6, time: '2000' } }  // Saturday
            ]
        })},
                updated_at = NOW()
            WHERE id = ${businessId}
            RETURNING id, name, address, pincode, phone, email, website
        `;

        console.log('✅ Successfully updated business details!');
        console.log('');
        console.log('📋 Updated Information:');
        console.log('─────────────────────────────────────────');
        console.log('ID:', result[0].id);
        console.log('Name:', result[0].name);
        console.log('Address:', result[0].address);
        console.log('Pincode:', result[0].pincode);
        console.log('Phone:', result[0].phone);
        console.log('Email:', result[0].email);
        console.log('Website:', result[0].website);
        console.log('');
        console.log('🕒 Opening Hours:');
        console.log('   Monday-Saturday: 10:00 AM – 8:00 PM');
        console.log('   Sunday: 10:00 AM – 1:30 PM');
        console.log('');

        // Now add detailed business hours to business_hours table
        console.log('📝 Adding detailed business hours...');

        // Delete existing hours for this business
        await sql`
            DELETE FROM business_hours 
            WHERE business_id = ${businessId}
        `;

        // Insert new hours
        const hours = [
            { day: 0, open: '10:00', close: '13:30', closed: false }, // Sunday
            { day: 1, open: '10:00', close: '20:00', closed: false }, // Monday
            { day: 2, open: '10:00', close: '20:00', closed: false }, // Tuesday
            { day: 3, open: '10:00', close: '20:00', closed: false }, // Wednesday
            { day: 4, open: '10:00', close: '20:00', closed: false }, // Thursday
            { day: 5, open: '10:00', close: '20:00', closed: false }, // Friday
            { day: 6, open: '10:00', close: '20:00', closed: false }, // Saturday
        ];

        for (const hour of hours) {
            await sql`
                INSERT INTO business_hours (business_id, day_of_week, open_time, close_time, is_closed)
                VALUES (${businessId}, ${hour.day}, ${hour.open}, ${hour.close}, ${hour.closed})
            `;
        }

        console.log('✅ Business hours added to database!');
        console.log('');
        console.log('🔗 View at: http://localhost:3000/business/indira-dental-clinic-dr-rockson-samuel-vellore');
        console.log('');

    } catch (error) {
        console.error('❌ Error updating business:', error);
        throw error;
    }
}

updateIndiraDentalClinicDetails()
    .then(() => {
        console.log('✅ Update completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Update failed:', error);
        process.exit(1);
    });
