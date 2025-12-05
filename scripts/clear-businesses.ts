import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '../lib/db';
import { businesses } from '../lib/schema';
import { sql } from 'drizzle-orm';

async function clearImportedBusinesses() {
    console.log('🗑️  Clearing Previously Imported Businesses...\n');

    // Count current businesses
    const countBefore = await db.execute(sql`SELECT COUNT(*) as count FROM businesses`);
    const totalBefore = (countBefore.rows[0] as any).count;

    console.log(`Current total: ${totalBefore} businesses`);
    console.log('\n⚠️  This will delete all businesses to start fresh import.');
    console.log('The enhanced import will fetch complete data including:');
    console.log('  - Opening hours');
    console.log('  - Photos (up to 5 per business)');
    console.log('  - Better phone numbers');
    console.log('  - All other details\n');

    // Delete all businesses
    await db.delete(businesses);

    console.log('✅ All businesses cleared!');
    console.log('Ready for fresh import with enhanced data.\n');

    process.exit(0);
}

clearImportedBusinesses().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
