import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

const services = [
    // Root Canal Treatment
    { name: 'Root Canal Treatment (Single Canal)', description: 'Painless RCT for single canal teeth using advanced rotary endodontics', duration: 60, price: '3000', bookable: true },
    { name: 'Root Canal Treatment (Multi Canal)', description: 'Complex RCT for molars with multiple canals', duration: 90, price: '6000', bookable: true },

    // Orthodontics
    { name: 'Metal Braces', description: 'Traditional metal braces for teeth alignment', duration: 30, price: '30000', bookable: true },
    { name: 'Ceramic Braces', description: 'Tooth-colored aesthetic braces', duration: 30, price: '50000', bookable: true },
    { name: 'Invisalign Clear Aligners', description: 'Invisible aligners for discreet teeth straightening', duration: 30, price: '150000', bookable: true },

    // Dental Implants
    { name: 'Single Tooth Implant', description: 'Premium titanium implant for single missing tooth', duration: 90, price: '35000', bookable: true },
    { name: 'Implant with Crown', description: 'Complete implant solution with ceramic crown', duration: 120, price: '45000', bookable: true },
    { name: 'All-on-4 Full Arch', description: 'Complete arch restoration with 4 implants', duration: 180, price: '325000', bookable: true },

    // Fillings
    { name: 'Composite Filling', description: 'Tooth-colored aesthetic filling for cavities', duration: 30, price: '1500', bookable: true },
    { name: 'Glass Ionomer Filling', description: 'Fluoride-releasing filling for children and seniors', duration: 30, price: '1000', bookable: true },

    // Cosmetic Dentistry
    { name: 'Teeth Whitening (In-Office)', description: 'Professional power bleaching for instant results', duration: 60, price: '12000', bookable: true },
    { name: 'Porcelain Veneers', description: 'Custom veneers for a perfect Hollywood smile', duration: 60, price: '12000', bookable: true },
    { name: 'Smile Makeover Consultation', description: 'Complete smile transformation planning', duration: 45, price: '1000', bookable: true },

    // Preventive Care
    { name: 'Dental Cleaning & Scaling', description: 'Professional teeth cleaning and tartar removal', duration: 45, price: '1500', bookable: true },
    { name: 'Deep Cleaning (Per Quadrant)', description: 'Periodontal deep cleaning for gum disease', duration: 60, price: '3500', bookable: true },

    // Extractions
    { name: 'Simple Tooth Extraction', description: 'Painless tooth removal', duration: 30, price: '1000', bookable: true },
    { name: 'Surgical Extraction', description: 'Complex tooth removal requiring surgery', duration: 45, price: '3500', bookable: true },
    { name: 'Wisdom Tooth Removal', description: 'Impacted wisdom tooth extraction', duration: 60, price: '5000', bookable: true },

    // Crowns & Bridges
    { name: 'Zirconia Crown', description: 'Premium all-ceramic crown for natural appearance', duration: 60, price: '14000', bookable: true },
    { name: 'Porcelain Fused to Metal Crown', description: 'Strong and aesthetic crown solution', duration: 60, price: '6000', bookable: true },

    // Dentures
    { name: 'Complete Acrylic Dentures', description: 'Full set of removable dentures', duration: 90, price: '12000', bookable: true },
    { name: 'Flexible Partial Dentures', description: 'Comfortable partial dentures', duration: 60, price: '20000', bookable: true },

    // Pediatric
    { name: 'Pediatric Dental Check-up', description: 'Child-friendly dental examination', duration: 30, price: '500', bookable: true },
    { name: 'Fluoride Treatment (Kids)', description: 'Cavity prevention for children', duration: 20, price: '800', bookable: true },
    { name: 'Dental Sealants', description: 'Protective coating for children\'s teeth', duration: 30, price: '1200', bookable: true },

    // Emergency
    { name: 'Emergency Consultation', description: 'Immediate care for dental emergencies', duration: 30, price: '750', bookable: true },
];

async function addServiceOfferings() {
    try {
        const businessId = '19054';

        console.log('📝 Adding service offerings to Indira Dental Clinic...');

        // Delete existing services
        await sql`
            DELETE FROM service_offerings 
            WHERE business_id = ${businessId}
        `;

        // Insert new services
        let count = 0;
        for (const service of services) {
            await sql`
                INSERT INTO service_offerings (
                    business_id, 
                    service_name, 
                    service_description, 
                    duration_minutes, 
                    price, 
                    is_bookable
                )
                VALUES (
                    ${businessId},
                    ${service.name},
                    ${service.description},
                    ${service.duration},
                    ${service.price},
                    ${service.bookable}
                )
            `;
            count++;
        }

        console.log(`✅ Successfully added ${count} service offerings!`);
        console.log('');
        console.log('📊 Services by Category:');
        console.log('   Root Canal Treatment: 2 services');
        console.log('   Orthodontics: 3 services');
        console.log('   Dental Implants: 3 services');
        console.log('   Fillings: 2 services');
        console.log('   Cosmetic Dentistry: 3 services');
        console.log('   Preventive Care: 2 services');
        console.log('   Extractions: 3 services');
        console.log('   Crowns & Bridges: 2 services');
        console.log('   Dentures: 2 services');
        console.log('   Pediatric: 3 services');
        console.log('   Emergency: 1 service');
        console.log('');
        console.log('🔗 View at: http://localhost:3000/business/indira-dental-clinic-dr-rockson-samuel-vellore');
        console.log('');

    } catch (error) {
        console.error('❌ Error adding services:', error);
        throw error;
    }
}

addServiceOfferings()
    .then(() => {
        console.log('✅ Service offerings added successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Failed to add services:', error);
        process.exit(1);
    });
