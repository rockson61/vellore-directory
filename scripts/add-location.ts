import { db } from '@/lib/db';
import { locations } from '@/lib/schema';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function addLocation() {
    console.log('Adding location: Sathuvachari');

    try {
        await db.insert(locations).values({
            name: 'Sathuvachari',
            slug: 'sathuvachari',
            pincode: '632003',
            description: 'A major residential and commercial area in Vellore',
        }).onConflictDoNothing();
        console.log('Location added successfully');
    } catch (error) {
        console.error('Error adding location:', error);
    }
}

addLocation()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
