import dotenv from 'dotenv';
import path from 'path';

// Load environment variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '../lib/db';
import { businesses, locations, categoryHierarchy } from '../lib/schema';
import { eq, sql } from 'drizzle-orm';

// Google Maps API configuration
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';

// Category mapping from Google Place Types to our categories
const CATEGORY_MAPPING: Record<string, string> = {
    // Food & Dining
    'restaurant': 'Restaurants',
    'cafe': 'Cafes & Coffee Shops',
    'bakery': 'Bakeries & Desserts',
    'bar': 'Bars & Nightlife',
    'meal_takeaway': 'Fast Food & Quick Service',
    'meal_delivery': 'Fast Food & Quick Service',
    'food': 'Restaurants',

    // Health & Medical
    'hospital': 'Hospitals & Clinics',
    'doctor': 'Doctors & Specialists',
    'dentist': 'Dental Care',
    'pharmacy': 'Pharmacies & Medical Supply',
    'physiotherapist': 'Alternative Medicine',
    'veterinary_care': 'Veterinary Services',

    // Shopping & Retail
    'clothing_store': 'Clothing & Fashion',
    'shoe_store': 'Clothing & Fashion',
    'jewelry_store': 'Specialty Shops',
    'electronics_store': 'Electronics & Computers',
    'furniture_store': 'Home & Garden',
    'home_goods_store': 'Home & Garden',
    'supermarket': 'Grocery & Food Stores',
    'convenience_store': 'Grocery & Food Stores',
    'grocery_or_supermarket': 'Grocery & Food Stores',
    'book_store': 'Specialty Shops',
    'pet_store': 'Specialty Shops',
    'florist': 'Specialty Shops',
    'hardware_store': 'Home & Garden',

    // Services
    'beauty_salon': 'Beauty & Personal Care',
    'hair_care': 'Beauty & Personal Care',
    'spa': 'Beauty & Personal Care',
    'gym': 'Sports & Fitness',
    'car_repair': 'Automotive',
    'car_wash': 'Automotive',
    'laundry': 'Home Services',
    'locksmith': 'Home Services',
    'plumber': 'Home Services',
    'electrician': 'Home Services',
    'painter': 'Home Services',
    'roofing_contractor': 'Home Services',
    'moving_company': 'Home Services',
    'lawyer': 'Professional Services',
    'accounting': 'Professional Services',
    'real_estate_agency': 'Professional Services',
    'insurance_agency': 'Professional Services',
    'travel_agency': 'Travel & Tourism',

    // Education
    'school': 'Schools',
    'university': 'Higher Education',
    'library': 'Education',
    'primary_school': 'Schools',
    'secondary_school': 'Schools',

    // Entertainment & Recreation
    'movie_theater': 'Entertainment Venues',
    'amusement_park': 'Entertainment Venues',
    'bowling_alley': 'Entertainment Venues',
    'night_club': 'Bars & Nightlife',
    'park': 'Outdoor Recreation',
    'stadium': 'Sports & Fitness',
    'tourist_attraction': 'Entertainment Venues',

    // Lodging
    'lodging': 'Hotels & Accommodations',
    'hotel': 'Hotels & Accommodations',

    // Transportation
    'gas_station': 'Vehicle Services',
    'parking': 'Transportation',
    'taxi_stand': 'Public Transportation',
    'bus_station': 'Public Transportation',
    'train_station': 'Public Transportation',
    'airport': 'Public Transportation',
};

interface GooglePlace {
    place_id: string;
    name: string;
    vicinity?: string;
    formatted_address?: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
    types: string[];
    rating?: number;
    user_ratings_total?: number;
    opening_hours?: {
        open_now?: boolean;
    };
}

interface PlaceDetails {
    name: string;
    formatted_address: string;
    formatted_phone_number?: string;
    international_phone_number?: string;
    website?: string;
    rating?: number;
    user_ratings_total?: number;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
    types: string[];
    opening_hours?: {
        weekday_text?: string[];
        open_now?: boolean;
        periods?: any[];
    };
    photos?: Array<{
        photo_reference: string;
        width: number;
        height: number;
    }>;
    price_level?: number;
    business_status?: string;
}

// Rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function geocodeLocation(location: string, pincode: string): Promise<{ lat: number; lng: number } | null> {
    if (!GOOGLE_MAPS_API_KEY) {
        throw new Error('GOOGLE_MAPS_API_KEY is not set');
    }

    const address = `${location}, ${pincode}, Vellore, Tamil Nadu, India`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].geometry.location;
    }

    return null;
}

async function searchNearbyPlaces(lat: number, lng: number, radius: number = 2000, type?: string): Promise<GooglePlace[]> {
    if (!GOOGLE_MAPS_API_KEY) {
        throw new Error('GOOGLE_MAPS_API_KEY is not set');
    }

    let url = `${PLACES_API_URL}/nearbysearch/json?location=${lat},${lng}&radius=${radius}&key=${GOOGLE_MAPS_API_KEY}`;

    if (type) {
        url += `&type=${type}`;
    }

    await delay(100); // Rate limiting

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'ZERO_RESULTS') {
        return [];
    }

    if (data.status !== 'OK') {
        console.error(`  API Error: ${data.status} - ${data.error_message || 'Unknown error'}`);
        return [];
    }

    // Filter out generic locations and keep only actual businesses
    const filtered = (data.results || []).filter((place: GooglePlace) => {
        // Exclude if it's just a locality or political area
        if (place.types.includes('locality') || place.types.includes('political')) {
            return false;
        }
        // Exclude if it's just a postal code
        if (place.types.includes('postal_code')) {
            return false;
        }
        return true;
    });

    return filtered;
}

async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    if (!GOOGLE_MAPS_API_KEY) {
        throw new Error('GOOGLE_MAPS_API_KEY is not set');
    }

    const fields = [
        'name',
        'formatted_address',
        'formatted_phone_number',
        'international_phone_number',
        'website',
        'rating',
        'user_ratings_total',
        'geometry',
        'types',
        'opening_hours',
        'photos',
        'price_level',
        'business_status'
    ].join(',');

    const url = `${PLACES_API_URL}/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_MAPS_API_KEY}`;

    await delay(100); // Rate limiting

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
        return null;
    }

    return data.result;
}

function mapGoogleTypeToCategory(types: string[]): string {
    // Try to find the most specific category match
    for (const type of types) {
        if (CATEGORY_MAPPING[type]) {
            return CATEGORY_MAPPING[type];
        }
    }

    // Default fallback
    return 'Services';
}

function createSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function checkDuplicate(name: string, address: string): Promise<boolean> {
    const existing = await db
        .select()
        .from(businesses)
        .where(sql`LOWER(${businesses.name}) = LOWER(${name}) AND LOWER(${businesses.address}) = LOWER(${address})`)
        .limit(1);

    return existing.length > 0;
}

async function importBusinessesForLocation(locationData: typeof locations.$inferSelect, testMode: boolean = false) {
    console.log(`\n📍 Processing: ${locationData.name} (${locationData.pincode})`);

    // First, geocode the location
    const coords = await geocodeLocation(locationData.name, locationData.pincode);
    if (!coords) {
        console.log(`  ❌ Could not geocode location`);
        return { imported: 0, skipped: 0, errors: 0 };
    }

    console.log(`  📍 Coordinates: ${coords.lat}, ${coords.lng}`);

    // Search for various types of businesses
    const businessTypes = [
        'restaurant', 'cafe', 'store', 'hospital', 'pharmacy',
        'school', 'bank', 'atm', 'gym', 'salon'
    ];

    let allPlaces: GooglePlace[] = [];

    // In test mode, only search for 2-3 types
    const typesToSearch = testMode ? businessTypes.slice(0, 3) : businessTypes;

    for (const type of typesToSearch) {
        console.log(`  Searching for: ${type}...`);
        const places = await searchNearbyPlaces(coords.lat, coords.lng, 2000, type);
        allPlaces = allPlaces.concat(places);
        await delay(200); // Rate limiting between searches
    }

    // Remove duplicates based on place_id
    const uniquePlaces = Array.from(new Map(allPlaces.map(p => [p.place_id, p])).values());

    console.log(`  Found ${uniquePlaces.length} unique places`);

    if (uniquePlaces.length === 0) {
        return { imported: 0, skipped: 0, errors: 0 };
    }

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    // Limit to 20 businesses per location in test mode
    const placesToProcess = testMode ? uniquePlaces.slice(0, 20) : uniquePlaces;

    for (const place of placesToProcess) {
        try {
            // Check for duplicates
            const isDuplicate = await checkDuplicate(place.name, place.vicinity || '');
            if (isDuplicate) {
                console.log(`  ⏭️  Skipped (duplicate): ${place.name}`);
                skipped++;
                continue;
            }

            // Get detailed information
            const details = await getPlaceDetails(place.place_id);
            if (!details) {
                console.log(`  ⚠️  Could not fetch details for: ${place.name}`);
                errors++;
                continue;
            }

            // Map category
            const category = mapGoogleTypeToCategory(details.types);

            // Process opening hours
            const openingHours = details.opening_hours?.weekday_text ? {
                weekday_text: details.opening_hours.weekday_text,
                open_now: details.opening_hours.open_now,
            } : null;

            // Process photos - get up to 5 photos
            const photos = details.photos?.slice(0, 5).map(photo =>
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
            ) || [];

            // Better phone number handling
            const phone = details.formatted_phone_number ||
                details.international_phone_number ||
                'N/A';

            // Create business entry
            const businessData = {
                name: details.name,
                slug: createSlug(details.name),
                description: details.types.filter(t => !['point_of_interest', 'establishment'].includes(t)).join(', ') || 'Local business',
                address: details.formatted_address,
                pincode: locationData.pincode,
                phone: phone,
                website: details.website || null,
                category: category,
                rating: details.rating?.toString() || null,
                totalRatings: details.user_ratings_total || 0,
                latitude: details.geometry.location.lat.toString(),
                longitude: details.geometry.location.lng.toString(),
                status: 'active' as const,
                verified: false,
                location: locationData.name,
                types: details.types.join(','),
                openingHours: openingHours,
                images: photos.length > 0 ? photos : null,
            };

            // Insert into database
            await db.insert(businesses).values(businessData);
            console.log(`  ✅ Imported: ${details.name} (${category})`);
            imported++;

            // Rate limiting - 10 requests per second max
            await delay(150);

        } catch (error: any) {
            console.error(`  ❌ Error importing ${place.name}:`, error.message);
            errors++;
        }
    }

    return { imported, skipped, errors };
}

async function main() {
    const args = process.argv.slice(2);
    const testMode = args.includes('--test');
    const specificLocations = args.find(arg => arg.startsWith('--locations='))?.split('=')[1]?.split(',');
    const allLocations = args.includes('--all');

    console.log('🚀 Google Maps Business Import');
    console.log('================================\n');

    if (!GOOGLE_MAPS_API_KEY) {
        console.error('❌ Error: GOOGLE_MAPS_API_KEY not found in environment variables');
        console.log('\nPlease add your Google Maps API key to .env.local:');
        console.log('GOOGLE_MAPS_API_KEY=your_api_key_here\n');
        process.exit(1);
    }

    console.log(`Mode: ${testMode ? 'TEST (max 10 businesses per location)' : 'FULL IMPORT'}\n`);

    // Get locations to process
    let locationsToProcess;

    if (specificLocations) {
        console.log(`Processing specific locations: ${specificLocations.join(', ')}\n`);
        locationsToProcess = await db
            .select()
            .from(locations)
            .where(sql`LOWER(${locations.name}) IN (${sql.join(specificLocations.map(loc => sql`LOWER(${loc})`), sql`, `)})`);
    } else if (allLocations || testMode) {
        console.log('Fetching all locations...\n');
        locationsToProcess = await db.select().from(locations);

        if (testMode && !specificLocations) {
            // In test mode without specific locations, just do first 3
            locationsToProcess = locationsToProcess.slice(0, 3);
            console.log(`Test mode: Processing first 3 locations\n`);
        }
    } else {
        console.log('Usage:');
        console.log('  --test                           Test mode (first 3 locations, max 10 businesses each)');
        console.log('  --locations=loc1,loc2,loc3      Import specific locations');
        console.log('  --all                            Import all locations');
        process.exit(0);
    }

    if (locationsToProcess.length === 0) {
        console.log('No locations found to process');
        process.exit(0);
    }

    console.log(`Processing ${locationsToProcess.length} locations...\n`);

    let totalImported = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    for (const location of locationsToProcess) {
        const result = await importBusinessesForLocation(location, testMode);
        totalImported += result.imported;
        totalSkipped += result.skipped;
        totalErrors += result.errors;
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ IMPORT COMPLETE');
    console.log('='.repeat(50));
    console.log(`Locations processed: ${locationsToProcess.length}`);
    console.log(`Businesses imported: ${totalImported}`);
    console.log(`Duplicates skipped: ${totalSkipped}`);
    console.log(`Errors: ${totalErrors}`);
    console.log('='.repeat(50) + '\n');

    process.exit(0);
}

main().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
