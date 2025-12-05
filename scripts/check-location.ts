import { db } from '../lib/db';
import { locations } from '../lib/schema';
import { eq } from 'drizzle-orm';

async function checkLocation() {
    const slug = 'ammanur';
    console.log(`Checking for location with slug: ${slug}`);

    const location = await db.query.locations.findFirst({
        where: eq(locations.slug, slug),
    });

    if (location) {
        console.log('Location found:', location);
    } else {
        console.log('Location NOT found');

        // List some locations to see what's there
        const allLocs = await db.select().from(locations).limit(5);
        console.log('Sample locations:', allLocs);
    }
    process.exit(0);
}

checkLocation().catch(console.error);
