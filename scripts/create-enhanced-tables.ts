import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function createEnhancedTables() {
  console.log('🚀 Resetting and creating database tables...\n');

  try {
    // Drop existing tables
    console.log('🗑️  Dropping existing tables...');
    await sql`DROP TABLE IF EXISTS appointments CASCADE`;
    await sql`DROP TABLE IF EXISTS service_offerings CASCADE`;
    await sql`DROP TABLE IF EXISTS business_hours CASCADE`;
    await sql`DROP TABLE IF EXISTS business_amenities CASCADE`;
    await sql`DROP TABLE IF EXISTS business_tags CASCADE`;
    await sql`DROP TABLE IF EXISTS category_hierarchy CASCADE`;
    await sql`DROP TABLE IF EXISTS orders CASCADE`;
    await sql`DROP TABLE IF EXISTS businesses CASCADE`;
    await sql`DROP TABLE IF EXISTS locations CASCADE`;
    await sql`DROP TABLE IF EXISTS categories CASCADE`; // Legacy
    console.log('✅ Tables dropped\n');

    // Create businesses table
    console.log('📝 Creating businesses table...');
    await sql`
            CREATE TABLE businesses (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                slug TEXT UNIQUE,
                description TEXT,
                address TEXT,
                pincode TEXT,
                phone TEXT,
                email TEXT,
                website TEXT,
                category TEXT,
                rating TEXT,
                total_ratings INTEGER DEFAULT 0,
                latitude TEXT,
                longitude TEXT,
                status TEXT DEFAULT 'active',
                verified BOOLEAN DEFAULT FALSE,
                amenities JSONB,
                opening_hours JSONB,
                images JSONB,
                whatsapp_phone TEXT,
                location JSONB,
                types JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    await sql`CREATE INDEX idx_businesses_slug ON businesses(slug)`;
    await sql`CREATE INDEX idx_businesses_category ON businesses(category)`;
    await sql`CREATE INDEX idx_businesses_pincode ON businesses(pincode)`;
    console.log('✅ Businesses table created\n');

    // Create locations table
    console.log('📝 Creating locations table...');
    await sql`
            CREATE TABLE locations (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                slug TEXT NOT NULL UNIQUE,
                pincode TEXT NOT NULL,
                city TEXT DEFAULT 'Vellore',
                state TEXT DEFAULT 'Tamil Nadu',
                description TEXT,
                latitude DECIMAL(10, 6),
                longitude DECIMAL(10, 6),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    console.log('✅ Locations table created\n');

    // Create category_hierarchy table
    console.log('📝 Creating category_hierarchy table...');
    await sql`
            CREATE TABLE category_hierarchy (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                slug TEXT NOT NULL UNIQUE,
                parent_id INTEGER REFERENCES category_hierarchy(id),
                level INTEGER NOT NULL,
                icon TEXT,
                color TEXT,
                description TEXT,
                is_professional_service BOOLEAN DEFAULT FALSE,
                allows_booking BOOLEAN DEFAULT FALSE,
                display_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    await sql`CREATE INDEX idx_parent ON category_hierarchy(parent_id)`;
    await sql`CREATE INDEX idx_level ON category_hierarchy(level)`;
    console.log('✅ Category hierarchy table created\n');

    // Create business_tags table
    console.log('📝 Creating business_tags table...');
    await sql`
            CREATE TABLE business_tags (
                id SERIAL PRIMARY KEY,
                business_id INTEGER REFERENCES businesses(id),
                tag TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    await sql`CREATE INDEX idx_business_tags ON business_tags(business_id)`;
    console.log('✅ Business tags table created\n');

    // Create business_amenities table
    console.log('📝 Creating business_amenities table...');
    await sql`
            CREATE TABLE business_amenities (
                id SERIAL PRIMARY KEY,
                business_id INTEGER REFERENCES businesses(id),
                amenity_type TEXT NOT NULL,
                amenity_name TEXT NOT NULL,
                amenity_value TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    await sql`CREATE INDEX idx_business_amenities ON business_amenities(business_id)`;
    console.log('✅ Business amenities table created\n');

    // Create business_hours table
    console.log('📝 Creating business_hours table...');
    await sql`
            CREATE TABLE business_hours (
                id SERIAL PRIMARY KEY,
                business_id INTEGER REFERENCES businesses(id),
                day_of_week INTEGER NOT NULL,
                open_time TIME,
                close_time TIME,
                is_closed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    console.log('✅ Business hours table created\n');

    // Create service_offerings table
    console.log('📝 Creating service_offerings table...');
    await sql`
            CREATE TABLE service_offerings (
                id SERIAL PRIMARY KEY,
                business_id INTEGER REFERENCES businesses(id),
                service_name TEXT NOT NULL,
                service_description TEXT,
                duration_minutes INTEGER NOT NULL,
                price DECIMAL(10, 2),
                is_bookable BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    console.log('✅ Service offerings table created\n');

    // Create appointments table
    console.log('📝 Creating appointments table...');
    await sql`
            CREATE TABLE appointments (
                id SERIAL PRIMARY KEY,
                business_id INTEGER REFERENCES businesses(id),
                service_id INTEGER REFERENCES service_offerings(id),
                user_id TEXT,
                customer_name TEXT NOT NULL,
                customer_phone TEXT NOT NULL,
                customer_email TEXT,
                appointment_date DATE NOT NULL,
                appointment_time TIME NOT NULL,
                duration_minutes INTEGER NOT NULL,
                status TEXT DEFAULT 'pending',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    await sql`CREATE INDEX idx_appointments_business ON appointments(business_id)`;
    await sql`CREATE INDEX idx_appointments_date ON appointments(appointment_date)`;
    await sql`CREATE INDEX idx_appointments_status ON appointments(status)`;
    console.log('✅ Appointments table created\n');

    // Create orders table
    console.log('📝 Creating orders table...');
    await sql`
            CREATE TABLE orders (
                id SERIAL PRIMARY KEY,
                user_id TEXT,
                business_id INTEGER REFERENCES businesses(id),
                items JSONB,
                notes TEXT,
                customer_phone TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    console.log('✅ Orders table created\n');

    console.log('🎉 Database reset and tables created successfully!');

  } catch (error) {
    console.error('❌ Failed to create tables:', error);
    process.exit(1);
  }
}

createEnhancedTables();
