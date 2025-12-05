import { db } from '../lib/db';
import { businesses, categoryHierarchy } from '../lib/schema';
import { eq } from 'drizzle-orm';

// Sample Vellore businesses data
const velloreBusinesses = [
    // Restaurants
    {
        name: "Darling Residency",
        category: "Restaurants",
        description: "Multi-cuisine restaurant with family dining",
        address: "Gandhi Nagar, Vellore, Tamil Nadu 632006",
        phone: "+91 98765 43210",
        latitude: 12.9165,
        longitude: 79.1325,
    },
    {
        name: "Hotel Aryaas",
        category: "Restaurants",
        description: "Popular South Indian vegetarian restaurant",
        address: "Officer's Line, Vellore, Tamil Nadu 632001",
        phone: "+91 98765 43211",
        latitude: 12.9165,
        longitude: 79.1325,
    },
    {
        name: "Ambur Star Biryani",
        category: "Restaurants",
        description: "Famous for authentic Ambur biryani",
        address: "Katpadi, Vellore, Tamil Nadu 632007",
        phone: "+91 98765 43212",
        latitude: 12.9695,
        longitude: 79.1559,
    },

    // Hospitals
    {
        name: "CMC Vellore",
        category: "Hospitals",
        description: "Christian Medical College - Premier multi-specialty hospital",
        address: "Ida Scudder Road, Vellore, Tamil Nadu 632004",
        phone: "+91 416 228 1000",
        latitude: 12.9252,
        longitude: 79.1353,
    },
    {
        name: "Aravind Eye Hospital",
        category: "Hospitals",
        description: "Specialized eye care hospital",
        address: "Sathuvachari, Vellore, Tamil Nadu 632009",
        phone: "+91 416 222 5000",
        latitude: 12.9165,
        longitude: 79.1325,
    },
    {
        name: "Apollo Speciality Hospital",
        category: "Hospitals",
        description: "Multi-specialty hospital with advanced facilities",
        address: "Bagayam, Vellore, Tamil Nadu 632001",
        phone: "+91 416 222 2222",
        latitude: 12.9165,
        longitude: 79.1325,
    },

    // Cafes
    {
        name: "Cafe Coffee Day",
        category: "Cafes",
        description: "Popular coffee chain with cozy ambiance",
        address: "Gandhi Nagar, Vellore, Tamil Nadu 632006",
        phone: "+91 98765 43213",
        latitude: 12.9165,
        longitude: 79.1325,
    },
    {
        name: "Barista Coffee",
        category: "Cafes",
        description: "Premium coffee and snacks",
        address: "Officer's Line, Vellore, Tamil Nadu 632001",
        phone: "+91 98765 43214",
        latitude: 12.9165,
        longitude: 79.1325,
    },

    // Shopping Malls
    {
        name: "VIT Square Mall",
        category: "Shopping Malls",
        description: "Modern shopping mall with retail stores and food court",
        address: "Katpadi, Vellore, Tamil Nadu 632014",
        phone: "+91 416 224 5000",
        latitude: 12.9695,
        longitude: 79.1559,
    },
    {
        name: "Spectrum Mall",
        category: "Shopping Malls",
        description: "Shopping and entertainment complex",
        address: "Gandhi Nagar, Vellore, Tamil Nadu 632006",
        phone: "+91 416 224 6000",
        latitude: 12.9165,
        longitude: 79.1325,
    },

    // Dental Clinics
    {
        name: "Smile Dental Care",
        category: "Dental Clinics",
        description: "Complete dental care and cosmetic dentistry",
        address: "Sathuvachari, Vellore, Tamil Nadu 632009",
        phone: "+91 98765 43215",
        latitude: 12.9165,
        longitude: 79.1325,
    },
    {
        name: "Perfect Smile Dental Clinic",
        category: "Dental Clinics",
        description: "Advanced dental treatments and orthodontics",
        address: "Bagayam, Vellore, Tamil Nadu 632001",
        phone: "+91 98765 43216",
        latitude: 12.9165,
        longitude: 79.1325,
    },

    // Pharmacies
    {
        name: "Apollo Pharmacy",
        category: "Pharmacies",
        description: "24/7 pharmacy with home delivery",
        address: "Gandhi Nagar, Vellore, Tamil Nadu 632006",
        phone: "+91 416 224 7000",
        latitude: 12.9165,
        longitude: 79.1325,
    },
    {
        name: "MedPlus Pharmacy",
        category: "Pharmacies",
        description: "Trusted pharmacy chain",
        address: "Officer's Line, Vellore, Tamil Nadu 632001",
        phone: "+91 416 224 8000",
        latitude: 12.9165,
        longitude: 79.1325,
    },

    // Beauty Salons
    {
        name: "Lakme Salon",
        category: "Beauty Salons",
        description: "Premium beauty and grooming services",
        address: "Gandhi Nagar, Vellore, Tamil Nadu 632006",
        phone: "+91 98765 43217",
        latitude: 12.9165,
        longitude: 79.1325,
    },
    {
        name: "Naturals Salon",
        category: "Beauty Salons",
        description: "Unisex salon with professional stylists",
        address: "Katpadi, Vellore, Tamil Nadu 632007",
        phone: "+91 98765 43218",
        latitude: 12.9695,
        longitude: 79.1559,
    },

    // Gyms
    {
        name: "Gold's Gym",
        category: "Gyms & Fitness Centers",
        description: "International fitness chain with modern equipment",
        address: "Gandhi Nagar, Vellore, Tamil Nadu 632006",
        phone: "+91 98765 43219",
        latitude: 12.9165,
        longitude: 79.1325,
    },
    {
        name: "Fitness First",
        category: "Gyms & Fitness Centers",
        description: "Complete fitness center with trainers",
        address: "Sathuvachari, Vellore, Tamil Nadu 632009",
        phone: "+91 98765 43220",
        latitude: 12.9165,
        longitude: 79.1325,
    },

    // Hotels
    {
        name: "Hotel Khanna International",
        category: "Hotels",
        description: "Luxury hotel with modern amenities",
        address: "Gandhi Nagar, Vellore, Tamil Nadu 632006",
        phone: "+91 416 224 9000",
        latitude: 12.9165,
        longitude: 79.1325,
    },
    {
        name: "Hotel Regency Sameera Vellore",
        category: "Hotels",
        description: "Comfortable stay with excellent service",
        address: "Officer's Line, Vellore, Tamil Nadu 632001",
        phone: "+91 416 225 0000",
        latitude: 12.9165,
        longitude: 79.1325,
    },

    // Schools
    {
        name: "Balalok Matriculation School",
        category: "Schools",
        description: "CBSE affiliated school with quality education",
        address: "Sathuvachari, Vellore, Tamil Nadu 632009",
        phone: "+91 416 225 1000",
        latitude: 12.9165,
        longitude: 79.1325,
    },
    {
        name: "St. John's International School",
        category: "Schools",
        description: "International curriculum with modern facilities",
        address: "Katpadi, Vellore, Tamil Nadu 632014",
        phone: "+91 416 225 2000",
        latitude: 12.9695,
        longitude: 79.1559,
    },

    // Auto Repair
    {
        name: "Bosch Car Service",
        category: "Auto Repair Shops",
        description: "Authorized service center for all car brands",
        address: "Bagayam, Vellore, Tamil Nadu 632001",
        phone: "+91 98765 43221",
        latitude: 12.9165,
        longitude: 79.1325,
    },
    {
        name: "Carnation Auto",
        category: "Auto Repair Shops",
        description: "Multi-brand car service and repair",
        address: "Katpadi, Vellore, Tamil Nadu 632007",
        phone: "+91 98765 43222",
        latitude: 12.9695,
        longitude: 79.1559,
    },

    // Electronics
    {
        name: "Reliance Digital",
        category: "Electronics Stores",
        description: "Consumer electronics and appliances",
        address: "Gandhi Nagar, Vellore, Tamil Nadu 632006",
        phone: "+91 416 225 3000",
        latitude: 12.9165,
        longitude: 79.1325,
    },
    {
        name: "Vijay Sales",
        category: "Electronics Stores",
        description: "Electronics and home appliances",
        address: "Officer's Line, Vellore, Tamil Nadu 632001",
        phone: "+91 416 225 4000",
        latitude: 12.9165,
        longitude: 79.1325,
    },
];

async function importBusinesses() {
    console.log('Starting business import...');

    let imported = 0;
    let skipped = 0;

    for (const business of velloreBusinesses) {
        try {
            // Check if business already exists
            const existing = await db
                .select()
                .from(businesses)
                .where(eq(businesses.name, business.name))
                .limit(1);

            if (existing.length > 0) {
                console.log(`Skipping existing business: ${business.name}`);
                skipped++;
                continue;
            }

            // Insert business
            await db.insert(businesses).values({
                name: business.name,
                slug: business.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                category: business.category,
                description: business.description,
                address: business.address,
                phone: business.phone,
                latitude: business.latitude.toString(),
                longitude: business.longitude.toString(),
                status: 'active',
            });

            console.log(`✓ Imported: ${business.name} (${business.category})`);
            imported++;
        } catch (error) {
            console.error(`Error importing ${business.name}:`, error);
        }
    }

    console.log('\n=== Import Summary ===');
    console.log(`Total businesses: ${velloreBusinesses.length}`);
    console.log(`Imported: ${imported}`);
    console.log(`Skipped (already exists): ${skipped}`);
    console.log('======================\n');
}

// Run import
importBusinesses()
    .then(() => {
        console.log('Import completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Import failed:', error);
        process.exit(1);
    });
