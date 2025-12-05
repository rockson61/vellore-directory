import { businesses, categoryHierarchy, locations } from '../lib/schema';
import { eq, sql } from 'drizzle-orm';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars BEFORE importing db
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const VELLORE_LAT = 12.9165;
const VELLORE_LNG = 79.1325;
const RADIUS = 20000; // 20km

if (!API_KEY) {
    console.error('❌ GOOGLE_MAPS_API_KEY is missing in .env.local');
    process.exit(1);
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

async function searchPlaces(query: string, pageToken?: string) {
    try {
        const params: any = {
            query: `${query} in Vellore`,
            key: API_KEY,
            location: `${VELLORE_LAT},${VELLORE_LNG}`,
            radius: RADIUS,
        };

        if (pageToken) {
            params.pagetoken = pageToken;
            // Google requires a short delay before using the next_page_token
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', { params });
        return response.data;
    } catch (error) {
        console.error(`Error searching for ${query}:`, error);
        return { results: [] };
    }
}

async function importGooglePlaces() {
    // Dynamic import to ensure env vars are loaded
    const { db } = await import('../lib/db');

    console.log('🚀 Starting Google Places Import...');

    // 1. Get all leaf categories
    const categories = await db
        .select()
        .from(categoryHierarchy)
        .where(sql`${categoryHierarchy.parentId} IS NOT NULL`);

    console.log(`Found ${categories.length} categories to search.`);

    let totalImported = 0;

    for (const category of categories) {
        console.log(`\n🔍 Searching for: ${category.name}`);

        let nextPageToken = null;
        let pagesFetched = 0;
        const MAX_PAGES = 1; // Limit pages to avoid excessive API usage for now

        do {
            const data: any = await searchPlaces(category.name, nextPageToken || undefined);
            const places = data.results || [];
            nextPageToken = data.next_page_token;

            if (places.length === 0) {
                console.log(`   No places found for ${category.name} (Page ${pagesFetched + 1})`);
                break;
            }

            console.log(`   Found ${places.length} places (Page ${pagesFetched + 1}). Importing...`);

            for (const place of places) {
                try {
                    // Check if business exists
                    const existing = await db.query.businesses.findFirst({
                        where: eq(businesses.name, place.name),
                    });

                    if (existing) {
                        continue;
                    }

                    // Generate slug
                    let slug = generateSlug(place.name);
                    // Ensure slug uniqueness (simple check)
                    const slugExists = await db.query.businesses.findFirst({
                        where: eq(businesses.slug, slug),
                    });
                    if (slugExists) {
                        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
                    }

                    // Insert business
                    await db.insert(businesses).values({
                        name: place.name,
                        slug: slug,
                        description: place.types ? place.types.join(', ') : null,
                        address: place.formatted_address,
                        phone: 'N/A',
                        website: null,
                        category: category.name,
                        rating: place.rating ? place.rating.toString() : null,
                        totalRatings: place.user_ratings_total || 0,
                        latitude: place.geometry?.location?.lat?.toString(),
                        longitude: place.geometry?.location?.lng?.toString(),
                        status: 'active',
                        verified: false,
                        pincode: extractPincode(place.formatted_address),
                    });
                    totalImported++;
                } catch (err) {
                    console.error(`   Failed to import ${place.name}:`, err);
                }
            }

            pagesFetched++;
        } while (nextPageToken && pagesFetched < MAX_PAGES);
    }

    console.log(`\n✅ Import complete! Total new businesses: ${totalImported}`);
}

function extractPincode(address: string): string | null {
    const match = address.match(/\b6\d{5}\b/);
    return match ? match[0] : null;
}

importGooglePlaces().catch(console.error);
