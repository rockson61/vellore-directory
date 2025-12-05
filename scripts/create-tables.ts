import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

async function createTables() {
    console.log('🚀 Creating database tables...\n');

    try {
        // Create businesses table
        console.log('📝 Creating businesses table...');
        await sql`
      CREATE TABLE IF NOT EXISTS businesses (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT,
        whatsapp_phone TEXT,
        location JSONB,
        rating REAL DEFAULT 0,
        total_ratings INTEGER DEFAULT 0,
        types JSONB,
        website TEXT,
        opening_hours JSONB,
        pincode TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
        console.log('✅ Businesses table created\n');

        // Create categories table
        console.log('📝 Creating categories table...');
        await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        count INTEGER DEFAULT 0,
        icon TEXT,
        color TEXT
      )
    `;
        console.log('✅ Categories table created\n');

        // Create orders table
        console.log('📝 Creating orders table...');
        await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id TEXT,
        business_id TEXT REFERENCES businesses(id),
        items JSONB,
        notes TEXT,
        customer_phone TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
        console.log('✅ Orders table created\n');

        console.log('🎉 All tables created successfully!');

    } catch (error) {
        console.error('❌ Failed to create tables:', error);
        process.exit(1);
    }
}

createTables();
